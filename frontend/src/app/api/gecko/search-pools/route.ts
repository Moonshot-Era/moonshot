import { NextResponse } from 'next/server';
import { searchPools } from '@/services/gecko/searchPools';
import { PoolGeckoType } from '@/@types/gecko';

export async function POST(request: Request) {
  const response = await request.json();
  const searchPoolsData: PoolGeckoType[] | [] = await searchPools(
    response?.query,
    response?.page
  );

  return NextResponse.json({ searchPoolsData });
}
