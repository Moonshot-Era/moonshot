import { PoolGeckoType } from '@/@types/gecko';
import { WalletPortfolioAssetType } from '@/services/helius/getWalletPortfolio';

export type SelectedTokens =
  | {
      from: WalletPortfolioAssetType;
      to: PoolGeckoType;
    }
  | { from: null; to: null };
