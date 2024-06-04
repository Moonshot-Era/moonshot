'use client';

import axios from 'axios';
import { FC, useState } from 'react';

import { SheetDrawer } from '@/legos';
import {
  WalletPortfolioAssetType,
  WalletPortfolioNormilizedType
} from '@/services/helius/getWalletPortfolio';
import { WithdrawItem } from './WithdrawItem';
import { WithdrawList } from './WithdrawList';
import './style.scss';

interface Props {
  isOpen: boolean;
  toggleOpen: () => void;
  portfolio: WalletPortfolioNormilizedType;
}

export const WithdrawDrawer: FC<Props> = ({
  isOpen,
  toggleOpen,
  portfolio
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

  const handleConfirmWithdraw = async (
    toAddress: string,
    amount: number | string
  ) => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/solana/send-tx`, {
        fromAddress: portfolio?.wallet,
        toAddress: toAddress,
        amount: amount,
        tokenAddress: fromAsset?.id,
        tokenDecimals: fromAsset?.token_info.decimals
      })
      .finally(handleClose);
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
