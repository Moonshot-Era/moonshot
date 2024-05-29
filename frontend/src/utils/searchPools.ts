import axios from 'axios';

import { WalletPortfolioNormilizedType } from '@/services/birdeye/getWalletPortfolio';

export const searchPools = (
  query: string
): Promise<WalletPortfolioNormilizedType> =>
  axios
    .post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/gecko/search-pools`, {
      query,
    })
    .then((response) => response.data.tokenList.data);
