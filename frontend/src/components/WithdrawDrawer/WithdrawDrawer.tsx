'use client';

import { FC, useState } from 'react';

import './style.scss';
import { SheetDrawer } from '@/legos';
import { WithdrawList } from './WithdrawList';
import { WithdrawItem } from './WithdrawItem';
import { WalletPortfolioAssetType } from '@/services/birdeye/getWalletPortfolio';

interface Props {
  isOpen: boolean;
  toggleOpen: () => void;
  walletAssets: WalletPortfolioAssetType[];
}

export const WithdrawDrawer: FC<Props> = ({
  isOpen,
  toggleOpen,
  walletAssets,
}) => {
  const [isTransfer, setIsTransfer] = useState(false);
  const [fromAsset, setFromAsset] = useState<WalletPortfolioAssetType>();

  const toggleTransfer = (asset: WalletPortfolioAssetType) => {
    setFromAsset(asset);
    setIsTransfer(!isTransfer);
  };

  const handleClose = () => {
    setIsTransfer(false);
    toggleOpen();
  };

  return (
    <>
      <SheetDrawer
        isOpen={isOpen && !isTransfer}
        handleClose={handleClose}
        snapPoints={[800, 540]}
        initialSnap={1}
      >
        <WithdrawList
          toggleTransfer={toggleTransfer}
          walletAssets={walletAssets}
        />
      </SheetDrawer>
      {fromAsset && (
        <SheetDrawer
          isOpen={isOpen && isTransfer}
          detent="content-height"
          handleClose={handleClose}
        >
          <WithdrawItem
            asset={fromAsset}
            onSlideHandler={handleClose}
            onAssetChange={() => setIsTransfer(false)}
          />
        </SheetDrawer>
      )}
    </>
  );
};
