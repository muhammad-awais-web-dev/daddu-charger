"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useTransition } from "@/components/TransitionContext";
import { TransitionLink } from "@/components/TransitionLink";
import { ProductGrid } from "@/components/ProductGrid";
import { Search, SlidersHorizontal } from "lucide-react";

interface SearchResult {
  id: string | number;
  title: string;
  handle: string;
  url?: string;
  image: string;
  price: string;
  available?: boolean;
  vendor?: string;
  type?: string;
}

export default function SearchPage() {
  const { finishTransition } = useTransition();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    finishTransition();
  }, []);

  // Sync URL query param on mount and when it changes
  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q && q !== query) {
      setQuery(q);
      setInputValue(q);
      setPage(1);
    }
  }, [searchParams]);

  // Fetch search results when query or page changes
  const fetchResults = useCallback(async () => {
    if (!query.trim()) {
      setResults([]);
      setTotalCount(undefined);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(
        `/api/shopify/search?q=${encodeURIComponent(query)}&page=${page}`
      );
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
        setTotalCount(data.totalCount);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  }, [query, page]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(inputValue);
    setPage(1);
    // Update URL without full navigation
    window.history.replaceState(
      null,
      "",
      `/search?q=${encodeURIComponent(inputValue)}`
    );
  };

  // Map results to ProductGrid format
  const gridProducts = results.map((r) => ({
    id: r.id.toString(),
    title: r.title,
    price: r.price,
    image: r.image || "/DadduCharger.svg",
    href: r.url || `/products/${r.handle}`,
    inStock: r.available ?? true,
  }));

  return (
    <main className="min-h-screen bg-black pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-4">
          <TransitionLink
            href="/"
            className="text-sm font-bold text-neutral-400 hover:text-white uppercase tracking-wider flex items-center gap-2 w-fit"
          >
            &larr; Back to Home
          </TransitionLink>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight">
            Search
          </h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex items-center gap-3 bg-neutral-900/80 border border-neutral-800 rounded-2xl px-6 py-4 focus-within:border-accent-gold/50 transition-colors">
            <Search className="w-5 h-5 text-neutral-500 flex-shrink-0" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search for products, categories, brands..."
              className="flex-1 bg-transparent border-none outline-none text-base text-white placeholder-neutral-500"
              autoFocus
            />
            {loading && (
              <span className="w-5 h-5 rounded-full border-2 border-neutral-600 border-t-white animate-spin flex-shrink-0" />
            )}
            <button
              type="submit"
              className="px-5 py-2 bg-accent-gold text-black font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-yellow-400 transition-colors cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results Info */}
        {hasSearched && !loading && (
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <span className="text-sm text-neutral-500 font-medium uppercase tracking-wider">
              {totalCount !== undefined
                ? `${totalCount} result${totalCount !== 1 ? "s" : ""}`
                : `${results.length} result${results.length !== 1 ? "s" : ""}`}
              {query && (
                <span className="text-neutral-400">
                  {" "}
                  for &ldquo;
                  <span className="text-white font-semibold">{query}</span>
                  &rdquo;
                </span>
              )}
            </span>
          </div>
        )}

        {/* Results Grid */}
        {loading && !hasSearched ? (
          <div className="flex items-center justify-center py-24">
            <span className="w-8 h-8 rounded-full border-2 border-neutral-600 border-t-white animate-spin" />
          </div>
        ) : results.length > 0 ? (
          <ProductGrid products={gridProducts} columns={4} />
        ) : hasSearched && !loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
            <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-neutral-600" />
            </div>
            <h3 className="text-xl font-bold text-white">No results found</h3>
            <p className="text-neutral-400 max-w-md">
              We couldn&apos;t find any products matching &ldquo;{query}&rdquo;.
              Try a different search term or browse our categories.
            </p>
            <TransitionLink
              href="/categories"
              className="mt-4 px-6 py-3 bg-white/10 text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-accent-gold hover:text-black border border-white/10 hover:border-accent-gold transition-all cursor-pointer"
            >
              Browse Categories
            </TransitionLink>
          </div>
        ) : (
          /* Initial state — no search yet */
          <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
            <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-neutral-600" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Search our store
            </h3>
            <p className="text-neutral-400 max-w-md">
              Find gaming mice, keyboards, headsets, controllers, PC builds, and
              more.
            </p>
          </div>
        )}

        {/* Pagination for search (server-side paginated via API) */}
        {results.length > 0 && totalCount !== undefined && totalCount > results.length && (
          <div className="flex items-center justify-center gap-4 py-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-6 py-2.5 border border-neutral-700 rounded-xl bg-neutral-900 text-white font-bold text-sm tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Previous
            </button>
            <span className="text-neutral-400 font-medium">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-6 py-2.5 border border-neutral-700 rounded-xl bg-neutral-900 text-white font-bold text-sm tracking-wider uppercase hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
