"use client";

import React from "react";
import { ProductCard } from "./ProductCard";

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

interface ProductGridProps {
  products: Product[];
  limit?: 4 | 8 | 12 | number;
  columns?: 2 | 3 | 4;
}

export function ProductGrid({ products, limit, columns = 4 }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        No products found.
      </div>
    );
  }

  // Slice array according to limit
  const displayedProducts = limit ? products.slice(0, limit) : products;

  // Grid class depending on columns prop
  const getGridColsClass = () => {
    switch (columns) {
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      case 3:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      case 4:
      default:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }
  };

  return (
    <div className={`grid ${getGridColsClass()} gap-6 w-full py-4`}>
      {displayedProducts.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          title={product.title}
          price={product.price}
          image={product.image}
          hoverImage={product.hoverImage}
          href={product.href}
          rating={product.rating}
          inStock={product.inStock}
        />
      ))}
    </div>
  );
}
