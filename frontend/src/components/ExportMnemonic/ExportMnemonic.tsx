import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Button } from '@/legos';
import { useWidth } from '@/hooks/useWidth';
import { copyToClipboard } from '@/helpers/helpers';

export const ExportMnemonic = ({ mnemonic }: { mnemonic: string }) => {
  const { mdScreen } = useWidth();

  return mnemonic ? (
    <Flex direction="column" align="center" gap="6">
      <Text size={mdScreen ? '3' : '2'} align="center">
        Save these mnemonic in a secure place. You can use it if you lose access
        to your wallet.
      </Text>
      <Flex width="50%" p="4" className="export-mnemonic-card">
        <Text
          weight="medium"
          size="3"
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
  ) : null;
};
