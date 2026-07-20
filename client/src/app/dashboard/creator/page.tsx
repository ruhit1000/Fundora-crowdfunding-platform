"use client";

import { useEffect, useState } from "react";
import { getCreatorDashboard } from "@/lib/api/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreatorDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCreatorDashboard()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error) return <div className="text-destructive font-bold p-10">{error}</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Creator Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your campaigns and track funding.</p>
        </div>
        <Link href="/dashboard/creator/new">
          <Button><PlusCircle className="mr-2 h-4 w-4" /> Launch Campaign</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Campaigns</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{data?.stats?.totalCampaigns || 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Active Campaigns</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{data?.stats?.activeCampaigns || 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Funding Raised</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-primary">${data?.stats?.totalRaised?.toLocaleString() || 0}</div></CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Your Campaigns</h2>
        {data?.campaigns?.length === 0 ? (
          <div className="p-8 text-center border rounded-lg bg-card text-muted-foreground">
            You haven&apos;t created any campaigns yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {data?.campaigns?.map((c: any) => (
              <Card key={c._id} className="overflow-hidden flex flex-col">
                <div 
                  className="h-32 w-full bg-cover bg-center bg-muted"
                  style={{ backgroundImage: `url(${c.image_url})` }}
                />
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-1">{c.title}</CardTitle>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      c.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      c.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 flex-grow">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>${c.amount_raised.toLocaleString()}</span>
                      <span className="text-muted-foreground">of ${c.funding_goal.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full" 
                        style={{ width: `${Math.min(100, (c.amount_raised / c.funding_goal) * 100)}%` }} 
                      />
                    </div>
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
