'use client';

import Link from 'next/link';
import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Icon, NavButton } from '@/legos';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="bg-white">
      <nav>
        <Flex width="100%" justify="between" gap="2">
          <Link href="/">
            <NavButton className={pathname === '/' ? 'nav-button-active' : ''}>
              <Icon icon="home" width={16} />
              <Text size="1">Home</Text>
            </NavButton>
          </Link>
          <Link href="/explore">
            <NavButton
              disabled
              className={pathname === '/explore' ? 'nav-button-active' : ''}
            >
              <Icon icon="search" width={16} />
              <Text size="1">Explore</Text>
            </NavButton>
          </Link>
          <Link href="/settings">
            <NavButton
              disabled
              className={pathname === '/settings' ? 'nav-button-active' : ''}
            >
              <Icon icon="settings" width={16} />
              <Text size="1">Settings</Text>
            </NavButton>
          </Link>
        </Flex>
      </nav>
    </header>
  );
};
