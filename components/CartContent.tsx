"use client";

import React from "react";
import Image from "next/image";
import { Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "./CartContext";
import { TransitionLink } from "./TransitionLink";
import { Button } from "./ui/button";

export function CartContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const { cartItems, updateQuantity, removeFromCart, setIsCartOpen } = useCart();

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + parseFloat(item.price.replace(/,/g, "")) * item.quantity;
  }, 0);

  const formatPrice = (val: number) => `Rs. ${val.toLocaleString()}`;

  const handleLinkClick = () => {
    setIsCartOpen(false);
    if (onLinkClick) onLinkClick();
  };

  if (cartItems.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
        <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center">
          <ShoppingCart className="w-10 h-10 text-neutral-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Your cart is empty</h3>
          <p className="text-neutral-400 mt-1">Looks like you haven't added anything yet.</p>
        </div>
        <Button
          onClick={handleLinkClick}
          className="mt-4 bg-white text-black hover:bg-neutral-200"
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-4 bg-neutral-900/40 p-3 rounded-xl border border-neutral-800/50">
            {/* Item Image */}
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-neutral-900 flex-shrink-0">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Item Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <TransitionLink
                    href={`/products/${item.handle}`}
                    onClick={handleLinkClick}
                    className="font-bold text-white text-sm line-clamp-2 hover:text-accent-gold transition-colors"
                  >
                    {item.title}
                  </TransitionLink>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-neutral-500 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {item.variantTitle && item.variantTitle !== "Default Title" && (
                  <p className="text-xs text-neutral-500 mt-1">{item.variantTitle}</p>
                )}
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-md overflow-hidden h-8">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="font-bold text-accent-gold text-sm">
                  {formatPrice(parseFloat(item.price.replace(/,/g, "")) * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-4 mt-2 border-t border-neutral-800 shrink-0 pb-2">
        <div className="flex items-center justify-between mb-4">
          <span className="text-neutral-400">Subtotal</span>
          <span className="text-xl font-bold text-white">{formatPrice(subtotal)}</span>
        </div>
        <p className="text-xs text-neutral-500 mb-6 text-center">
          Shipping, taxes, and discounts calculated at checkout.
        </p>
        <Button className="w-full h-14 text-base font-bold uppercase tracking-wider bg-accent-gold hover:bg-yellow-400 text-black shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] transition-all">
          Checkout
        </Button>
      </div>
    </div>
  );
}
