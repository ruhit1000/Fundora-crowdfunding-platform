"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, TrendingUp, Calendar, Target, User, CheckCircle2 } from "lucide-react";
import { getCampaignById, contributeToCampaign } from "@/lib/api/campaign";

interface Campaign {
  _id: string;
  title: string;
  story: string;
  category: string;
  funding_goal: number;
  min_contribution: number;
  amount_raised: number;
  deadline: string;
  reward_info: string;
  image_url: string;
  creator_name: string;
}

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();
  
  const [amount, setAmount] = useState<number>(0);
  const [contributing, setContributing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const data = await getCampaignById(id as string);
        setCampaign(data);
        setAmount(data.min_contribution);
      } catch (err) {
        console.error("Failed to fetch campaign", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCampaign();
  }, [id]);

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push("/login");
      return;
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((session.user as any)?.role !== "supporter") {
      setError("Only supporters can contribute to campaigns");
      return;
    }

    setContributing(true);
    setError("");

    try {
      const data = await contributeToCampaign(id as string, amount, campaign?.reward_info);
      setSuccess(true);
      if (campaign) {
        setCampaign({ ...campaign, amount_raised: data.amount_raised });
      }
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "An unexpected error occurred");
    } finally {
      setContributing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Campaign Not Found</h1>
        <Button onClick={() => router.push("/explore")}>Back to Explore</Button>
      </div>
    );
  }

  const progress = Math.min(100, Math.round((campaign.amount_raised / campaign.funding_goal) * 100));
  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));

  return (
    <div className="container mx-auto py-12 px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="text-sm font-semibold text-primary uppercase tracking-wider">
              {campaign.category}
            </div>
            <h1 className="text-4xl font-bold tracking-tight">{campaign.title}</h1>
            <p className="text-muted-foreground flex items-center">
              <User className="mr-2 h-4 w-4" /> By {campaign.creator_name}
            </p>
          </div>

          <div 
            className="w-full h-[400px] rounded-xl bg-cover bg-center bg-muted"
            style={{ backgroundImage: `url(${campaign.image_url || 'https://placehold.co/1200x800?text=Campaign'})` }}
          />

          <div className="prose prose-slate max-w-none">
            <h3 className="text-2xl font-bold">About this project</h3>
            <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground mt-4">
              {campaign.story}
            </p>
          </div>
        </div>

        {/* Sidebar / Contribution Panel */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">${campaign.amount_raised.toLocaleString()}</CardTitle>
              <CardDescription className="text-base">
                raised of ${campaign.funding_goal.toLocaleString()} goal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold flex items-center"><Target className="mr-2 h-5 w-5 text-primary"/> {progress}%</span>
                  <span className="text-sm text-muted-foreground">Funded</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold flex items-center"><Calendar className="mr-2 h-5 w-5 text-primary"/> {daysLeft}</span>
                  <span className="text-sm text-muted-foreground">Days left</span>
                </div>
              </div>

              {success ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto" />
                  <h4 className="font-semibold text-green-700 dark:text-green-400">Thank you for your support!</h4>
                  <p className="text-sm text-green-600/80 dark:text-green-400/80">Your contribution has been recorded.</p>
                </div>
              ) : (
                <form onSubmit={handleContribute} className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Contribution Amount ($)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 font-medium">$</span>
                      <Input 
                        id="amount" 
                        type="number" 
                        min={campaign.min_contribution} 
                        className="pl-8 text-lg font-semibold"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum contribution: ${campaign.min_contribution}
                    </p>
                  </div>
                  
                  {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                  
                  <Button type="submit" className="w-full h-12 text-lg" disabled={contributing || daysLeft === 0}>
                    {contributing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <TrendingUp className="mr-2 h-5 w-5" />}
                    Back this project
                  </Button>
                </form>
              )}
            </CardContent>
            
            <CardFooter className="bg-muted/30 flex flex-col items-start p-6">
              <h4 className="font-semibold mb-2">Reward</h4>
              <p className="text-sm text-muted-foreground">{campaign.reward_info}</p>
            </CardFooter>
          </Card>
        </div>

      </div>
    </div>
  );
}
