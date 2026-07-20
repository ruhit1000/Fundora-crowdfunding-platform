import express from "express";
import { 
  getCreatorDashboard, 
  getSupporterDashboard, 
  getAdminDashboard,
  updateCampaignStatus
} from "../controllers/dashboardController";
import { verifyToken } from "../index";

const router = express.Router();

// All dashboard routes are protected
router.use(verifyToken);

router.get("/creator", getCreatorDashboard);
router.get("/supporter", getSupporterDashboard);
router.get("/admin", getAdminDashboard);
router.put("/admin/campaigns/:id/status", updateCampaignStatus);

export default router;
