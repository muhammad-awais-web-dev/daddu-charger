"use client";

import React from "react";
import Image from "next/image";
import { TransitionLink } from "./TransitionLink";
import { Card } from "@/components/ui/card";

interface CategoryCardProps {
  name: string;
  image: string;
  href: string;
  itemCount?: number;
}

export function CategoryCard({ name, image, href, itemCount }: CategoryCardProps) {
  return (
    <TransitionLink href={href} className="group block">
      <Card className="relative overflow-hidden border-neutral-800 bg-neutral-900 h-64 sm:h-80 w-full cursor-pointer rounded-2xl shadow-xl transition-all duration-300 group-hover:border-primary/50">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={image || "/DadduCharger.svg"}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain bg-white p-6 object-center transition-transform duration-500 group-hover:scale-105"
          />
          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 opacity-70 transition-opacity duration-300 group-hover:opacity-85" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-accent-gold">
              {name}
            </h3>
            {itemCount !== undefined && (
              <span className="inline-block text-xs font-semibold text-neutral-400 bg-neutral-950/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-neutral-800/40">
                {itemCount} {itemCount === 1 ? "Item" : "Items"}
              </span>
            )}
          </div>
        </div>
      </Card>
    </TransitionLink>
  );
}
