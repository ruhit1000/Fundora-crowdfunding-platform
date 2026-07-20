"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Mail, MessageCircle } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Don't show regular footer inside dashboard
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="w-full border-t bg-muted/40 py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 md:px-8">
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-xl font-bold tracking-tight text-primary">Fundora</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Empowering creators and innovators to bring their ideas to life through community support.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="#" className="text-muted-foreground hover:text-foreground"><Globe className="h-5 w-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-foreground"><MessageCircle className="h-5 w-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-foreground"><Mail className="h-5 w-5" /></a>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/explore" className="hover:text-primary">All Campaigns</Link></li>
            <li><Link href="/categories/tech" className="hover:text-primary">Technology</Link></li>
            <li><Link href="/categories/art" className="hover:text-primary">Creative Arts</Link></li>
            <li><Link href="/categories/community" className="hover:text-primary">Community</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Fundora. All rights reserved.
      </div>
    </footer>
  );
}
