import express from "express";
import { createCheckoutSession } from "../controllers/paymentController";
import { verifyToken } from "../index";

const router = express.Router();

// The webhook is mounted directly in index.ts because it needs raw body

router.use(verifyToken);
router.post("/create-checkout-session", createCheckoutSession);

export default router;
