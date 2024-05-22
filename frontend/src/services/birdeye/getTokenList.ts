import axios from 'axios';

export const getTokenList = async (offset: number, limit: number) => {
  try {
    const { data: tokenList } = await axios.get(
      `${process.env.BIRDEYE_URL_API}/defi/tokenlist?sort_by=v24hUSD&sort_type=desc`,
      {
        params: {
          offset,
          limit,
        },
        headers: {
          'x-chain': 'solana',
          'X-API-KEY': process.env.BIRDEYE_X_API_KEY,
        },
      }
    );

    return tokenList;
  } catch (err) {
    console.log('Error', err);
  }
  return [];
};
