import axios from 'axios';

export const getOhlcvData = async (tokenAddress: string) => {
  try {
    if (!tokenAddress) {
      throw Error(`No token address provided`);
    }

    const { data } = await axios.get(
      `${process.env.BIRDEYE_URL_API}defi/ohlcv`,
      {
        params: {
          address: tokenAddress,
          type: '15m'
        },
        headers: {
          'x-chain': 'solana',
          'X-API-KEY': process.env.BIRDEYE_X_API_KEY
        }
      }
    );
    console.log('data', data);
    return data;
  } catch (err) {
    console.log('Error:', err);
  }
  return {};
};
