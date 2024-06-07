import { Transaction } from '@/@types/helius';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const fetchTransactionHistory = (walletAddress: string) =>
  axios
    .post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/transaction-history`, {
      walletAddress
    })
    .then((response) => {
      return response.data.transactionHistory as Transaction[];
    });

export const useTransactionHistory = (walletAddress?: string) => {
  const { data, ...rest } = useQuery({
    queryKey: ['transaction_history'],
    queryFn: () => {
      if (!walletAddress) {
        return null;
      } else {
        return fetchTransactionHistory(walletAddress);
      }
    }
  });

  return { transactionHistory: data, ...rest };
};
