import axios from 'axios';

export const searchPools = async () => {
  try {
    const { data: trendingListGecko } = await axios.get(
      `${process.env.GECKO_URL_API}/onchain/networks/solana/trending_pools`,
      {
        headers: {
          'x-cg-pro-api-key': `${process.env.GECKO_API_KEY}`,
        },
      }
    );
    return trendingListGecko;
  } catch (err) {
    console.log('Error', err);
  }
  return [];
};
