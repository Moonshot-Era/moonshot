import { axiosBrowserClient } from '@/services/axios';
import { HEADER_PROVIDER, HEADER_PROVIDER_TOKEN } from '@/utils';
import { AxiosResponse } from 'axios';

type FetchWalletParams = {
  token: string;
  provider: string;
};

export const fetchWallet = ({ token, provider }: FetchWalletParams) => {
  return axiosBrowserClient.post<Wallet>(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-wallet`,
    undefined,
    {
      headers: {
        [HEADER_PROVIDER_TOKEN]: token,
        [HEADER_PROVIDER]: provider
      }
    }
  );
};
