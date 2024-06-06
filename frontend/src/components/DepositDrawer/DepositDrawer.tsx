'use client';

import { FC, useState } from 'react';

import './style.scss';
import { SheetDrawer } from '@/legos';
import { DepositList } from './DepositList';
import { DepositItem } from './DepositItem';

interface Props {
  isOpen: boolean;
  toggleOpen: () => void;
  walletAddress: string;
}

export const DepositDrawer: FC<Props> = ({
  isOpen,
  toggleOpen,
  walletAddress,
}) => {
  const [isTransfer, setIsTransfer] = useState(false);

  const toggleTransfer = () => {
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
          walletAddress={walletAddress}
        />
      </SheetDrawer>
      <SheetDrawer
        isOpen={isOpen && isTransfer}
        detent="content-height"
        handleClose={handleClose}
      >
        <DepositItem walletAddress={walletAddress} />
      </SheetDrawer>
    </>
  );
};
