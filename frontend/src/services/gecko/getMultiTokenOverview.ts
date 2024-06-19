import axios from 'axios';

export const getMultiTokenOverview = async (tokenAddresses: string) => {
  try {
    const tokensOverview = (
      await axios.get(
        `${process.env.GECKO_URL_API}/onchain/networks/solana/tokens/multi/${tokenAddresses}`,
        {
          headers: {
            'x-cg-pro-api-key': `${process.env.GECKO_API_KEY}`
          },
          params: {
            include: 'top_pools'
          }
        }
      )
    ).data;

    return {
      tokensOverview
    };
  } catch (err) {
    console.log('Error while fetching trending pools', err);
  }
  return [];
};
