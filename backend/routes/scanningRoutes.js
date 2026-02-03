import express from 'express';
import { searchTicket, markEventEntry, markEventExit, markConcertEntry } from '../controllers/scanning.js';

const router = express.Router();

router.post('/search', searchTicket);
router.post('/event/entry', markEventEntry);
router.post('/event/exit', markEventExit);
router.post('/concert/entry', markConcertEntry);


export default router;
