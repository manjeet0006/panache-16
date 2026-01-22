import { prisma } from '../db.js';

export const getEventsList = async (req, res) => {
  // Frontend sends ?isVgu=true or ?isVgu=false based on landing page choice
  const { isVgu } = req.query; 

  try {
    const events = await prisma.event.findMany({
      where: {
        registrationOpen: true,
        // If 'false', only show events where allowOutside is true
        // If 'true', show all events (VGU students can see everything)
        ...(isVgu === 'false' ? { allowOutside: true } : {})
      },
      orderBy: { category: 'asc' }
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    console.error("getEventById error:", error);
    next(error);
  }
};