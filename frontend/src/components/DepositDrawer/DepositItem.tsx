'use client';

import Image from 'next/image';
import { Box, Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Button } from '@/legos';
import { copyToClipboard } from '@/helpers/helpers';
import qrCode from '../../assets/images/qr-code.png';

const mockDepositData = {
  currencyName: 'MICHI',
  wallet: '5CxsB1BH...3whqAKYa',
  processingTime: '< 1 minute',
  minDeposit: '10,000 MICHI',
};

export const DepositItem = () => (
  <Flex width="100%" direction="column" align="center" px="4" pb="6" gap="6">
    <Text size="4" weight="bold">
      {`Deposit ${mockDepositData.currencyName}`}
    </Text>
    <Text size="3" weight="medium">
      Solana network
    </Text>
    <Image alt="qr-code" src={qrCode} />
    <Flex width="100%" direction="row" align="center" justify="center" gap="2">
      <Text wrap="nowrap" size="3" weight="medium">
        {mockDepositData.wallet}
      </Text>

      <Button
        className="deposit-copy-button bg-magenta"
        onClick={() => copyToClipboard('copy text')}
      >
        <Text size="2" weight="medium">
          Copy
        </Text>
      </Button>
    </Flex>
    <Box py="2" px="4" className="deposit-info-card">
      <Text size="1" weight="medium">
        Only deposit MICHI from the Solana network. Deposits of other assets or
        from other networks will be lost.
      </Text>
    </Box>
    <Flex width="100%" direction="column">
      <Flex direction="row" justify="between">
        <Text size="1">Processing time</Text>
        <Text size="1" weight="medium">
          {mockDepositData.processingTime}
        </Text>
      </Flex>
      <Flex direction="row" justify="between">
        <Text size="1">Minimum deposit</Text>
        <Text size="1" weight="medium">
          {mockDepositData.minDeposit}
        </Text>
      </Flex>
    </Flex>
  </Flex>
);
