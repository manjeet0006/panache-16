import express from 'express';
import { loginWithSecretCode, getMyHistory } from '../controllers/userController.js';


const router = express.Router();

// Public: Identity Verification (Login)
// Reaches: /api/user/login
router.post('/login',  loginWithSecretCode);

// Protected: Personal Dashboard Data
// Reaches: /api/user/history
router.get('/history', getMyHistory);

export default router;