'use client';

import { FC, useState } from 'react';
import { Sheet } from 'react-modal-sheet';
import { Box, Flex, Text, Theme } from '@radix-ui/themes';

import './style.scss';
import { Icon, Input, SlideButton, TokenCard } from '@/legos';

const mockWithdrawData = {
  currencyName: 'MICHI',
  wallet: '5CxsB1BH...3whqAKYa',
  processingTime: '< 1 minute',
  minDeposit: '10,000 MICHI',
  balance: 435,
};

interface Props {
  isOpen: boolean;
  toggleOpen: () => void;
}

export const WithdrawDrawer: FC<Props> = ({ isOpen, toggleOpen }) => {
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
        snapPoints={[800, 420]}
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
                  Withdraw
                </Text>

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
                  {`Withdraw ${mockWithdrawData.currencyName}`}
                </Text>
                <Flex
                  width="100%"
                  justify="center"
                  align="center"
                  position="relative"
                >
                  <Text size="7" weight="medium">
                    {`${mockWithdrawData.balance}$`}
                  </Text>
                  <Flex
                    direction="column"
                    align="center"
                    position="absolute"
                    right="0"
                  >
                    <Icon icon="switchHorizontal" />
                    <Text size="4" weight="medium">
                      {mockWithdrawData.currencyName}
                    </Text>
                  </Flex>
                </Flex>

                <Box
                  width="100%"
                  py="2"
                  pl="2"
                  pr="4"
                  className="withdraw-info-card"
                >
                  <Text size="1" weight="medium">
                    You need at least 1,000 MICHI to complete a withdrawal
                  </Text>
                </Box>
                <Input placeholder="Wallet address" />
                <SlideButton />
              </Flex>
            </Theme>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </>
  );
};
