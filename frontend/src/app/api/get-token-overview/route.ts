import { NextResponse } from 'next/server';

import { TokenOverviewBirdEyeType } from '@/@types/birdeye';
import { getTokenOverview } from '@/services/helius/getTokenOverview';

export async function POST(request: Request) {
  const response = await request.json();

  const data = await getTokenOverview(response?.tokenAddress);
  return NextResponse.json({
    token: (data as TokenOverviewBirdEyeType) || {}
  });
}
