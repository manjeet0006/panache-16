import express from "express";
import { getEventsList } from "../controllers/eventController.js";
import { getEventById } from "../controllers/eventController.js";
import { submitRegistration } from "../controllers/registration.js";
import { submitInquiry } from "../controllers/inquiryController.js";
import { upload } from "../middleware/upload.js";
import { registrationLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/event/:id", getEventById);

router.get("/list-events", getEventsList);
router.post(
  "/register-team",
  registrationLimiter,
  upload.single("paymentImage"),
  submitRegistration
);
router.post("/inquiry", submitInquiry);

export default router;
