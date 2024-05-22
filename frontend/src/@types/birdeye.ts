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
