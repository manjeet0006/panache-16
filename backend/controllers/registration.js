import { prisma } from "../db.js";
import { uploadPaymentImage } from "../utils/cloudinary.js";
import { v4 as uuidv4 } from 'uuid';

export const submitRegistration = async (req, res) => {
    try {
        const {
            teamName, eventId, secretCode, collegeId,
            customCollegeName, departmentId, transactionId
        } = req.body;

        const members = JSON.parse(req.body.members);
        const isVgu = req.body.isVgu === "true";
        const paymentImageFile = req.file;

        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) return res.status(404).json({ error: "Event not found" });

        const mustUseInviteCode = event.allowOutside || !isVgu;

        let finalCollegeId = collegeId;
        let finalInviteId = null;
        let paymentImageUrl = null;

        if (mustUseInviteCode) {
            const invite = await prisma.eventInvite.findFirst({
                where: { code: secretCode, eventId, isUsed: false }
            });

            if (!invite) {
                return res.status(400).json({
                    error: (event.allowOutside && isVgu)
                        ? "For this event, VGU teams must use a specific Invite Code. Department Codes are not valid here."
                        : "Invalid or already used invite code."
                });
            }
            finalInviteId = invite.id;

            if (!isVgu && collegeId === "other") {
                const newCol = await prisma.college.create({
                    data: { name: customCollegeName, city: "Unknown", isInternal: false }
                });
                finalCollegeId = newCol.id;
            }
        } else {
            const department = await prisma.department.findUnique({ where: { id: departmentId } });
            if (!department || department.secretCode !== secretCode) {
                return res.status(400).json({ error: "Invalid Department Secret Code." });
            }
            finalCollegeId = department.collegeId;
        }

        if (!isVgu && paymentImageFile) {
            paymentImageUrl = await uploadPaymentImage(paymentImageFile.buffer);
        }


        

        // Before creating team
        if (!departmentId) {
            // External team
            const existing = await prisma.team.findFirst({
                where: {
                    eventId,
                    collegeId
                }
            });

            if (existing) {
                return res.status(400).json({
                    error: "This college has already registered for this event"
                });
            }
        }


        const result = await prisma.$transaction(async (tx) => {
            if (isVgu && event.allowOutside) {
                const existingVguTeam = await tx.team.findFirst({
                    where: { eventId, college: { isInternal: true } }
                });
                if (existingVguTeam) throw new Error("VGU_ALREADY_REGISTERED");
            }


            if (!departmentId) {
                // External team
                const existing = await prisma.team.findFirst({
                    where: {
                        eventId,
                        collegeId
                    }
                });

                if (existing) {
                    return res.status(400).json({
                        error: "This college has already registered for this event"
                    });
                }
            }

            const team = await tx.team.create({
                data: {
                    teamName,
                    paymentStatus: isVgu ? "APPROVED" : "PENDING",
                    paymentImage: paymentImageUrl,
                    transactionId: isVgu ? null : transactionId,
                    // Note: removed hasEntered here as it is not in your schema
                    ticketCode: isVgu ? null : `PAN-${uuidv4().slice(0, 6).toUpperCase()}`,
                    event: { connect: { id: eventId } },
                    college: { connect: { id: finalCollegeId } },
                    ...(isVgu && { department: { connect: { id: departmentId } } }),
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
        if (error.message === "VGU_ALREADY_REGISTERED") {
            return res.status(400).json({ error: "A VGU team is already registered for this event." });
        }
        return res.status(500).json({ error: error.message });
    }
};