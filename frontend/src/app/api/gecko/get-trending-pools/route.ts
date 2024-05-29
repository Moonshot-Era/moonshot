import { PoolGeckoType } from '@/@types/gecko';
import { getTrendingPools } from '@/services/gecko/getTrendingPools';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const requestBody = await request.json();
  const trendingPools: PoolGeckoType | {} = await getTrendingPools(
    requestBody?.page || 1,
    requestBody?.withTokensOverview || true,
  );

  return NextResponse.json({ trendingPools });
}
