import axios from 'axios';
import { GeckoTokenIncluded } from '@/@types/gecko';

export const getTrendingPools = async (
  page: number,
  withTokensOverview: boolean
) => {
  try {
    const { data: trendingListGecko } = await axios.get(
      `${process.env.GECKO_URL_API}/onchain/networks/solana/trending_pools`,
      {
        params: {
          include: 'base_token',
          page
        },
        headers: {
          'x-cg-pro-api-key': `${process.env.GECKO_API_KEY}`
        }
      }
    );

    let tokensOverview;

    if (withTokensOverview) {
      const tokenAddresses = trendingListGecko.included.reduce(
        (address: string, token: GeckoTokenIncluded) => {
          return address.length
            ? address + ',' + token.attributes.address
            : token.attributes.address;
        },
        ''
      );

      tokensOverview = (
        await axios.get(
          `${process.env.GECKO_URL_API}/onchain/networks/solana/tokens/multi/${tokenAddresses}`,
          {
            headers: {
              'x-cg-pro-api-key': `${process.env.GECKO_API_KEY}`
            }
          }
        )
      ).data;
    }

    return {
      ...trendingListGecko,
      tokensOverview
    };
  } catch (err) {
    throw err;
  }
};
