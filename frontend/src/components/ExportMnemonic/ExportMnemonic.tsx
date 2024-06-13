import { FC, useEffect, useState } from 'react';
import { Flex, Spinner, Text } from '@radix-ui/themes';

import './style.scss';
import { Button } from '@/legos';
import { useWidth } from '@/hooks/useWidth';
import { copyToClipboard } from '@/helpers/helpers';
import axios from 'axios';

export const ExportMnemonic = () => {
  const { mdScreen } = useWidth();
  const [loading, setLoading] = useState(false);
  const [mnemonic, setMnemonic] = useState('');

  const getMnemonic = async () => {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/export-keys`,
      {
        type: 'export'
      }
    );
    setMnemonic(data);
  };

  useEffect(() => {
    getMnemonic().finally(() => setLoading(false));
  }, []);

  return mnemonic ? (
    <Flex direction="column" align="center" gap="6">
      <Text size={mdScreen ? '3' : '2'} align="center">
        Save these mnemonic in a secure place. You can use it if you lose access
        to your wallet.
      </Text>
      <Flex width="88px" p="4" className="export-mnemonic-card">
        <Text
          weight="medium"
          align="center"
          className="export-mnemonic-card-text"
        >
          {mnemonic}
        </Text>
      </Flex>
      <Button
        className="export-mnemonic-button"
        onClick={() => copyToClipboard(mnemonic)}
      >
        <Text size={mdScreen ? '4' : '3'} weight="medium">
          Copy
        </Text>
      </Button>
    </Flex>
  ) : loading ? (
    <Spinner size="3" />
  ) : null;
};
