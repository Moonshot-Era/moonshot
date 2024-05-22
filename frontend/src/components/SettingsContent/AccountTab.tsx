'use client';

import { FC } from 'react';
import Image from 'next/image';
import { Box, Flex, Switch, Text } from '@radix-ui/themes';

import './style.scss';
import userIcon from '../../assets/images/user-icon.png';

import { Button, Icon } from '@/legos';

interface Props {
  handleActiveTab: (
    tab: 'account' | 'recent' | 'export' | 'logout' | null
  ) => void;
}

export const AccountTab: FC<Props> = ({ handleActiveTab }) => (
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
        Account
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
    <Box mb="2">
      <Image alt="user-photo" src={userIcon} width={80} height={80} />
    </Box>
    <Button className="settings-account-button">
      <Text size="2" weight="medium">
        Edit photo
      </Text>
    </Button>
    <Flex
      width="100%"
      direction="row"
      align="center"
      justify="between"
      py="3"
      px="3"
      className="settings-account-notifications"
    >
      <Text size="3" weight="medium">
        Notifications
      </Text>
      <Switch
        size="3"
        defaultChecked
        color="green"
        className="settings-account-switch"
      />
    </Flex>
  </Flex>
);
