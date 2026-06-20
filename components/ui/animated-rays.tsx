"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedRaysProps {
    /** Additional CSS classes */
    className?: string;
    /** Optional children to render over the background */
    children?: React.ReactNode;
    /** Headline text to show in the center */
    headline?: string;
    /** Subtext paragraph to show in the center */
    subtext?: string;
}

export function AnimatedRays({
    className = "",
    children,
    headline,
    subtext,
}: AnimatedRaysProps) {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkDark = () => document.documentElement.classList.contains("dark");
        setIsDark(checkDark());

        const observer = new MutationObserver(() => setIsDark(checkDark()));
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

    if (!mounted) return null;

    const stripes = `repeating-linear-gradient(
        100deg,
        var(--stripe-color) 0%,
        var(--stripe-color) 7%,
        transparent 10%,
        transparent 12%,
        var(--stripe-color) 16%
    )`;
    const rainbow = `repeating-linear-gradient(
        100deg,
        #60a5fa 10%,
        #e879f9 15%,
        #60a5fa 20%,
        #5eead4 25%,
        #60a5fa 30%
    )`;

    const stripeColorVal = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)";

    return (
        <section className={cn("relative w-full h-full overflow-hidden flex items-center justify-center min-h-[70vh]", className)}>
            {/* Aurora Background — matches original .hero */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `${stripes}, ${rainbow}`,
                    backgroundSize: "300%, 200%",
                    backgroundPosition: "50% 50%, 50% 50%",
                    filter: isDark
                        ? "blur(10px) opacity(50%) saturate(200%)"
                        : "blur(10px) invert(100%)",
                    maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
                    WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
                    "--stripe-color": stripeColorVal,
                } as React.CSSProperties}
            >
                {/* Animated overlay — matches original .hero::after */}
                <div
                    className="absolute inset-0 animate-aurora-bg"
                    style={{
                        backgroundImage: `${stripes}, ${rainbow}`,
                        backgroundSize: "200%, 100%",
                        backgroundAttachment: "fixed",
                        mixBlendMode: "difference",
                        "--stripe-color": stripeColorVal,
                    } as React.CSSProperties}
                />
            </div>

            {(children || headline || subtext) && (
                <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto py-16">
                    {headline && (
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 drop-shadow-md">
                            {headline}
                        </h1>
                    )}
                    {subtext && (
                        <p className="text-base md:text-lg text-neutral-200 max-w-2xl mx-auto leading-relaxed mb-8 drop-shadow-sm">
                            {subtext}
                        </p>
                    )}
                    {children}
                </div>
            )}
        </section>
    );
}

export default AnimatedRays;
