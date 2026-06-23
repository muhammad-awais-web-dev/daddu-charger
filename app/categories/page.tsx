import React from "react";
import Image from "next/image";
import { getShopifyCollections } from "@/lib/shopify";
import { TransitionLink } from "@/components/TransitionLink";
import { PageTransitionCompleter } from "@/components/PageTransitionCompleter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories - Daddu Charger",
  description:
    "Explore our product categories — gaming mice, keyboards, headsets, controllers, gaming PC builds, and more. Find what you need at Daddu Charger.",
};

interface CollectionCard {
  title: string;
  handle: string;
  image: string;
  description: string;
  productsCount?: number;
}

// Strip HTML tags and decode entities to get clean plain text
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export default async function CategoriesPage() {
  let collections: CollectionCard[] = [];

  try {
    const res = await getShopifyCollections({ limit: 50 });
    collections = res.collections
      .filter((col) => {
        const isHidden = col.handle === "reelup-do-not-delete";
        return !isHidden;
      })
      .map((col) => ({
        title: col.title,
        handle: col.handle,
        image: col.image?.src || "/DadduCharger.svg",
        description: col.description || "",
        productsCount: (col as any).products_count,
      }));
  } catch (error) {
    console.error("Failed to load collections:", error);
  }

  return (
    <main className="min-h-screen bg-black pt-32 pb-24 px-6 md:px-12">
      <PageTransitionCompleter />
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <TransitionLink
            href="/"
            className="text-sm font-bold text-neutral-400 hover:text-white uppercase tracking-wider flex items-center gap-2 w-fit"
          >
            &larr; Back to Home
          </TransitionLink>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight">
            Categories
          </h1>
          <p className="text-neutral-400 max-w-2xl text-lg">
            Browse by category to find exactly what you&apos;re looking for.
          </p>
        </div>

        {/* Collection count */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <span className="text-sm text-neutral-500 font-medium uppercase tracking-wider">
            {collections.length} categor{collections.length !== 1 ? "ies" : "y"}
          </span>
        </div>

        {/* Categories Grid */}
        {collections.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            No categories found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((col) => (
              <TransitionLink
                key={col.handle}
                href={`/collections/${col.handle}`}
                loaderText={`Loading ${col.title}...`}
                className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
                  <Image
                    src={col.image}
                    alt={col.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain object-center transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Text content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight group-hover:text-accent-gold transition-colors duration-300">
                    {col.title}
                  </h2>
                  {col.description && stripHtml(col.description) && (
                    <p className="text-sm text-neutral-400 line-clamp-2">
                      {stripHtml(col.description)}
                    </p>
                  )}
                  {col.productsCount !== undefined && col.productsCount !== null && (
                    <span className="inline-block text-xs font-bold uppercase tracking-wider text-neutral-500 bg-neutral-800/60 px-3 py-1 rounded-full border border-neutral-700/50">
                      {col.productsCount} product{col.productsCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </TransitionLink>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
