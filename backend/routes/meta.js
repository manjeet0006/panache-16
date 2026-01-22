import express from 'express';
import { getColleges, getDepartments } from '../controllers/meta.js';

const router = express.Router();

router.get('/colleges', getColleges);
router.get('/departments', getDepartments);

export default router;