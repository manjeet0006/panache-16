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
            { expiresIn: '1d' }
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
    const { userCode } = req; 

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
                    }
                },
                members: true,
                // ✅ CRITICAL FIX: Added isInternal so the frontend knows who is VGU
                college: { 
                    select: { 
                        name: true,
                        isInternal: true 
                    } 
                },
                entryLogs: {
                    orderBy: { scannedAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(teams || []);
    } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        res.status(500).json({ error: "Failed to retrieve history." });
    }
};