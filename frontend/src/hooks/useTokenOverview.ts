import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { NormilizedTokenDataOverview } from '@/services/gecko/getTokenOverview';

export const fetchTokenItemOverview = async (tokenAddress: string) => {
  const { data: tokenOverview } = await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-token-overview`,
    {
      tokenAddress
    }
  );
  return tokenOverview;
};

export const useTokenOverview = ({
  tokenAddress
}: {
  tokenAddress: string;
}) => {
  const { data, ...rest } = useQuery({
    queryKey: [`token-overview-${tokenAddress}`],
    queryFn: () => fetchTokenItemOverview(tokenAddress),
    staleTime: 30000,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  return {
    tokenOverview: data as NormilizedTokenDataOverview,
    ...rest
  };
};
