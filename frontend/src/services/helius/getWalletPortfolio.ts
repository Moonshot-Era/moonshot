import {
  PoolGeckoType,
  TokenAttributes,
  TokenItemGeckoType
} from '@/@types/gecko';
import { TokenItemHeliusType } from '@/@types/helius';
import { SOLANA_WRAPPED_ADDRESS } from '@/utils';
import axios from 'axios';

type HeliusWalletType = {
  total: number;
  limit: number;
  cursor: string;
  items: TokenItemHeliusType[];
  nativeBalance: {
    lamports: number;
    price_per_sol: number;
    total_price: number;
  };
};
export interface WalletPortfolioAssetType {
  address: string;
  balance: number;
  decimals: number;
  name: string;
  priceUsd: number;
  symbol: string;
  uiAmount: number;
  valueUsd: number;
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
    const { result }: { result: HeliusWalletType } = await response.json();

    const tokensAddresses =
      result?.items?.map((tok: TokenItemHeliusType) => tok.id).join(',') +
      `,${SOLANA_WRAPPED_ADDRESS}`;

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
      const solanaToken: TokenAttributes = tokensListGecko?.data?.find(
        (token: TokenItemGeckoType) =>
          token.attributes.address === SOLANA_WRAPPED_ADDRESS
      )?.attributes;

      const solana_percentage_change_h24 = tokensListGecko?.included?.find(
        (included: PoolGeckoType) => included?.attributes?.name === 'SOL / USDC'
      )?.attributes?.price_change_percentage?.h24;
      if (result?.nativeBalance?.lamports) {
        walletPortfolioNormalized.push({
          address: solanaToken?.address,
          balance:
            result?.nativeBalance?.lamports / 10 ** solanaToken?.decimals,
          decimals: solanaToken?.decimals,
          name: 'SOLANA',
          priceUsd: result?.nativeBalance?.price_per_sol,
          symbol: 'SOL',
          uiAmount:
            result?.nativeBalance?.lamports / 10 ** solanaToken?.decimals,
          valueUsd: result?.nativeBalance?.total_price,
          imageUrl: solanaToken?.image_url,
          percentage_change_h24: solana_percentage_change_h24
        });
      }

      result?.items?.map((asset: TokenItemHeliusType) => {
        const token: TokenAttributes = tokensListGecko?.data?.find(
          (token: TokenItemGeckoType) => token.attributes.address === asset?.id
        )?.attributes;

        const included = tokensListGecko?.included?.find(
          (included: PoolGeckoType) =>
            included?.relationships?.base_token?.data?.id ===
              `solana_${asset?.id}` ||
            included?.relationships?.quote_token?.data?.id ===
              `solana_${asset?.id}`
        )?.attributes;

        walletPortfolioNormalized.push({
          address: asset?.id,
          balance:
            asset?.token_info?.balance /
            10 ** (asset?.token_info?.decimals || 1),
          decimals: asset?.token_info?.decimals,
          name: included?.name || '',
          priceUsd: asset?.token_info?.price_info?.price_per_token,
          symbol: asset?.token_info?.symbol,
          uiAmount:
            asset?.token_info?.balance /
            10 ** (asset?.token_info?.decimals || 1),
          valueUsd: asset?.token_info?.price_info?.total_price,
          imageUrl: token?.image_url,
          percentage_change_h24: included?.price_change_percentage?.h24
        });
      });
    }

    return {
      walletAssets: walletPortfolioNormalized,
      totalUsd: result?.nativeBalance.total_price || 0,
      wallet: walletAddress
    };
  } catch (err) {
    console.log('Error:' + err);
  }
  return {};
};
