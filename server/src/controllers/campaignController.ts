import { Request, Response } from "express";
import { Campaign } from "../models/Campaign";
import { AuthenticatedRequest } from "../index";

export const getAllCampaigns = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, status = "approved", page = 1, limit = 12 } = req.query;
    
    const query: any = {};
    if (category) query.category = category;
    if (status !== "all") query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    
    const campaigns = await Campaign.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
      
    const total = await Campaign.countDocuments(query);

    res.json({
      campaigns,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch campaigns", error: error.message });
  }
};

export const getCampaignById = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      res.status(404).json({ message: "Campaign not found" });
      return;
    }
    res.json(campaign);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch campaign", error: error.message });
  }
};

export const createCampaign = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "creator" && req.user?.role !== "admin") {
      res.status(403).json({ message: "Only creators can launch campaigns" });
      return;
    }

    const { title, story, category, funding_goal, min_contribution, deadline, reward_info, image_url } = req.body;

    const newCampaign = new Campaign({
      title,
      story,
      category,
      funding_goal,
      min_contribution,
      deadline,
      reward_info,
      image_url,
      creator_email: req.user.email,
      creator_name: req.user.name,
      status: "pending"
    });

    const savedCampaign = await newCampaign.save();
    res.status(201).json(savedCampaign);
  } catch (error: any) {
    res.status(400).json({ message: "Failed to create campaign", error: error.message });
  }
};

export const updateCampaign = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      res.status(404).json({ message: "Campaign not found" });
      return;
    }

    // Only owner or admin can update
    if (campaign.creator_email !== req.user?.email && req.user?.role !== "admin") {
      res.status(403).json({ message: "Not authorized to update this campaign" });
      return;
    }

    const updated = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: "Failed to update campaign", error: error.message });
  }
};

export const deleteCampaign = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      res.status(404).json({ message: "Campaign not found" });
      return;
    }

    // Only owner or admin can delete
    if (campaign.creator_email !== req.user?.email && req.user?.role !== "admin") {
      res.status(403).json({ message: "Not authorized to delete this campaign" });
      return;
    }

    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ message: "Campaign deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to delete campaign", error: error.message });
  }
};

export const contributeToCampaign = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { amount, reward_selected } = req.body;
    const campaignId = req.params.id;

    if (!req.user || req.user.role !== "supporter") {
      res.status(403).json({ message: "Only supporters can contribute" });
      return;
    }

    if (amount <= 0) {
      res.status(400).json({ message: "Amount must be greater than zero" });
      return;
    }

    // In a real app, we would verify Stripe payment here. 
    // For now, we will simulate a successful contribution.
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      res.status(404).json({ message: "Campaign not found" });
      return;
    }

    if (amount < campaign.min_contribution) {
      res.status(400).json({ message: `Minimum contribution is $${campaign.min_contribution}` });
      return;
    }

    campaign.amount_raised += Number(amount);
    await campaign.save();

    // Ideally we would also save a Contribution record here
    // const Contribution = require('../models/Contribution').Contribution;
    // await new Contribution({ campaignId, supporterId: req.user._id, amount, reward_selected, payment_status: 'completed' }).save();

    res.json({ message: "Contribution successful", amount_raised: campaign.amount_raised });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to process contribution", error: error.message });
  }
};
