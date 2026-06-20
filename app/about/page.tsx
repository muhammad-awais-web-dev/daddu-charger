"use client";

import { useEffect } from "react";
import { useTransition } from "@/components/TransitionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, Compass, Cpu, Monitor, HelpCircle, ShieldCheck, Heart, Users, Eye } from "lucide-react";

export default function AboutPage() {
  const { finishTransition } = useTransition();

  useEffect(() => {
    finishTransition();
  }, []);

  return (
    <main className="dark min-h-[90vh] bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full text-primary mb-2">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
            About Us
          </h1>
          <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed pt-2">
            Welcome to Daddu Charger – Powering Your Gaming Experience
          </p>
          <p className="text-sm sm:text-base text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            At Daddu Charger, we're passionate about delivering top-tier gaming experiences. Founded in Rawalpindi, Pakistan, our mission is to provide gamers with high-performance custom-built PCs and premium accessories that elevate gameplay to the next level.
          </p>
        </div>

        {/* Our Journey Card */}
        <Card className="border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-2 bg-neutral-800 rounded-lg text-primary">
              <Compass className="w-6 h-6" />
            </div>
            <CardTitle className="text-xl font-bold text-white">Our Journey</CardTitle>
          </CardHeader>
          <CardContent className="text-neutral-400 leading-relaxed text-sm sm:text-base">
            What began as a small venture fueled by a love for gaming has evolved into a trusted destination for gaming enthusiasts. Recognizing the need for reliable and powerful gaming setups, we've dedicated ourselves to assembling rigs that meet the unique demands of each gamer.
          </CardContent>
        </Card>

        {/* What We Offer Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight border-b border-neutral-800 pb-2">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-neutral-800 bg-neutral-900/30">
              <CardHeader className="pb-2">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-primary mb-2">
                  <Cpu className="w-4 h-4" />
                </div>
                <CardTitle className="text-base font-semibold text-white">Custom PCs</CardTitle>
              </CardHeader>
              <CardContent className="text-xs sm:text-sm text-neutral-400">
                Tailored to your specific needs, ensuring optimal performance for your favorite titles.
              </CardContent>
            </Card>

            <Card className="border-neutral-800 bg-neutral-900/30">
              <CardHeader className="pb-2">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-primary mb-2">
                  <Monitor className="w-4 h-4" />
                </div>
                <CardTitle className="text-base font-semibold text-white">Premium Accessories</CardTitle>
              </CardHeader>
              <CardContent className="text-xs sm:text-sm text-neutral-400">
                From high-res monitors to responsive keyboards and precision mice, we enhance your setup.
              </CardContent>
            </Card>

            <Card className="border-neutral-800 bg-neutral-900/30">
              <CardHeader className="pb-2">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-primary mb-2">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <CardTitle className="text-base font-semibold text-white">Expert Consultation</CardTitle>
              </CardHeader>
              <CardContent className="text-xs sm:text-sm text-neutral-400">
                Our team guides you through selecting the perfect components and configurations.
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight border-b border-neutral-800 pb-2">Why Choose Daddu Charger?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-white text-base">Quality Assurance</h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                We use only top-tier components to ensure durability and performance.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-white text-base">Customer-Centric</h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Your satisfaction is our priority. We offer personalized support and after-sales service.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-white text-base">Community Engagement</h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Join our growing community of gamers on Instagram, Facebook, TikTok, and YouTube.
              </p>
            </div>
          </div>
        </div>

        {/* Our Vision Card */}
        <Card className="border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900/50 to-neutral-900 border text-center p-6">
          <CardHeader className="flex flex-col items-center gap-2 pb-2">
            <div className="p-2 bg-neutral-800 rounded-lg text-primary">
              <Eye className="w-6 h-6" />
            </div>
            <CardTitle className="text-xl font-bold text-white">Our Vision</CardTitle>
          </CardHeader>
          <CardContent className="text-neutral-400 leading-relaxed max-w-xl mx-auto text-sm sm:text-base">
            To be at the forefront of the gaming industry in Pakistan, providing innovative solutions and fostering a vibrant gaming community.
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
