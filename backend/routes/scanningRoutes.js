import express from 'express';
import { prisma } from '../db.js';

const router = express.Router();

router.get('/team-history/:teamId', async (req, res) => {
  try {
    const history = await prisma.entryLog.findMany({
      where: { teamId: req.params.teamId },
      orderBy: { scannedAt: 'desc' },
      take: 5
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

export default router;