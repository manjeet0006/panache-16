import { prisma } from "../db.js";
import { uploadPaymentImage } from "../utils/cloudinary.js";
import { v4 as uuidv4 } from 'uuid';

export const submitRegistration = async (req, res) => {
    try {
        const {
            teamName, eventId, secretCode, collegeId,
            customCollegeName, departmentId, transactionId
        } = req.body;

        const members = JSON.parse(req.body.members || "[]");
        const isVgu = req.body.isVgu === "true";
        const paymentImageFile = req.file;

        // 1. Validate Event
        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) return res.status(404).json({ error: "Event not found" });

        // Logic check: Global events OR External teams must use Invite Codes
        const mustUseInviteCode = event.allowOutside || !isVgu;

        let finalCollegeId = collegeId;
        let finalInviteId = null;
        let paymentImageUrl = null;

        // ---------------------------------------------------------
        // 2. COLLEGE & INVITE LOGIC
        // ---------------------------------------------------------
        if (mustUseInviteCode) {
            // Validate Invite Code
            const invite = await prisma.eventInvite.findFirst({
                where: { code: secretCode, eventId, isUsed: false }
            });

            if (!invite) {
                return res.status(400).json({
                    error: (event.allowOutside && isVgu)
                        ? "For this event, VGU teams must use a specific Invite Code. Department codes are not valid here."
                        : "Invalid or already used invite code."
                });
            }
            finalInviteId = invite.id;

            if (isVgu) {
                // FIX: For VGU teams in Global Events, find the internal VGU college record
                const internalCol = await prisma.college.findFirst({ where: { isInternal: true } });
                if (!internalCol) return res.status(500).json({ error: "Internal College record not found in DB." });
                finalCollegeId = internalCol.id;
            } else if (collegeId === "other") {
                // Create new college for external students
                const newCol = await prisma.college.create({
                    data: { name: customCollegeName, city: "Unknown", isInternal: false }
                });
                finalCollegeId = newCol.id;
            }
        } else {
            // Internal Dept-based Registration
            const department = await prisma.department.findUnique({ where: { id: departmentId } });
            if (!department || department.secretCode !== secretCode) {
                return res.status(400).json({ error: "Invalid Department Secret Code." });
            }
            finalCollegeId = department.collegeId;
        }

        // Final safety check for College ID
        if (!finalCollegeId) return res.status(400).json({ error: "College identification failed." });

        // ---------------------------------------------------------
        // 3. PAYMENT UPLOAD
        // ---------------------------------------------------------
        if (!isVgu && paymentImageFile) {
            paymentImageUrl = await uploadPaymentImage(paymentImageFile.buffer);
        }

        // ---------------------------------------------------------
        // 4. TRANSACTION
        // ---------------------------------------------------------
        const result = await prisma.$transaction(async (tx) => {
            
            // Check if VGU is already represented in this global event
            if (isVgu && event.allowOutside) {
                const existingVguTeam = await tx.team.findFirst({
                    where: { eventId, college: { isInternal: true } }
                });
                if (existingVguTeam) throw new Error("VGU_ALREADY_REGISTERED");
            }

            // External College duplicate check (Only for non-dept teams)
            if (!departmentId) {
                const existing = await tx.team.findFirst({
                    where: { eventId, collegeId: finalCollegeId }
                });
                if (existing) throw new Error("COLLEGE_ALREADY_REGISTERED");
            }

            // Create Team
            const team = await tx.team.create({
                data: {
                    teamName,
                    paymentStatus: isVgu ? "APPROVED" : "PENDING",
                    paymentImage: paymentImageUrl,
                    transactionId: isVgu ? null : transactionId,
                    ticketCode: isVgu ? null : `PAN-${uuidv4().slice(0, 6).toUpperCase()}`,
                    event: { connect: { id: eventId } },
                    college: { connect: { id: finalCollegeId } },
                    // Only connect department if it exists (internal events)
                    ...(departmentId && { department: { connect: { id: departmentId } } }),
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

            // Mark invite as used
            if (finalInviteId) {
                await tx.eventInvite.update({
                    where: { id: finalInviteId },
                    data: { isUsed: true, usedByTeamId: team.id }
                });
            }

            return team;
        }, { timeout: 15000 });

        return res.status(201).json({
            message: "Registration successful!",
            team: { name: result.teamName },
            ticket: { id: result.ticketCode || "INTERNAL-CONFIRMED" }
        });

    } catch (error) {
        console.error("Registration Error:", error);
        if (error.message === "VGU_ALREADY_REGISTERED") {
            return res.status(400).json({ error: "A VGU team is already registered for this event." });
        }
        if (error.message === "COLLEGE_ALREADY_REGISTERED") {
            return res.status(400).json({ error: "This college has already registered for this event." });
        }
        return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};