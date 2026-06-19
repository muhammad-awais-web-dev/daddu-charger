import { NextRequest } from 'next/server';
import { getShopifyCollection } from '@/lib/shopify';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  let resolvedHandle = '';
  try {
    const { handle } = await params;
    resolvedHandle = handle;
    const data = await getShopifyCollection(handle);
    return Response.json(data);
  } catch (error: any) {
    console.error(`Error fetching collection ${resolvedHandle || 'unknown'} from Shopify API:`, error);
    return Response.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
