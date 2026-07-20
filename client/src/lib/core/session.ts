import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "creator" | "supporter";
  image?: string;
  credits: number;
}

export const getUserSession = async (): Promise<AuthUser | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (session?.user as unknown as AuthUser) || null;
};

export const getUserToken = async (): Promise<string | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.session?.token || null;
};

export const requireRole = async (role: "admin" | "creator" | "supporter"): Promise<AuthUser> => {
  const user = await getUserSession();
  
  if (!user) {
    redirect("/login");
  }
  
  if (user.role !== role) {
    redirect("/explore"); // Redirect unauthorized users to explore
  }
  
  return user;
};
