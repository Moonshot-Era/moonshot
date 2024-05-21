'use client';

import { FC, ReactNode } from 'react';
import { Theme } from '@radix-ui/themes';
import { Sheet } from 'react-modal-sheet';

import './style.scss';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  children: ReactNode;
  snapPoints?: number[];
  initialSnap?: number;
  detent?: 'content-height' | 'full-height';
}

export const SheetDrawer: FC<Props> = ({
  isOpen,
  handleClose,
  children,
  detent,
  initialSnap,
  snapPoints,
}) => (
  <Sheet
    isOpen={isOpen}
    detent={detent}
    snapPoints={snapPoints}
    initialSnap={initialSnap}
    style={{
      display: 'flex',
      justifyContent: 'center',
    }}
    onClose={handleClose}
  >
    <Sheet.Container
      className="bg-yellow-1"
      style={{
        maxWidth: '390px',
        left: 'auto',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
      }}
    >
      <Sheet.Header />
      <Sheet.Content>
        <Theme>{children}</Theme>
      </Sheet.Content>
    </Sheet.Container>
    <Sheet.Backdrop />
  </Sheet>
);
