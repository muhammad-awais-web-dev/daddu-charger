"use client";

import React from "react";
import Image from "next/image";
import { Trash2, Heart, ShoppingCart } from "lucide-react";
import { useWishlist } from "./WishlistContext";
import { useCart } from "./CartContext";
import { TransitionLink } from "./TransitionLink";
import { Button } from "./ui/button";

export function WishlistContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const { wishlistItems, removeFromWishlist, setIsWishlistOpen } = useWishlist();
  const { addToCart } = useCart();

  const handleLinkClick = () => {
    setIsWishlistOpen(false);
    if (onLinkClick) onLinkClick();
  };

  const handleMoveToCart = (item: any) => {
    addToCart({
      variantId: item.productId,
      productId: item.productId,
      handle: item.handle,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: 1,
    });
    removeFromWishlist(item.productId);
  };

  const formatPrice = (val: string | number) => {
    const num = typeof val === "string" ? parseFloat(val.replace(/,/g, "")) : val;
    if (!isNaN(num)) return `Rs. ${num.toLocaleString()}`;
    return val;
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
        <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center">
          <Heart className="w-10 h-10 text-neutral-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Your wishlist is empty</h3>
          <p className="text-neutral-400 mt-1">Save your favorite items here to buy later.</p>
        </div>
        <Button
          onClick={handleLinkClick}
          className="mt-4 bg-white text-black hover:bg-neutral-200"
        >
          Explore Products
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
      {wishlistItems.map((item) => (
        <div key={item.productId} className="flex gap-4 bg-neutral-900/40 p-3 rounded-xl border border-neutral-800/50 relative group">
          {/* Item Image */}
          <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-neutral-900 flex-shrink-0">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Item Details */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="pr-6">
              <TransitionLink
                href={`/products/${item.handle}`}
                onClick={handleLinkClick}
                className="font-bold text-white text-sm line-clamp-2 hover:text-accent-gold transition-colors leading-snug"
              >
                {item.title}
              </TransitionLink>
              <span className="font-bold text-neutral-400 text-sm mt-1 block">
                {formatPrice(item.price)}
              </span>
            </div>

            <Button
              onClick={() => handleMoveToCart(item)}
              variant="outline"
              className="w-full mt-3 h-9 text-xs font-bold uppercase tracking-wider bg-transparent border-neutral-700 text-neutral-300 hover:border-accent-gold hover:text-accent-gold hover:bg-accent-gold/10 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
            </Button>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => removeFromWishlist(item.productId)}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-red-500 hover:border-red-500/50 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
