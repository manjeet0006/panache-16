// backend/middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

export const registrationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 registration attempts
    message: { error: "Too many attempts, please try again after 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
});