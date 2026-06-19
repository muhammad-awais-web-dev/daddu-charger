"use client";

import React, { createContext, useContext, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import Image from "next/image";

interface TransitionContextType {
  startTransition: (href: string) => void;
  finishTransition: () => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const curtainRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Transition Intro (curtain slides up to cover the screen, then navigates)
  const startTransition = (href: string) => {
    if (!curtainRef.current || isTransitioning) return;

    setIsTransitioning(true);

    // Initial state: slide down offscreen
    gsap.set(curtainRef.current, { y: "100%" });

    gsap.to(curtainRef.current, {
      y: "0%",
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        router.push(href);
      },
    });
  };

  // Transition Outro (curtain slides up and off the screen to reveal the page content)
  const finishTransition = () => {
    if (!curtainRef.current) return;

    gsap.to(curtainRef.current, {
      y: "-100%",
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(curtainRef.current, { y: "100%" });
        setIsTransitioning(false);
      },
    });
  };

  return (
    <TransitionContext.Provider value={{ startTransition, finishTransition, isTransitioning }}>
      {children}

      {/* Global Transition Curtain Overlay */}
      <div
        ref={curtainRef}
        className="fixed inset-0 bg-gradient-to-tr from-amber-600 via-orange-600 to-yellow-500 z-[9999] pointer-events-none block"
        style={{ transform: "translateY(100%)" }}
      >
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-black">
          <div className="p-3 bg-black rounded-full shadow-2xl animate-pulse">
            {/* <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg> */}
            <Image
              src="/DadduCharger.svg"
              alt="Loading Icon"
              width={100}
              height={100}
              className="text-amber-400"
            />

          </div>
          <span className="font-mono text-xs font-bold tracking-widest uppercase bg-black text-amber-400 px-3 py-1 rounded-full shadow-lg">
            Loading Route...
          </span>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
}
