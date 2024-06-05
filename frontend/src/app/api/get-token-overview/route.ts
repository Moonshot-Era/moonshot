import { NextResponse } from 'next/server';

import { getTokenOverview } from '@/services/gecko/getTokenOverview';

export async function POST(request: Request) {
  const response = await request.json();

  const data = await getTokenOverview(response?.tokenAddress);
  return NextResponse.json(data);
}
