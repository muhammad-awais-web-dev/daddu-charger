"use client";

import React from "react";
import { CartProvider } from "./CartContext";
import { WishlistProvider } from "./WishlistContext";
import { TransitionProvider } from "./TransitionContext";
import { CartDrawer } from "./CartDrawer";
import { WishlistDrawer } from "./WishlistDrawer";

export function StoreProviders({ children }: { children: React.ReactNode }) {
  return (
    <TransitionProvider>
      <CartProvider>
        <WishlistProvider>
          {children}
          <CartDrawer />
          <WishlistDrawer />
        </WishlistProvider>
      </CartProvider>
    </TransitionProvider>
  );
}
