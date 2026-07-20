import { Response } from "express";
import mongoose from "mongoose";
import { Campaign } from "../models/Campaign";
import { Contribution } from "../models/Contribution";
import { Notification } from "../models/Notification";
import { AuthenticatedRequest } from "../index";

export const getCreatorDashboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "creator") {
      res.status(403).json({ message: "Forbidden: Creators only" });
      return;
    }

    const campaigns = await Campaign.find({ creator_email: req.user.email }).sort({ createdAt: -1 });
    
    // Calculate stats
    const totalCampaigns = campaigns.length;
    const totalRaised = campaigns.reduce((sum, c) => sum + c.amount_raised, 0);
    const activeCampaigns = campaigns.filter(c => c.status === "approved").length;
    
    // Get recent contributions for this creator's campaigns
    const recentContributions = await Contribution.find({ creator_email: req.user.email })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalCampaigns,
        totalRaised,
        activeCampaigns
      },
      campaigns,
      recentContributions
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to load creator dashboard", error: error.message });
  }
};

export const getSupporterDashboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "supporter") {
      res.status(403).json({ message: "Forbidden: Supporters only" });
      return;
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const contributions = await Contribution.find({ supporter_email: req.user.email })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalContributions = await Contribution.countDocuments({ supporter_email: req.user.email });
    
    // Get stats
    const allUserContributions = await Contribution.find({ supporter_email: req.user.email });
    const totalSupportedAmount = allUserContributions.reduce((sum, c) => sum + c.amount, 0);
    const uniqueCampaignsSupported = new Set(allUserContributions.map(c => c.campaign_id.toString())).size;

    res.json({
      stats: {
        totalSupportedAmount,
        campaignsSupported: uniqueCampaignsSupported,
        creditsAvailable: req.user.credits || 0
      },
      contributions,
      pagination: {
        total: totalContributions,
        page,
        totalPages: Math.ceil(totalContributions / limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to load supporter dashboard", error: error.message });
  }
};

export const getAdminDashboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(403).json({ message: "Forbidden: Admins only" });
      return;
    }

    // Stats
    const totalUsers = await mongoose.connection.collection("user").countDocuments();
    const allCampaigns = await Campaign.find();
    
    const totalCampaigns = allCampaigns.length;
    const totalFunding = allCampaigns.reduce((sum, c) => sum + c.amount_raised, 0);
    
    // Pending campaigns for review
    const pendingCampaigns = await Campaign.find({ status: "pending" }).sort({ createdAt: 1 });
    
    // Recent campaigns overall
    const recentCampaigns = await Campaign.find().sort({ createdAt: -1 }).limit(10);

    res.json({
      stats: {
        totalUsers,
        totalCampaigns,
        totalFunding
      },
      pendingCampaigns,
      recentCampaigns
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to load admin dashboard", error: error.message });
  }
};

export const updateCampaignStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(403).json({ message: "Forbidden: Admins only" });
      return;
    }

    const { status } = req.body;
    if (!["approved", "rejected", "pending"].includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!campaign) {
      res.status(404).json({ message: "Campaign not found" });
      return;
    }

    // Send notification to creator
    const notification = new Notification({
      message: `Your campaign "${campaign.title}" has been ${status}.`,
      toEmail: campaign.creator_email,
      actionRoute: `/campaigns/${campaign._id}`,
    });
    await notification.save();

    res.json(campaign);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update campaign status", error: error.message });
  }
};
