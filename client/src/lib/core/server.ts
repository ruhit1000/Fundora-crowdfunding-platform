import { getUserToken } from "./session";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const authHeader = async (): Promise<Record<string, string>> => {
  const token = await getUserToken();
  return token ? { Authorization: `Bearer ${token}` } : {}; 
};

export const serverMutation = async <T = unknown>(
  path: string, 
  method: "POST" | "PUT" | "PATCH", 
  data: unknown
): Promise<T> => {
  const requestHeaders = {
    "Content-Type": "application/json",
    ...(await authHeader()),
  };

  const res = await fetch(`${baseUrl}/api/${path}`, {
    method: method,
    headers: requestHeaders,
    body: JSON.stringify(data),
  });

  return res.json();
};

export const serverDelete = async <T = unknown>(path: string): Promise<T> => {
  const res = await fetch(`${baseUrl}/api/${path}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeader()),
    },
  });
  return res.json();
};

export const serverFetch = async <T = unknown>(path: string): Promise<T> => {
  const res = await fetch(`${baseUrl}/api/${path}`, {
    cache: "no-store",
  });
  return res.json();
};

export const protectedFetch = async <T = unknown>(path: string): Promise<T> => {
  const res = await fetch(`${baseUrl}/api/${path}`, {
    cache: "no-store",
    headers: await authHeader(),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! Status: ${res.status}`);
  }

  return res.json();
};
