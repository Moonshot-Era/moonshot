import { PoolGeckoType } from '@/@types/gecko';
import { WalletPortfolioAssetType } from '@/services/helius/getWalletPortfolio';

export interface FeeDataType {
  fromAddress: string;
  amount: number;
  tokenAddress: string;
  tokenDecimals: number;
}

export type SelectedTokens =
  | {
      from: WalletPortfolioAssetType;
      to: PoolGeckoType;
    }
  | { from: null; to: null };
