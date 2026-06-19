import { NextRequest } from 'next/server';
import { getStoreUrl } from '@/lib/shopify';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || searchParams.get('query') || '';

    if (!query) {
      return Response.json({ results: [] });
    }

    const storeUrl = getStoreUrl();
    const suggestUrl = `${storeUrl}/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product`;
    
    const response = await fetch(suggestUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NextJS-Shopify-Client/1.0',
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      return Response.json({ results: [] });
    }

    const data = await response.json();
    const products = data?.resources?.results?.products || [];
    
    // Return formatted suggestions matching the dashboard structure
    return Response.json({
      results: products.map((p: any) => ({
        id: p.id,
        title: p.title,
        handle: p.handle,
        url: p.url || `/products/${p.handle}`,
        image: p.image || '',
        price: p.price || '0.00',
        available: p.available !== undefined ? p.available : true,
        vendor: p.vendor || '',
        type: p.product_type || p.type || ''
      }))
    });
  } catch (error: any) {
    console.error('Quick search route error:', error);
    return Response.json({ results: [], error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
