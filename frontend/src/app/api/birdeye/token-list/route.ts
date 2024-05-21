import { NextResponse } from 'next/server';
import { getTokenList } from '@/services/birdeye/getTokenList';

export async function POST(request: Request) {
  const response = await request.json();
  const tokenList = await getTokenList(
    response?.offset || 0,
    response?.limit || 50
  );

  return NextResponse.json({ tokenList });
}
