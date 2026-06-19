"use client";

import { useEffect } from "react";
import { useTransition } from "@/components/TransitionContext";
import { TransitionLink } from "@/components/TransitionLink";

export default function PageOne() {
  const { finishTransition } = useTransition();

  useEffect(() => {
    // Exit transition curtain immediately on mount
    finishTransition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#070709] text-gray-100 flex flex-col items-center justify-center p-6 text-center">
      
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-md w-full bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-orange-600" />
        
        <div className="p-3 bg-amber-500/10 w-fit mx-auto rounded-2xl text-amber-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white">Welcome to Page One</h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          This is a simple demo route. The entry animation played automatically, and the curtain slid away immediately on mount.
        </p>

        <div className="flex flex-col gap-3 pt-2">
          <TransitionLink
            href="/"
            className="bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all inline-block"
          >
            Go back to Dashboard
          </TransitionLink>
          <TransitionLink
            href="/page-two"
            className="bg-amber-500 hover:bg-amber-400 text-black px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-amber-500/10 inline-block"
          >
            Navigate to Page Two (Delayed Load)
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}
