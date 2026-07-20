import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: string; // BetterAuth uses string IDs
  name: string;
  email: string;
  image?: string;
  role: "admin" | "creator" | "supporter";
  credits: number;
}

// User schema bound to BetterAuth's "user" collection in MongoDB
const UserSchema = new Schema<IUser>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String },
    role: { type: String, enum: ["admin", "creator", "supporter"], default: "supporter" },
    credits: { type: Number, default: 0 }
  },
  { collection: "user" } // Specifically linking to the exact collection BetterAuth creates
);

export const User = mongoose.model<IUser>("User", UserSchema);
