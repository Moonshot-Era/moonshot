"use client";

import { Flex, Text } from "@radix-ui/themes";

import { IconButton } from "@/legos";
import { MutableRefObject, useRef, useState } from 'react';
import { ConvertDrawer } from '../ConvertDrawer/ConvertDrawer';
import { DepositDrawer } from '../DepositDrawer/DepositDrawer';
import { WithdrawDrawer } from '../WithdrawDrawer/WithdrawDrawer';
import { ShareModal } from '../ShareModal/ShareModal';
import { WalletPortfolioNormilizedType } from '@/services/birdeye/getWalletPortfolio';

interface ToolbarProps {
  portfolio: WalletPortfolioNormilizedType;
  withShare?: boolean;
}

export const Toolbar = ({ withShare, portfolio }: ToolbarProps) => {
  const convertDrawerRef: MutableRefObject<null> = useRef(null);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const toggleDepositDrawer = () => setIsDepositOpen(!isDepositOpen);
  const toggleWithdrawDrawer = () => setIsWithdrawOpen(!isWithdrawOpen);

  return (
    <>
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
        {!!portfolio?.totalUsd && (
          <Flex direction="column" align="center" gap="1">
            <IconButton
              icon="transfer"
              className="bg-yellow"
              onClick={() => convertDrawerRef.current?.open()}
            />
            <Text size="2">Convert</Text>
          </Flex>
        )}
        <Flex direction="column" align="center" gap="1">
          <IconButton
            icon="deposit"
            className="bg-magenta"
            onClick={toggleDepositDrawer}
          />
          <Text size="2">Deposit</Text>
        </Flex>
        {!!portfolio?.totalUsd && (
          <Flex direction="column" align="center" gap="1">
            <IconButton
              icon="withdraw"
              className="bg-violet"
              onClick={toggleWithdrawDrawer}
            />
            <Text size="2">Withdraw</Text>
          </Flex>
        )}
        {withShare ? <ShareModal /> : null}
      </Flex>
    </>
  );
};
