import axios from 'axios';

export const searchPools = async () => {
  try {
    const { data: trendingListGecko } = await axios.get(
      `${process.env.GECKO_URL_API}/onchain/search/pools?query=sol&network=solana&include=base_token`,
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
