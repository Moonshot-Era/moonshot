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
          type: '15m',
          // TODO: add proper time from 
          time_from: 1717181740583,
          // time_from: new Date(2024, 0, 1).getTime().toString(),
          time_to: new Date().getTime()
        },
        headers: {
          'x-chain': 'solana',
          'X-API-KEY': process.env.BIRDEYE_X_API_KEY
        }
      }
    );
    return data;
  } catch (err) {
    console.log('Error:', err);
  }
  return {};
};
