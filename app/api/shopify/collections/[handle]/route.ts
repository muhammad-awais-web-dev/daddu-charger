import { NextRequest } from 'next/server';
import { getShopifyCollection, getShopifyCollectionProducts } from '@/lib/shopify';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  let resolvedHandle = '';
  try {
    const { handle } = await params;
    resolvedHandle = handle;
    
    const [collectionData, productsData] = await Promise.all([
      getShopifyCollection(handle),
      getShopifyCollectionProducts(handle).catch((err) => {
        console.warn(`Failed to fetch products for collection ${handle}:`, err);
        return { products: [] };
      })
    ]);

    const collection = {
      ...collectionData.collection,
      products: productsData.products || []
    };

    return Response.json({ collection });
  } catch (error: any) {
    console.error(`Error fetching collection ${resolvedHandle || 'unknown'} from Shopify API:`, error);
    return Response.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
