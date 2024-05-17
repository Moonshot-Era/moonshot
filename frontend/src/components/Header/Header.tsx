'use client';

import Link from 'next/link';
import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Icon, NavButton } from '@/legos';
import { usePathname, useRouter } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="bg-white">
      <nav>
        <Flex width="100%" justify="between" gap="2">
          <Link href="/">
            <NavButton
              className={pathname === '/home-design' ? 'nav-button-active' : ''}
              onClick={() => router.push('/home-design')}
            >
              <Icon icon="home" width={16} />
              <Text size="1">Home</Text>
            </NavButton>
          </Link>
          <NavButton
            disabled
            className={pathname === '/explore' ? 'nav-button-active' : ''}
            onClick={() => router.push('/explore')}
          >
            <Icon icon="search" width={16} />
            <Text size="1">Explore</Text>
          </NavButton>
          <NavButton
            disabled
            className={pathname === '/settings' ? 'nav-button-active' : ''}
            onClick={() => router.push('/settings')}
          >
            <Icon icon="settings" width={16} />
            <Text size="1">Settings</Text>
          </NavButton>
        </Flex>
      </nav>
    </header>
  );
};
