"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingCart, CheckCircle, Heart } from "lucide-react";
import { ShopifyProduct, ShopifyVariant } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/CartContext";
import { useWishlist } from "@/components/WishlistContext";

interface ProductDetailsProps {
  product: ShopifyProduct;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  // Initial state setup
  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0]?.src || product.image?.src || "/DadduCharger.svg"
  );
  
  const hasVariants = product.variants && product.variants.length > 1;
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(
    product.variants?.[0] || null
  );

  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addToCart, setIsCartOpen } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    addToCart({
      variantId: selectedVariant.id.toString(),
      productId: product.id.toString(),
      handle: product.handle,
      title: product.title,
      variantTitle: selectedVariant.title,
      price: currentPrice,
      image: selectedImage,
      quantity,
    });
    
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
      // Optional: Open cart drawer
      setIsCartOpen(true);
    }, 1500);
  };

  const inWishlist = isInWishlist(product.id.toString());
  
  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id.toString());
    } else {
      addToWishlist({
        productId: product.id.toString(),
        handle: product.handle,
        title: product.title,
        price: currentPrice,
        image: selectedImage,
      });
    }
  };

  const currentPrice = selectedVariant?.price || "0.00";
  const compareAtPrice = selectedVariant?.compare_at_price;
  const isAvailable = selectedVariant?.available ?? true;

  // Formatting currency
  const formatPrice = (val: string | number) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    if (!isNaN(num)) {
      return `Rs. ${num.toLocaleString()}`;
    }
    return val;
  };

  return (
    <div className="space-y-16">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
      {/* Left Column: Image Gallery */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {/* Main Image */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-xl group flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-gradient-to-tr from-accent-gold/5 via-transparent to-transparent opacity-50" />
          <Image
            src={selectedImage}
            alt={product.title}
            fill
            className="object-contain p-4 mix-blend-screen transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Thumbnails */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
            {product.images.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img.src)}
                className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === img.src
                    ? "border-accent-gold shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                    : "border-neutral-800 hover:border-neutral-600"
                } bg-neutral-900 flex items-center justify-center p-2`}
              >
                <Image
                  src={img.src}
                  alt={img.alt || product.title}
                  fill
                  className="object-contain p-1 mix-blend-screen"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Product Info */}
      <div className="w-full lg:w-1/2 flex flex-col gap-8">
        {/* Title and Price */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
            {product.title}
          </h1>
          
          <div className="flex items-center gap-4">
            <span className="text-2xl md:text-3xl font-bold text-accent-gold">
              {formatPrice(currentPrice)}
            </span>
            {compareAtPrice && parseFloat(compareAtPrice) > parseFloat(currentPrice) && (
              <span className="text-lg md:text-xl text-neutral-500 line-through font-semibold">
                {formatPrice(compareAtPrice)}
              </span>
            )}
            
            {compareAtPrice && parseFloat(compareAtPrice) > parseFloat(currentPrice) && (
              <span className="ml-2 bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Sale
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <hr className="border-neutral-800" />

        {/* Variants Selector */}
        {hasVariants && (
          <div className="space-y-6">
            {/* If options exist, we can render them. For now we just render a simple variant selector if there's only 1 combined option list, or we just map variants. */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-neutral-400 uppercase tracking-wider">
                Select Option
              </label>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariant(variant);
                      if (variant.featured_image?.src) {
                        setSelectedImage(variant.featured_image.src);
                      }
                    }}
                    className={`px-4 py-2 rounded-lg border-2 font-semibold text-sm transition-all ${
                      selectedVariant?.id === variant.id
                        ? "border-accent-gold text-accent-gold bg-accent-gold/10"
                        : "border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:text-white bg-neutral-900"
                    } ${!variant.available ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!variant.available}
                  >
                    {variant.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Area */}
        <div className="space-y-6 bg-neutral-900/40 border border-neutral-800/60 p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            {/* Quantity */}
            <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden h-14">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center font-bold text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className={`flex-1 h-14 text-base font-bold uppercase tracking-wider transition-all duration-300 ${
                addedToCart
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-accent-gold hover:bg-yellow-400 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]"
              }`}
            >
              {addedToCart ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Added to Cart
                </span>
              ) : !isAvailable ? (
                "Out of Stock"
              ) : (
                <span className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </span>
              )}
            </Button>

            {/* Add to Wishlist Button */}
            <button
              onClick={handleToggleWishlist}
              className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 transition-all ${
                inWishlist 
                  ? "border-red-500 bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]" 
                  : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-red-500/50 hover:text-red-400"
              }`}
            >
              <Heart className={`w-6 h-6 ${inWishlist ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* Description */}
      {(() => {
        // Strip emojis from the description HTML
        const stripEmojis = (html: string) =>
          html.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, '').replace(/\s{2,}/g, ' ');

        const cleanHtml = product.body_html ? stripEmojis(product.body_html) : '';
        if (!cleanHtml.trim()) return null;

        return (
          <div className="mt-12 space-y-6 border-t border-neutral-800 pt-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent uppercase">
              Description
            </h3>
            <div 
              className={[
                "prose prose-invert max-w-none leading-relaxed",
                // Paragraphs
                "prose-p:text-neutral-400 prose-p:text-[15px] prose-p:leading-relaxed prose-p:mb-4",
                // Headings — gradient style matching the product title
                "[&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h2]:bg-gradient-to-b [&_h2]:from-white [&_h2]:to-neutral-400 [&_h2]:bg-clip-text [&_h2]:text-transparent [&_h2]:uppercase [&_h2]:mt-10 [&_h2]:mb-4",
                "[&_h3]:text-lg [&_h3]:sm:text-xl [&_h3]:font-bold [&_h3]:tracking-tight [&_h3]:text-white [&_h3]:uppercase [&_h3]:mt-8 [&_h3]:mb-3",
                // Strong / bold
                "prose-strong:text-white prose-strong:font-bold",
                // Links
                "prose-a:text-accent-gold hover:prose-a:text-yellow-400 prose-a:transition-colors prose-a:no-underline hover:prose-a:underline",
                // Lists
                "[&_ul]:space-y-2 [&_ul]:my-4 [&_ul]:pl-0 [&_ul]:list-none",
                "[&_ul>li]:relative [&_ul>li]:pl-6 [&_ul>li]:text-neutral-400 [&_ul>li]:text-[15px]",
                "[&_ul>li]:before:content-[''] [&_ul>li]:before:absolute [&_ul>li]:before:left-0 [&_ul>li]:before:top-[10px] [&_ul>li]:before:w-2 [&_ul>li]:before:h-2 [&_ul>li]:before:bg-accent-gold/60 [&_ul>li]:before:rounded-full",
                "[&_ul>li>p]:mb-0",
                // Horizontal rules — subtle gold accent
                "[&_hr]:border-neutral-800 [&_hr]:my-8 [&_hr]:border-t [&_hr]:border-b-0",
              ].join(" ")}
              dangerouslySetInnerHTML={{ __html: cleanHtml }}
            />
          </div>
        );
      })()}
    </div>
  );
}
