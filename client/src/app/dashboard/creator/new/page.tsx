"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { getAuthHeaders } from "@/lib/api/campaign";

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    funding_goal: 1000,
    min_contribution: 5,
    deadline: "",
    reward_info: "",
    story: "",
    image_url: ""
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const headers = await getAuthHeaders();
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      const res = await fetch(`${API_URL}/api/campaigns`, {
        method: "POST",
        headers,
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create campaign");

      // Redirect back to dashboard on success
      router.push("/dashboard/creator");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Launch a Campaign</h1>
        <p className="text-muted-foreground mt-1">Fill out the details below to submit your project for review.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>Provide clear, compelling information to attract supporters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title</Label>
              <Input 
                id="title" 
                placeholder="E.g., The Next Great Smartwatch" 
                required 
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select required value={formData.category} onValueChange={(val) => handleChange("category", val || "")}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="art">Creative Arts</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Funding Deadline</Label>
                <Input 
                  id="deadline" 
                  type="date" 
                  required 
                  value={formData.deadline}
                  onChange={(e) => handleChange("deadline", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="goal">Funding Goal ($)</Label>
                <Input 
                  id="goal" 
                  type="number" 
                  min={100} 
                  required 
                  value={formData.funding_goal}
                  onChange={(e) => handleChange("funding_goal", Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="min">Minimum Contribution ($)</Label>
                <Input 
                  id="min" 
                  type="number" 
                  min={1} 
                  required 
                  value={formData.min_contribution}
                  onChange={(e) => handleChange("min_contribution", Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Cover Image URL</Label>
              <Input 
                id="image" 
                type="url" 
                placeholder="https://example.com/image.jpg" 
                required 
                value={formData.image_url}
                onChange={(e) => handleChange("image_url", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">In a real app, we would use a file uploader (e.g. AWS S3 or ImgBB).</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reward">Supporter Reward</Label>
              <Input 
                id="reward" 
                placeholder="E.g., Early bird access & T-Shirt" 
                required 
                value={formData.reward_info}
                onChange={(e) => handleChange("reward_info", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="story">Campaign Story</Label>
              <textarea 
                id="story" 
                placeholder="Tell your story. Why should people support you?" 
                className="min-h-[150px] flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required 
                value={formData.story}
                onChange={(e) => handleChange("story", e.target.value)}
              />
            </div>
            
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t pt-6 bg-muted/20">
            <Button variant="outline" type="button" onClick={() => router.push("/dashboard/creator")}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit for Review
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
