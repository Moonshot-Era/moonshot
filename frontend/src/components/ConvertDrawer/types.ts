import { TokenItemBirdEyeType } from '@/@types/birdeye';
import { WalletPortfolioAssetType } from '@/services/birdeye/getWalletPortfolio';

export type SelectedTokens =
  | {
      from: WalletPortfolioAssetType;
      to: TokenItemBirdEyeType;
    }
  | { from: null; to: null };
