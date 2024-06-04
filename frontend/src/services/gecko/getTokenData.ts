import { TokenOverviewBirdEyeType } from '@/@types/birdeye';
import axios from 'axios';

export const getTokenData = async (tokenAddress: string) => {
  try {
    const network = 'solana';
    const { data: tokenData } = await axios.get(
      `${process.env.GECKO_URL_API}/onchain/networks/${network}/tokens/${tokenAddress}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-cg-pro-api-key': `${process.env.GECKO_API_KEY}`
        },
        params: {
          include: 'top_pools'
        }
      }
    );

    const normalizedTokenData = {
      mc: tokenData.data.attributes.market_cap_usd,
      v24hUSD: tokenData.data.attributes.volume_usd.h24,
      liquidity: tokenData.data.attributes.total_reserve_in_usd,
      supply: tokenData.data.attributes.total_supply,
      holder: 0,
      extensions: {
        telegram: '',
        twitter: '',
        website: ''
      },
      top_pools: tokenData.data.relationships.top_pools.data
    };

    return normalizedTokenData;
  } catch (err) {
    console.log('Error', err);
  }
  return {} as TokenOverviewBirdEyeType;
};
