import { prisma } from '../db.js';
import jwt from 'jsonwebtoken';
// Note: In a real app, use bcrypt to compare passwords
// import bcrypt from 'bcryptjs'; 

export const judgeLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const judge = await prisma.judge.findUnique({ where: { email } });

    if (!judge || judge.password !== password) { // Simple check for now
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create Token
    const token = jwt.sign(
      { id: judge.id, role: 'JUDGE' }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({
      token,
      judge: { id: judge.id, name: judge.name }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

