import axios from 'axios';

export const getOhlcvData = async (tokenAddress: string) => {
  try {
    if (!tokenAddress) {
      throw Error(`No token address provided`);
    }

    let currentDate = new Date();
    currentDate.setDate(currentDate.getDay() - 7);
    const timeFrom = currentDate.getTime();

    const { data } = await axios.get(
      `${process.env.BIRDEYE_URL_API}defi/ohlcv`,
      {
        params: {
          address: tokenAddress,
          type: '15m',
          time_from: timeFrom,
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
