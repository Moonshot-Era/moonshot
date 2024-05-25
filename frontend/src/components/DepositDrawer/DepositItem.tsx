'use client';

import Image from 'next/image';
import { Box, Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Button, QrCodeImage } from '@/legos';
import { copyToClipboard } from '@/helpers/helpers';
import qrCode from '../../assets/images/qr-code.png';
import { WalletPortfolioAssetType } from '@/services/birdeye/getWalletPortfolio';

const MIN_DEPOSIT = '10,000 MICHI';
const PROCESSING_TIME = '< 1 minute';

export const DepositItem = ({ token }: { token: WalletPortfolioAssetType }) => (
  <Flex width="100%" direction="column" align="center" px="4" pb="6" gap="6">
    <Text size="4" weight="bold">
      {`Deposit ${token?.symbol}`}
    </Text>
    <Text size="3" weight="medium">
      Solana network
    </Text>
    {token?.address && (
      <>
        <QrCodeImage value={token.address} maxWidth={144} />
        <Flex
          width="100%"
          direction="row"
          align="center"
          justify="center"
          gap="2"
        >
          <Text wrap="nowrap" size="3" weight="medium">
            {token.address.slice(0, 8)}...
            {token.address.slice(
              token.address.length - 8 > 0 ? token.address.length - 8 : 0,
              token.address.length
            )}
          </Text>

          <Button
            className="deposit-copy-button bg-magenta"
            onClick={() => copyToClipboard(token?.address)}
          >
            <Text size="2" weight="medium">
              Copy
            </Text>
          </Button>
        </Flex>
      </>
    )}
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
          {PROCESSING_TIME}
        </Text>
      </Flex>
      <Flex direction="row" justify="between">
        <Text size="1">Minimum deposit</Text>
        <Text size="1" weight="medium">
          {MIN_DEPOSIT}
        </Text>
      </Flex>
    </Flex>
  </Flex>
);
