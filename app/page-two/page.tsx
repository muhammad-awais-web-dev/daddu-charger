"use client";

import { useEffect, useState } from "react";
import { useTransition } from "@/components/TransitionContext";
import { TransitionLink } from "@/components/TransitionLink";

export default function PageTwo() {
  const { finishTransition } = useTransition();
  const [loadingData, setLoadingData] = useState(true);
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    // Simulate data fetch (e.g. from shopify api or delay)
    const fetchData = async () => {
      setLoadingData(true);
      // Wait 1.5 seconds to simulate API load
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setData("Shopify Catalog Synchronized!");
      setLoadingData(false);

      // Exit transition curtain once data has loaded
      finishTransition();
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#070709] text-gray-100 flex flex-col items-center justify-center p-6 text-center">
      
      {/* Glow Orbs */}
      <div className="absolute top-1/4 right-1/3 w-72 h-72 bg-orange-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-md w-full bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-600 to-yellow-500" />
        
        <div className="p-3 bg-orange-500/10 w-fit mx-auto rounded-2xl text-orange-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white font-sans">Welcome to Page Two</h1>
        
        <div className="bg-black/60 border border-white/5 rounded-xl p-4 space-y-2">
          <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Fetched Page Data State</p>
          {loadingData ? (
            <span className="text-xs text-gray-400 font-mono italic">Synchronizing...</span>
          ) : (
            <span id="data" className="text-sm font-semibold text-emerald-400 font-mono">{data}</span>
          )}
        </div>

        <p className="text-sm text-gray-400 leading-relaxed">
          This page simulated a 1.5s API query. The GSAP overlay remained active and blocked interaction until data fetching finished and triggered the exit curtain.
        </p>

        <div className="flex flex-col gap-3 pt-2">
          <TransitionLink
            href="/"
            className="bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all inline-block"
          >
            Go back to Dashboard
          </TransitionLink>
          <TransitionLink
            href="/page-one"
            className="bg-amber-500 hover:bg-amber-400 text-black px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-amber-500/10 inline-block"
          >
            Navigate to Page One (Immediate Load)
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}
