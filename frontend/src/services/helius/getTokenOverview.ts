import { TokenOverviewBirdEyeType } from '@/@types/birdeye';

export const getTokenOverview = async (tokenAddress: string) => {
  try {
    const url = `${process.env.HELIUS_URL_API}?api-key=${process.env.HELIUS_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: tokenAddress,
        method: 'getAsset',
        params: {
          id: tokenAddress
        }
      })
    });
    const { result: tokenOverview } = await response.json();

    const normalizedTokenOverview: TokenOverviewBirdEyeType = {
      address: tokenOverview.id,
      name: tokenOverview.content.metadata.name,
      logoURI: tokenOverview.content.links.image,
      extensions: {
        description: tokenOverview.content.metadata.description,
        telegram: '',
        twitter: '',
        website: '',
        coingeckoId: '',
        serumV3Usdc: '',
        serumV3Usdt: '',
        discord: '',
        medium: ''
      },
      mc: 0,
      v24hUSD: 0,
      liquidity: 0,
      supply: 0,
      holder: 0,
      decimals: 0,
      symbol: '',
      lastTradeUnixTime: 0,
      lastTradeHumanTime: '',
      price: 0,
      history30mPrice: 0,
      priceChange30mPercent: 0
    };

    return normalizedTokenOverview;
  } catch (err) {
    console.log('Error', err);
  }
  return {} as TokenOverviewBirdEyeType;
};
