import { useQuery } from '@tanstack/react-query';
import { fetchWallet } from './fetchWallet';
import { useCookies } from 'next-client-cookies';
import {
  COOKIE_PROVIDER,
  COOKIE_PROVIDER_TOKEN,
  HEADER_PROVIDER_TOKEN
} from '@/utils';
import { useLogout } from '../useLogout';

export const useWallet = (isPublic = false) => {
  const logout = useLogout();
  const cookies = useCookies();
  const provider = cookies.get(COOKIE_PROVIDER);
  const token = cookies.get(COOKIE_PROVIDER_TOKEN);

  const { data, ...rest } = useQuery<Wallet | null>({
    enabled: !isPublic,
    queryKey: ['wallet', token],
    queryFn: async () => {
      try {
        const { data, config } = await fetchWallet({
          provider,
          token
        });

        const newToken = config.headers?.[HEADER_PROVIDER_TOKEN];

        if (newToken) {
          cookies.set(COOKIE_PROVIDER_TOKEN, newToken as string);
        } else {
          cookies.remove(COOKIE_PROVIDER_TOKEN);
          cookies.remove(COOKIE_PROVIDER);
        }

        if (data.wallet) {
          return data;
        }

        throw Error('Can not receive wallet');
      } catch (err) {
        await logout();
        return null;
      }
    }
  });

  return {
    walletData: data,
    ...rest
  };
};
