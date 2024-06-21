import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { NormilizedTokenInfoOverview } from '@/services/gecko/getTokenInfo';

export const fetchTokenItemInfo = async (tokenAddress: string) => {
  const { data: tokenInfo } = await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-token-info`,
    {
      tokenAddress
    }
  );
  return tokenInfo;
};

export const useTokenInfo = ({ tokenAddress }: { tokenAddress: string }) => {
  const { data, ...rest } = useQuery({
    queryKey: [`token-info-${tokenAddress}`],
    queryFn: () => fetchTokenItemInfo(tokenAddress),
    staleTime: 30000,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  return {
    tokenInfo: data as NormilizedTokenInfoOverview,
    ...rest
  };
};
