import axios from 'axios';

export const getTokenOverview = async (tokenAddress: string) => {
  try {
    const { data: tokenOverview } = await axios.get(
      `${process.env.BIRDEYE_URL_API}defi/token_overview?address=${tokenAddress}`,
      {
        headers: {
          'x-chain': 'solana',
          'X-API-KEY': process.env.BIRDEYE_X_API_KEY,
        },
      }
    );

    return tokenOverview;
  } catch (err) {
    console.log('Error', err);
  }
  return [];
};
