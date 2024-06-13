'use client';

import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { Box, Checkbox, Flex, Spinner, Text } from '@radix-ui/themes';
import './style.scss';

import { Button, Icon } from '@/legos';
import { useWidth } from '@/hooks/useWidth';
import { createBrowserClient } from '@/supabase/client';
import { ExportRemaining } from '../ExportRemaining/ExportRemaining';
import { ExportMnemonic } from '../ExportMnemonic/ExportMnemonic';

interface Props {
  handleActiveTab: (
    tab: 'account' | 'recent' | 'export' | 'logout' | null
  ) => void;
}

export const ExportKeyTab: FC<Props> = ({ handleActiveTab }) => {
  const { mdScreen } = useWidth();
  const [loading, setLoading] = useState(false);
  const supabaseClient = createBrowserClient();
  const [exportDelay, setExportDelay] = useState<Date | null>(null);
  const [exportWindow, setExportWindow] = useState<Date | null>(null);

  const [checked, setChecked] = useState(false);

  const getExportInfo = async () => {
    setLoading(true);
    const { data } = await supabaseClient.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;
    const { data: avatarData } = await supabaseClient
      .from('profiles')
      .select('export_keys_delay,export_keys_window')
      .eq('user_id', userId);
    const delay = avatarData?.[0]?.export_keys_delay;
    const window = avatarData?.[0]?.export_keys_window;
    delay && setExportDelay(new Date(delay));
    window && setExportWindow(new Date(window));
  };

  useEffect(() => {
    getExportInfo().finally(() => setLoading(false));
  }, []);

  const toggleChecked = () => setChecked(!checked);

  const handleInitiateExportKeys = async () => {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/export-keys`,
      {
        type: 'initiate'
      }
    );
    console.log('debug > data===', new Date(data * 1000));
  };
  console.log('debug > exportInfo===', exportDelay, exportWindow);
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
          Export private key
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
      {loading && <Spinner size="3" />}
      {!loading && !exportDelay && !exportWindow && (
        <>
          <Flex
            width="100%"
            direction="column"
            align="center"
            p="4"
            mb="24px"
            className="setting-export-card"
          >
            <Box mb="4">
              <Icon icon="alertTriangle" width={64} height={64} />
            </Box>
            <Text
              size={mdScreen ? '4' : '3'}
              mb="6"
              mx="2"
              align="center"
              className="setting-export-card-title"
            >
              Handle with utmost care. Store securely offline, never share, and
              remember, loss of key equals loss of funds.
            </Text>
            <Text
              size={mdScreen ? '4' : '3'}
              mb="6"
              mx="2"
              align="center"
              className="setting-export-card-title"
            >
              To ensure your safety, there is a{' '}
              <Text weight="bold">48 hour </Text>
              waiting period before you can retrieve a phrase.
            </Text>

            <Text
              size={mdScreen ? '4' : '3'}
              weight="bold"
              align="center"
              className="setting-export-card-subtitle"
            >
              You are solely responsible for its safety.
            </Text>
          </Flex>
          <Flex
            width="100%"
            direction="row"
            align="center"
            gap="2"
            py="2"
            pl="4"
            pr="7"
            mb="24px"
            className="setting-export-checkbox-card"
          >
            <Checkbox
              size={mdScreen ? '2' : '1'}
              checked={checked}
              className="settings-export-checkbox"
              onClick={toggleChecked}
            />
            <Text size={mdScreen ? '4' : '3'}>
              I understand that I am solely responsible for my private key’s
              security.
            </Text>
          </Flex>
          <Button
            disabled={!checked}
            className="settings-export-button"
            onClick={handleInitiateExportKeys}
          >
            <Text size={mdScreen ? '4' : '3'} weight="medium">
              Continue
            </Text>
          </Button>
        </>
      )}
      {!loading && exportDelay && exportDelay > new Date() && (
        <ExportRemaining delayRemaining={exportDelay} />
      )}
      {!loading &&
        exportDelay &&
        exportDelay < new Date() &&
        exportWindow &&
        exportWindow < new Date() && <ExportMnemonic />}
    </Flex>
  );
};
