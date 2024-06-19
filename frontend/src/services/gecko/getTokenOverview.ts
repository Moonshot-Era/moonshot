import { TokenItemGeckoType } from '@/@types/gecko';
import axios from 'axios';

export interface NormilizedTokenDataOverview {
  mc?: string | null;
  v24hUSD: string;
  liquidity?: string;
  supply?: string;
  holder: number;
  decimals?: number;
  price_usd: string;
  poolAddress: string;
}

export const getTokenOverview = async (tokenAddress: string) => {
  try {
    const network = 'solana';
    const { data: tokenData }: { data: { data: TokenItemGeckoType } } =
      await axios.get(
        `${process.env.GECKO_URL_API}/onchain/networks/${network}/tokens/${tokenAddress}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-cg-pro-api-key': `${process.env.GECKO_API_KEY}`
          }
        }
      );

    const normalizedTokenData: NormilizedTokenDataOverview = {
      mc: tokenData.data.attributes.market_cap_usd || '',
      v24hUSD: tokenData.data.attributes.volume_usd.h24,
      liquidity: tokenData.data.attributes.total_reserve_in_usd,
      supply: tokenData.data.attributes.total_supply,
      price_usd: tokenData.data.attributes.price_usd,
      holder: 0,
      decimals: tokenData.data.attributes.decimals,
      poolAddress: tokenData.data.relationships.top_pools.data?.[0]?.id.replace(
        'solana_',
        ''
      )
    };

    return normalizedTokenData;
  } catch (err) {
    console.log('Error', err);
  }
  return {};
};
