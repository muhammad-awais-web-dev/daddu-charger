import React from "react";
import { notFound } from "next/navigation";
import { getShopifyProduct, getShopifyProducts } from "@/lib/shopify";
import { ProductDetails } from "@/components/ProductDetails";
import { ProductGrid } from "@/components/ProductGrid";
import { PageTransitionCompleter } from "@/components/PageTransitionCompleter";
import { TransitionLink } from "@/components/TransitionLink";

interface ProductPageProps {
  params: Promise<{
    handle: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  try {
    const { handle } = await params;
    const { product } = await getShopifyProduct(handle);
    return {
      title: `${product.title} - Daddu Charger`,
      description: product.body_html ? product.body_html.replace(/<[^>]+>/g, '').substring(0, 160) : `Buy ${product.title} at Daddu Charger.`,
    };
  } catch (error) {
    return {
      title: "Product Not Found - Daddu Charger",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product;
  let relatedProducts: any[] = [];
  try {
    const { handle } = await params;
    
    // Fetch product and general products in parallel
    const [res, allProductsRes] = await Promise.all([
      getShopifyProduct(handle),
      getShopifyProducts({ limit: 12 })
    ]);
    
    product = res.product;
    
    relatedProducts = allProductsRes.products
      .filter((p) => p.handle !== handle)
      .slice(0, 4)
      .map((p) => ({
        id: p.id.toString(),
        title: p.title,
        price: p.variants?.[0]?.price || "0",
        image: p.images?.[0]?.src || p.image?.src || "/DadduCharger.svg",
        hoverImage: p.images?.[1]?.src,
        href: `/products/${p.handle}`,
        inStock: p.variants?.[0]?.available ?? true,
      }));
  } catch (error) {
    console.error("Failed to load product:", error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  return (
    <main className="w-full flex-1 flex flex-col bg-background text-foreground relative z-10 pt-24 pb-16">
      <PageTransitionCompleter />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm font-semibold text-neutral-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 custom-scrollbar">
          <TransitionLink href="/" className="hover:text-white transition-colors">
            Home
          </TransitionLink>
          <span className="text-neutral-700">/</span>
          <TransitionLink href="/products" className="hover:text-white transition-colors">
            Products
          </TransitionLink>
          <span className="text-neutral-700">/</span>
          <span className="text-accent-gold truncate max-w-[200px] sm:max-w-xs">{product.title}</span>
        </nav>

        {/* Client Side Product Display */}
        <ProductDetails product={product} />

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-neutral-800/60">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-8">
              You May Also Like
            </h2>
            <ProductGrid products={relatedProducts} limit={4} columns={4} />
          </div>
        )}

      </div>
    </main>
  );
}
