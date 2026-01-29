import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
      
      req.userId = decoded.id;
      req.role = decoded.role; // Admin or Judge
      
      next();
    } catch (error) {
      res.status(401).json({ error: "Not authorized, token failedd" });
    }
  }

  if (!token) {
    res.status(401).json({ error: "Not authorized, no token" });
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