import { prisma } from '../db.js';

export const getAssignedEvents = async (req, res) => {
  const { judgeId } = req.params;

  // Security: Prevent one judge from seeing another judge's assignments
  if (req.userId !== judgeId) {
    return res.status(403).json({ error: "Not authorized to view these assignments." });
  }

  try {
    const assignments = await prisma.judgeAssignment.findMany({
      where: { judgeId },
      include: { event: true }
    });
    res.json(assignments.map(a => a.event));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const submitScore = async (req, res) => {
  const { teamId, judgeId, criteriaScores, comments } = req.body;

  // Security: The judge logged in must be the one submitting the score
  if (req.userId !== judgeId) {
    return res.status(403).json({ error: "Fraudulent score submission detected." });
  }

  const totalPoints = Object.values(criteriaScores).reduce((a, b) => a + b, 0);

  try {
    const score = await prisma.score.upsert({
      where: { teamId_judgeId: { teamId, judgeId } },
      update: { criteriaScores, totalPoints, comments },
      create: { teamId, judgeId, criteriaScores, totalPoints, comments }
    });
    res.json({ message: "Score saved successfully", score });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const getLeaderBoard = async (req, res) => {
  try {
    // Fetch all entries
    const entries = await prisma.leaderBoard.findMany();

    // Sort manually because 'score' is a String in your database
    const sortedEntries = entries.sort((a, b) => {
      const scoreA = parseFloat(a.score) || 0;
      const scoreB = parseFloat(b.score) || 0;
      return scoreB - scoreA; // Descending order (Highest first)
    });

    res.status(200).json(sortedEntries);
  } catch (error) {
    console.error("Leaderboard Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};