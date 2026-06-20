"use client";

import { useEffect } from "react";
import { useTransition } from "@/components/TransitionContext";
import { TransitionLink } from "@/components/TransitionLink";
import AnimatedRays from "@/components/ui/animated-rays";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { finishTransition } = useTransition();

  useEffect(() => {
    finishTransition();
  }, []);

  return (
    <main className="dark w-full flex-1 flex flex-col bg-background text-foreground relative">
      <AnimatedRays
        className="flex-1 min-h-[calc(100vh-6rem)]"
        headline="Welcome to Daddu Charger"
        subtext="Powering Your Gaming Experience. We deliver top-tier, high-performance custom-built gaming PCs and premium accessories crafted in Rawalpindi, Pakistan, designed to elevate your gameplay to the next level."
      >
        <div className="flex items-center justify-center gap-4 mt-4">
          <TransitionLink href="/page-one">
            <Button size="lg" className="font-semibold px-8 cursor-pointer shadow-lg hover:scale-105 transition-transform duration-200">
              Explore Store
            </Button>
          </TransitionLink>
        </div>
      </AnimatedRays>
    </main>
  );
}
