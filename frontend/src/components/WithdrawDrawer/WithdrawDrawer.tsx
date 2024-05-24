'use client';

import { FC, useState } from 'react';

import './style.scss';
import { SheetDrawer } from '@/legos';
import { WithdrawList } from './WithdrawList';
import { WithdrawItem } from './WithdrawItem';
import {
  WalletPortfolioAssetType,
  WalletPortfolioNormilizedType,
} from '@/services/birdeye/getWalletPortfolio';
import axios from 'axios';
import { cookies } from 'next/headers';

interface Props {
  isOpen: boolean;
  toggleOpen: () => void;
  portfolio: WalletPortfolioNormilizedType;
}

export const WithdrawDrawer: FC<Props> = ({
  isOpen,
  toggleOpen,
  portfolio,
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

  const handleConfirmWithdraw = async () => {
    const { data: txData } = await axios.post(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/solana/send-tx`,
      {
        fromAddress: '',
        toAddress: 'B8xaui7xwQSZmuPwjem7Ka5Qobag7khJHNCPWzDpmXrD',
        amount: 0.1,
      }
    );
    handleClose();
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
          walletAssets={portfolio?.walletAssets}
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
            onSlideHandler={handleConfirmWithdraw}
          />
        </SheetDrawer>
      )}
    </>
  );
};
