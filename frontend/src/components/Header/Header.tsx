'use client';

import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Icon, NavButton } from '@/legos';
import { usePathname, useRouter } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isVisible =
    pathname === '/' || pathname === '/explore' || pathname === '/settings';

  return (
    <>
      {isVisible ? (
        <header className="bg-white">
          <nav>
            <Flex
              width="100%"
              justify="between"
              gap="2"
              maxWidth="430px"
              m="auto"
            >
              <NavButton
                className={pathname === '/' ? 'nav-button-active' : ''}
                onClick={() => router.push('/')}
              >
                <Icon icon="home" width={16} />
                <Text size="1">Home</Text>
              </NavButton>
              <NavButton
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
      ) : null}
    </>
  );
};
