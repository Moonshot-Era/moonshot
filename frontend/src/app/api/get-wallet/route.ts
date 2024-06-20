import { NextRequest, NextResponse } from 'next/server';
import { getUserSessionClient, getUserWallet } from '@/services';
import { logger } from '@/services/logger/pino/pinoLogger';

export async function POST() {
  try {
    const userSessionClient = await getUserSessionClient();
    const wallet = await getUserWallet(userSessionClient);

    return NextResponse.json({ wallet });
  } catch (err: any) {
    logger.error(err, 'route get-wallet');
    return NextResponse.json({ wallet: null });
  }
}
