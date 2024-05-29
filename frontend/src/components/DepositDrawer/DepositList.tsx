'use client';

import { FC } from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Icon } from '@/legos';

interface Props {
  toggleTransfer: () => void;
  handleClose(): void;
  walletAddress: string;
}

export const DepositList: FC<Props> = ({
  toggleTransfer,
  handleClose,
  walletAddress,
}) => {
  const formConfiguration = {
    apiKey: process.env.SHIFT4_API_KEY!,
    walletAddress
  };
  // const handleShowShift4Form =
  //   // @ts-ignore
  //   Shift4CryptoSDK.createForm(formConfiguration).append();

  // const handleDepositWithShift4 = () => {
  //   handleClose();
  //   handleShowShift4Form.show();
  // };

  return (
    <Flex width="100%" direction="column" align="center" gap="4" px="4" pb="6">
      <Text size="4" weight="bold">
        Deposit
      </Text>
      {/* <Flex
        width="100%"
        direction="row"
        py="4"
        px="3"
        gap="4"
        className="deposit-transfer-card-bank"
      >
        <Icon icon="shift4" />
        <Flex
          direction="column"
          justify="between"
          onClick={handleDepositWithShift4}
        >
          <Text size="3" weight="medium">
            Shift4
          </Text>
          <Text>Card or bank transfer</Text>
        </Flex>
      </Flex> */}
      <Flex
        width="100%"
        direction="row"
        py="4"
        px="3"
        gap="4"
        className="deposit-transfer-card-bank"
      >
        <Icon icon="wallet" size={48} />
        <Flex direction="column" justify="between" onClick={toggleTransfer}>
          <Text size="3" weight="medium">
            Your wallet
          </Text>
          <Text>
            {walletAddress.slice(0, 8)}...
            {walletAddress.slice(
              walletAddress.length - 8 > 0 ? walletAddress.length - 8 : 0,
              walletAddress.length
            )}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
