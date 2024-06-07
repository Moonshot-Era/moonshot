import { getTransactionHistory } from '@/services/helius/getTransactionHistory';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();

  const walletAddress = data?.walletAddress;

  const transactionHistory = await getTransactionHistory(walletAddress);
  return NextResponse.json({ transactionHistory });
}
