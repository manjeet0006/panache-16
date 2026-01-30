import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Not authorized, token failed" });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) { // 'req.role' is set by your 'protect' middleware
      return res.status(403).json({ error: "Access denied: Unauthorized role" });
    }
    next();
  };
};