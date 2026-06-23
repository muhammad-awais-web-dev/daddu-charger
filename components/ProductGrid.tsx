"use client";

import React, { useState } from "react";
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
  enablePagination?: boolean;
}

export function ProductGrid({ products, limit, columns = 4, enablePagination = false }: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        No products found.
      </div>
    );
  }

  // Calculate items per page based on limit, defaulting to 12 if pagination is enabled but limit isn't set
  const itemsPerPage = limit || 12;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Slice array according to pagination or limit
  let displayedProducts = products;
  if (enablePagination) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    displayedProducts = products.slice(startIndex, endIndex);
  } else if (limit) {
    displayedProducts = products.slice(0, limit);
  }

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
    <div className="flex flex-col gap-8 w-full">
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
      
      {enablePagination && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-4">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-6 py-2.5 border border-neutral-700 rounded-xl bg-neutral-900 text-white font-bold text-sm tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors"
          >
            Previous
          </button>
          <span className="text-neutral-400 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-6 py-2.5 border border-neutral-700 rounded-xl bg-neutral-900 text-white font-bold text-sm tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
