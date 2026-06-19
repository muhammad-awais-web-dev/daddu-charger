import { NextRequest } from 'next/server';
import { searchShopify } from '@/lib/shopify';

export async function GET(request: NextRequest) {
  let query = '';
  try {
    const searchParams = request.nextUrl.searchParams;
    query = searchParams.get('q') || searchParams.get('query') || '';

    if (!query) {
      return Response.json({ results: [], error: 'Query parameter "q" or "query" is required' }, { status: 400 });
    }

    const pageStr = searchParams.get('page');
    const page = pageStr ? parseInt(pageStr, 10) : 1;

    const data = await searchShopify(query, page);
    return Response.json(data);
  } catch (error: any) {
    console.error(`Error searching Shopify for query "${query}":`, error);
    return Response.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
