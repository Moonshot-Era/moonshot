import { Flex, Text } from '@radix-ui/themes';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/supabase/server';

import AuthButton from '../components/AuthButton';
import ConnectSupabaseSteps from '@/components/tutorial/ConnectSupabaseSteps';
import SignUpUserSteps from '@/components/tutorial/SignUpUserSteps';
import Header from '@/components/Header';

import {
  Badge,
  BadgeSecond,
  Button,
  Icon,
  IconButton,
  Input,
  NavButton,
  SlideButton,
  TokenCard,
} from '@/legos';

export default async function Index() {
  const supabaseClient = createServerClient();

  const user = (await supabaseClient.auth.getSession()).data.session?.user;

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Flex direction="column" gap="4" width="100%" maxWidth="300px">
        <Flex m="7" gap="2">
          <NavButton>
            <Icon icon="home" width={16} />
            <Text size="1">Home</Text>
          </NavButton>
          <NavButton>
            <Icon icon="explore" width={16} />
            <Text size="1">Explore</Text>
          </NavButton>
          <NavButton>
            <Icon icon="settings" width={16} />
            <Text size="1">Settings</Text>
          </NavButton>
        </Flex>
        <IconButton className="box-shadow-second bg-magenta">
          <Icon icon="deposit" width={24} />
        </IconButton>
        <IconButton className="box-shadow-second bg-yellow">
          <Icon icon="convert" width={24} />
        </IconButton>
        <IconButton className="box-shadow-second bg-violet">
          <Icon icon="withdraw" width={24} />
        </IconButton>
        <IconButton className="box-shadow-second bg-blue">
          <Icon icon="share" width={24} />
        </IconButton>

        <IconButton className="box-shadow">
          <Icon icon="google" width={24} />
        </IconButton>
        <IconButton className="box-shadow">
          <Icon icon="apple" width={24} />
        </IconButton>

        <Button>
          <Icon icon="google" width={24} />
          <Text size="2" weight="medium">
            Sign in with Google
          </Text>
        </Button>
        <Button>
          <Icon icon="apple" width={24} />
          <Text size="2" weight="medium">
            Sign in with Apple
          </Text>
        </Button>
        <Badge percent={2.7} total={9578.45} />
        <Badge percent={2.7} total={-9578.45} />
        <BadgeSecond percent={2.7} total={9578.45} />
        <BadgeSecond percent={2.7} total={-9578.45} />
        <TokenCard
          name="jeo boden"
          currencyType="baseStatus"
          percent={2.7}
          total={21938}
          description="43,453 BODEN"
        />
        <TokenCard
          name="jeo boden"
          currencyType="solana"
          percent={2.7}
          total={-21938}
          description="43,453 BODEN"
          isLabel
        />
        <Input label="Email" error errorText="Error text" />
        <SlideButton></SlideButton>
      </Flex>

      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <AuthButton />
        </div>
      </nav>

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <Header />
        <main className="flex-1 flex flex-col gap-6">
          <h2 className="font-bold text-4xl mb-4">Next steps</h2>
          <ConnectSupabaseSteps />
        </main>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Powered by
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
      </footer>
    </div>
  );
}
