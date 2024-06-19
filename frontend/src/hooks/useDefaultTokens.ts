import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { SOLANA_WRAPPED_ADDRESS, USDC_ADDRESS } from '@/utils';
import {
  GeckoTokenIncluded,
  PoolGeckoType,
  TokenItemGeckoType
} from '@/@types/gecko';

export const fetchTokensOverview = async (tokenAddresses: string) => {
  const { data: tokenOverview } = await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-multi-token-overview`,
    {
      tokenAddresses
    }
  );
  return tokenOverview;
};

export const useDefaultTokens = ({ skip = false }: { skip: boolean }) => {
  const tokenAddresses = SOLANA_WRAPPED_ADDRESS + ',' + USDC_ADDRESS;
  const { data, ...rest } = useQuery({
    enabled: !skip,
    queryKey: ['defaulf-tokens'],
    queryFn: () => fetchTokensOverview(tokenAddresses),
    staleTime: 30000,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  console.log('debug > data===', data);

  const normalizedTokenData = data?.tokensOverview?.data?.map(
    (token: TokenItemGeckoType) => ({
      ...token,
      included: data?.tokensOverview?.included.find(
        ({ id }: GeckoTokenIncluded) => {
          return id === token.relationships.top_pools?.data?.[0]?.id;
        }
      )
    })
  );

  return {
    defaultTokens: normalizedTokenData || [],
    ...rest
  };
};
