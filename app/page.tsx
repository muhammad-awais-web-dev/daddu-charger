"use client";

import { useEffect, useState } from "react";
import { useTransition } from "@/components/TransitionContext";
import { TransitionLink } from "@/components/TransitionLink";
import AnimatedRays from "@/components/ui/animated-rays";
import { Button } from "@/components/ui/button";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { ProductGrid } from "@/components/ProductGrid";

interface Category {
  name: string;
  image: string;
  href: string;
  itemCount?: number;
}

interface Product {
  id: string;
  title: string;
  price: string | number;
  image: string;
  hoverImage?: string;
  href: string;
  rating?: number;
  inStock?: boolean;
}

export default function Home() {
  const { finishTransition } = useTransition();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [gamingPcProducts, setGamingPcProducts] = useState<Product[]>([]);

  // Mapping functions
  const mapShopifyProduct = (prod: any): Product => {
    const mainImage = prod.images?.[0]?.src || prod.image?.src || "/DadduCharger.svg";
    const hoverImage = prod.images?.[1]?.src || undefined;
    const price = prod.variants?.[0]?.price || "0.00";
    const inStock = prod.variants?.[0]?.available !== undefined ? prod.variants[0].available : true;
    
    return {
      id: prod.id.toString(),
      title: prod.title,
      price: price,
      image: mainImage,
      hoverImage: hoverImage,
      href: `/products/${prod.handle}`,
      inStock: inStock,
      rating: 5
    };
  };

  const mapShopifyCollection = (col: any): Category => {
    return {
      name: col.title,
      image: col.image?.src || "/DadduCharger.svg",
      href: `/collections/${col.handle}`,
      itemCount: col.products_count
    };
  };

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [collectionsRes, productsRes, gamingPcRes] = await Promise.allSettled([
          fetch("/api/shopify/collections").then(res => {
            if (!res.ok) throw new Error("Failed to fetch collections");
            return res.json();
          }),
          fetch("/api/shopify/products?limit=8").then(res => {
            if (!res.ok) throw new Error("Failed to fetch products");
            return res.json();
          }),
          fetch("/api/shopify/collections/gaming-pc-builds").then(res => {
            if (!res.ok) throw new Error("Failed to fetch gaming pc builds");
            return res.json();
          })
        ]);

        if (collectionsRes.status === "fulfilled" && collectionsRes.value?.collections) {
          const filteredCollections = collectionsRes.value.collections.filter((col: any) => {
            const isReelUp = col.handle === "reelup-do-not-delete";
            const isEmpty = col.products_count === undefined || col.products_count === null || col.products_count === 0;
            return !isReelUp && !isEmpty;
          });
          setCategories(filteredCollections.map(mapShopifyCollection));
        } else {
          console.error("Collections fetch failed:", collectionsRes.status === "rejected" ? collectionsRes.reason : "No collections returned");
        }

        if (productsRes.status === "fulfilled" && productsRes.value?.products) {
          setFeaturedProducts(productsRes.value.products.map(mapShopifyProduct));
        } else {
          console.error("Products fetch failed:", productsRes.status === "rejected" ? productsRes.reason : "No products returned");
        }

        if (gamingPcRes.status === "fulfilled" && gamingPcRes.value?.collection?.products) {
          setGamingPcProducts(gamingPcRes.value.collection.products.map(mapShopifyProduct));
        } else {
          console.error("Gaming PC fetch failed:", gamingPcRes.status === "rejected" ? gamingPcRes.reason : "No gaming pc products returned");
        }
      } catch (err) {
        console.error("Error loading home page data:", err);
      } finally {
        finishTransition();
      }
    };

    loadHomeData();
  }, []);

  return (
    <main className="dark w-full flex-1 flex flex-col bg-background text-foreground relative">
      <AnimatedRays
        className="flex-1 min-h-[calc(100vh-6rem)]"
        headline="Welcome to Daddu Charger"
        subtext="Powering Your Gaming Experience. We deliver top-tier, high-performance custom-built gaming PCs and premium accessories crafted in Rawalpindi, Pakistan, designed to elevate your gameplay to the next level."
      >
        <div className="flex items-center justify-center gap-4 mt-4">
          <TransitionLink href="/page-one">
            <Button size="lg" className="font-semibold px-8 cursor-pointer shadow-lg hover:scale-105 transition-transform duration-200">
              Explore Store
            </Button>
          </TransitionLink>
        </div>
      </AnimatedRays>

      {/* Homepage Content Sections */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20 relative z-10">
        
        {/* Category Carousel Section */}
        {categories.length > 0 && (
          <section className="space-y-8">
            <div className="flex flex-col items-center text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
                Popular Collections
              </h2>
              <p className="text-sm sm:text-base text-accent-gold font-semibold tracking-wider uppercase">
                Explore Categories
              </p>
            </div>
            <CategoryCarousel categories={categories} />
          </section>
        )}

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section className="space-y-8">
            <div className="flex flex-col items-center text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
                Featured Products
              </h2>
              <p className="text-sm sm:text-base text-accent-gold font-semibold tracking-wider uppercase">
                Hot Deals & New Arrivals
              </p>
            </div>
            <ProductGrid products={featuredProducts} limit={8} />
          </section>
        )}

        {/* Gaming PC Builds Section */}
        {gamingPcProducts.length > 0 && (
          <section className="space-y-8">
            <div className="flex flex-col items-center text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
                Gaming PC Builds
              </h2>
              <p className="text-sm sm:text-base text-accent-gold font-semibold tracking-wider uppercase">
                Pre-Configured Performance Beasts
              </p>
            </div>
            <ProductGrid products={gamingPcProducts} />
          </section>
        )}

      </div>
    </main>
  );
}
