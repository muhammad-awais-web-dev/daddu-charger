"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TransitionLink } from "@/components/TransitionLink";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/animate/tooltip";

interface QuickSearchResult {
  id: string;
  title: string;
  price: string;
  image: string;
  handle: string;
  url: string;
}

export function Header() {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<QuickSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Menu Links
  const menuLinks = [
    { name: "Home", href: "/" },
    { name: "All Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  // Track scroll position to change visual density
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync wishlist and cart counts from LocalStorage
  const updateCounts = () => {
    if (typeof window === "undefined") return;

    try {
      const savedWishlist = localStorage.getItem("daddu_wishlist");
      if (savedWishlist) {
        setWishlistCount(JSON.parse(savedWishlist).length);
      } else {
        setWishlistCount(0);
      }

      const savedCart = localStorage.getItem("daddu_cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        const count = parsedCart.reduce((acc: number, curr: any) => acc + (curr.quantity || 0), 0);
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error("Failed to read storage counts:", err);
    }
  };

  useEffect(() => {
    updateCounts();
    // Listen to local updates and cross-tab updates
    window.addEventListener("daddu_storage_update", updateCounts);
    window.addEventListener("storage", updateCounts);
    return () => {
      window.removeEventListener("daddu_storage_update", updateCounts);
      window.removeEventListener("storage", updateCounts);
    };
  }, []);

  // Debounced Quick Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`/api/shopify/quick-search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        }
      } catch (err) {
        console.error("Search fetch failed:", err);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <TooltipProvider openDelay={0} closeDelay={100}>
      <div className="w-full fixed top-0 inset-x-0 z-50 transition-all duration-300">
      {/* Floating Capsule Container */}
      <div className="w-full px-6 pt-4">
        <header
          className={`max-w-5xl mx-auto px-6 bg-neutral-950/80 border border-neutral-800 shadow-2xl backdrop-blur-xl rounded-full flex items-center justify-between transition-all duration-300 ${
            scrolled ? "py-2.5 max-w-4xl" : "py-4"
          }`}
        >
          {/* Logo Section */}
          <div className="flex items-center gap-2 pl-2">
            <TransitionLink href="/" loaderText="Loading Home...">
              <Image
                src="/DADDUCHARGER-LOGO-ROG.png"
                alt="Daddu Charger Logo"
                width={120}
                height={32}
                className="object-contain cursor-pointer"
                priority
              />
            </TransitionLink>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {menuLinks.map((link) => (
              <TransitionLink
                key={link.name}
                href={link.href}
                loaderText={`Navigating to ${link.name}...`}
                className="text-xs font-semibold text-neutral-400 hover:text-accent-gold transition-colors py-1.5 px-3 rounded-lg cursor-pointer"
              >
                {link.name}
              </TransitionLink>
            ))}
          </nav>

          {/* Action Buttons Section */}
          <div className="flex items-center gap-2 pr-2">
            {/* Search Toggle Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`p-2 rounded-full hover:bg-white/5 transition-all text-neutral-400 hover:text-white ${
                    searchOpen ? "bg-white/5 text-white" : ""
                  }`}
                >
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent>Search Products</TooltipContent>
            </Tooltip>

            {/* Wishlist Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 rounded-full hover:bg-white/5 transition-all text-neutral-400 hover:text-white relative">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white border border-black animate-pulse" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>Saved Items ({wishlistCount})</TooltipContent>
            </Tooltip>

            {/* Cart Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 rounded-full hover:bg-white/5 transition-all text-neutral-400 hover:text-white relative">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-white text-black text-[9px] font-bold flex items-center justify-center border border-black">
                      {cartCount}
                    </span>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>View Shopping Cart ({cartCount})</TooltipContent>
            </Tooltip>

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full hover:bg-white/5 text-neutral-400 hover:text-white md:hidden transition-colors"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </header>
      </div>

      {/* Floating Search Drawer Component */}
      <AnimatePresence>
        {searchOpen && (
          <div className="w-full px-6 mt-2">
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="max-w-4xl mx-auto bg-neutral-950/95 border border-neutral-800 shadow-2xl rounded-3xl backdrop-blur-xl overflow-hidden relative z-40"
            >
              <div className="px-6 py-6 space-y-4">
                <div className="flex items-center gap-3 border-b border-neutral-800 pb-2">
                  <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type to search products..."
                    className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-neutral-500"
                    autoFocus
                  />
                  {searching && <span className="w-4 h-4 rounded-full border-2 border-neutral-600 border-t-white animate-spin" />}
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="text-xs text-neutral-400 hover:text-white transition-colors"
                  >
                    Close
                  </button>
                </div>

                {/* Suggestions Grid */}
                {searchQuery.trim() !== "" && (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                    {searchResults.length === 0 && !searching ? (
                      <p className="text-xs text-neutral-500 px-1 py-2">No products found matching your search.</p>
                    ) : (
                      searchResults.map((product) => (
                        <TransitionLink
                          key={product.id}
                          href={product.url || `/products/${product.handle}`}
                          loaderText={`Loading ${product.title}...`}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-18 h-18 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                              <Image
                                src={product.image || "/DadduCharger.svg"}
                                alt={product.title}
                                width={52}
                                height={52}
                                className="opacity-80 object-contain"
                              />
                            </div>
                            <span className="text-xs font-semibold text-white">{product.title}</span>
                          </div>
                          <span className="text-xs text-neutral-400">Rs. {Number(product.price).toLocaleString()}</span>
                        </TransitionLink>
                      ))
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="w-full px-6 mt-2 md:hidden">
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-neutral-950/95 border border-neutral-800 shadow-2xl rounded-3xl backdrop-blur-xl overflow-hidden relative z-40"
            >
              <nav className="flex flex-col p-6 gap-4">
                {menuLinks.map((link) => (
                  <TransitionLink
                    key={link.name}
                    href={link.href}
                    loaderText={`Navigating to ${link.name}...`}
                    className="text-sm font-semibold text-neutral-300 hover:text-accent-gold transition-colors"
                  >
                    {link.name}
                  </TransitionLink>
                ))}
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
