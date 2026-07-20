import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper to get auth headers from BetterAuth session
export const getAuthHeaders = async (): Promise<HeadersInit> => {
  const { data } = await authClient.getSession();
  
  // BetterAuth stores token in the session object
  const token = data?.session?.token;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
};

export const getCampaigns = async (category: string = "all") => {
  let url = `${API_URL}/api/campaigns?status=approved`;
  if (category !== "all") {
    url += `&category=${category}`;
  }
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch campaigns");
  }
  
  const data = await res.json();
  return data.campaigns || [];
};

export const getCampaignById = async (id: string) => {
  const res = await fetch(`${API_URL}/api/campaigns/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch campaign");
  }
  return res.json();
};

export const contributeToCampaign = async (id: string, amount: number, reward_selected?: string) => {
  const headers = await getAuthHeaders();
  
  const res = await fetch(`${API_URL}/api/payments/create-checkout-session`, {
    method: "POST",
    headers,
    body: JSON.stringify({ campaignId: id, amount, reward: reward_selected }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to create payment session");
  }
  
  // Return the Stripe checkout URL to redirect to
  return data;
};
