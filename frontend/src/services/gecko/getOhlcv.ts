import axios from 'axios';

export const getOhlcvData = async (
  poolAddress: string,
  timeFrame: string,
  aggregateParam: string,
  beforeTimestamp?: number,
) => {
  try {
    if (!poolAddress) {
      throw Error(`No pool address provided`);
    }

    const network = 'solana';
    const { data } = await axios.get(
      `${process.env.GECKO_URL_API}/onchain/networks/${network}/pools/${poolAddress}/ohlcv/${timeFrame}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-cg-pro-api-key': `${process.env.GECKO_API_KEY}`
        },
        params: {
          aggregate: aggregateParam,
          before_timestamp: beforeTimestamp,
        }
      }
    );
    return data;
  } catch (err) {
    throw err;
  }
  return {};
};
