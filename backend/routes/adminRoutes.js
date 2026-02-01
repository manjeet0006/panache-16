import express from 'express';
import * as adminCtrl from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// --- 🔓 PUBLIC ADMIN ROUTES ---
/**
 * Login must be public so the admin can receive their 
 * JWT token to access the routes below.
 */

router.post('/login', adminCtrl.adminLogin);


// ---  PROTECTED ADMIN ROUTES ---

router.use(protect);
router.use(authorize('ADMIN'));

// 1. Dashboard & Global Data
router.get('/dashboard', adminCtrl.getAdminDashboardData);

// 2. Stage 1: Lead / Inquiry Management (Outside Students)
router.get('/inquiries', adminCtrl.getInquiries);
router.patch('/inquiry/:id', adminCtrl.updateInquiryStatus);

// 3. Stage 2: Secret Code / Invite Management
router.post('/invites/generate', adminCtrl.generateSecretCodes);
router.get('/invites/available/:eventId', adminCtrl.getAvailableCodes);

// 4. Infrastructure Management
router.post('/crevents', adminCtrl.createEvent);
router.get("/events", adminCtrl.getEvents);
router.put("/events/:eventId", adminCtrl.updateEvent);
router.delete("/events/:eventId", adminCtrl.deleteEvent);


router.post('/departments', adminCtrl.createDepartment);

// 5. Judge Management
router.post('/judges/create', adminCtrl.createJudgeAccount);
router.post('/judges/appoint', adminCtrl.appointJudgeToEvent);

// 6. Registration & Team Oversight
// Update payment status (Approve/Reject)
router.patch('/registration/status/:teamId', adminCtrl.updateRegistrationStatus);
// Edit team members or names (Correction Power)
router.put('/team/:teamId', adminCtrl.updateTeamDetails);

// 7. Results, Leaderboards & Data Export
router.get('/results/:eventId', adminCtrl.getEventLeaderboard);
router.get('/export/:eventId', adminCtrl.exportParticipantList);

export default router;