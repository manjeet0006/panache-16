import express from 'express';
import { loginWithSecretCode, getMyHistory } from '../controllers/userController.js';
import { verifyIdentity } from '../middleware/verifyIdentity.js';

const router = express.Router();

// Public: Identity Verification (Login)
// Reaches: /api/user/login
router.post('/login', loginWithSecretCode);

// Protected: Personal Dashboard Data
// Reaches: /api/user/history
router.get('/history', verifyIdentity, getMyHistory);

export default router;