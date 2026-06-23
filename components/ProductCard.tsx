"use client";

import React, { useState } from "react";
import Image from "next/image";
import { TransitionLink } from "./TransitionLink";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { useWishlist } from "@/components/WishlistContext";

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
  id,
  title,
  price,
  image,
  hoverImage,
  href,
  rating = 5,
  inStock = true,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, setIsCartOpen } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Extract handle from href (assuming href is like /products/handle)
  const handle = href.split('/').pop() || "";

  // The id provided to ProductCard is just a string, but the cart expects a variantId
  // Since we don't have variants on the card, we just use id as variantId for Quick Add
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;

    addToCart({
      variantId: id,
      productId: id,
      handle,
      title,
      price: price.toString(),
      image,
      quantity: 1,
    });
    
    setIsCartOpen(true);
  };

  const inWishlist = isInWishlist(id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        productId: id,
        handle,
        title,
        price: price.toString(),
        image,
      });
    }
  };

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
            className="object-cover object-center transition-all duration-150 group-hover:scale-105 opacity-100"
          />

          {/* Optional Hover Image */}
          {hoverImage && (
            <Image
              src={hoverImage}
              alt={`${title} - Alternate View`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className={`object-cover object-center absolute inset-0 transition-all duration-150 group-hover:scale-105 ${
                isHovered ? "opacity-100" : "opacity-0"
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

          {/* Wishlist Button (Always Visible) */}
          <div className="absolute right-4 top-4 z-20">
            <button
              onClick={handleToggleWishlist}
              className={`cursor-pointer p-2.5 rounded-full shadow-lg backdrop-blur-md border transition-all ${
                inWishlist 
                  ? "bg-red-500/20 border-red-500/50 text-red-500 hover:bg-red-500/30" 
                  : "bg-black/80 border-white/20 text-white hover:bg-black hover:text-red-400 hover:border-red-500/50"
              }`}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
            </button>
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

          {/* Price & Add to Cart */}
          <div className="space-y-3 mt-1">
            <div className="text-base sm:text-lg font-extrabold text-white">
              {formatPrice(price)}
            </div>
            <button
              onClick={handleQuickAdd}
              disabled={!inStock}
              className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                inStock 
                  ? "bg-white/10 text-white hover:bg-accent-gold hover:text-black border border-white/10 hover:border-accent-gold shadow-lg cursor-pointer" 
                  : "bg-black/40 text-neutral-500 border border-white/5 cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {inStock ? "Add to Cart" : "Sold Out"}
            </button>
          </div>
        </CardContent>
      </Card>
    </TransitionLink>
  );
}
