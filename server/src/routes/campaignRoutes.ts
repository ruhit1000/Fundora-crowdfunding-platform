import express from "express";
import { 
  getAllCampaigns, 
  getCampaignById, 
  createCampaign, 
  updateCampaign, 
  deleteCampaign,
  contributeToCampaign
} from "../controllers/campaignController";
import { verifyToken } from "../index";

const router = express.Router();

// Public routes
router.get("/", getAllCampaigns);
router.get("/:id", getCampaignById);

// Protected routes
router.post("/", verifyToken, createCampaign);
router.put("/:id", verifyToken, updateCampaign);
router.delete("/:id", verifyToken, deleteCampaign);
router.post("/:id/contribute", verifyToken, contributeToCampaign);

export default router;
