import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const fetchOhlcv = (tokenAddress: string) =>
  axios
    .post(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/birdeye/ohlcv`,
      {
        tokenAddress
      },
      {
        headers: {
          'x-chain': 'solana',
          'X-API-KEY': process.env.BIRDEYE_X_API_KEY
        }
      }
    )
    .then((response) => {
      return response.data.ohlcvData.data;
    });

export const useOhlcv = (tokenAddress?: string) => {
  const { data, ...rest } = useQuery({
    queryKey: ['ohlcv'],
    queryFn: () => {
      if (!tokenAddress) {
        return null;
      } else {
        return fetchOhlcv(tokenAddress);
      }
    }
  });

  return { ohlcv: data, ...rest };
};
