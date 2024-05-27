import { PoolGeckoType } from '@/@types/gecko';
import { getTrendingPools } from '@/services/gecko/getTrendingPools';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const trendingPools: PoolGeckoType | {} = await getTrendingPools();

  return NextResponse.json({ trendingPools });
}
