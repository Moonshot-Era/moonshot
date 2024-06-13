'use client';

import { useAvatarImage } from '@/hooks/useAvatarImage';
import { Button, Icon } from '@/legos';
import { createBrowserClient } from '@/supabase/client';
import { Box, Flex, Spinner, Text } from '@radix-ui/themes';
import Image from 'next/image';
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import './style.scss';

interface Props {
  handleActiveTab: (
    tab: 'account' | 'recent' | 'export' | 'logout' | null
  ) => void;
}

export const AccountTab: FC<Props> = ({ handleActiveTab }) => {
  const inputFile = useRef(null);
  const [avatar, setAvatar] = useState('');
  const supabaseClient = createBrowserClient();
  const { imageUrl, mutate, isPending } = useAvatarImage();

  const getUser = async () => {
    const { data } = await supabaseClient.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;
    const { data: avatarData } = await supabaseClient
      .from('profiles')
      .select('avatar_url')
      .eq('user_id', userId);
    const userAvatar = avatarData?.[0].avatar_url;
    userAvatar && setAvatar(userAvatar);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    console.log('imageUrl', imageUrl);
    imageUrl && setAvatar(imageUrl);
  }, [imageUrl]);

  const handleUploadImage = () => {
    inputFile.current && inputFile.current.click();
  };

  const handleChangeFile = async (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files?.[0];

    if (file) {
      mutate(file);
    }
  };

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
        <Text size="4" weight="bold">
          Account
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
      <Flex height="150px" gap="8px" direction="column">
        {isPending || !avatar ? (
          <Spinner />
        ) : (
          <>
            <Box mb="2">
              <Image
                alt="user-photo"
                src={avatar}
                width={80}
                height={80}
                style={{ borderRadius: '50%' }}
              />
            </Box>
            <Button
              className="settings-account-button"
              onClick={handleUploadImage}
            >
              <Text size="2" weight="medium">
                Edit photo
              </Text>
            </Button>
            <input
              type="file"
              id="file"
              accept="image/*"
              ref={inputFile}
              style={{ display: 'none' }}
              onChange={handleChangeFile}
            />
          </>
        )}
      </Flex>
      <Flex
        width="100%"
        direction="row"
        align="center"
        justify="center"
        py="3"
        px="3"
        className="settings-account-notifications"
      >
        <button
          className="progressier-subscribe-button"
          data-icons="true"
          data-eligible="Get notifications"
          data-subscribed="Notifications enabled"
          data-blocked="Notifications blocked"
        ></button>
      </Flex>
    </Flex>
  );
};
