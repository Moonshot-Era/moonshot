'use client';

import axios from 'axios';
import { FC, useState } from 'react';
import { toast } from 'sonner';

import { SheetDrawer } from '@/legos';
import {
  WalletPortfolioAssetType,
  WalletPortfolioNormilizedType
} from '@/services/helius/getWalletPortfolio';
import { createBrowserClient } from '@/supabase/client';
import { WithdrawItem } from './WithdrawItem';
import { WithdrawList } from './WithdrawList';
import { snackbar } from '@/helpers/snackbar';

import './style.scss';
import { tokenAddressWithDots } from '@/helpers/helpers';

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

  const withdrawMutation = async (
    toAddress: string,
    amount: number | string,
    tokenPrice: number
  ) => {
    const supabaseClient = createBrowserClient();

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-tx`, {
        fromAddress: portfolio?.wallet,
        toAddress: toAddress,
        amount: amount,
        tokenAddress: fromAsset?.address,
        tokenDecimals: fromAsset?.decimals
      });
      if (toAddress !== portfolio?.wallet) {
        await supabaseClient.from('transactions').insert({
          // @ts-ignore
          created_at: new Date().toISOString(),
          user_id: '',
          token_name: fromAsset?.name,
          token_address: fromAsset?.address,
          token_amount: amount,
          token_price: `${tokenPrice ?? 0}`,
          transaction_type: 'sell'
        });
      }
      snackbar('success', `Withdrawal succeeded!`);
      handleClose();
    } catch (err: any) {
      snackbar(
        'error',
        err?.response?.data?.errorMessage ||
          `Something went wrong, please try again.`
      );
      throw err;
    }
  };

  const handleConfirmWithdraw = async (
    toAddress: string,
    amount: number | string,
    tokenPrice: number,
    symbol: string
  ) => {
    toast.promise(withdrawMutation(toAddress, amount, tokenPrice), {
      loading: `Withdrawing ${amount} ${symbol} to ${tokenAddressWithDots(
        toAddress
      )}`,
      className: 'snackbar-promise',
      position: 'top-center'
    });
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
