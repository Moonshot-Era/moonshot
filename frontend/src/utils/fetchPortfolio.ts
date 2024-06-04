import axios from 'axios';

import { WalletPortfolioNormilizedType } from '@/services/birdeye/getWalletPortfolio';

export const fetchPortfolio = (
  walletAddress: string
): Promise<WalletPortfolioNormilizedType> =>
  axios
    .post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/wallet-portfolio`, {
      walletAddress
    })
    .then((response) => response.data.walletPortfolio);
