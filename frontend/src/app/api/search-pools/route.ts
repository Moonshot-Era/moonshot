import { NextResponse } from 'next/server';
import { searchPools } from '@/services/gecko/searchPools';
import { PoolGeckoType } from '@/@types/gecko';

export async function POST(request: Request) {
  const reqData = await request.json();
  const searchPoolsData: PoolGeckoType[] | [] = await searchPools(
    reqData?.query,
    reqData?.page,
    reqData?.withTokensOverview,
  );

  return NextResponse.json({ searchPoolsData });
}
