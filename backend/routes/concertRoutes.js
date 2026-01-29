import express from 'express';
import { 
    createRazorpayOrder, 
    verifyGuestPayment, 
    findGuestTicket,
    getAllConcerts,
    getConcertById,
} from '../controllers/concertController.js';

const router = express.Router();


router.get('/all' , getAllConcerts)
router.get('/:id', getConcertById);

// 1. Initialize Payment (Get Order ID)
router.post('/create-order', createRazorpayOrder);

// 2. Finalize Booking (Verify Signature & Create Ticket)
router.post('/verify', verifyGuestPayment);

// 3. Lost Ticket Finder (No Login)
router.post('/find-ticket', findGuestTicket);

// 4. (Optional) Get Live Sales Stats
// router.get('/stats', getConcertStats);

export default router;