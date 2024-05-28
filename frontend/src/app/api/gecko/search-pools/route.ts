import { NextResponse } from 'next/server';
import { WalletPortfolioType } from '@/@types/birdeye';
import { searchPools } from '@/services/gecko/searchPools';

export async function POST(request: Request) {
  const response = await request.json();
  const searchPoolsData: WalletPortfolioType | {} = await searchPools();

  return NextResponse.json({ searchPoolsData });
}
