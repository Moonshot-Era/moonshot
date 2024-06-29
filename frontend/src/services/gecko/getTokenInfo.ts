import axios from 'axios';

export interface NormilizedTokenInfoOverview {
  name: string;
  address: string;
  imageUrl?: string;
  description?: string;
  telegramUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
}

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
    const normalizedTokenData: NormilizedTokenInfoOverview = {
      name: tokenData.data.attributes.name,
      address: tokenData.data.attributes.address,
      imageUrl: tokenData.data.attributes.image_url,
      description: tokenData.data.attributes.description,
      telegramUrl: tokenData.data.attributes.telegram_handle
        ? `https://t.me/${tokenData.data.attributes.telegram_handle}`
        : '',
      twitterUrl: tokenData.data.attributes.twitter_handle
        ? `https://x.com/${tokenData.data.attributes.twitter_handle}`
        : '',
      websiteUrl: tokenData.data.attributes.websites[0]
    };

    return normalizedTokenData;
  } catch (err) {
    throw err;
  }
};
