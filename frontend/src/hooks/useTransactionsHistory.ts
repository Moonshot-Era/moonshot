import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { Transaction } from '@/@types/helius';

export const fetchTransactionsHistory = (walletAddress: string) =>
  axios
    .post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/transactions-history`, {
      walletAddress
    })
    .then((response) => {
      return response.data.transactionsHistory as Transaction[];
    });

export const useTransactionsHistory = (walletAddress?: string) => {
  const { data, ...rest } = useQuery({
    queryKey: ['transactions_history'],
    queryFn: () => {
      if (!walletAddress) {
        return null;
      } else {
        return fetchTransactionsHistory(walletAddress);
      }
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  return { transactionsHistory: data, ...rest };
};
