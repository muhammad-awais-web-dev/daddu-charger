import React, { Suspense } from "react";
import type { Metadata } from "next";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Search Results - Daddu Charger Store",
  description: "Search for custom gaming PC builds, GPUs, racing wheels, and premium gaming accessories at Daddu Charger. Find the best hardware for your gaming setup.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#070709] text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-400">Loading search...</p>
        </div>
      </div>
    }>
      <SearchClient />
    </Suspense>
  );
}
