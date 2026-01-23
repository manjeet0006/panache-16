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
            teamName, eventId, secretCode, collegeId,
            customCollegeName, departmentId,
            razorpay_order_id, razorpay_payment_id, razorpay_signature
        } = req.body;

        const isVgu = req.body.isVgu === true || req.body.isVgu === 'true';
        let members = typeof req.body.members === 'string' ? JSON.parse(req.body.members) : req.body.members;

        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) return res.status(404).json({ error: "Event not found" });

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
        if (event.allowOutside || !isVgu) {
            const invite = await prisma.eventInvite.findFirst({
                where: { code: secretCode, eventId, isUsed: false }
            });
            if (!invite) return res.status(400).json({ error: "Invalid or already used invite code." });
            finalInviteId = invite.id;
        } else {
            const department = await prisma.department.findUnique({ where: { id: departmentId } });
            if (!department || department.secretCode !== secretCode) {
                return res.status(400).json({ error: "Invalid Department Secret Code." });
            }
        }

        // --- 3. ATOMIC TRANSACTION ---
        const result = await prisma.$transaction(async (tx) => {
            let actualCollegeId = collegeId;

            // DYNAMIC COLLEGE CREATION: Handle "Other" selection
            if (!isVgu && collegeId === 'other') {
                if (!customCollegeName) throw new Error("Custom college name is required.");

                const newCollege = await tx.college.create({
                    data: {
                        name: customCollegeName,
                        city: "External", // Or capture city from frontend
                        isInternal: false
                    }
                });
                actualCollegeId = newCollege.id;
            } else if (isVgu) {
                const internalCol = await tx.college.findFirst({ where: { isInternal: true } });
                if (!internalCol) throw new Error("Internal College record missing.");
                actualCollegeId = internalCol.id;
            }

            // Duplicate Check for VGU in Grand Finale
            if (isVgu && eventId === 'panache-main-2026') {
                const existingVgu = await tx.team.findFirst({
                    where: { eventId, college: { isInternal: true } }
                });
                if (existingVgu) throw new Error("VGU_ALREADY_REGISTERED");
            }

            // Create Team
            const team = await tx.team.create({
                data: {
                    teamName,
                    paymentStatus: "APPROVED",
                    transactionId: isVgu ? `VGU_EXEMPT_${Date.now()}` : razorpay_payment_id,
                    ticketCode: isVgu ? null : `PAN-${uuidv4().slice(0, 6).toUpperCase()}`,
                    event: { connect: { id: eventId } },
                    college: { connect: { id: actualCollegeId } },
                    razorpayOrderId: razorpay_order_id,
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature,
                    ...(isVgu && departmentId && { department: { connect: { id: departmentId } } }),
                    ...(finalInviteId && { invite: { connect: { id: finalInviteId } } }),
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

            // Mark Invite Code as used
            if (finalInviteId) {
                await tx.eventInvite.update({
                    where: { id: finalInviteId },
                    data: { isUsed: true, usedByTeamId: team.id }
                });
            }

            return team;
        }, { timeout: 20000 });

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
        const status = (error.message.includes("REGISTERED") || error.message.includes("required")) ? 400 : 500;
        return res.status(status).json({ error: error.message });
    }
};


export const preVerifyRegistration = async (req, res) => {
    const { eventId, collegeId, departmentId, isVgu, secretCode } = req.body;

    try {
        // 1. Check for Duplicate Registration First
        if (isVgu) {
            const existingDeptTeam = await prisma.team.findFirst({
                where: { eventId, departmentId }
            });
            if (existingDeptTeam) {
                return res.status(400).json({ error: "Your department has already registered for this event." });
            }

            // --- VGU SECRET CODE VALIDATION ---
            const dept = await prisma.department.findUnique({
                where: { id: departmentId }
            });

            if (!dept || dept.secretCode !== secretCode) {
                return res.status(400).json({ error: "Invalid Department Secret Code." });
            }

        } else {
            const existingCollegeTeam = await prisma.team.findFirst({
                where: { eventId, collegeId }
            });
            if (existingCollegeTeam) {
                return res.status(400).json({ error: "A team from your college is already registered." });
            }

            // --- EXTERNAL INVITE CODE VALIDATION ---
            const invite = await prisma.eventInvite.findUnique({
                where: { code: secretCode }
            });

            if (!invite || invite.eventId !== eventId) {
                return res.status(400).json({ error: "Invalid or expired event code." });
            }

            if (invite.isUsed) {
                return res.status(400).json({ error: "This code has already been used by another team." });
            }
        }

        return res.status(200).json({ message: "Eligible to register." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error during verification." });
    }
};