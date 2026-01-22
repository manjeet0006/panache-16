import { prisma } from '../db.js';

// Stage 1: Initial Inquiry 
export const submitInquiry = async (req, res) => {
  const { name, collegeName, phone, email, eventId } = req.body;

  try {
    const request = await prisma.registrationRequest.create({
      data: { name, collegeName, phone, email, eventId }
    });

    res.status(201).json({ 
      success: true, 
      message: "Request received! Our team will contact you with a Secret Code shortly." 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
