"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";
import { getCampaigns } from "@/lib/api/campaign";

interface Campaign {
  _id: string;
  title: string;
  category: string;
  funding_goal: number;
  amount_raised: number;
  image_url: string;
  creator_name: string;
}

export default function ExplorePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const data = await getCampaigns(category);
      setCampaigns(data);
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [category]);

  const filteredCampaigns = campaigns.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto py-12 px-4 md:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Explore Campaigns</h1>
          <p className="text-muted-foreground mt-2">Discover and support innovative projects</p>
        </div>
        
        <div className="flex w-full md:w-auto items-center space-x-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search campaigns..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={category} onValueChange={(val) => setCategory(val || "all")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="tech">Technology</SelectItem>
              <SelectItem value="art">Creative Arts</SelectItem>
              <SelectItem value="community">Community</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed">
          <h3 className="text-xl font-semibold mb-2">No campaigns found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCampaigns.map((campaign) => {
            const progress = Math.min(100, Math.round((campaign.amount_raised / campaign.funding_goal) * 100));
            
            return (
              <Card key={campaign._id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                <div 
                  className="h-48 w-full bg-cover bg-center bg-muted"
                  style={{ backgroundImage: `url(${campaign.image_url || 'https://placehold.co/600x400?text=Campaign'})` }}
                />
                <CardHeader className="p-4 pb-2">
                  <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                    {campaign.category}
                  </div>
                  <CardTitle className="line-clamp-2 text-lg">{campaign.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">by {campaign.creator_name}</p>
                </CardHeader>
                <CardContent className="p-4 pt-2 flex-grow">
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>${campaign.amount_raised.toLocaleString()}</span>
                      <span className="text-muted-foreground">raised of ${campaign.funding_goal.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-right text-muted-foreground">
                      {progress}% Funded
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Link href={`/campaigns/${campaign._id}`} className="w-full">
                    <Button className="w-full">View Campaign</Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
