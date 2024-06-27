import { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { fetchPortfolio } from '@/utils/fetchPortfolio';

const wait = (waitFor: number) => new Promise((resolve) => setTimeout(resolve, waitFor))

export const usePortfolio = (walletAddress?: string) => {
  const { data, refetch, ...rest } = useQuery({
    enabled: !!walletAddress,
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
    retry: (failureCount, error) => {
      return failureCount < 3;
    }
  });

  useEffect(() => {
    const controller = new AbortController();
    // The hook that will listen for changes in account using our api.
    // It constantly wait for response
    const waitForUpdate = async () => {
      while (!controller.signal.aborted) {
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_SITE_URL}api/wait-account-change`,
            { walletAddress },
            { signal: controller.signal }
          );
          if (!controller.signal.aborted) {
            await wait(5000);
            refetch();
          }
        } catch (error) {
          if (!controller.signal.aborted) {
            console.error('Error waiting for account change:', error);
            refetch();
            await wait(1000);
          }
        }
      }
    };

    if (walletAddress) {
      waitForUpdate();
    }

    return () => {
      controller.abort();
    };
  }, [walletAddress, refetch]);

  return { portfolio: data, refetch, ...rest };
};
