'use client';

import { useState } from 'react';
import { Dialog, Flex, Text } from '@radix-ui/themes';

import { Button, Input } from '@/legos';
import { useWidth } from '@/hooks/useWidth';

import './style.scss';
import { removeCubeSignerUser } from '@/services';

export const RemoveUserModal = () => {
  const { mdScreen } = useWidth();
  const [userId, setUserId] = useState('');
  const handleRemoveUser = async () => {
    await removeCubeSignerUser(userId)
      .then((res) => console.log('debug > remove user res===', res))
      .catch((err) => console.log('debug > remove user err===', err));
  };

  return (
    <Dialog.Content maxWidth="600px" className="dialog-content">
      <Flex direction="column" gap="4" align="center">
        <Text size={mdScreen ? '5' : '4'}>DANGER!</Text>
        <Text size={mdScreen ? '3' : '3'}>Remove user moonshot!</Text>

        <Flex width="100%" direction="row" justify="between">
          <Input
            placeholder="Input user id"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </Flex>
        <Button onClick={handleRemoveUser}>
          <Text size={mdScreen ? '4' : '2'} weight="medium">
            Remove user
          </Text>
        </Button>
      </Flex>
    </Dialog.Content>
  );
};
