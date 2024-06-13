'use client';

import { Dialog, Flex, Text } from '@radix-ui/themes';
import { MutableRefObject, useRef, useState } from 'react';

import { useWidth } from '@/hooks/useWidth';
import { IconButton } from '@/legos';
import { WalletPortfolioNormilizedType } from '@/services/helius/getWalletPortfolio';
import { ConvertDrawer } from '../ConvertDrawer/ConvertDrawer';
import { DepositDrawer } from '../DepositDrawer/DepositDrawer';
import { ShareModal } from '../ShareModal/ShareModal';
import { WithdrawDrawer } from '../WithdrawDrawer/WithdrawDrawer';

interface ToolbarProps {
  portfolio: WalletPortfolioNormilizedType;
  withShare?: boolean;
  tokenPrice?: number;
  hasWalletAddress?: boolean;
}

export const Toolbar = ({
  withShare,
  portfolio,
  tokenPrice,
  hasWalletAddress
}: ToolbarProps) => {
  const { mdScreen } = useWidth();

  const convertDrawerRef: MutableRefObject<null> = useRef(null);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const toggleDepositDrawer = () => setIsDepositOpen(!isDepositOpen);
  const toggleWithdrawDrawer = () => setIsWithdrawOpen(!isWithdrawOpen);

  return (
    <>
      {/* @ts-ignore */}
      <ConvertDrawer ref={convertDrawerRef} portfolio={portfolio} />
      <DepositDrawer
        isOpen={isDepositOpen}
        toggleOpen={toggleDepositDrawer}
        walletAddress={portfolio?.wallet}
      />
      <WithdrawDrawer
        isOpen={isWithdrawOpen}
        toggleOpen={toggleWithdrawDrawer}
        portfolio={portfolio}
      />
      <Flex
        width="100%"
        maxWidth="390px"
        direction="row"
        justify={portfolio?.totalUsd ? 'between' : 'center'}
        gap="2"
        mb="8"
        px={withShare ? '5' : '7'}
      >
        <Flex direction="column" align="center" gap="1">
          <IconButton
            icon="transfer"
            className="bg-yellow"
            // @ts-ignore
            onClick={() => convertDrawerRef.current?.open()}
          />
          <Text size={mdScreen ? '4' : '2'}>Convert</Text>
        </Flex>
        <Flex direction="column" align="center" gap="1">
          <IconButton
            icon="deposit"
            className="bg-magenta"
            onClick={toggleDepositDrawer}
          />
          <Text size={mdScreen ? '4' : '2'}>Deposit</Text>
        </Flex>
        {hasWalletAddress && (
          <Flex direction="column" align="center" gap="1">
            <IconButton
              icon="withdraw"
              className="bg-violet"
              onClick={toggleWithdrawDrawer}
            />
            <Text size={mdScreen ? '4' : '2'}>Withdraw</Text>
          </Flex>
        )}
        {withShare && tokenPrice ? (
          <Dialog.Root open={isShareOpen} onOpenChange={setIsShareOpen}>
            <Dialog.Trigger>
              <Flex direction="column" align="center" gap="1">
                <IconButton icon="share" className="bg-blue" />
                <Text size={mdScreen ? '4' : '2'}>Share</Text>
              </Flex>
            </Dialog.Trigger>
            {isShareOpen && <ShareModal tokenPrice={tokenPrice} />}
          </Dialog.Root>
        ) : null}
      </Flex>
    </>
  );
};
