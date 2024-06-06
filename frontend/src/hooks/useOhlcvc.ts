import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const fetchOhlcv = (poolAddress: string) =>
  axios
    .post(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/ohlcv`,
      {
        poolAddress
      },
      {
        headers: {
          'x-chain': 'solana',
          'X-API-KEY': process.env.BIRDEYE_X_API_KEY
        }
      }
    )
    .then((response) => {
      return response.data.data;
    });

export const useOhlcv = (poolAddress?: string) => {
  const { data, ...rest } = useQuery({
    queryKey: ['ohlcv'],
    queryFn: () => {
      if (!poolAddress) {
        return null;
      } else {
        return fetchOhlcv(poolAddress);
      }
    }
  });

  return { ohlcv: data, ...rest };
};
