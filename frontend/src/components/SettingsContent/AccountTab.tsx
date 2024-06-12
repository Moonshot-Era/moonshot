'use client';

import { FC } from 'react';
import Image from 'next/image';
import { Box, Flex, Text } from '@radix-ui/themes';
import { createBrowserClient } from '@/supabase/client';

import './style.scss';
import { Button, Icon } from '@/legos';
import { useWidth } from '@/hooks/useWidth';
import userIcon from '../../assets/images/user-icon.png';

interface Props {
  handleActiveTab: (
    tab: 'account' | 'recent' | 'export' | 'logout' | null
  ) => void;
}

export const AccountTab: FC<Props> = ({ handleActiveTab }) => {
  // const supabaseClient = createBrowserClient();
  // const { data } = supabaseClient.auth.getSession();

  // const userId = data.session?.user?.id;

  // if (userId) {
  //   await supabaseClient
  //     .from('profiles')
  //     .update({
  //       onboarding_completed: true
  //     })
  //     .eq('user_id', userId);

  //   route.replace(ROUTES.home);
  // }
  const { mdScreen } = useWidth();

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
        <Text size={mdScreen ? '6' : '4'} weight="bold">
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
        <Text size={mdScreen ? '4' : '2'} weight="medium">
          Edit photo
        </Text>
      </Button>
      <Flex
        width="100%"
        direction="row"
        align="center"
        justify="center"
        py="3"
        px="3"
        className="settings-account-notifications"
      >
        <button
          className="progressier-subscribe-button"
          data-icons="true"
          data-eligible="Get notifications"
          data-subscribed="Notifications enabled"
          data-blocked="Notifications blocked"
        ></button>
      </Flex>
    </Flex>
  );
};
