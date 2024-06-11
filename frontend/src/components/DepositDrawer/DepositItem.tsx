'use client';

import { Box, Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { useWidth } from '@/hooks/useWidth';
import { Button, QrCodeImage } from '@/legos';
import { copyToClipboard } from '@/helpers/helpers';

export const DepositItem = ({ walletAddress }: { walletAddress: string }) => {
  const { mdScreen } = useWidth();

  return (
    <Flex width="100%" direction="column" align="center" px="4" pb="6" gap="6">
      <Text size={mdScreen ? '5' : '4'} weight="bold">
        {`Deposit to wallet`}
      </Text>
      <Text size={mdScreen ? '4' : '3'} weight="medium">
        Solana network
      </Text>
      {walletAddress && (
        <>
          <QrCodeImage value={walletAddress} maxWidth={144} />
          <Flex direction="row" align="center" justify="center" gap="2">
            <Text wrap="nowrap" size={mdScreen ? '4' : '3'} weight="medium">
              {walletAddress.slice(0, 8)}...
              {walletAddress.slice(
                walletAddress.length - 8 > 0 ? walletAddress.length - 8 : 0,
                walletAddress.length
              )}
            </Text>

            <Button
              className="deposit-copy-button bg-magenta"
              onClick={() => copyToClipboard(walletAddress)}
            >
              <Text size={mdScreen ? '3' : '2'} weight="medium">
                Copy
              </Text>
            </Button>
          </Flex>
        </>
      )}
      <Box className="deposit-info-card" py="2" px="4" mb="9">
        <Text size={mdScreen ? '3' : '1'} weight="medium">
          Only deposit MICHI from the Solana network. Deposits of other assets
          or from other networks will be lost.
        </Text>
      </Box>
    </Flex>
  );
};
