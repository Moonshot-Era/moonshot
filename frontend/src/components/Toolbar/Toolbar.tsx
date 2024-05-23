'use client';

import { Flex, Text } from '@radix-ui/themes';

import { IconButton } from '@/legos';
import { useState } from 'react';
import { ConvertDrawer } from '../ConvertDrawer/ConvertDrawer';
import { DepositDrawer } from '../DepositDrawer/DepositDrawer';
import { WithdrawDrawer } from '../WithdrawDrawer/WithdrawDrawer';
import { ShareModal } from '../ShareModal/ShareModal';
import { WalletPortfolioAssetType } from '@/services/birdeye/getWalletPortfolio';

interface ToolbarProps {
  walletAssets: WalletPortfolioAssetType[];
  withShare?: boolean;
}

export const Toolbar = ({ withShare, walletAssets }: ToolbarProps) => {
  const [isConvertOpen, setIsConvertOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const toggleConvertDrawer = () => setIsConvertOpen(!isConvertOpen);
  const toggleDepositDrawer = () => setIsDepositOpen(!isDepositOpen);
  const toggleWithdrawDrawer = () => setIsWithdrawOpen(!isWithdrawOpen);
  return (
    <>
      <ConvertDrawer isOpen={isConvertOpen} toggleOpen={toggleConvertDrawer} />
      <DepositDrawer isOpen={isDepositOpen} toggleOpen={toggleDepositDrawer} />
      <WithdrawDrawer
        isOpen={isWithdrawOpen}
        toggleOpen={toggleWithdrawDrawer}
        walletAssets={walletAssets}
      />
      <Flex
        width="100%"
        maxWidth="390px"
        direction="row"
        justify="between"
        gap="2"
        mb="8"
        px={withShare ? '5' : '7'}
      >
        <Flex direction="column" align="center" gap="1">
          <IconButton
            icon="transfer"
            className="bg-yellow"
            onClick={toggleConvertDrawer}
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
        {withShare ? <ShareModal /> : null}
      </Flex>
    </>
  );
};
