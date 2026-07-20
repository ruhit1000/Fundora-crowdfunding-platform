"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"creator" | "supporter">("supporter");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    // Hardcoded public key or env key for ImgBB
    const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_KEY || "YOUR_IMGBB_KEY"; 
    
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.data?.url || "";
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      // Initial credits based on role
      const initialCredits = role === "supporter" ? 50 : 20;

      // Note: For custom fields like role & credits to be saved, 
      // they must be defined in the BetterAuth schema. We pass them in the signUp call.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: imageUrl,
        role: role,
        credits: initialCredits
      } as any);

      if (error) {
        setError(error.message || "Failed to register");
      } else {
        window.location.href = `/dashboard/${role}`;
      }
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <Card className="w-full max-w-md shadow-lg border-muted/50">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
          <CardDescription>
            Join Fundora to support or create campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">I want to...</Label>
              <Select value={role} onValueChange={(val) => val && setRole(val as "creator" | "supporter")}>
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supporter">Support Campaigns (Get 50 Credits)</SelectItem>
                  <SelectItem value="creator">Create Campaigns (Get 20 Credits)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Profile Picture (Optional)</Label>
              <Input 
                id="image" 
                type="file" 
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>

            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="ml-1 text-primary hover:underline font-medium">
            Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
