import mongoose, { Schema, Document } from "mongoose";

export interface IContribution extends Document {
  campaign_id: mongoose.Types.ObjectId;
  campaign_title: string;
  amount: number;
  supporter_email: string;
  supporter_name: string;
  creator_name: string;
  creator_email: string;
  date: Date;
  status: "pending" | "approved" | "rejected";
}

const ContributionSchema = new Schema<IContribution>(
  {
    campaign_id: { type: Schema.Types.ObjectId, ref: "Campaign", required: true },
    campaign_title: { type: String, required: true },
    amount: { type: Number, required: true },
    supporter_email: { type: String, required: true },
    supporter_name: { type: String, required: true },
    creator_name: { type: String, required: true },
    creator_email: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Contribution = mongoose.model<IContribution>("Contribution", ContributionSchema);
