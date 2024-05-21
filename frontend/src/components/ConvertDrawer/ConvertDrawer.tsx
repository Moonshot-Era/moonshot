'use client';

import { FC, useState } from 'react';

import './style.scss';
import { SheetDrawer } from '@/legos';
import { ConvertList } from './ConvertList';
import { ConvertItem } from './ConvertItem';

interface Props {
  isOpen: boolean;
  toggleOpen: () => void;
}

export const ConvertDrawer: FC<Props> = ({ isOpen, toggleOpen }) => {
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
        snapPoints={[800, 420]}
        initialSnap={1}
      >
        <ConvertList toggleTransfer={toggleTransfer} />
      </SheetDrawer>
      <SheetDrawer
        isOpen={isOpen && isTransfer}
        detent="content-height"
        handleClose={handleClose}
      >
        <ConvertItem />
      </SheetDrawer>
    </>
  );
};
