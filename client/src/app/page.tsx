import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Shield, Zap } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Fundora | Empowering Innovators Worldwide",
  description: "Fundora is the leading crowdfunding platform for creative projects, startups, and community initiatives.",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black"></div>
        <div className="absolute inset-0 z-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-block mb-4 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary-foreground backdrop-blur-sm">
            <span className="text-sm font-semibold tracking-wider text-primary-200">THE FUTURE OF CROWDFUNDING</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-lg">
            Bring Your Ideas <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">To Life.</span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10 drop-shadow">
            Join thousands of creators and backers building the next generation of tech, art, and community projects.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/explore">
              <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                Explore Projects <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto bg-white/5 border-white/20 text-white hover:bg-white/10">
                Start a Campaign
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Choose Fundora?</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide the best tools for creators to succeed and for backers to discover amazing projects safely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/30 border border-muted/50 transition-all hover:shadow-md">
              <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <Globe className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Global Reach</h3>
              <p className="text-muted-foreground">Connect with backers from over 150 countries. Break down borders and fund your dream globally.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/30 border border-muted/50 transition-all hover:shadow-md">
              <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Payments</h3>
              <p className="text-muted-foreground">Powered by Stripe, your contributions are safe. Creators only get funds when goals are met.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/30 border border-muted/50 transition-all hover:shadow-md">
              <div className="h-14 w-14 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Payouts</h3>
              <p className="text-muted-foreground">Experience lightning-fast payouts once your campaign succeeds. No waiting weeks for your funds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6">Ready to make an impact?</h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Whether you are here to fund the future or build it, Fundora is your platform.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold">
              Join Fundora Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
