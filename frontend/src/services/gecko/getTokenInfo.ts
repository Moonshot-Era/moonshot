import { TokenOverviewBirdEyeType } from '@/@types/birdeye';
import axios from 'axios';

export const getTokenInfo = async (tokenAddress: string) => {
  try {
    const network = 'solana';
    const { data: tokenData } = await axios.get(
      `${process.env.GECKO_URL_API}/onchain/networks/${network}/tokens/${tokenAddress}/info`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-cg-pro-api-key': `${process.env.GECKO_API_KEY}`
        }
      }
    );
    const normalizedTokenData = {
      name: tokenData.data.attributes.name,
      address: tokenData.data.attributes.address,
      logoURI: tokenData.data.attributes.image_url,
      extensions: {
        description: tokenData.data.attributes.description,
        telegram: tokenData.data.attributes.telegram_handle,
        twitter: tokenData.data.attributes.twitter_handle,
        website: tokenData.data.attributes.websites[0]
      }
    };

    return normalizedTokenData;
  } catch (err) {
    console.log('Error', err);
  }
  return {} as TokenOverviewBirdEyeType;
};
