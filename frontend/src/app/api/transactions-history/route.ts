import { NextResponse } from 'next/server';

import { Transaction } from '@/@types/helius';
import { getTransactionsHistory } from '@/services/helius/getTransactionsHistory';

export async function POST(request: Request) {
  const data = await request.json();

  const walletAddress = data?.walletAddress;

  const transactionsHistory: Transaction[] = await getTransactionsHistory(
    walletAddress
  );
  return NextResponse.json({ transactionsHistory });
}
