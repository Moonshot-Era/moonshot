'use client';

import { useState } from 'react';
import { Flex, Text } from '@radix-ui/themes';

import './style.scss';

import { Icon } from '@/legos';
import { RecentTab } from './RecentTab';
import { AccountTab } from './AccountTab';
import { ExportKeyTab } from './ExportKeyTab';
import { ROUTES, logout } from '@/utils';
import { useRouter } from 'next/navigation';

export const SettingsContent = () => {
  const [activeTab, setActiveTab] = useState<
    'account' | 'recent' | 'export' | 'logout' | null
  >(null);
  const router = useRouter();

  const handleActiveTab = (
    tab: 'account' | 'recent' | 'export' | 'logout' | null,
  ) => setActiveTab(tab);

  const handleLogout = () => {
    logout().then(() => {
      router.push(ROUTES.login);
    });
  };

  return (
    <>
      <Flex
        direction="column"
        align="center"
        justify="center"
        width="100%"
        gap="4"
        className="main-wrapper settings-wrapper"
      >
        {!activeTab ? (
          <>
            <Flex
              width="100%"
              direction="row"
              align="center"
              gap="3"
              p="4"
              className="settings-card"
              onClick={() => handleActiveTab('account')}
            >
              <Icon icon="userCircle" />
              <Text size="3" weight="medium">
                Account
              </Text>
            </Flex>
            <Flex
              width="100%"
              direction="row"
              align="center"
              gap="3"
              p="4"
              className="settings-card"
              onClick={() => handleActiveTab('recent')}
            >
              <Icon icon="notes" />
              <Text size="3" weight="medium">
                Recent activity
              </Text>
            </Flex>
            <Flex
              width="100%"
              direction="row"
              align="center"
              gap="3"
              p="4"
              className="settings-card"
              onClick={() => handleActiveTab('export')}
            >
              <Icon icon="key" />
              <Text size="3" weight="medium">
                Export private key
              </Text>
            </Flex>
            <Flex
              width="100%"
              direction="row"
              align="center"
              gap="3"
              p="4"
              className="settings-card"
              onClick={handleLogout}
            >
              <Icon icon="logout" />
              <Text size="3" weight="medium">
                Log out
              </Text>
            </Flex>
          </>
        ) : activeTab === 'account' ? (
          <AccountTab handleActiveTab={handleActiveTab} />
        ) : activeTab === 'recent' ? (
          <RecentTab handleActiveTab={handleActiveTab} />
        ) : activeTab === 'export' ? (
          <ExportKeyTab handleActiveTab={handleActiveTab} />
        ) : null}
      </Flex>
    </>
  );
};
