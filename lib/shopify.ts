export interface ShopifyImage {
  id: number;
  product_id?: number;
  position: number;
  created_at: string;
  updated_at: string;
  alt: string | null;
  width: number;
  height: number;
  src: string;
  variant_ids: number[];
}

export interface ShopifyVariant {
  id: number;
  title: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  sku: string | null;
  requires_shipping: boolean;
  taxable: boolean;
  featured_image: ShopifyImage | null;
  available: boolean;
  price: string;
  compare_at_price: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface ShopifyOption {
  name: string;
  position: number;
  values: string[];
}

export interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  vendor: string;
  product_type: string;
  tags: string[];
  variants: ShopifyVariant[];
  images: ShopifyImage[];
  options: ShopifyOption[];
  image?: { src: string }; // Fallback image representation in some contexts
}

export interface ShopifyCollection {
  id: number;
  title: string;
  handle: string;
  description: string;
  published_at: string;
  updated_at: string;
  image: {
    src: string;
    alt?: string | null;
  } | null;
  products?: ShopifyProduct[]; // Some endpoints embed products
}

// Predictive search results format
export interface ShopifyPredictiveProduct {
  id: number;
  title: string;
  handle: string;
  url: string;
  image: string;
  price: string;
  compare_at_price?: string;
  available: boolean;
  vendor: string;
  type: string;
}

export interface ShopifyPredictiveSearchResults {
  products?: ShopifyPredictiveProduct[];
  collections?: any[];
  queries?: any[];
  pages?: any[];
}

export interface ShopifySearchResponse {
  results: ShopifyPredictiveProduct[];
  isFallback: boolean;
  totalCount?: number;
}

// Helper to get store URL
export function getStoreUrl(): string {
  let url = process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL || 'https://www.dadducharger.com';
  // Strip trailing slash if present
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  return url;
}

/**
 * Fetch helper with standard timeout and headers
 */
async function shopifyFetch<T>(path: string): Promise<T> {
  const storeUrl = getStoreUrl();
  const targetUrl = `${storeUrl}${path}`;
  
  const response = await fetch(targetUrl, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'NextJS-Shopify-Client/1.0',
    },
    next: { revalidate: 60 } // Next.js ISR cache behavior (revalidate every 60s)
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch from Shopify: ${response.status} ${response.statusText} at ${targetUrl}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`Expected JSON response from ${targetUrl} but received Content-Type: ${contentType}`);
  }

  return response.json() as Promise<T>;
}

/**
 * List products
 */
export async function getShopifyProducts(options?: { limit?: number; page?: number }): Promise<{ products: ShopifyProduct[] }> {
  const limit = options?.limit || 50;
  const page = options?.page || 1;
  return shopifyFetch<{ products: ShopifyProduct[] }>(`/products.json?limit=${limit}&page=${page}`);
}

/**
 * Fetch a single product detail
 */
export async function getShopifyProduct(handle: string): Promise<{ product: ShopifyProduct }> {
  return shopifyFetch<{ product: ShopifyProduct }>(`/products/${handle}.json`);
}

/**
 * List collections
 */
export async function getShopifyCollections(options?: { limit?: number; page?: number }): Promise<{ collections: ShopifyCollection[] }> {
  const limit = options?.limit || 50;
  const page = options?.page || 1;
  return shopifyFetch<{ collections: ShopifyCollection[] }>(`/collections.json?limit=${limit}&page=${page}`);
}

/**
 * Fetch a single collection details
 */
export async function getShopifyCollection(handle: string): Promise<{ collection: ShopifyCollection }> {
  return shopifyFetch<{ collection: ShopifyCollection }>(`/collections/${handle}.json`);
}

/**
 * Fetch products within a specific collection
 */
export async function getShopifyCollectionProducts(handle: string, options?: { limit?: number; page?: number }): Promise<{ products: ShopifyProduct[] }> {
  const limit = options?.limit || 50;
  const page = options?.page || 1;
  return shopifyFetch<{ products: ShopifyProduct[] }>(`/collections/${handle}/products.json?limit=${limit}&page=${page}`);
}

/**
 * Search products with dual search fallback.
 * First tries to scrape/parse the Shopify Search page HTML for var meta = ... (supporting pagination!).
 * If that fails or isn't present, falls back to the Predictive Search API (suggest.json).
 */
export async function searchShopify(query: string, page: number = 1): Promise<ShopifySearchResponse> {
  const storeUrl = getStoreUrl();
  const searchHtmlUrl = `${storeUrl}/search?q=${encodeURIComponent(query)}&page=${page}`;
  
  try {
    const response = await fetch(searchHtmlUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) NextJS-Shopify-Client/1.0',
      },
      next: { revalidate: 60 }
    });

    if (response.ok) {
      const html = await response.text();
      
      // Look for "var meta = " embedded JSON block in the HTML page
      const metaStartStr = 'var meta = ';
      const startIndex = html.indexOf(metaStartStr);
      if (startIndex !== -1) {
        const jsonStart = startIndex + metaStartStr.length;
        let endOfLine = html.indexOf(';\n', jsonStart);
        if (endOfLine === -1) {
          endOfLine = html.indexOf(';', jsonStart);
        }
        
        const jsonText = html.substring(jsonStart, endOfLine).trim();
        const parsedMeta = JSON.parse(jsonText);
        const products = parsedMeta.products || [];
        
        if (products.length > 0) {
          // Parse the absolute total count of search results
          const countMatch = html.match(/Found (\d+) results/i) || html.match(/Search: (\d+) results found/i);
          const totalCount = countMatch ? parseInt(countMatch[1], 10) : products.length;

          const results = products.map((prod: any) => {
            const handle = prod.handle;
            const handleIndex = html.indexOf(`/products/${handle}`);
            
            let imageUrl = '';
            if (handleIndex !== -1) {
              // Extract the next image element within a small window to get the product thumbnail
              const searchScope = html.substring(handleIndex, handleIndex + 1500);
              const imgMatches = searchScope.match(/<img[^>]+src="([^"]+)"/);
              if (imgMatches && imgMatches[1]) {
                imageUrl = imgMatches[1].replace(/&amp;/g, '&');
                if (imageUrl.startsWith('//')) {
                  imageUrl = 'https:' + imageUrl;
                }
              }
            }

            // Normalise pricing: Shopify stores raw values multiplied by 100 (e.g. 3150000 -> 31500.00)
            const rawPrice = prod.variants?.[0]?.price;
            const priceVal = rawPrice !== undefined ? (rawPrice / 100).toFixed(2) : '0.00';

            return {
              id: prod.id,
              title: prod.variants?.[0]?.name || prod.title || prod.handle,
              handle: prod.handle,
              url: `/products/${prod.handle}`,
              image: imageUrl,
              price: priceVal,
              available: prod.variants?.[0]?.available !== undefined ? prod.variants[0].available : true,
              vendor: prod.vendor || '',
              type: prod.type || ''
            };
          });

          return {
            results,
            isFallback: false,
            totalCount
          };
        }
      }
    }
  } catch (err) {
    console.warn(`Scraping Shopify search page HTML failed, falling back to suggest.json. Error:`, err);
  }

  // Fallback: Use Shopify Predictive Search API (suggest.json - limits to 10 results)
  const suggestUrl = `/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product`;
  const data = await shopifyFetch<{ resources: { results: { products: ShopifyPredictiveProduct[] } } }>(suggestUrl);
  
  const products = data?.resources?.results?.products || [];
  return {
    results: products,
    isFallback: true
  };
}
