import mongoose, { Schema, Document } from "mongoose";

export interface ICampaign extends Document {
  title: string;
  story: string;
  category: string;
  funding_goal: number;
  min_contribution: number;
  deadline: Date;
  reward_info: string;
  image_url: string;
  creator_email: string;
  creator_name: string;
  amount_raised: number;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema = new Schema<ICampaign>(
  {
    title: { type: String, required: true },
    story: { type: String, required: true },
    category: { type: String, required: true },
    funding_goal: { type: Number, required: true },
    min_contribution: { type: Number, required: true },
    deadline: { type: Date, required: true },
    reward_info: { type: String, required: true },
    image_url: { type: String, required: true },
    creator_email: { type: String, required: true },
    creator_name: { type: String, required: true },
    amount_raised: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Campaign = mongoose.model<ICampaign>("Campaign", CampaignSchema);
