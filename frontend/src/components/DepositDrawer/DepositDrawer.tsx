'use client';

import { FC, useState } from 'react';

import './style.scss';
import { SheetDrawer } from '@/legos';
import { DepositList } from './DepositList';
import { DepositItem } from './DepositItem';
import { WalletPortfolioAssetType } from '@/services/birdeye/getWalletPortfolio';

interface Props {
  isOpen: boolean;
  toggleOpen: () => void;
}

export const DepositDrawer: FC<Props> = ({ isOpen, toggleOpen }) => {
  const [isTransfer, setIsTransfer] = useState(false);
  const [token, setToken] = useState<WalletPortfolioAssetType | undefined>();

  const toggleTransfer = (item: WalletPortfolioAssetType) => {
    setToken(item);
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
        <DepositList
          toggleTransfer={toggleTransfer}
          handleClose={handleClose}
        />
      </SheetDrawer>
      {token && (
        <SheetDrawer
          isOpen={isOpen && isTransfer}
          detent="content-height"
          handleClose={handleClose}
        >
          <DepositItem token={token} />
        </SheetDrawer>
      )}
    </>
  );
};
