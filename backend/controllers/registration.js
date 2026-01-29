import { prisma } from "../db.js";
import { v4 as uuidv4 } from 'uuid';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { ticketCache } from '../index.js';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * STEP 1: Create Order
 */
export const createPaymentOrder = async (req, res) => {
    const { amount } = req.body;
    try {
        const options = {
            amount: Math.round(amount * 100), // Convert to paisa
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * STEP 2: Finalize Registration
 */
/**
 * STEP 2: Finalize Registration
 */
export const submitRegistration = async (req, res) => {
    try {
        const {
            teamName, eventId, collegeId,
            customCollegeName, departmentId,
            razorpay_order_id, razorpay_payment_id, razorpay_signature
        } = req.body;

        const secretCode = req.body.secretCode?.trim().toUpperCase();
        const isVgu = req.body.isVgu === true || req.body.isVgu === 'true';
        let members = typeof req.body.members === 'string' ? JSON.parse(req.body.members) : req.body.members;

        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) return res.status(404).json({ error: "Event not found" });

        // ✅ THE KILL-SWITCH: Block submission if registration is closed
        if (!event.registrationOpen) {
            return res.status(403).json({
                error: "Registration Closed",
                message: "We are no longer accepting submissions for this event."
            });
        }

        // Security check for VGU students using external codes
        if (isVgu && secretCode.toUpperCase().startsWith('EXT-')) {
            return res.status(403).json({ error: "Security Alert: VGU students cannot use External Invite Codes." });
        }



        // --- 1. PAYMENT SECURITY ---
        if (!isVgu) {
            if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                return res.status(400).json({ error: "Payment verification failed. Missing details." });
            }
            const sign = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(sign.toString()).digest("hex");
            if (expectedSign !== razorpay_signature) return res.status(400).json({ error: "Invalid payment signature." });
        }

        // --- 2. CODE VERIFICATION ---
        let finalInviteId = null;
        if (event.allowOutside && !isVgu) {
            const invite = await prisma.eventInvite.findFirst({
                where: { code: secretCode, eventId, isUsed: false }
            });
            if (!invite) return res.status(400).json({ error: "Invalid or already used invite code." });
            finalInviteId = invite.id;
        } else {
            const department = await prisma.department.findUnique({ where: { id: departmentId } });

            // ✅ FIX: Normalize both strings to Uppercase before comparing
            const dbCode = department?.secretCode?.trim().toUpperCase();
            const inputCode = secretCode?.trim().toUpperCase();

            if (!department || dbCode !== inputCode) {
                return res.status(400).json({
                    error: "Invalid Department Secret Code.",
                    // Debugging hint (remove in production)
                    debug: `Input: ${inputCode}, Expected: ${dbCode}`
                });
            }
        }


        const result = await prisma.$transaction(async (tx) => {
            let actualCollegeId = collegeId;

            // --- 1. OPTIMIZED PARALLEL CHECKS ---
            // We fetch all necessary validation data at once to save round-trip time.
            const [dupDept, dupCollege, internalCol, existingVguTeam] = await Promise.all([
                isVgu ? tx.team.findFirst({ where: { eventId, departmentId } }) : Promise.resolve(null),
                (!isVgu && collegeId !== 'other') ? tx.team.findFirst({ where: { eventId, collegeId } }) : Promise.resolve(null),
                isVgu ? tx.college.findFirst({ where: { isInternal: true } }) : Promise.resolve(null),
                (isVgu && event.allowOutside) ? tx.team.findFirst({ where: { eventId: event.id, college: { isInternal: true } } }) : Promise.resolve(null)
            ]);

            // --- 2. VALIDATION LOGIC (UNCHANGED) ---
            if (isVgu && dupDept) throw new Error("DEPT_EXISTS");
            if (!isVgu && collegeId !== 'other' && dupCollege) throw new Error("COLLEGE_EXISTS");

            if (isVgu) {
                if (!internalCol) throw new Error("Internal College record missing.");
                actualCollegeId = internalCol.id;

                // if (event.allowOutside && existingVguTeam) {
                //     throw new Error("VGU_LIMIT_REACHED: Only one VGU representative team allowed for this open event.");
                // }
            } else if (collegeId === 'other') {
                if (!customCollegeName) throw new Error("Custom college name is required.");
                const newCollege = await tx.college.create({
                    data: { name: customCollegeName, city: "External", isInternal: false }
                });
                actualCollegeId = newCollege.id;
            }

            // --- 3. CREATE TEAM (UNCHANGED) ---
            const inviteToUseId = finalInviteId;

            const team = await tx.team.create({
                data: {
                    teamName,
                    paymentStatus: "APPROVED",
                    transactionId: isVgu ? `VGU_INTERNAL_${Date.now()}` : razorpay_payment_id,
                    ticketCode: (!isVgu || event.allowOutside)
                        ? `PAN-${uuidv4().slice(0, 6).toUpperCase()}`
                        : null,
                    event: { connect: { id: eventId } },
                    college: { connect: { id: actualCollegeId } },
                    razorpayOrderId: isVgu ? null : razorpay_order_id,
                    razorpayPaymentId: isVgu ? null : razorpay_payment_id,
                    razorpaySignature: isVgu ? null : razorpay_signature,
                    ...(isVgu && departmentId && { department: { connect: { id: departmentId } } }),
                    ...(inviteToUseId && { invite: { connect: { id: inviteToUseId } } }),
                    members: {
                        create: members.map((m) => ({
                            name: m.name,
                            phone: m.phone,
                            enrollment: isVgu ? m.enrollment : null,
                            isLeader: m.isLeader
                        }))
                    }
                }
            });

            // --- 4. UPDATE INVITE (UNCHANGED) ---
            if (inviteToUseId) {
                await tx.eventInvite.update({
                    where: { id: inviteToUseId },
                    data: { isUsed: true, usedByTeamId: team.id }
                });
            }

            return team;
        }, {
            timeout: 30000, // Slightly tighter timeout for better resource cycling
            isolationLevel: 'Serializable' // Crucial for preventing double-registrations
        });


        // Update Cache
        if (result.ticketCode) {
            ticketCache.set(result.ticketCode, {
                id: result.id,
                name: result.teamName,
                payment: "APPROVED",
                lastStatus: "EXIT"
            });
        }

        return res.status(201).json({
            message: "Registration successful!",
            ticketCode: result.ticketCode || "VGU-INTERNAL"
        });
    } catch (error) {
        console.error("Critical Registration Bug:", error);

        // 1. Handle our custom "Logic" errors
        const errorMap = {
            "DEPT_EXISTS": "Your department is already registered for this event.",
            "COLLEGE_EXISTS": "Your college already has a team registered for this event.",
            "VGU_LIMIT_REACHED": "This event only allows one representative team from VGU.",
            "INTERNAL_COLLEGE_MISSING": "System Error: Internal college record not found. Please contact admin.",
        };

        if (errorMap[error.message]) {
            return res.status(400).json({
                error: "Registration Blocked",
                message: errorMap[error.message]
            });
        }

        // 2. Handle Prisma specific errors (e.g., Unique constraints)
        if (error.code === 'P2002') {
            return res.status(400).json({
                error: "Duplicate Entry",
                message: "A team with this name or code already exists in our database."
            });
        }

        // 3. Handle Transaction Timeouts
        if (error.name === 'PrismaClientKnownRequestError' && error.code === 'P2028') {
            return res.status(408).json({
                error: "Request Timeout",
                message: "The server is busy. Please wait a moment and try submitting again."
            });
        }

        // 4. Default Fallback
        return res.status(500).json({
            error: "Submission Failed",
            message: error.message || "An unexpected error occurred. Please try again later."
        });
    }
};


export const preVerifyRegistration = async (req, res) => {
    const { eventId, collegeId, departmentId, isVgu, secretCode } = req.body;

    try {
        const normalizedInput = secretCode?.trim().toUpperCase();

        // 1. Parallel Lookups via Transaction
        const [
            event,
            existingVguTeam,
            existingCollegeTeam,
            existingDeptTeam,
            invite,
            department
        ] = await prisma.$transaction([
            prisma.event.findUnique({ where: { id: eventId } }),

            // Check if any VGU team exists for this event
            prisma.team.findFirst({
                where: { eventId, college: { isInternal: true } }
            }),

            // Check if this specific outside college is already registered
            prisma.team.findFirst({
                where: { eventId, collegeId }
            }),

            // Check if this specific department is already registered
            prisma.team.findFirst({
                where: { eventId, departmentId }
            }),

            // Check for a specific Invite Code (External/Global)
            prisma.eventInvite.findUnique({
                where: { code: normalizedInput }
            }),

            // Fetch the department details (Internal)
            prisma.department.findUnique({
                where: { id: departmentId }
            })
        ]);

        // 2. REGISTRATION OPEN CHECK (The Kill-Switch)
        if (!event) return res.status(404).json({ error: "Event not found" });

        if (!event.registrationOpen) {
            return res.status(403).json({
                error: "Registration Closed",
                message: "This event is no longer accepting new squads."
            });
        }

        // Security check for VGU students using external codes
        if (isVgu && secretCode.toUpperCase().startsWith('EXT-')) {
            return res.status(403).json({ error: "Security Alert: VGU students cannot use External Invite Codes." });
        }

        if (isVgu) {
            // Case A: VGU participating in a GLOBAL event (Needs Invite Code)
            if (event.allowOutside) {
                // if (existingVguTeam) {
                //     return res.status(400).json({ error: "A VGU team is already registered for this global event." });
                // }
                // if (!invite || invite.eventId !== eventId || invite.isUsed) {
                //     return res.status(400).json({ error: "Invalid or already used Invite Code." });
                // }
                if (existingDeptTeam) {
                    return res.status(400).json({ error: "Your department is already registered." });
                }
                if (!department || department.secretCode.trim().toUpperCase() !== normalizedInput) {
                    return res.status(400).json({ error: "Invalid Department Secret Code." });
                }
            }
            // Case B: VGU participating in an INTERNAL event (Needs Dept Secret Code)
            else {
                if (existingDeptTeam) {
                    return res.status(400).json({ error: "Your department is already registered." });
                }
                if (!department || department.secretCode.trim().toUpperCase() !== normalizedInput) {
                    return res.status(400).json({ error: "Invalid Department Secret Code." });
                }
            }
        } else {
            // Case C: OUTSIDE College (Only one team per college per event)
            if (existingCollegeTeam) {
                return res.status(400).json({ error: "This college is already represented in this event." });
            }
            if (!invite || invite.eventId !== eventId || invite.isUsed) {
                return res.status(400).json({ error: "Invalid or already used Invite Code." });
            }
        }

        return res.status(200).json({ message: "Eligible to register." });

    } catch (err) {
        console.error("Critical Verification Error:", err);
        return res.status(500).json({ error: "Server error during verification." });
    }
};


