"use client";

import { useEffect, useState } from "react";
import { getSupporterDashboard } from "@/lib/api/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SupporterDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    getSupporterDashboard(page)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [page]);

  if (loading && !data) return <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error) return <div className="text-destructive font-bold p-10">{error}</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Supporter Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track your impact and active contributions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Contributed</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-primary">${data?.stats?.totalSupportedAmount?.toLocaleString() || 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Campaigns Supported</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{data?.stats?.campaignsSupported || 0}</div></CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-primary flex items-center"><Coins className="mr-2 h-4 w-4"/> Credits Available</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">${data?.stats?.creditsAvailable?.toLocaleString() || 0}</div></CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Your Contributions</h2>
        {data?.contributions?.length === 0 ? (
          <div className="p-8 text-center border rounded-lg bg-card text-muted-foreground space-y-4">
            <p>You haven&apos;t backed any campaigns yet.</p>
            <Link href="/explore">
              <Button>Explore Campaigns</Button>
            </Link>
          </div>
        ) : (
          <div className="border rounded-md bg-card">
            <div className="grid grid-cols-4 gap-4 p-4 border-b font-medium text-sm text-muted-foreground">
              <div className="col-span-2">Campaign</div>
              <div>Date</div>
              <div className="text-right">Amount</div>
            </div>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {data?.contributions?.map((c: any) => (
              <div key={c._id} className="grid grid-cols-4 gap-4 p-4 border-b last:border-0 items-center text-sm">
                <div className="col-span-2 font-medium">
                  <Link href={`/campaigns/${c.campaignId}`} className="hover:underline">
                    {c.campaign_title || "Unknown Campaign"}
                  </Link>
                  {c.reward_selected && <div className="text-xs text-muted-foreground mt-1">Reward: {c.reward_selected}</div>}
                </div>
                <div className="text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</div>
                <div className="text-right font-semibold text-primary">${c.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {data?.pagination?.totalPages > 1 && (
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              disabled={page >= data.pagination.totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
