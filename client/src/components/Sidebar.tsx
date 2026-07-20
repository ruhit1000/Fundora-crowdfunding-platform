"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  PlusCircle, 
  List, 
  WalletCards, 
  History, 
  Heart,
  Users,
  ShieldAlert
} from "lucide-react";

interface SidebarProps {
  role: "admin" | "creator" | "supporter";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const creatorLinks = [
    { name: "Dashboard", href: "/dashboard/creator", icon: LayoutDashboard },
    { name: "Add Campaign", href: "/dashboard/creator/campaigns/new", icon: PlusCircle },
    { name: "My Campaigns", href: "/dashboard/creator/campaigns", icon: List },
    { name: "Withdrawals", href: "/dashboard/creator/withdrawals", icon: WalletCards },
    { name: "Payment History", href: "/dashboard/creator/payments", icon: History },
  ];

  const supporterLinks = [
    { name: "Dashboard", href: "/dashboard/supporter", icon: LayoutDashboard },
    { name: "My Contributions", href: "/dashboard/supporter/contributions", icon: Heart },
    { name: "Purchase Credits", href: "/dashboard/supporter/credits", icon: WalletCards },
    { name: "Payment History", href: "/dashboard/supporter/payments", icon: History },
  ];

  const adminLinks = [
    { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Campaign Approvals", href: "/dashboard/admin/campaigns", icon: ShieldAlert },
    { name: "Withdrawal Requests", href: "/dashboard/admin/withdrawals", icon: WalletCards },
    { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
  ];

  const links = role === "admin" ? adminLinks : role === "creator" ? creatorLinks : supporterLinks;

  return (
    <aside className="w-64 border-r bg-muted/20 min-h-[calc(100vh-4rem)]">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight text-primary">Fundora</span>
        </Link>
      </div>
      <nav className="space-y-1 p-4">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-4 left-4">
        <Link href="/">
          <span className="text-sm font-medium text-muted-foreground hover:text-foreground">
            ← Back to Home
          </span>
        </Link>
      </div>
    </aside>
  );
}
