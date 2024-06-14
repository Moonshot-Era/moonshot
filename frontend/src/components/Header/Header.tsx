'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Icon, NavButton } from '@/legos';
import { useWidth } from '@/hooks/useWidth';

export const Header = ({ isPublic }: { isPublic?: boolean }) => {
  const pathname = usePathname();
  const { mdScreen } = useWidth();

  return (
    <header className="bg-white">
      <nav>
        <Flex
          direction="row"
          justify={isPublic ? 'center' : 'between'}
          width="100%"
          maxWidth="430px"
          m="auto"
        >
          {isPublic ? (
            <>
              <Link href="/login">
                <Text className="text-link" color="blue">
                  Login to Moonshot
                </Text>
              </Link>
              <Text style={{ paddingLeft: 4 }}>to start trading culture</Text>
            </>
          ) : (
            <>
              <Link href="/">
                <NavButton
                  className={`${mdScreen ? 'h-14' : 'h-10'} ${
                    pathname === '/' ? 'nav-button-active' : ''
                  }`}
                >
                  <Icon icon="home" width={16} />
                  <Text size={mdScreen ? '3' : '1'}>Home</Text>
                </NavButton>
              </Link>
              <Link href="/explore">
                <NavButton
                  className={`${mdScreen ? 'h-14' : 'h-10'} ${
                    pathname === '/explore' || pathname.includes('/culture')
                      ? 'nav-button-active'
                      : ''
                  }`}
                >
                  <div>
                    <Icon icon="search" width={16} />
                  </div>
                  <Text size={mdScreen ? '3' : '1'}>Explore</Text>
                </NavButton>
              </Link>
              <Link href="/settings">
                <NavButton
                  className={`${mdScreen ? 'h-14' : 'h-10'} ${
                    pathname === '/settings' ? 'nav-button-active' : ''
                  }`}
                >
                  <div>
                    <Icon icon="settings" width={16} />
                  </div>
                  <Text size={mdScreen ? '3' : '1'}>Settings</Text>
                </NavButton>
              </Link>
            </>
          )}
        </Flex>
      </nav>
    </header>
  );
};
