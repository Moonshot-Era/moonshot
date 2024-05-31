import axios from 'axios';

export const searchPools = async (query?: string, page: number = 1) => {
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
    return searchPoolsGecko;
  } catch (err) {
    console.log('Error', err);
  }
  return [];
};
