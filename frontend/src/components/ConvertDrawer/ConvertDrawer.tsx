'use client';

import { Box, Flex, Text, Theme } from '@radix-ui/themes';

import './style.scss';
import { Icon, Input, Select, SlideButton, TokenCard } from '@/legos';

const mockBalance = 123831;

const formatBalance = formatNumber(mockBalance);

interface Props {
  isOpen: boolean;
  toggleOpen: () => void;
}

import { Sheet } from 'react-modal-sheet';
import { FC, useState } from 'react';
import { formatNumber } from '@/helpers/helpers';

export const ConvertDrawer: FC<Props> = ({ isOpen, toggleOpen }) => {
  const [isTransfer, setIsTransfer] = useState(false);

  const toggleTransfer = () => setIsTransfer(!isTransfer);

  const handleClose = () => {
    setIsTransfer(false);
    toggleOpen();
  };
  return (
    <Sheet
      isOpen={isOpen}
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
            {!isTransfer ? (
              <Flex
                width="100%"
                direction="column"
                align="center"
                gap="4"
                px="4"
                pb="6"
              >
                <Text size="4" weight="bold">
                  Convert
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
            ) : (
              <Flex
                width="100%"
                direction="column"
                align="center"
                px="4"
                pb="6"
                gap="5"
              >
                <Text size="4" weight="bold">
                  Convert MICHI to USDC
                </Text>
                <Flex
                  width="100%"
                  justify="between"
                  py="3"
                  px="4"
                  className="bg-yellow transfer-card"
                >
                  <Flex direction="column" justify="between" gap="1">
                    <Text size="5" weight="bold">
                      {formatBalance[0]}
                    </Text>
                    <Text size="1">{`Available: 3,210,563`}</Text>
                  </Flex>
                  <Flex
                    direction="column"
                    justify="between"
                    align="end"
                    gap="1"
                  >
                    <Select
                      values={[
                        { id: 1, value: 'USDT' },
                        { id: 2, value: 'MICHI' },
                        { id: 3, value: 'BTC' },
                      ]}
                    />

                    <Text size="1" className="transfer-card-max">
                      Max
                    </Text>
                  </Flex>
                </Flex>
                <Box className="convert-icon-arrow">
                  <Icon icon="arrowRight" />
                </Box>
                <Flex
                  width="100%"
                  justify="between"
                  py="3"
                  px="4"
                  className="bg-yellow transfer-card"
                >
                  <Text size="5" weight="bold">
                    342,659
                  </Text>

                  <Select
                    defaultValue={2}
                    values={[
                      { id: 1, value: 'USDT' },
                      { id: 2, value: 'MICHI' },
                      { id: 3, value: 'BTC' },
                    ]}
                  />
                </Flex>
                <SlideButton />
              </Flex>
            )}
          </Theme>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop />
    </Sheet>
  );
};
