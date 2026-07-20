import { getAuthHeaders } from "./campaign";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const getCreatorDashboard = async () => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/dashboard/creator`, { headers });
  if (!res.ok) throw new Error("Failed to fetch creator dashboard");
  return res.json();
};

export const getSupporterDashboard = async (page: number = 1, limit: number = 10) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/dashboard/supporter?page=${page}&limit=${limit}`, { headers });
  if (!res.ok) throw new Error("Failed to fetch supporter dashboard");
  return res.json();
};

export const getAdminDashboard = async () => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/dashboard/admin`, { headers });
  if (!res.ok) throw new Error("Failed to fetch admin dashboard");
  return res.json();
};

export const updateCampaignStatus = async (id: string, status: "approved" | "rejected" | "pending") => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/dashboard/admin/campaigns/${id}/status`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error("Failed to update campaign status");
  return res.json();
};
