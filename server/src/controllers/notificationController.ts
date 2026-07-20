import { Response } from "express";
import { Notification } from "../models/Notification";
import { AuthenticatedRequest } from "../index";

export const getNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.email) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const notifications = await Notification.find({ toEmail: req.user.email })
      .sort({ time: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({ toEmail: req.user.email, isRead: false });

    res.json({ notifications, unreadCount });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
  }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.email) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    
    // If id is "all", mark all as read
    if (id === "all") {
      await Notification.updateMany(
        { toEmail: req.user.email, isRead: false },
        { isRead: true }
      );
    } else {
      await Notification.findOneAndUpdate(
        { _id: id, toEmail: req.user.email },
        { isRead: true }
      );
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update notification", error: error.message });
  }
};
