import { TokenItemBirdEyeType, WalletPortfolioType } from '@/@types/birdeye';
import {
  PoolGeckoType,
  TokenAttributes,
  TokenItemGeckoType
} from '@/@types/gecko';
import { isSolanaAddress } from '@/helpers/helpers';
import axios from 'axios';

export interface WalletPortfolioAssetType {
  imageUrl: string;
  percentage_change_h24: any;
  address: string;
  balance: number;
  chainId?: string;
  decimals?: number;
  logoURI?: string;
  name: string;
  priceUsd: number;
  symbol: string;
  uiAmount: number;
  valueUsd: number;
}

export interface WalletPortfolioNormilizedType {
  walletAssets: WalletPortfolioAssetType[];
  totalUsd: number;
  wallet: string;
}

export const getWalletPortfolio = async (walletAddress: string) => {
  try {
    if (!walletAddress) {
      throw Error(`User don't have a wallet`);
    }
    const url = `${process.env.HELIUS_URL_API}?api-key=${process.env.HELIUS_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'searchAssets',
        params: {
          ownerAddress: walletAddress,
          tokenType: 'fungible',
          displayOptions: {
            showNativeBalance: true
          }
        }
      })
    });
    const { result } = await response.json();
    console.log('========Search Assets: ', result);

    // TODO: check further data
    const walletPortfolio: WalletPortfolioType = result?.data;
    const tokensAddresses = walletPortfolio?.items
      ?.map(
        (tok: TokenItemBirdEyeType) =>
          isSolanaAddress(tok.address) || tok.address
      )
      .join(',');

    let walletPortfolioNormalized: WalletPortfolioAssetType[] = [];

    if (tokensAddresses?.length) {
      const { data: tokensListGecko } = await axios.get(
        `${process.env.GECKO_URL_API}/onchain/networks/solana/tokens/multi/${tokensAddresses}?include=top_pools`,
        {
          headers: {
            'x-cg-pro-api-key': `${process.env.GECKO_API_KEY}`
          }
        }
      );
      walletPortfolioNormalized = walletPortfolio?.items?.map(
        (asset: TokenItemBirdEyeType) => {
          const token: TokenAttributes = tokensListGecko?.data?.find(
            (token: TokenItemGeckoType) =>
              token.attributes.address ===
              (isSolanaAddress(asset?.address) || asset?.address)
          )?.attributes;

          const percentage_change_h24 = tokensListGecko?.included?.find(
            (included: PoolGeckoType) =>
              included?.relationships?.base_token?.data?.id ===
              `solana_${isSolanaAddress(asset?.address) || asset?.address}`
          )?.attributes?.price_change_percentage?.h24;

          return {
            ...asset,
            imageUrl: token?.image_url,
            percentage_change_h24
          };
        }
      );
    }
    return data?.success
      ? {
          walletAssets: walletPortfolioNormalized,
          totalUsd: walletPortfolio?.totalUsd,
          wallet: walletPortfolio?.wallet
        }
      : {};
  } catch (err) {
    console.log('Error:', err.response);
  }
  return {};
};
