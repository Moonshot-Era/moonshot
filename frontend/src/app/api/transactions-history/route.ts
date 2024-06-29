import { NextResponse } from 'next/server';

import { Transaction } from '@/@types/helius';
import { getTransactionsHistory } from '@/services/helius/getTransactionsHistory';
import { getTransactionsHistoryDB } from '@/services/helpers/getTransactionHistoryDB';

export async function POST(request: Request) {
  const data = await request.json();

  const walletAddress = data?.walletAddress;

  const transactionsHistory: Transaction[] = await getTransactionsHistory(
    walletAddress
  );

  const transactionsHistoryDB = await getTransactionsHistoryDB();

  return NextResponse.json({
    transactions: {
      public: transactionsHistory,
      internal: transactionsHistoryDB
    }
  });
}
