import React from "react";
import { getShopifyProducts } from "@/lib/shopify";
import { ProductGrid } from "@/components/ProductGrid";
import { TransitionLink } from "@/components/TransitionLink";
import { PageTransitionCompleter } from "@/components/PageTransitionCompleter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products - Daddu Charger",
  description:
    "Browse our full catalog of gaming mice, keyboards, controllers, headsets, gaming PC builds, and premium accessories. Fast delivery across Pakistan.",
};

export default async function AllProductsPage() {
  let products: any[] = [];

  try {
    const res = await getShopifyProducts({ limit: 250 });
    products = res.products.map((p) => ({
      id: p.id.toString(),
      title: p.title,
      price: p.variants?.[0]?.price || "0",
      image: p.images?.[0]?.src || p.image?.src || "/DadduCharger.svg",
      hoverImage: p.images?.[1]?.src,
      href: `/products/${p.handle}`,
      inStock: p.variants?.[0]?.available ?? true,
    }));
  } catch (error) {
    console.error("Failed to load products:", error);
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
            All Products
          </h1>
          <p className="text-neutral-400 max-w-2xl text-lg">
            Browse our entire collection of gaming peripherals, accessories, and custom-built PCs.
          </p>
        </div>

        {/* Product count */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <span className="text-sm text-neutral-500 font-medium uppercase tracking-wider">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Products Grid with Pagination */}
        <ProductGrid products={products} limit={12} enablePagination={true} columns={4} />
      </div>
    </main>
  );
}
