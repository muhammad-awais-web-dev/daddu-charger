import { NextRequest } from 'next/server';
import { getShopifyCollections } from '@/lib/shopify';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : undefined;

    const data = await getShopifyCollections({ limit, page });
    return Response.json(data);
  } catch (error: any) {
    console.error('Error fetching collections from Shopify API:', error);
    return Response.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
