import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: {
    dialect: "mongodb",
    type: "mongodb",
    url: process.env.MONGODB_URI || "mongodb://localhost:27017/crowdfunding",
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  plugins: [
    admin() // Used to set roles (admin/creator/supporter)
  ]
});
