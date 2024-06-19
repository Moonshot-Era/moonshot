import { PoolGeckoType } from '@/@types/gecko';
import { WalletPortfolioAssetType } from '@/services/helius/getWalletPortfolio';

export interface FeeDataType {
  fromAddress: string;
  amount: number;
  tokenAddress: string;
  tokenDecimals: number;
  tokenSymbol: string;
}

export type SelectedToken = (WalletPortfolioAssetType & PoolGeckoType) | null;

export type SelectedTokens = {
  from: SelectedToken;
  to: SelectedToken;
}
