import { TokenItemBirdEyeType, WalletPortfolioType } from '@/@types/birdeye';
import { PoolGeckoType, TokenItemGeckoType } from '@/@types/gecko';
import { isSolanaAddress } from '@/helpers/helpers';
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

    const tokensAddresses = walletPortfolio?.data?.items
      ?.map(
        (tok: TokenItemBirdEyeType) =>
          isSolanaAddress(tok.address) || tok.address
      )
      .join(',');

    const { data: tokensListGecko } = await axios.get(
      `https://api.geckoterminal.com/api/v2/networks/solana/tokens/multi/${tokensAddresses}?include=top_pools`
    );

    return walletPortfolio?.success
      ? {
          walletDetails: walletPortfolio.data as WalletPortfolioType,
          tokensDetails: tokensListGecko
            ? (tokensListGecko?.data as TokenItemGeckoType[])
            : [],
          tokensIncludedDetails: tokensListGecko
            ? (tokensListGecko?.included as PoolGeckoType[])
            : [],
        }
      : {};
  } catch (err) {
    console.log('Error', err);
  }
  return {};
};
