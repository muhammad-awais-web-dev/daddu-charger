"use client";

import { useState, useEffect } from "react";
import { useTransition } from "@/components/TransitionContext";
import { TransitionLink } from "@/components/TransitionLink";

export default function DeveloperPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "collections" | "search" | "inspector">("dashboard");
  const [storeUrl, setStoreUrl] = useState<string>("https://www.dadducharger.com");
  
  // Products tab states
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Collections tab states
  const [collections, setCollections] = useState<any[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<any | null>(null);
  const [collectionProducts, setCollectionProducts] = useState<any[]>([]);
  const [loadingCollProducts, setLoadingCollProducts] = useState(false);

  // Search tab states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchMeta, setSearchMeta] = useState<{ isFallback?: boolean; count?: number } | null>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [quickSearchResults, setQuickSearchResults] = useState<any[]>([]);
  const [loadingQuickSearch, setLoadingQuickSearch] = useState(false);
  const [showQuickDropdown, setShowQuickDropdown] = useState(false);

  // Inspector states
  const [inspectorRoute, setInspectorRoute] = useState("/api/shopify/products");
  const [inspectorData, setInspectorData] = useState<any>(null);
  const [inspectorLoading, setInspectorLoading] = useState(false);
  const [inspectorStatus, setInspectorStatus] = useState<number | null>(null);
  const { finishTransition } = useTransition();

  // Load initial environment config & dashboard checks
  useEffect(() => {
    finishTransition(); // Clean transition curtain on home page mount

    // Determine the environment store url if set
    const envUrl = process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL;
    if (envUrl) {
      setStoreUrl(envUrl);
    }
    
    // Pre-fetch some data
    fetchProducts();
    fetchCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced Quick Search Effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setQuickSearchResults([]);
      setShowQuickDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoadingQuickSearch(true);
      try {
        const res = await fetch(`/api/shopify/quick-search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setQuickSearchResults(data.results || []);
          setShowQuickDropdown(true);
        }
      } catch (err) {
        console.error("Quick search fetch error:", err);
      } finally {
        setLoadingQuickSearch(false);
      }
    }, 350);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch("/api/shopify/products?limit=12");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchCollections = async () => {
    setLoadingCollections(true);
    try {
      const res = await fetch("/api/shopify/collections");
      if (res.ok) {
        const data = await res.json();
        setCollections(data.collections || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCollections(false);
    }
  };

  const loadCollectionProducts = async (handle: string) => {
    setLoadingCollProducts(true);
    try {
      const res = await fetch(`/api/shopify/collections/${handle}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedCollection(data.collection);
        setCollectionProducts(data.collection?.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCollProducts(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent, page: number = 1) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoadingSearch(true);
    setSearchPage(page);
    setShowQuickDropdown(false); // Close suggestions on full search execution
    try {
      const res = await fetch(`/api/shopify/search?q=${encodeURIComponent(searchQuery)}&page=${page}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.results || []);
        setSearchMeta({
          isFallback: data.isFallback,
          count: data.totalCount !== undefined ? data.totalCount : (data.results?.length || 0)
        });
      } else {
        setSearchResults([]);
        setSearchMeta({ count: 0 });
      }
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const runInspectorRequest = async (route: string) => {
    setInspectorLoading(true);
    setInspectorStatus(null);
    setInspectorData(null);
    try {
      const res = await fetch(route);
      setInspectorStatus(res.status);
      const data = await res.json();
      setInspectorData(data);
    } catch (err: any) {
      setInspectorStatus(500);
      setInspectorData({ error: err.message || "Failed to parse JSON" });
    } finally {
      setInspectorLoading(false);
    }
  };

  const triggerInspectorPreset = (route: string) => {
    setInspectorRoute(route);
    setActiveTab("inspector");
    runInspectorRequest(route);
  };

  // Helper to format currency
  const formatPrice = (price: string | number) => {
    const val = typeof price === "string" ? parseFloat(price) : price;
    return isNaN(val) ? "Rs. 0.00" : `Rs. ${val.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-[#070709] text-gray-100 flex flex-col selection:bg-amber-500 selection:text-black">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />


      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 relative z-10">
        
        {/* Navigation Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 sticky top-24 space-y-1">
            <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">Endpoints Explorer</p>
            
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === "dashboard"
                  ? "bg-amber-500/10 text-amber-400 border-l-2 border-amber-500"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              Overview Dashboard
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === "products"
                  ? "bg-amber-500/10 text-amber-400 border-l-2 border-amber-500"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Products Explorer
            </button>

            <button
              onClick={() => setActiveTab("collections")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === "collections"
                  ? "bg-amber-500/10 text-amber-400 border-l-2 border-amber-500"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Collections Explorer
            </button>

            <button
              onClick={() => setActiveTab("search")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === "search"
                  ? "bg-amber-500/10 text-amber-400 border-l-2 border-amber-500"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Playground
            </button>

            <button
              onClick={() => setActiveTab("inspector")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === "inspector"
                  ? "bg-amber-500/10 text-amber-400 border-l-2 border-amber-500"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Raw API Inspector
            </button>
          </div>
        </aside>

        {/* Tab Content Areas */}
        <section className="flex-1 min-w-0 space-y-6">
          
          {/* Dashboard Info Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.01] border border-white/5 rounded-2xl p-4">
            <div>
              <h1 className="text-lg font-bold text-white">Daddu Charger Explorer</h1>
              <p className="text-xs text-gray-400 font-mono">Shopify JSON API Client Layer</p>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <TransitionLink
                href="/page-one"
                loaderText="Loading Page One..."
                className="text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
              >
                Page One
              </TransitionLink>
              <TransitionLink
                href="/page-two"
                loaderText="Initializing Deferred Route..."
                className="text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
              >
                Page Two
              </TransitionLink>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <a 
                  href={storeUrl}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs font-semibold text-amber-400 hover:underline hover:text-amber-300 transition-colors whitespace-nowrap"
                >
                  {storeUrl.replace("https://", "")}
                </a>
              </div>
            </div>
          </div>
          
          {/* TAB: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Banner Card */}
              <div className="bg-gradient-to-r from-amber-500/10 via-orange-600/5 to-transparent border border-amber-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <h2 className="text-2xl font-bold text-white">Public Shopify JSON API Wrapper</h2>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Access products, collections, search results, and metadata from Shopify stores directly using public <code>.json</code> routes without API credentials. Fully wrapped in server-side Next.js route handlers.
                  </p>
                </div>
                <button
                  onClick={() => triggerInspectorPreset("/api/shopify/products")}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-5 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-amber-500/20 flex items-center gap-2 flex-shrink-0"
                >
                  Quick Test Endpoint
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>

              {/* Specific User Request Examples */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-amber-500/20 rounded-md text-amber-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  </span>
                  <h3 className="text-md font-semibold text-white">Your Requested Example Endpoints</h3>
                </div>
                <p className="text-xs text-gray-400">
                  Click any button to execute the wrapper endpoint and inspect the live data coming from the store:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Collection Example */}
                  <div className="bg-black/40 border border-white/5 hover:border-amber-500/30 rounded-xl p-4 flex flex-col justify-between gap-3 transition-colors group">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full">Collection API Endpoint</span>
                      <h4 className="text-sm font-semibold text-gray-200 mt-1">12-12 Mega Sale Collection</h4>
                      <p className="text-xs text-gray-500 font-mono overflow-hidden text-ellipsis break-all mt-1">
                        /api/shopify/collections/12-12-mega-sale-upto-40-off
                      </p>
                    </div>
                    <button
                      onClick={() => triggerInspectorPreset("/api/shopify/collections/12-12-mega-sale-upto-40-off")}
                      className="bg-white/5 hover:bg-amber-500 hover:text-black text-gray-300 font-semibold py-1.5 rounded-lg text-xs transition-all duration-200 text-center flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      Inspect Live Collection JSON
                    </button>
                  </div>

                  {/* Product Example */}
                  <div className="bg-black/40 border border-white/5 hover:border-amber-500/30 rounded-xl p-4 flex flex-col justify-between gap-3 transition-colors group">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full">Product API Endpoint</span>
                      <h4 className="text-sm font-semibold text-gray-200 mt-1">12-12 Sale Ryzen 1500X Gaming PC</h4>
                      <p className="text-xs text-gray-500 font-mono overflow-hidden text-ellipsis break-all mt-1">
                        /api/shopify/products/12-12-sale-ryzen-1500x-budget-gaming-pc-build-with-hd-7800-gpu-special-offer-price
                      </p>
                    </div>
                    <button
                      onClick={() => triggerInspectorPreset("/api/shopify/products/12-12-sale-ryzen-1500x-budget-gaming-pc-build-with-hd-7800-gpu-special-offer-price")}
                      className="bg-white/5 hover:bg-amber-500 hover:text-black text-gray-300 font-semibold py-1.5 rounded-lg text-xs transition-all duration-200 text-center flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      Inspect Live Product JSON
                    </button>
                  </div>
                </div>
              </div>

              {/* Endpoint Specifications Grid */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Supported Base Endpoints</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Endpoint 1 */}
                  <div className="bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] rounded-xl p-5 space-y-2 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">GET</span>
                      <span className="text-xs text-gray-500 font-mono">Dynamic</span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-200">List Products</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Fetches available products from shopify. Supports query parameters <code>limit</code> and <code>page</code>.
                    </p>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                      <span className="text-xs text-gray-500 font-mono">Route:</span>
                      <button onClick={() => triggerInspectorPreset("/api/shopify/products")} className="text-xs font-mono text-amber-400 hover:underline">/api/shopify/products</button>
                    </div>
                  </div>

                  {/* Endpoint 2 */}
                  <div className="bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] rounded-xl p-5 space-y-2 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">GET</span>
                      <span className="text-xs text-gray-500 font-mono">Dynamic</span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-200">Fetch Product by Handle</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Queries single product metadata, images, and variants detail by passing the product slug handle.
                    </p>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                      <span className="text-xs text-gray-500 font-mono">Route:</span>
                      <button onClick={() => triggerInspectorPreset("/api/shopify/products/12-12-sale-ryzen-1500x-budget-gaming-pc-build-with-hd-7800-gpu-special-offer-price")} className="text-xs font-mono text-amber-400 hover:underline">/api/shopify/products/[handle]</button>
                    </div>
                  </div>

                  {/* Endpoint 3 */}
                  <div className="bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] rounded-xl p-5 space-y-2 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">GET</span>
                      <span className="text-xs text-gray-500 font-mono">Dynamic</span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-200">List Collections</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Lists all product collections setup on the shopify backend, returns handles, tags and cover images.
                    </p>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                      <span className="text-xs text-gray-500 font-mono">Route:</span>
                      <button onClick={() => triggerInspectorPreset("/api/shopify/collections")} className="text-xs font-mono text-amber-400 hover:underline">/api/shopify/collections</button>
                    </div>
                  </div>

                  {/* Endpoint 4 */}
                  <div className="bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] rounded-xl p-5 space-y-2 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">GET</span>
                      <span className="text-xs text-gray-500 font-mono">Dynamic</span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-200">Fetch Collection by Handle</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Fetches metadata for a single collection along with a list of products inside this collection.
                    </p>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                      <span className="text-xs text-gray-500 font-mono">Route:</span>
                      <button onClick={() => triggerInspectorPreset("/api/shopify/collections/12-12-mega-sale-upto-40-off")} className="text-xs font-mono text-amber-400 hover:underline">/api/shopify/collections/[handle]</button>
                    </div>
                  </div>

                  {/* Endpoint 5 */}
                  <div className="bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] rounded-xl p-5 space-y-2 transition-all md:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">GET</span>
                      <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">Automatic Fallback Layer</span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-200">Search Products</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Searches products using standard <code>/search.json?q=query</code>. If the template returns HTML (disabled on some stores), the wrapper automatically calls Shopify's internal Predictive Search API <code>/search/suggest.json?q=query&resources[type]=product</code> to return a structured JSON response.
                    </p>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                      <span className="text-xs text-gray-500 font-mono">Route:</span>
                      <button onClick={() => triggerInspectorPreset("/api/shopify/search?q=gaming")} className="text-xs font-mono text-amber-400 hover:underline">/api/shopify/search?q=query</button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB: PRODUCTS EXPLORER */}
          {activeTab === "products" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Products Explorer</h2>
                  <p className="text-xs text-gray-400 mt-1">Fetched from <code>/api/shopify/products</code></p>
                </div>
                <button
                  onClick={fetchProducts}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 transition-all flex items-center gap-2"
                >
                  <svg className={`w-3.5 h-3.5 ${loadingProducts ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18" />
                  </svg>
                  Refresh
                </button>
              </div>

              {loadingProducts ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 h-80 animate-pulse space-y-4">
                      <div className="bg-white/5 rounded-xl h-48 w-full" />
                      <div className="h-4 bg-white/5 rounded w-2/3" />
                      <div className="h-4 bg-white/5 rounded w-1/3" />
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-2xl space-y-3">
                  <p className="text-gray-400">No products found in the catalog.</p>
                  <button onClick={fetchProducts} className="bg-amber-500 text-black px-4 py-2 rounded-lg text-xs font-semibold hover:bg-amber-400">Try Loading Again</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {products.map((product) => {
                    const price = product.variants?.[0]?.price || "0.00";
                    const imageSrc = product.images?.[0]?.src || product.image?.src || "";
                    
                    return (
                      <div
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className="bg-white/[0.01] border border-white/5 hover:border-amber-500/40 rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5 group"
                      >
                        <div className="space-y-3">
                          {/* Image Container */}
                          <div className="relative aspect-video rounded-xl bg-neutral-900 border border-white/5 overflow-hidden flex items-center justify-center">
                            {imageSrc ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={imageSrc}
                                alt={product.title}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                              />
                            ) : (
                              <svg className="w-10 h-10 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{product.vendor || "Store Vendor"}</span>
                            <h3 className="font-semibold text-gray-100 text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">{product.title}</h3>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                          <span className="text-amber-400 font-bold text-sm">{formatPrice(price)}</span>
                          <span className="text-[10px] text-gray-500 font-mono">View Details →</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Product Details Modal Overlay */}
              {selectedProduct && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                  <div className="bg-[#0e0e12] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl relative">
                    
                    {/* Close Button */}
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors z-10"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
                      {/* Left: Product Images & Info */}
                      <div className="space-y-6">
                        <div className="aspect-square bg-neutral-950 rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
                          {selectedProduct.images?.[0]?.src || selectedProduct.image?.src ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={selectedProduct.images?.[0]?.src || selectedProduct.image?.src}
                              alt={selectedProduct.title}
                              className="object-contain w-full h-full max-h-[400px]"
                            />
                          ) : (
                            <span className="text-gray-600">No Image Available</span>
                          )}
                        </div>

                        {/* Images Thumbnails Row */}
                        {selectedProduct.images && selectedProduct.images.length > 1 && (
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {selectedProduct.images.map((img: any) => (
                              <div key={img.id} className="w-16 h-16 rounded-lg bg-neutral-900 border border-white/5 overflow-hidden flex-shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={img.src} alt="thumbnail" className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="space-y-1">
                          <h2 className="text-xl font-bold text-white">{selectedProduct.title}</h2>
                          <div className="flex gap-2 flex-wrap items-center">
                            <span className="text-xs text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                              {formatPrice(selectedProduct.variants?.[0]?.price)}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">
                              Vendor: {selectedProduct.vendor}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">
                              Type: {selectedProduct.product_type || "None"}
                            </span>
                          </div>
                        </div>

                        {/* Description HTML parsing fallback */}
                        <div className="border-t border-white/5 pt-4">
                          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 font-mono">Description</h4>
                          <div 
                            className="text-sm text-gray-300 leading-relaxed max-h-40 overflow-y-auto space-y-2 pr-2"
                            dangerouslySetInnerHTML={{ __html: selectedProduct.body_html || "<p>No description provided.</p>" }}
                          />
                        </div>
                      </div>

                      {/* Right: Technical Inspector & Payload */}
                      <div className="space-y-6 flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-white font-mono">Live API Payload</h3>
                            <button
                              onClick={() => triggerInspectorPreset(`/api/shopify/products/${selectedProduct.handle}`)}
                              className="text-xs text-amber-400 hover:text-amber-300 font-mono font-semibold flex items-center gap-1.5"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                              Open in JSON Inspector
                            </button>
                          </div>

                          {/* Variants list info */}
                          {selectedProduct.variants && (
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-2.5">
                              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">Variants ({selectedProduct.variants.length})</h4>
                              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-2">
                                {selectedProduct.variants.map((v: any) => (
                                  <div key={v.id} className="flex items-center justify-between text-xs py-1 border-b border-white/[0.02] last:border-b-0">
                                    <span className="text-gray-300 font-medium">{v.title}</span>
                                    <div className="flex gap-2 items-center">
                                      <span className="text-gray-500 font-mono">{v.sku || "No SKU"}</span>
                                      <span className="text-amber-400 font-semibold">{formatPrice(v.price)}</span>
                                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${v.available ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                                        {v.available ? "In Stock" : "Out of Stock"}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Options specifications */}
                          {selectedProduct.options && (
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-2">
                              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">Product Options Structure</h4>
                              <div className="flex gap-3 flex-wrap">
                                {selectedProduct.options.map((opt: any, idx: number) => (
                                  <div key={idx} className="bg-black/60 border border-white/5 rounded-lg p-2 flex flex-col gap-1">
                                    <span className="text-[10px] font-mono text-gray-500 uppercase">{opt.name}</span>
                                    <span className="text-xs text-gray-300 font-semibold">{opt.values?.join(", ") || "None"}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="pt-6 border-t border-white/5 flex justify-end gap-3">
                          <button
                            onClick={() => setSelectedProduct(null)}
                            className="bg-white/5 hover:bg-white/10 text-gray-300 font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: COLLECTIONS EXPLORER */}
          {activeTab === "collections" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Collections Explorer</h2>
                  <p className="text-xs text-gray-400 mt-1">Fetched from <code>/api/shopify/collections</code></p>
                </div>
                <button
                  onClick={fetchCollections}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 transition-all flex items-center gap-2"
                >
                  <svg className={`w-3.5 h-3.5 ${loadingCollections ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18" />
                  </svg>
                  Refresh
                </button>
              </div>

              {/* Collection details sub-state */}
              {selectedCollection ? (
                <div className="space-y-6">
                  {/* Collection Header Panel */}
                  <div className="bg-gradient-to-r from-amber-500/10 via-transparent to-transparent border border-amber-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setSelectedCollection(null)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                      </button>
                      <div>
                        <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full">Viewing Collection</span>
                        <h3 className="text-xl font-bold text-white mt-1">{selectedCollection.title}</h3>
                        <p className="text-xs text-gray-400 mt-1 font-mono">Slug: {selectedCollection.handle}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => triggerInspectorPreset(`/api/shopify/collections/${selectedCollection.handle}`)}
                        className="bg-white/5 hover:bg-white/10 text-gray-300 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                        Raw Collection JSON
                      </button>
                      <button
                        onClick={() => setSelectedCollection(null)}
                        className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors"
                      >
                        Show All Collections
                      </button>
                    </div>
                  </div>

                  {/* List collection's products */}
                  <h4 className="text-sm font-semibold text-gray-300 font-mono">Products in this Collection:</h4>
                  {loadingCollProducts ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 h-80 animate-pulse space-y-4">
                          <div className="bg-white/5 rounded-xl h-48 w-full" />
                          <div className="h-4 bg-white/5 rounded w-2/3" />
                        </div>
                      ))}
                    </div>
                  ) : collectionProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-2xl">
                      <p className="text-gray-400 text-sm">No products found inside this collection. It might be empty or uses custom filtering tags.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {collectionProducts.map((product) => {
                        const price = product.variants?.[0]?.price || "0.00";
                        const imageSrc = product.images?.[0]?.src || product.image?.src || "";
                        
                        return (
                          <div
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            className="bg-white/[0.01] border border-white/5 hover:border-amber-500/40 rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5 group"
                          >
                            <div className="space-y-3">
                              <div className="relative aspect-video rounded-xl bg-neutral-900 border border-white/5 overflow-hidden flex items-center justify-center">
                                {imageSrc ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={imageSrc}
                                    alt={product.title}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                  />
                                ) : (
                                  <svg className="w-10 h-10 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                )}
                              </div>
                              <h3 className="font-semibold text-gray-100 text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">{product.title}</h3>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                              <span className="text-amber-400 font-bold text-sm">{formatPrice(price)}</span>
                              <span className="text-[10px] text-gray-500 font-mono">View Details →</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* Grid list of Collections */
                loadingCollections ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 h-48 animate-pulse space-y-4">
                        <div className="h-6 bg-white/5 rounded w-1/3" />
                        <div className="h-4 bg-white/5 rounded w-2/3" />
                      </div>
                    ))}
                  </div>
                ) : collections.length === 0 ? (
                  <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-2xl space-y-3">
                    <p className="text-gray-400">No collections found.</p>
                    <button onClick={fetchCollections} className="bg-amber-500 text-black px-4 py-2 rounded-lg text-xs font-semibold hover:bg-amber-400">Try Loading Again</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {collections.map((coll) => {
                      const imageSrc = coll.image?.src || "";
                      return (
                        <div
                          key={coll.id}
                          onClick={() => loadCollectionProducts(coll.handle)}
                          className="bg-white/[0.01] border border-white/5 hover:border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5 group"
                        >
                          <div className="space-y-4">
                            {/* Collection Image */}
                            <div className="aspect-video rounded-xl bg-neutral-900 border border-white/5 overflow-hidden flex items-center justify-center">
                              {imageSrc ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={imageSrc}
                                  alt={coll.title}
                                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <svg className="w-10 h-10 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                              )}
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-semibold text-gray-100 group-hover:text-amber-400 transition-colors text-sm">{coll.title}</h3>
                              <p className="text-xs text-gray-500 font-mono overflow-hidden text-ellipsis line-clamp-1">{coll.handle}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-6 pt-3 border-t border-white/5">
                            <span className="text-xs text-gray-400">Products List</span>
                            <span className="text-xs text-amber-500 font-semibold group-hover:translate-x-1 transition-transform">Explore →</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              )}
            </div>
          )}

          {/* TAB: SEARCH PLAYGROUND */}
          {activeTab === "search" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-white">Search Playground</h2>
                <p className="text-xs text-gray-400 mt-1">Queries the endpoint <code>/api/shopify/search?q=query</code> with automatic theme fallback detection.</p>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter keywords e.g. gaming, ryzen, charger..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 transition-colors pr-10 font-sans"
                    onFocus={() => {
                      if (quickSearchResults.length > 0) setShowQuickDropdown(true);
                    }}
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  {/* Quick Search Dropdown Preview */}
                  {showQuickDropdown && (quickSearchResults.length > 0 || loadingQuickSearch) && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-[#0e0e12]/95 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl z-40 max-h-[380px] overflow-y-auto">
                      {loadingQuickSearch ? (
                        <div className="px-4 py-3 text-xs text-gray-500 flex items-center gap-2">
                          <svg className="animate-spin h-3.5 w-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Searching suggestions...
                        </div>
                      ) : (
                        <div className="divide-y divide-white/5">
                          <div className="px-3 py-1.5 bg-white/[0.02] text-[10px] font-mono text-amber-400 font-semibold flex justify-between items-center">
                            <span>Quick Suggestions (10 items max)</span>
                            <button 
                              type="button" 
                              onClick={() => setShowQuickDropdown(false)}
                              className="text-gray-500 hover:text-white transition-colors"
                            >
                              Close
                            </button>
                          </div>
                          {quickSearchResults.map((prod) => (
                            <div
                              key={prod.id || prod.handle}
                              onClick={() => {
                                setShowQuickDropdown(false);
                                // Fetch full product details using helper endpoint and show modal
                                fetch(`/api/shopify/products/${prod.handle}`)
                                  .then((res) => res.json())
                                  .then((data) => {
                                    if (data.product) {
                                      setSelectedProduct(data.product);
                                    }
                                  })
                                  .catch((err) => console.error(err));
                              }}
                              className="px-4 py-2.5 hover:bg-amber-500/10 cursor-pointer transition-colors flex items-center gap-3 group text-left"
                            >
                              <div className="w-10 h-10 bg-neutral-950 rounded overflow-hidden flex-shrink-0 flex items-center justify-center border border-white/5">
                                {prod.image ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={prod.image} alt={prod.title} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-[10px] text-gray-700">No Img</span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-200 line-clamp-1 group-hover:text-amber-400 transition-colors">{prod.title}</p>
                                <p className="text-[10px] text-gray-500 font-mono mt-0.5">{prod.vendor || "Store Vendor"}</p>
                              </div>
                              <span className="text-xs font-semibold text-amber-400 font-mono flex-shrink-0">{formatPrice(prod.price)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loadingSearch}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-6 py-3 rounded-xl text-sm transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loadingSearch ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Searching...
                    </>
                  ) : (
                    "Search Store"
                  )}
                </button>
              </form>

              {/* Search Meta Status */}
              {searchMeta && (
                <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-xl p-3.5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">Search Mode:</span>
                    {searchMeta.isFallback ? (
                      <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        Fallback (Predictive Search suggest.json)
                      </span>
                    ) : (
                      <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        Standard search.json
                      </span>
                    )}
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                  <div>
                    <span className="text-gray-400">Results: </span>
                    <span className="font-bold text-gray-200">{searchMeta.count} items found</span>
                  </div>
                </div>
              )}

              {/* Search Results Grid */}
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {searchResults.map((product) => {
                    return (
                      <div
                        key={product.id || product.handle}
                        onClick={() => {
                          // Try loading full details from route helper if we click details
                          triggerInspectorPreset(`/api/shopify/products/${product.handle}`);
                        }}
                        className="bg-white/[0.01] border border-white/5 hover:border-amber-500/40 rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5 group"
                      >
                        <div className="space-y-3">
                          {/* Image */}
                          <div className="relative aspect-video rounded-xl bg-neutral-900 border border-white/5 overflow-hidden flex items-center justify-center">
                            {product.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={product.image}
                                alt={product.title}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <svg className="w-10 h-10 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                          <div className="space-y-1">
                            {product.vendor && <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{product.vendor}</span>}
                            <h3 className="font-semibold text-gray-100 text-sm line-clamp-2 group-hover:text-amber-400 transition-colors">{product.title}</h3>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                          <span className="text-amber-400 font-bold text-sm">
                            {product.price ? formatPrice(product.price) : "View Price"}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">Inspect JSON →</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : searchQuery && !loadingSearch ? (
                <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-2xl">
                  <p className="text-gray-400 text-sm">No products found matching your search query.</p>
                </div>
              ) : (
                <div className="text-center py-20 bg-white/[0.01] border border-white/5 border-dashed rounded-2xl">
                  <p className="text-gray-500 text-sm">Enter search terms above to query the Shopify store.</p>
                </div>
              )}

              {/* Search Pagination Controller */}
              {searchResults.length > 0 && (
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => handleSearch(undefined, searchPage - 1)}
                    disabled={searchPage === 1 || loadingSearch}
                    className="bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-xl text-xs disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Previous Page
                  </button>
                  <span className="text-xs text-gray-400 font-mono">Page {searchPage}</span>
                  <button
                    type="button"
                    onClick={() => handleSearch(undefined, searchPage + 1)}
                    disabled={searchResults.length < 12 || loadingSearch || searchMeta?.isFallback}
                    className="bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-xl text-xs disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Next Page →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB: RAW API INSPECTOR */}
          {activeTab === "inspector" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-white">Raw API Endpoint Inspector</h2>
                <p className="text-xs text-gray-400 mt-1">Test raw API routes and examine full Shopify response JSON outputs.</p>
              </div>

              {/* Preset Selector & Custom Input */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Preset selector */}
                  <div className="md:w-1/3 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-400 font-mono uppercase">API Route Preset</label>
                    <select
                      onChange={(e) => setInspectorRoute(e.target.value)}
                      value={inspectorRoute}
                      className="bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-gray-300 focus:outline-none focus:border-amber-500/80 transition-colors"
                    >
                      <option value="/api/shopify/products">List Products (/api/shopify/products)</option>
                      <option value="/api/shopify/collections">List Collections (/api/shopify/collections)</option>
                      <option value="/api/shopify/collections/12-12-mega-sale-upto-40-off">Requested Collection Preset</option>
                      <option value="/api/shopify/products/12-12-sale-ryzen-1500x-budget-gaming-pc-build-with-hd-7800-gpu-special-offer-price">Requested Product Preset</option>
                      <option value="/api/shopify/search?q=gaming">Search Endpoint (/api/shopify/search?q=gaming)</option>
                    </select>
                  </div>

                  {/* Custom endpoint input */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-400 font-mono uppercase">Custom Endpoint Path</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inspectorRoute}
                        onChange={(e) => setInspectorRoute(e.target.value)}
                        className="flex-1 bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-amber-500/80 font-mono transition-colors"
                      />
                      <button
                        onClick={() => runInspectorRequest(inspectorRoute)}
                        disabled={inspectorLoading}
                        className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 rounded-lg text-xs transition-colors flex items-center gap-1.5 flex-shrink-0 disabled:opacity-50"
                      >
                        {inspectorLoading ? "Loading..." : "Send GET"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Header */}
              {inspectorStatus !== null && (
                <div className="flex items-center gap-3 bg-white/[0.01] border border-white/5 rounded-xl p-3 text-xs font-mono">
                  <span className="text-gray-400">HTTP Status:</span>
                  <span className={`font-bold px-2 py-0.5 rounded ${inspectorStatus >= 200 && inspectorStatus < 300 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                    {inspectorStatus} {inspectorStatus === 200 ? "OK" : inspectorStatus === 500 ? "Server Error" : "Unknown"}
                  </span>
                </div>
              )}

              {/* Inspector Output Panel */}
              <div className="bg-black/60 border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[500px]">
                {/* Panel Header */}
                <div className="bg-neutral-900 px-4 py-2 flex items-center justify-between border-b border-white/5 flex-shrink-0">
                  <span className="text-xs font-bold text-gray-400 font-mono">response_payload.json</span>
                  <button 
                    onClick={() => {
                      if (inspectorData) navigator.clipboard.writeText(JSON.stringify(inspectorData, null, 2));
                    }}
                    className="text-[10px] text-gray-500 hover:text-gray-300 font-mono transition-colors flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                    Copy JSON
                  </button>
                </div>

                {/* Response Code Area */}
                <div className="flex-1 overflow-auto p-4 font-mono text-xs text-gray-300 leading-relaxed scrollbar-thin">
                  {inspectorLoading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-500">
                      <svg className="animate-spin h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending request to API route...
                    </div>
                  ) : inspectorData ? (
                    <pre className="whitespace-pre-wrap">{JSON.stringify(inspectorData, null, 2)}</pre>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-600 italic">
                      No response loaded. Click &quot;Send GET&quot; to request data.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 bg-black/20 mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 Shopify API Wrapper Explorer. Built with Next.js 16 and Tailwind v4.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono">Status: Production Ready</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
        </div>
      </footer>
    </div>
  );
}
