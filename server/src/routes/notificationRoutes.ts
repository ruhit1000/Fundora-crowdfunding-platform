import express from "express";
import { getNotifications, markAsRead } from "../controllers/notificationController";
import { verifyToken } from "../index";

const router = express.Router();

router.use(verifyToken);
router.get("/", getNotifications);
router.put("/:id/read", markAsRead);

export default router;
