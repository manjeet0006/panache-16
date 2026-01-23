import express from "express";
import { getEventsList, getEventById } from "../controllers/eventController.js";
import { createPaymentOrder, preVerifyRegistration, submitRegistration } from "../controllers/registration.js";
import { submitInquiry } from "../controllers/inquiryController.js";
import { registrationLimiter } from "../middleware/rateLimiter.js";


const router = express.Router();

router.get("/event/:id", getEventById);
router.get("/list-events", getEventsList);

// CLEANED: Removed Multer to support high-speed JSON registrations
router.post(
  "/register-team",
  registrationLimiter,
  submitRegistration
);

router.post("/inquiry", submitInquiry);
router.post('/create-order', createPaymentOrder);

router.post('/pre-verify' , preVerifyRegistration )



export default router;