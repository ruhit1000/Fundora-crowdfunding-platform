import { Request, Response } from "express";
import Stripe from "stripe";
import { Campaign } from "../models/Campaign";
import { Contribution } from "../models/Contribution";
import { Notification } from "../models/Notification";
import { AuthenticatedRequest } from "../index";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20" as any,
});

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

export const createCheckoutSession = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { campaignId, amount, reward } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      res.status(404).json({ message: "Campaign not found" });
      return;
    }

    if (amount < campaign.min_contribution) {
      res.status(400).json({ message: `Minimum contribution is $${campaign.min_contribution}` });
      return;
    }

    // Create a pending contribution immediately
    const contribution = new Contribution({
      campaign_id: campaign._id,
      campaign_title: campaign.title,
      amount: amount,
      supporter_email: req.user?.email,
      supporter_name: req.user?.name,
      creator_name: campaign.creator_name,
      creator_email: campaign.creator_email,
      status: "pending", // Will be marked approved when payment succeeds
    });

    await contribution.save();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Contribution to ${campaign.title}`,
              description: reward ? `Reward: ${reward}` : "Support this amazing project!",
            },
            unit_amount: amount * 100, // in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${CLIENT_URL}/campaigns/${campaignId}?success=true`,
      cancel_url: `${CLIENT_URL}/campaigns/${campaignId}?canceled=true`,
      metadata: {
        contributionId: contribution._id.toString(),
        campaignId: campaignId.toString(),
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ message: "Failed to create payment session", error: error.message });
  }
};

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // Must be raw buffer
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle successful payment
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const contributionId = session.metadata?.contributionId;
    const campaignId = session.metadata?.campaignId;

    if (contributionId && campaignId) {
      try {
        // Mark contribution as approved
        const contribution = await Contribution.findByIdAndUpdate(
          contributionId,
          { status: "approved" },
          { new: true }
        );

        if (contribution) {
          // Increment campaign's amount_raised
          const campaign = await Campaign.findByIdAndUpdate(
            campaignId,
            { $inc: { amount_raised: contribution.amount } },
            { new: true }
          );

          if (campaign) {
            // Notify Creator
            await new Notification({
              message: `${contribution.supporter_name} just contributed $${contribution.amount} to your campaign!`,
              toEmail: campaign.creator_email,
              actionRoute: `/dashboard/creator`,
            }).save();

            // Notify Supporter
            await new Notification({
              message: `Your payment of $${contribution.amount} for "${campaign.title}" was successful. Thank you!`,
              toEmail: contribution.supporter_email,
              actionRoute: `/dashboard/supporter`,
            }).save();
          }

          console.log(`Payment successful for contribution ${contributionId}`);
        }
      } catch (err) {
        console.error("Failed to update database after payment:", err);
      }
    }
  }

  res.json({ received: true });
};
