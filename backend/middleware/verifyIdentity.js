import jwt from 'jsonwebtoken';

export const verifyIdentity = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Authorization Required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userCode = decoded.code; // This is the secret code used to login
    next();
  } catch (err) {
    res.status(401).json({ error: "Session expired. Please re-verify." });
  }
};