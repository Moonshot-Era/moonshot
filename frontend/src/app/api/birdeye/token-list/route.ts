import { NextResponse } from 'next/server';
import { getTokenList } from '@/services/birdeye/getTokenList';

export async function POST(request: Request) {
  const requestBody = await request.json();
  const tokenList = await getTokenList(
    requestBody?.offset || 0,
    requestBody?.limit || 50
  );

  return NextResponse.json({ tokenList });
}
