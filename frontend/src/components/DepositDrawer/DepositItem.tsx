'use client';

import { Box, Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Button, QrCodeImage } from '@/legos';
import { copyToClipboard } from '@/helpers/helpers';
import { WalletPortfolioAssetType } from '@/services/birdeye/getWalletPortfolio';

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
        <Flex direction="row" align="center" justify="center" gap="2">
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
    <Box className="deposit-info-card" py="2" px="4" mb="9">
      <Text size="1" weight="medium">
        Only deposit MICHI from the Solana network. Deposits of other assets or
        from other networks will be lost.
      </Text>
    </Box>
  </Flex>
);
