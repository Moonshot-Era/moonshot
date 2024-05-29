'use client';

import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Icon, NavButton } from '@/legos';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export const Header = () => {
  const pathname = usePathname();

  const isVisible =
    pathname === '/' ||
    pathname === '/explore' ||
    pathname === '/settings' ||
    pathname === '/culture' ||
    pathname.includes('public');

  return (
    <>
      {isVisible ? (
        <header className="bg-white">
          <nav>
            <Flex
              direction="row"
              justify={pathname.includes('public') ? 'center' : 'between'}
              width="100%"
              maxWidth="430px"
              m="auto"
            >
              {pathname.includes('public') ? (
                <>
                  <Link href="/login">
                    <Text className="text-link" color="blue">
                      Login to Moonshot
                    </Text>
                  </Link>
                  <Text style={{ paddingLeft: 4 }}>
                    to start trading culture
                  </Text>
                </>
              ) : (
                <>
                  <Link href="/">
                    <NavButton
                      className={pathname === '/' ? 'nav-button-active' : ''}
                    >
                      <Icon icon="home" width={16} />
                      <Text size="1">Home</Text>
                    </NavButton>
                  </Link>
                  <Link href="/explore">
                    <NavButton
                      className={
                        pathname === '/explore' ? 'nav-button-active' : ''
                      }
                    >
                      <Icon icon="search" width={16} />
                      <Text size="1">Explore</Text>
                    </NavButton>
                  </Link>
                  <Link href="/settings">
                    <NavButton
                      className={
                        pathname === '/settings' ? 'nav-button-active' : ''
                      }
                    >
                      <Icon icon="settings" width={16} />
                      <Text size="1">Settings</Text>
                    </NavButton>
                  </Link>
                </>
              )}
            </Flex>
          </nav>
        </header>
      ) : null}
    </>
  );
};
