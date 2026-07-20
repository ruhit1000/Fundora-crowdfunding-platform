import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/crowdfunding";

mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ Successfully connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Extending Request interface for auth
export interface AuthenticatedRequest extends Request {
  user?: any; // Replace with proper User interface later
}

// verifyToken Middleware (Task 1-4)
export const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized Access - Missing Token" });
    }

    const token = authHeader.split(" ")[1];
    
    // Check if session exists in MongoDB directly
    const session = await mongoose.connection.collection("session").findOne({ token });
    if (!session) {
      return res.status(401).json({ message: "Unauthorized Access - Invalid Session" });
    }

    // Check if session is expired
    if (session.expiresAt < new Date()) {
      return res.status(401).json({ message: "Unauthorized Access - Session Expired" });
    }

    const user = await mongoose.connection.collection("user").findOne({
      _id: session.userId, // BetterAuth uses string IDs by default but could be ObjectId
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized Access - User Not Found" });
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.error("Auth Exception:", error);
    return res.status(500).json({ message: "Internal Auth Exception", error: error.message });
  }
};

import campaignRoutes from "./routes/campaignRoutes";

app.use("/api/campaigns", campaignRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "healthy", dbState: mongoose.connection.readyState });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
