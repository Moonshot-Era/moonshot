import { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { fetchPortfolio } from '@/utils/fetchPortfolio';

export const usePortfolio = (walletAddress?: string) => {
  const { data, refetch, ...rest } = useQuery({
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

  useEffect(() => {
    // The hook that will listen for changes in account using our api.
    // It constantly wait for response
    let cancelRequest = false;

    const waitForUpdate = async () => {
      try {
        while (true) {
          await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/wait-account-change`, {
            walletAddress,
          });
          if (cancelRequest) return;
          refetch();
        }
      } catch (error) {
        console.error('Error waiting for account change:', error);
        if (!cancelRequest) setTimeout(waitForUpdate, 1000);
      }
    };

    if (walletAddress) {
      waitForUpdate();
    }

    return () => {
      cancelRequest = true;
    };
  }, [walletAddress, refetch]);

  return { portfolio: data, refetch, ...rest };
};
