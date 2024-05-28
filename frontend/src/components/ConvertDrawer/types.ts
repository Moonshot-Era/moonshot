import { WalletPortfolioAssetType } from '@/services/birdeye/getWalletPortfolio';

export type SelectedTokens = {
  from: WalletPortfolioAssetType;
  to: WalletPortfolioAssetType;
}
