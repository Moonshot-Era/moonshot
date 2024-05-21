'use client';

import { FC, useState } from 'react';

import './style.scss';
import { SheetDrawer } from '@/legos';
import { WithdrawList } from './WithdrawList';
import { WithdrawItem } from './WithdrawItem';

const mockWithdrawData = {
  currencyName: 'MICHI',
  wallet: '5CxsB1BH...3whqAKYa',
  processingTime: '< 1 minute',
  minDeposit: '10,000 MICHI',
  balance: 435,
};

interface Props {
  isOpen: boolean;
  toggleOpen: () => void;
}

export const WithdrawDrawer: FC<Props> = ({ isOpen, toggleOpen }) => {
  const [isTransfer, setIsTransfer] = useState(false);

  const toggleTransfer = () => setIsTransfer(!isTransfer);

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
        <WithdrawList toggleTransfer={toggleTransfer} />
      </SheetDrawer>
      <SheetDrawer
        isOpen={isOpen && isTransfer}
        detent="content-height"
        handleClose={handleClose}
      >
        <WithdrawItem />
      </SheetDrawer>
    </>
  );
};
