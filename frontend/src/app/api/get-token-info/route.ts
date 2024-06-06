import { NextResponse } from 'next/server';

import { getTokenInfo } from '@/services/gecko/getTokenInfo';

export async function POST(request: Request) {
  const response = await request.json();

  const data = await getTokenInfo(response?.tokenAddress);
  return NextResponse.json(data);
}
