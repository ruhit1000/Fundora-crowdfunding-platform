"use client";

import { Sidebar } from "@/components/Sidebar";
import { authClient } from "@/lib/auth-client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session?.user as any)?.role || "supporter";

  return (
    <div className="flex min-h-[calc(100vh-64px)] overflow-hidden">
      <Sidebar role={role} />
      <main className="flex-1 overflow-y-auto bg-muted/20 p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
