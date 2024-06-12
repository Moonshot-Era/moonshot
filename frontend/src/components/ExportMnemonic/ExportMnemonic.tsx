import { FC } from 'react';
import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Button } from '@/legos';
import { useWidth } from '@/hooks/useWidth';

interface Props {
  backupCodes: string;
}

export const ExportMnemonic: FC<Props> = ({ backupCodes }) => {
  const { mdScreen } = useWidth();

  return (
    <Flex direction="column" align="center" gap="6">
      <Text size={mdScreen ? '3' : '2'} align="center">
        Save these backup codes in a secure place. You can use them if you lose
        access to your authenticator app.
      </Text>
      <Flex width="88px" p="4" className="export-mnemonic-card">
        <Text
          weight="medium"
          align="center"
          className="export-mnemonic-card-text"
        >
          {backupCodes}
        </Text>
      </Flex>
      <Button className="export-mnemonic-button">
        <Text size={mdScreen ? '4' : '3'} weight="medium">
          Next
        </Text>
      </Button>
    </Flex>
  );
};
