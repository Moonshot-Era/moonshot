export interface WalletPortfolioType {
  items: TokenItemBirdEyeType[];
  totalUsd: number;
  wallet: string;
}

export interface TokenItemBirdEyeType {
  address: string;
  balance: number;
  chainId: string;
  decimals: number;
  logoURI: string;
  name: string;
  priceUsd: number;
  symbol: string;
  uiAmount: number;
  valueUsd: number;
}

export interface TokenOverviewBirdEyeType {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  mc: number;
  extensions: {
    coingeckoId: string;
    serumV3Usdc: string;
    serumV3Usdt: string;
    website: string;
    telegram: string | null;
    twitter: string;
    description: string;
    discord: string;
    medium: string;
  };
  logoURI: string;
  liquidity: number;
  supply: number;
  holder: number;
  lastTradeUnixTime: number;
  lastTradeHumanTime: string;
  price: number;
  v24hUSD: number;
  history30mPrice: number;
  priceChange30mPercent: number;
}

export interface OhlcvBirdEyeType {
  address: string;
  c: number;
  h: number;
  l: number;
  o: number;
  type: string;
  unixTime: number;
  v: number;
}
