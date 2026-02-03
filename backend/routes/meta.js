import express from 'express';
import { createCollege, deleteCollege, deleteDepartment, getColleges, getDepartments, updateCollege } from '../controllers/meta.js';


const router = express.Router();

router.get('/colleges', getColleges);
router.get('/departments', getDepartments);
router.delete('/departments/:id', deleteDepartment);

router.post("/colleges", createCollege);
router.put("/colleges/:id", updateCollege);
router.delete("/colleges/:id", deleteCollege);
export default router;