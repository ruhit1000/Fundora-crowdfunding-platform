"use client";

import { useEffect, useState } from "react";
import { getNotifications, markNotificationAsRead } from "@/lib/api/notification";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function NotificationDropdown() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  const fetchNotifs = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifs();
    // Refresh periodically
    const interval = setInterval(fetchNotifs, 30000); // 30s
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (id: string, route: string, isRead: boolean) => {
    if (!isRead) {
      try {
        await markNotificationAsRead(id);
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prev) => 
          prev.map((n) => n._id === id ? { ...n, isRead: true } : n)
        );
      } catch (e) {
        console.error("Failed to mark read", e);
      }
    }
    if (route) {
      router.push(route);
    }
  };

  const markAllRead = async () => {
    try {
      await markNotificationAsRead("all");
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative p-2 rounded-md hover:bg-muted transition-colors outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600 ring-2 ring-background"></span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="font-semibold text-sm">Notifications</div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto px-2 py-1 text-xs" onClick={markAllRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <div className="py-2">
          {notifications.length === 0 ? (
            <div className="px-4 py-3 text-sm text-center text-muted-foreground">
              No notifications yet.
            </div>
          ) : (
            notifications.map((n) => (
              <DropdownMenuItem 
                key={n._id} 
                className={`flex flex-col items-start px-4 py-3 cursor-pointer ${!n.isRead ? 'bg-muted/30' : ''}`}
                onClick={() => handleNotificationClick(n._id, n.actionRoute, n.isRead)}
              >
                <div className="flex w-full justify-between gap-2">
                  <span className={`text-sm ${!n.isRead ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                    {n.message}
                  </span>
                  {!n.isRead && <span className="h-2 w-2 mt-1 rounded-full bg-primary flex-shrink-0" />}
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {new Date(n.time || n.createdAt).toLocaleString()}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
