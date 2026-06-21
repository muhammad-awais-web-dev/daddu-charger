"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "./CartContext";
import { CartContent } from "./CartContent";

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartCount } = useCart();

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCartOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setIsCartOpen]);



  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="hidden md:block fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="hidden md:flex fixed top-24 right-6 w-full max-w-[400px] bg-neutral-950/95 border border-neutral-800 shadow-2xl rounded-3xl backdrop-blur-xl z-[101] flex-col h-fit max-h-[calc(100vh-8rem)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-800 shrink-0">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <ShoppingCart className="w-5 h-5 text-accent-gold" />
                Your Cart
                <span className="text-sm font-normal text-neutral-400 normal-case">
                  ({cartCount} items)
                </span>
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-neutral-900 transition-colors text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-hidden px-6 pt-6 flex flex-col min-h-0">
              <CartContent />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
