'use client';

import Image from 'next/image';
import { FC, useState } from 'react';
import { Sheet } from 'react-modal-sheet';
import { Box, Flex, Text, Theme } from '@radix-ui/themes';

import './style.scss';
import { copyToClipboard } from '@/helpers/helpers';
import qrCode from '../../assets/images/qr-code.png';
import { Button, Icon, Input, TokenCard } from '@/legos';

const mockDepositData = {
  currencyName: 'MICHI',
  wallet: '5CxsB1BH...3whqAKYa',
  processingTime: '< 1 minute',
  minDeposit: '10,000 MICHI',
};

interface Props {
  isOpen: boolean;
  toggleOpen: () => void;
}

export const DepositDrawer: FC<Props> = ({ isOpen, toggleOpen }) => {
  const [isTransfer, setIsTransfer] = useState(false);

  const toggleTransfer = () => setIsTransfer(!isTransfer);

  const handleClose = () => {
    setIsTransfer(false);
    toggleOpen();
  };
  return (
    <>
      <Sheet
        isOpen={isOpen && !isTransfer}
        snapPoints={[800, 540]}
        initialSnap={1}
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
        onClose={handleClose}
      >
        <Sheet.Container
          className="bg-yellow-1"
          style={{
            maxWidth: '390px',
            left: 'auto',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
          }}
        >
          <Sheet.Header />
          <Sheet.Content>
            <Theme>
              <Flex
                width="100%"
                direction="column"
                align="center"
                gap="4"
                px="4"
                pb="6"
              >
                <Text size="4" weight="bold">
                  Deposit
                </Text>
                <Flex
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
                    onClick={toggleTransfer}
                  >
                    <Text size="3" weight="medium">
                      Shift4
                    </Text>
                    <Text>Card or bank transfer</Text>
                  </Flex>
                </Flex>
                <Box
                  width="100%"
                  className="deposit-transfer-card-bank-border"
                />
                <Input placeholder="Search assets" icon="search" />
                <Flex width="100%" direction="column" gap="4">
                  <TokenCard
                    name="jeo boden"
                    currencyType="baseStatus"
                    percent={2.7}
                    total={21938}
                    description="43,453 BODEN"
                    handler={toggleTransfer}
                  />
                  <TokenCard
                    name="jeo boden"
                    currencyType="baseStatus"
                    percent={2.7}
                    total={21938}
                    description="43,453 BODEN"
                    handler={toggleTransfer}
                  />
                  <TokenCard
                    name="jeo boden"
                    currencyType="baseStatus"
                    percent={2.7}
                    total={21938}
                    description="43,453 BODEN"
                    handler={toggleTransfer}
                  />
                </Flex>
              </Flex>
            </Theme>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
      <Sheet
        isOpen={isOpen && isTransfer}
        detent="content-height"
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
        onClose={handleClose}
      >
        <Sheet.Container
          className="bg-yellow-1"
          style={{
            maxWidth: '390px',
            left: 'auto',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
          }}
        >
          <Sheet.Header />
          <Sheet.Content>
            <Theme>
              <Flex
                width="100%"
                direction="column"
                align="center"
                px="4"
                pb="6"
                gap="6"
              >
                <Text size="4" weight="bold">
                  {`Deposit ${mockDepositData.currencyName}`}
                </Text>
                <Text size="3" weight="medium">
                  Solana network
                </Text>
                <Image alt="qr-code" src={qrCode} />
                <Flex
                  width="100%"
                  direction="row"
                  align="center"
                  justify="center"
                  gap="2"
                >
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
                    Only deposit MICHI from the Solana network. Deposits of
                    other assets or from other networks will be lost.
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
            </Theme>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </>
  );
};
