import axios from 'axios';

export const getOhlcvData = async (poolAddress: string) => {
  try {
    if (!poolAddress) {
      throw Error(`No pool address provided`);
    }

    const network = 'solana';
    const timeFrame = 'day';

    const { data } = await axios.get(
      `${process.env.GECKO_URL_API}/onchain/networks/${network}/pools/${poolAddress}/ohlcv/${timeFrame}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-cg-pro-api-key': `${process.env.GECKO_API_KEY}`
        }
      }
    );
    return data;
  } catch (err) {
    console.log('Error:', err);
  }
  return {};
};
