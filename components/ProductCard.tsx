"use client";

import React, { useState } from "react";
import Image from "next/image";
import { TransitionLink } from "./TransitionLink";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ProductCardProps {
  id: string;
  title: string;
  price: string | number;
  image: string;
  hoverImage?: string;
  href: string;
  rating?: number;
  inStock?: boolean;
}

export function ProductCard({
  title,
  price,
  image,
  hoverImage,
  href,
  rating = 5,
  inStock = true,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Formatting currency
  const formatPrice = (val: string | number) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    if (!isNaN(num)) {
      return `Rs. ${num.toLocaleString()}`;
    }
    return val;
  };

  return (
    <TransitionLink href={href} className="group block">
      <Card
        className="relative overflow-hidden border-neutral-800 bg-neutral-900/50 backdrop-blur-sm rounded-2xl shadow-lg transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Section */}
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-950">
          {/* Main Image */}
          <Image
            src={image || "/DadduCharger.svg"}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className={`object-cover object-center transition-transform duration-500 group-hover:scale-105 ${
              hoverImage && isHovered ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Optional Hover Image */}
          {hoverImage && (
            <Image
              src={hoverImage}
              alt={`${title} - Alternate View`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className={`object-cover object-center absolute inset-0 transition-all duration-500 group-hover:scale-105 ${
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            />
          )}

          {/* In Stock / Out of Stock Badge */}
          <div className="absolute left-4 top-4 z-20">
            {inStock ? (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-green-500/10 border border-green-500/30 text-green-400 px-2 py-0.5 rounded-full backdrop-blur-md">
                In Stock
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/10 border border-red-500/30 text-red-400 px-2 py-0.5 rounded-full backdrop-blur-md">
                Sold Out
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-5 space-y-2">
          {/* Rating */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < rating
                    ? "fill-primary text-primary"
                    : "fill-neutral-800 text-neutral-800"
                }`}
              />
            ))}
          </div>

          {/* Title */}
          <h4 className="font-bold text-sm sm:text-base text-neutral-200 line-clamp-2 transition-colors duration-300 group-hover:text-accent-gold min-h-[2.5rem]">
            {title}
          </h4>

          {/* Price */}
          <div className="text-base sm:text-lg font-extrabold text-white">
            {formatPrice(price)}
          </div>
        </CardContent>
      </Card>
    </TransitionLink>
  );
}
