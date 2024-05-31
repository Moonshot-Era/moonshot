'use client';

import { FC, ReactNode, useRef, useEffect } from 'react';
import { Theme } from '@radix-ui/themes';
import { Sheet } from 'react-modal-sheet';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  children: ReactNode;
  snapPoints?: number[];
  initialSnap?: number;
  detent?: 'content-height' | 'full-height';
  disableDrag?: boolean;
  onSnap?: (snapPoint: number) => void;
  onScroll?: (event: any) => Promise<void>;
  scrollToTop?: boolean;
  toggleScrollToTop?(): void;
}

export const SheetDrawer: FC<Props> = ({
  isOpen,
  handleClose,
  children,
  detent,
  initialSnap,
  snapPoints,
  disableDrag,
  onSnap,
  onScroll,
  scrollToTop,
  toggleScrollToTop
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;

    const handleScroll = (event: Event) => {
      if (onScroll) {
        onScroll(event);
      }
      if (scrollToTop && toggleScrollToTop) {
        scrollerRef?.current?.scroll({ top: 0, behavior: 'smooth' });
        toggleScrollToTop();
      }
    };

    if (scroller) {
      scroller.addEventListener('scroll', handleScroll);
      scroller.addEventListener('touchmove', handleScroll);
    }

    return () => {
      if (scroller) {
        scroller.removeEventListener('scroll', handleScroll);
        scroller.removeEventListener('touchmove', handleScroll);
      }
    };
  }, [onScroll, scrollToTop, toggleScrollToTop]);

  return (
    <Sheet
      isOpen={isOpen}
      detent={detent}
      snapPoints={snapPoints}
      initialSnap={initialSnap}
      style={{
        display: 'flex',
        justifyContent: 'center'
      }}
      onClose={handleClose}
      onSnap={onSnap}
      disableDrag={disableDrag}
    >
      <Sheet.Container
        className="bg-yellow-1"
        style={{
          maxWidth: '450px',
          left: 'auto',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px'
        }}
      >
        <Sheet.Header />
        <Sheet.Content>
          <Sheet.Scroller ref={scrollerRef} draggableAt="both">
            <Theme>{children}</Theme>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  );
};
