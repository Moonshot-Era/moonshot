"use client";

import { IconButton } from "@/legos";
import { Dialog, Flex, Text } from "@radix-ui/themes";
import Image from "next/image";
import {
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  XIcon,
} from "react-share";
import "./style.scss";

export const ShareModal = () => {
  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/og-image`;
  const imageLoader = () => {
    return imageUrl;
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Flex direction="column" align="center" gap="1">
          <IconButton icon="share" className="bg-blue" />
          <Text size="2">Share</Text>
        </Flex>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="293px" className="dialog-content">
        <Flex direction="column" gap="4" align="center">
          <Text size="4">Share your moonshot!</Text>
          <div className="share-image-wrapper">
            <Image
              loader={imageLoader}
              src={imageUrl}
              alt="monshootShareImage"
              width={235}
              height={237}
            />
          </div>
          <Flex width="100%" direction="row" justify="between">
            <TwitterShareButton url="">
              <button className="icon-button small">
                <XIcon round size={32} />
              </button>
            </TwitterShareButton>
            <TelegramShareButton url="">
              <button className="icon-button small">
                <TelegramIcon round size={32} />
              </button>
            </TelegramShareButton>
            <IconButton icon="message" size="small" className="bg-violet" />
            <IconButton
              icon="fileDownload"
              size="small"
              className="bg-orange"
            />
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
