"use client";

import React, { createContext, useContext, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import Image from "next/image";

interface TransitionContextType {
  startTransition: (href: string, text?: string) => void;
  finishTransition: () => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const curtainRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const [loaderText, setLoaderText] = useState("Loading...");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Transition Intro (stairs slide up from the bottom and grow, then logo appears, then route navigates)
  const startTransition = (href: string, customText?: string) => {
    if (!curtainRef.current || isTransitioning) return;

    setLoaderText(customText || "Loading...");
    setIsTransitioning(true);

    const stairs = curtainRef.current.querySelectorAll(".stair");

    // Immediately place the curtain overlay on-screen
    gsap.set(curtainRef.current, { y: "0%" });

    // Set initial states: stairs at the bottom of the page with 0 height, logo container hidden
    gsap.set(stairs, { top: "100%", height: "0%" });
    gsap.set(logoContainerRef.current, { opacity: 0, scale: 0.8 });

    const tl = gsap.timeline({
      onComplete: () => {
        router.push(href);
      },
    });

    // Animate stairs entering from the bottom of the page, growing to their place
    tl.to(stairs, {
      top: (i) => `${i * 20}%`,
      height: "20.5%", // Slightly larger than 20% to prevent sub-pixel gaps
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.1,
    });

    // Animate logo container in once stairs are in place
    tl.to(logoContainerRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "back.out(1.7)",
    });
  };

  // Transition Outro (logo hides first, then stairs go out in reverse back to the bottom of the page)
  const finishTransition = () => {
    if (!curtainRef.current) return;

    const stairs = curtainRef.current.querySelectorAll(".stair");

    const tl = gsap.timeline({
      onComplete: () => {
        // Clean up curtain container position and transition state
        gsap.set(curtainRef.current, { y: "100%" });
        setIsTransitioning(false);
      },
    });

    // 1. Hide the logo container completely
    tl.to(logoContainerRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      ease: "power2.in",
    });

    // 2. Animate the stairs back to the bottom of the page (top: 100%, height: 0%) in reverse order
    tl.to(stairs, {
      top: "100%",
      height: "0%",
      duration: 0.8,
      ease: "power2.inOut",
      stagger: {
        each: 0.1,
        from: "end",
      },
    });
  };

  return (
    <TransitionContext.Provider value={{ startTransition, finishTransition, isTransitioning }}>
      {children}

      {/* Global Transition Curtain Overlay */}
      <div
        ref={curtainRef}
        className="fixed inset-0 z-[9999] pointer-events-none block"
        style={{ transform: "translateY(100%)" }}
      >
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-black">
          <div className="stair absolute z-10  top-0 w-full h-1/5 bg-[#fff]" ></div>
          <div className="stair absolute z-10  top-1/5 w-full h-1/5 bg-[#eee]" ></div>
          <div className="stair absolute z-10  top-2/5 w-full h-1/5 bg-[#ddd]" ></div>
          <div className="stair absolute z-10  top-3/5 w-full h-1/5 bg-[#ccc]" ></div>
          <div className="stair absolute z-10  top-4/5 w-full h-1/5 bg-[#bbb]" ></div>
          <div ref={logoContainerRef} className="z-20 flex flex-col items-center justify-center gap-4">
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
            <div className="px-4 py-1.5 bg-black/60 border border-white/10 rounded-full shadow-2xl backdrop-blur-md">
              <span className="font-sans text-xs font-bold tracking-[0.2em] uppercase bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
                {loaderText}
              </span>
            </div>
          </div>
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
