'use client';

import { FC, useState } from 'react';
import { Box, Checkbox, Flex, Text } from '@radix-ui/themes';

import './style.scss';

import { Button, Icon } from '@/legos';

interface Props {
  handleActiveTab: (
    tab: 'account' | 'recent' | 'export' | 'logout' | null
  ) => void;
}

export const ExportKeyTab: FC<Props> = ({ handleActiveTab }) => {
  const [checked, setChecked] = useState(false);

  const toggleChecked = () => setChecked(!checked);

  return (
    <Flex width="100%" direction="column" align="center">
      <Flex
        position="relative"
        width="100%"
        justify="center"
        align="center"
        direction="row"
        mb="6"
      >
        <Text size="4" weight="bold">
          Export private key
        </Text>
        <Box
          position="absolute"
          left="0"
          className="settings-icon-arrow"
          onClick={() => handleActiveTab(null)}
        >
          <Icon icon="arrowRight" />
        </Box>
      </Flex>
      <Flex
        width="100%"
        direction="column"
        align="center"
        p="4"
        mb="24px"
        className="setting-export-card"
      >
        <Box mb="4">
          <Icon icon="alertTriangle" width={64} height={64} />
        </Box>
        <Text
          size="2"
          mb="6"
          mx="2"
          align="center"
          className="setting-export-card-title"
        >
          Handle with utmost care. Store securely offline, never share, and
          remember, loss of key equals loss of funds.
        </Text>
        <Text size="2" weight="bold" className="setting-export-card-subtitle">
          You are solely responsible for its safety.
        </Text>
      </Flex>
      <Flex
        width="100%"
        direction="row"
        align="center"
        gap="2"
        py="2"
        pl="4"
        pr="7"
        mb="24px"
        className="setting-export-checkbox-card"
      >
        <Checkbox
          size="1"
          checked={checked}
          className="settings-export-checkbox"
          onClick={toggleChecked}
        />
        <Text size="2">
          I understand that I am solely responsible for my private key’s
          security.
        </Text>
      </Flex>
      <Button disabled={!checked} className="settings-export-button">
        <Text size="2" weight="medium">
          Continue
        </Text>
      </Button>
    </Flex>
  );
};
