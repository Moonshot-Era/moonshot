'use client';

import axios from 'axios';
import { FC, useState } from 'react';

import { SheetDrawer } from '@/legos';
import {
  WalletPortfolioAssetType,
  WalletPortfolioNormilizedType
} from '@/services/helius/getWalletPortfolio';
import { createBrowserClient } from '@/supabase/client';
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
    const supabaseClient = createBrowserClient();
    await axios
      .post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-tx`, {
        fromAddress: portfolio?.wallet,
        toAddress: toAddress,
        amount: amount,
        tokenAddress: fromAsset?.address,
        tokenDecimals: fromAsset?.decimals
      })
      .then(async () => {
        await supabaseClient.from('transactions').insert({
          created_at: new Date().toISOString(),
          user_id: '',
          token_name: fromAsset?.name,
          token_address: fromAsset?.address,
          token_amount: amount,
          token_price: '',
          transaction_type: 'sell',
          image_url: fromAsset?.imageUrl,
          // ?
          wallet_address: toAddress
        });
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
