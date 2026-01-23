import jwt from 'jsonwebtoken';
import { prisma } from '../db.js';

/**
 * Direct Login: Username == Password == Secret Code
 */
export const loginWithSecretCode = async (req, res) => {
    
    const username = req.body.username?.trim().toUpperCase();
    const password = req.body.password?.trim().toUpperCase();

    if (!username || username !== password) {
        return res.status(401).json({ error: "Credentials must match your Secret Code." });
    }

    try {
        // Check if the code belongs to a VGU Dept or an Outside Invitee
        const [dept, invite] = await Promise.all([
            prisma.department.findFirst({ where: { secretCode: username } }),
            prisma.eventInvite.findUnique({ where: { code: username } })
        ]);

        const identity = dept || invite;

        if (!identity) {
            return res.status(404).json({ error: "Secret Code not recognized." });
        }

        // Generate the JWT
        const token = jwt.sign(
            { id: identity.id, code: username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            code: username,
            name: dept ? dept.name : "Team Leader",
            type: dept ? "INTERNAL" : "EXTERNAL"
        });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Fetch History: Returns all teams for the logged-in code
 */
export const getMyHistory = async (req, res) => {
    const { userCode } = req; // Provided by verifyIdentity middleware

    try {
        const teams = await prisma.team.findMany({
            where: {
                OR: [
                    { department: { secretCode: userCode } },
                    { invite: { code: userCode } }
                ]
            },
            include: {
                event: {
                    select: {
                        name: true,
                        category: true,
                        eventPrice: true,
                        allowOutside: true
                    }
                },
                members: true,
                college: { select: { name: true } },
                // ✅ Added: Get the latest scan status for the dashboard stepper
                entryLogs: {
                    orderBy: { scannedAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Return empty array if none found (better for frontend mapping)
        res.status(200).json(teams || []);
    } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        res.status(500).json({ error: "Failed to retrieve registration history." });
    }
};