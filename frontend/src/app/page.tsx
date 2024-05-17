'use server';

import { Flex, Text } from '@radix-ui/themes';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/supabase/server';

import AuthButton from '../components/AuthButton';
import { SplashScreen } from '@/components/SplashScreen/SplashScreen';

import {
  Badge,
  BadgeSecond,
  Button,
  Icon,
  Input,
  NavButton,
  TokenCard,
} from '@/legos';
import { Test } from '@/components/Test';
import { cookies } from 'next/headers';

export default async function Index() {
  const supabaseClient = createServerClient();

  const user = (await supabaseClient.auth.getSession()).data.session?.user;

  // if (!user) {
  //   redirect('/login');
  // }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <AuthButton />
        </div>
      </nav>
      <Flex mt="3" direction="column" gap="4" width="100%" maxWidth="300px">
        <Test oidc={cookies().get('gc')?.value || ''} />
      </Flex>
      <Flex
        gap="2"
        justify="center"
        position="fixed"
        bottom="50px"
        left="0"
        right="0"
      >
        <NavButton>
          <Icon icon="home" width={16} />
          <Text size="1">Home</Text>
        </NavButton>
        <NavButton>
          <Icon icon="search" width={16} />
          <Text size="1">Explore</Text>
        </NavButton>
        <NavButton>
          <Icon icon="settings" width={16} />
          <Text size="1">Settings</Text>
        </NavButton>
      </Flex>

      <SplashScreen />
    </div>
  );
}
