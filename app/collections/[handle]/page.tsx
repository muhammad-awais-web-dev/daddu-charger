import React from "react";
import { notFound } from "next/navigation";
import { getShopifyCollection, getShopifyCollectionProducts } from "@/lib/shopify";
import { ProductGrid } from "@/components/ProductGrid";
import { TransitionLink } from "@/components/TransitionLink";
import { PageTransitionCompleter } from "@/components/PageTransitionCompleter";

interface CollectionPageProps {
  params: Promise<{
    handle: string;
  }>;
}

export async function generateMetadata({ params }: CollectionPageProps) {
  try {
    const { handle } = await params;
    const { collection } = await getShopifyCollection(handle);
    return {
      title: `${collection.title} - Daddu Charger`,
      description: collection.description ? collection.description.replace(/<[^>]+>/g, '').substring(0, 160) : `Shop ${collection.title} at Daddu Charger.`,
    };
  } catch (error) {
    return {
      title: "Collection Not Found - Daddu Charger",
    };
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  let collection;
  let products = [];

  try {
    const { handle } = await params;
    
    // Fetch collection info and its products in parallel
    const [collectionRes, productsRes] = await Promise.all([
      getShopifyCollection(handle),
      getShopifyCollectionProducts(handle, { limit: 250 }) // fetch maximum for client-side pagination
    ]);

    collection = collectionRes.collection;
    
    products = productsRes.products.map((p) => ({
      id: p.id.toString(),
      title: p.title,
      price: p.variants?.[0]?.price || "0",
      image: p.images?.[0]?.src || p.image?.src || "/DadduCharger.svg",
      hoverImage: p.images?.[1]?.src,
      href: `/products/${p.handle}`,
      inStock: p.variants?.[0]?.available ?? true,
    }));
  } catch (error) {
    console.error("Failed to load collection:", error);
    notFound();
  }

  return (
    <main className="min-h-screen bg-black pt-32 pb-24 px-6 md:px-12">
      <PageTransitionCompleter />
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-4">
          <TransitionLink href="/" className="text-sm font-bold text-neutral-400 hover:text-white uppercase tracking-wider flex items-center gap-2 w-fit">
            &larr; Back to Home
          </TransitionLink>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight">
            {collection.title}
          </h1>
          {collection.description && (
            <div 
              className="text-neutral-400 max-w-2xl text-lg [&>p]:mb-3 [&>p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: collection.description }}
            />
          )}
        </div>

        <ProductGrid products={products} limit={12} enablePagination={true} columns={4} />
      </div>
    </main>
  );
}
