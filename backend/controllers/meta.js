// backend/controllers/meta.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getColleges = async (req, res) => {
    try {
        const colleges = await prisma.college.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(colleges);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch colleges" });
    }
};

export const getDepartments = async (req, res) => {
    try {
        const departments = await prisma.department.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(departments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch departments" });
    }
};