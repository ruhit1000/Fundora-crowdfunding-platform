"use client";

import { useEffect, useState } from "react";
import { getAdminDashboard, updateCampaignStatus } from "@/lib/api/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, FolderKanban, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = () => {
    getAdminDashboard()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
    try {
      await updateCampaignStatus(id, status);
      // Refresh dashboard to remove from pending
      fetchDashboard();
    } catch (e: any) {
      alert(e.message || "Failed to update status");
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error) return <div className="text-destructive font-bold p-10">{error}</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
        <p className="text-muted-foreground mt-1">Platform overview and moderation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center"><Users className="mr-2 h-4 w-4"/> Total Users</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{data?.stats?.totalUsers || 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center"><FolderKanban className="mr-2 h-4 w-4"/> Total Campaigns</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{data?.stats?.totalCampaigns || 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center"><Banknote className="mr-2 h-4 w-4"/> Total Volume</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-primary">${data?.stats?.totalFunding?.toLocaleString() || 0}</div></CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-yellow-600">Pending Review</h2>
        {data?.pendingCampaigns?.length === 0 ? (
          <div className="p-6 border rounded-lg bg-card text-muted-foreground">
            No campaigns pending review.
          </div>
        ) : (
          <div className="grid gap-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {data?.pendingCampaigns?.map((c: any) => (
              <Card key={c._id}>
                <CardContent className="p-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{c.title}</h3>
                    <p className="text-sm text-muted-foreground">By {c.creator_name} ({c.creator_email})</p>
                    <p className="text-sm"><span className="font-medium">Goal:</span> ${c.funding_goal.toLocaleString()} | <span className="font-medium">Category:</span> {c.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleStatusUpdate(c._id, 'rejected')}>
                      Reject
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate(c._id, 'approved')}>
                      Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
