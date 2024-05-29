import { useQuery } from '@tanstack/react-query';

import { fetchPortfolio } from '@/utils/frtchPortfolio';

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
  });

  return { portfolio: data, ...rest };
};
