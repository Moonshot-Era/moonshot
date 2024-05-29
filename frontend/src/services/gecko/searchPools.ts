import axios from 'axios';

export const searchPools = async (query?: string) => {
  try {
    const { data: searchPoolsGecko } = await axios.get(
      `${process.env.GECKO_URL_API}/onchain/search/pools?query=${query}&network=solana&include=base_token`,
      {
        headers: {
          'x-cg-pro-api-key': `${process.env.GECKO_API_KEY}`,
        },
      }
    );
    return searchPoolsGecko;
  } catch (err) {
    console.log('Error', err);
  }
  return [];
};
