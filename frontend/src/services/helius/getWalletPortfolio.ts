import {
  PoolGeckoType,
  TokenAttributes,
  TokenItemGeckoType
} from '@/@types/gecko';
import { TokenItemHeliusType } from '@/@types/helius';
import { isSolanaAddress } from '@/helpers/helpers';
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

export interface OverviewTokenSelectedType {
  address: string;
  decimals: number;
  name: string;
  symbol: string;
  uiAmount: number;
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

    if (!result) {
      throw Error('Error fetching portfolio');
    }
    const tokensAddresses = result?.items
      ?.map((tok: TokenItemHeliusType) => {
        return tok.id;
      })
      .join(',');

    let walletPortfolioNormalized: WalletPortfolioAssetType[] = [];

    if (result?.nativeBalance?.lamports) {
      const { data: solanaData } = await axios.get(
        `${process.env.GECKO_URL_API}//coins/markets?vs_currency=usd&ids=solana`,
        {
          headers: {
            'x-cg-pro-api-key': `${process.env.GECKO_API_KEY}`
          }
        }
      );

      walletPortfolioNormalized.push({
        address: SOLANA_WRAPPED_ADDRESS,
        balance: result?.nativeBalance?.lamports / 10 ** 9,
        decimals: 9,
        name: 'SOL',
        priceUsd: solanaData?.[0]?.current_price,
        symbol: 'SOL',
        uiAmount: result?.nativeBalance?.lamports / 10 ** 9,
        valueUsd: result?.nativeBalance?.total_price,
        imageUrl: solanaData?.[0]?.image,
        percentage_change_h24: solanaData?.[0]?.price_change_percentage_24h || 0
      });
    }

    if (tokensAddresses?.length) {
      const { data: tokensListGecko } = await axios.get(
        `${process.env.GECKO_URL_API}/onchain/networks/solana/tokens/multi/${tokensAddresses}?include=top_pools`,
        {
          headers: {
            'x-cg-pro-api-key': `${process.env.GECKO_API_KEY}`
          }
        }
      );

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
            10 ** (asset?.token_info?.decimals || 0),
          decimals: asset?.token_info?.decimals,
          name: isSolanaAddress(asset?.id) ? 'SOL' : token?.name || '',
          priceUsd: +token?.price_usd,
          symbol: isSolanaAddress(asset?.id) ? 'SOL' : token?.symbol,
          uiAmount:
            asset?.token_info?.balance /
            10 ** (asset?.token_info?.decimals || 0),
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
    throw err;
  }
};
