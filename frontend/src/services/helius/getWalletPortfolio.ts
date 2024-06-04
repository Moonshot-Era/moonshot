import {
  PoolGeckoType,
  TokenAttributes,
  TokenItemGeckoType
} from '@/@types/gecko';
import { TokenItemHeliusType } from '@/@types/helius';
import { isSolanaAddress } from '@/helpers/helpers';
import axios from 'axios';

export interface WalletPortfolioAssetType extends TokenItemHeliusType {
  imageUrl: string;
  percentage_change_h24: any;
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

    const tokensAddresses = result?.items
      ?.map((tok: TokenItemHeliusType) => isSolanaAddress(tok.id) || tok.id)
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
      walletPortfolioNormalized = result?.items?.map(
        (asset: TokenItemHeliusType) => {
          const token: TokenAttributes = tokensListGecko?.data?.find(
            (token: TokenItemGeckoType) =>
              token.attributes.address ===
              (isSolanaAddress(asset?.id) || asset?.id)
          )?.attributes;

          const percentage_change_h24 = tokensListGecko?.included?.find(
            (included: PoolGeckoType) =>
              included?.relationships?.base_token?.data?.id ===
              `solana_${isSolanaAddress(asset?.id) || asset?.id}`
          )?.attributes?.price_change_percentage?.h24;

          return {
            ...asset,
            imageUrl: token?.image_url,
            percentage_change_h24
          };
        }
      );
    }

    return {
      walletAssets: walletPortfolioNormalized,
      totalUsd: result?.nativeBalance.total_price || 0,
      wallet: walletAddress
    };
  } catch (err) {
    console.log('Error:', err.response);
  }
  return {};
};
