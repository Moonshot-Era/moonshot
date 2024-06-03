import { useQuery } from '@tanstack/react-query';

import { fetchPortfolio } from '@/utils/fetchPortfolio';

export const usePortfolio = (walletAddress?: string) => {
  const { data, ...rest } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => {
      if (!walletAddress) {
        return null;
      } else {
        return fetchPortfolio(walletAddress);
      }
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return { portfolio: data, ...rest };
};
