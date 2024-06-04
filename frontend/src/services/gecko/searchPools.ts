import { GeckoTokenIncluded } from '@/@types/gecko';
import axios from 'axios';

export const searchPools = async (query?: string, page: number = 1, withTokensOverview?: boolean) => {
  try {
    const { data: searchPoolsGecko } = await axios.get(
      `${process.env.GECKO_URL_API}/onchain/search/pools`,
      {
        params: {
          network: 'solana',
          include: 'base_token',
          page,
          query
        },
        headers: {
          'x-cg-pro-api-key': `${process.env.GECKO_API_KEY}`
        }
      }
    );

    let tokensOverview;

    if (withTokensOverview) {
      const tokenAddresses = searchPoolsGecko.included.reduce((address: string, token: GeckoTokenIncluded) => {
        return address.length ? address + ',' + token.attributes.address : token.attributes.address
      }, '');
  
      tokensOverview = (await axios.get(
        `${process.env.GECKO_URL_API}/onchain/networks/solana/tokens/multi/${tokenAddresses}`,
        {
          headers: {
            'x-cg-pro-api-key': `${process.env.GECKO_API_KEY}`,
          },
        }
      )).data;
    }

    return {
      ...searchPoolsGecko,
      tokensOverview,
    };
  } catch (err) {
    console.log('Error', err);
  }
  return [];
};
