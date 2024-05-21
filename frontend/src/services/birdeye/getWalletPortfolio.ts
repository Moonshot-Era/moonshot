import { WalletPortfolioType } from '@/@types/birdeye';
import axios from 'axios';

export const getWalletPortfolio = async (walletAddress: string) => {
  try {
    const { data: walletPortfolio } = await axios.get(
      `${process.env.BIRDEYE_URL_API}/v1/wallet/token_list?wallet=${
        walletAddress || process.env.WALLET_MAINNET
      }`,
      {
        headers: {
          'x-chain': 'solana',
          'X-API-KEY': process.env.BIRDEYE_X_API_KEY,
        },
      }
    );
    return walletPortfolio?.success
      ? (walletPortfolio.data as WalletPortfolioType)
      : {};
  } catch (err) {
    console.log('Error', err);
  }
  return {};
};
