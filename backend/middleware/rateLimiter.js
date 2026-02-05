import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Increased to 100 (50 is too low if frontend has bugs)
    message: { error: "Too many attempts, please try again after 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: ipKeyGenerator
});

export const registrationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10, 
    message: { error: "Too many registration attempts, please try again after 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: ipKeyGenerator
});