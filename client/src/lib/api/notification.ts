import { getAuthHeaders } from "./campaign";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const getNotifications = async () => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/notifications`, { headers });
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
};

export const markNotificationAsRead = async (id: string) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/notifications/${id}/read`, {
    method: "PUT",
    headers,
  });
  if (!res.ok) throw new Error("Failed to update notification");
  return res.json();
};
