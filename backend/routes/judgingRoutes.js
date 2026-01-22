import express from 'express';
import { getAssignedEvents, submitScore } from '../controllers/judging.js';
import { judgeLogin } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public Login
router.post('/login', judgeLogin);

// Protected Judging Endpoints
// The 'protect' middleware ensures the user is logged in
router.get('/assigned/:judgeId', protect, getAssignedEvents);
router.post('/submit', protect, submitScore);

export default router;