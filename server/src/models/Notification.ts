import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  message: string;
  toEmail: string;
  actionRoute: string;
  time: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    message: { type: String, required: true },
    toEmail: { type: String, required: true },
    actionRoute: { type: String, required: true },
    time: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
