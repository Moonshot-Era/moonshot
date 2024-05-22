'use client';

import { Flex, Text } from '@radix-ui/themes';

import { IconButton } from '@/legos';
import { useRef, useState } from 'react';
import { ConvertDrawer } from '../ConvertDrawer/ConvertDrawer';
import { DepositDrawer } from '../DepositDrawer/DepositDrawer';
import { WithdrawDrawer } from '../WithdrawDrawer/WithdrawDrawer';

interface ToolbarProps {
  withShare?: boolean;
}

export const Toolbar = ({ withShare }: ToolbarProps) => {
  const convertDrawerRef = useRef(null);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const toggleDepositDrawer = () => setIsDepositOpen(!isDepositOpen);
  const toggleWithdrawDrawer = () => setIsWithdrawOpen(!isWithdrawOpen);
  return (
    <>
      <ConvertDrawer ref={convertDrawerRef} />
      <DepositDrawer isOpen={isDepositOpen} toggleOpen={toggleDepositDrawer} />
      <WithdrawDrawer
        isOpen={isWithdrawOpen}
        toggleOpen={toggleWithdrawDrawer}
      />
      <Flex width="100%" direction="row" justify="between" px="43px" mb="8">
        <Flex direction="column" align="center" gap="1">
          <IconButton
            icon="transfer"
            className="bg-yellow"
            onClick={() => convertDrawerRef.current?.open()}
          />
          <Text size="2">Convert</Text>
        </Flex>
        <Flex direction="column" align="center" gap="1">
          <IconButton
            icon="deposit"
            className="bg-magenta"
            onClick={toggleDepositDrawer}
          />
          <Text size="2">Deposit</Text>
        </Flex>
        <Flex direction="column" align="center" gap="1">
          <IconButton
            icon="withdraw"
            className="bg-violet"
            onClick={toggleWithdrawDrawer}
          />
          <Text size="2">Withdraw</Text>
        </Flex>
        {withShare ? (
          <Flex direction="column" align="center" gap="1">
            <IconButton
              icon="search"
              className="bg-violet"
              onClick={toggleWithdrawDrawer}
            />
            <Text size="2">Share</Text>
          </Flex>
        ) : null}
      </Flex>
    </>
  );
};
