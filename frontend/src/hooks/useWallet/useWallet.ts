import { useQuery } from '@tanstack/react-query';
import { fetchWallet } from './fetchWallet';

import { useLogout } from '../useLogout';

export const useWallet = (isPublic = false) => {
  const logout = useLogout();

  const { data, ...rest } = useQuery<Wallet | null>({
    enabled: !isPublic,
    queryKey: ['wallet'],
    queryFn: async () => {
      try {
        const { data } = await fetchWallet();

        if (data.wallet) {
          return data;
        }

        throw Error('Can not receive wallet');
      } catch (err) {
        if (!isPublic) {
          await logout();
        }
        return null;
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  return {
    walletData: data,
    ...rest
  };
};
