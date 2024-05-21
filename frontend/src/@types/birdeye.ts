export interface WalletPortfolioType {
  items: TokenItemType[];
  totalUsd: number;
  wallet: string;
}

export interface TokenItemType {
  address: string;
  balance: number;
  chainId: string;
  decimals: number;
  logoURI: string;
  name: number;
  priceUsd: number;
  symbol: string;
  uiAmount: number;
  valueUsd: number;
}
