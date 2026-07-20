"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Menu } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Don't show regular navbar inside dashboard
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-tight text-primary">Fundora</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/explore" className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground">
            Explore
          </Link>
          <Link href="/join-dev" className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground">
            Join as Dev
          </Link>

          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : session ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                🪙 {((session.user as any).credits) || 0} Credits
              </div>
              
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Link href={`/dashboard/${(session.user as any).role || 'supporter'}`}>
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image || ""} alt={session.user.name} />
                      <AvatarFallback>{session.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-2">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-background p-4 space-y-4 shadow-lg">
          <Link href="/explore" className="block text-sm font-medium text-foreground">Explore</Link>
          <Link href="/join-dev" className="block text-sm font-medium text-foreground">Join as Dev</Link>
          
          {session ? (
            <>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Link href={`/dashboard/${(session.user as any).role || 'supporter'}`} className="block text-sm font-medium text-foreground">Dashboard</Link>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <div className="text-sm font-semibold text-secondary-foreground">🪙 {((session.user as any).credits) || 0} Credits</div>
              <Button variant="destructive" size="sm" className="w-full mt-2" onClick={handleSignOut}>Log out</Button>
            </>
          ) : (
            <div className="flex flex-col space-y-2 mt-4">
              <Link href="/login"><Button variant="outline" className="w-full">Log in</Button></Link>
              <Link href="/register"><Button className="w-full">Register</Button></Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
