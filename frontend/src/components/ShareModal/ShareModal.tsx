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
  const imageUrl = new URL(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/og-image`
  );
  imageUrl.searchParams.append("name", "Michi");
  imageUrl.searchParams.append("profitPercent", "2700");
  imageUrl.searchParams.append("entry", "372");
  imageUrl.searchParams.append("profit", "10070");
  imageUrl.searchParams.append("purchaseDate", "4/05/24");
  imageUrl.searchParams.append("soldDate ", "5/08/24");

  const imageLoader = () => {
    return imageUrl.href;
  };

  const shareMessage = () => {
    navigator.share({ url: process.env.NEXT_PUBLIC_SITE_URL });
  };

  const downloadFile = () => {};

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
              src={imageUrl.href}
              alt="monshootShareImage"
              width={235}
              height={237}
            />
          </div>
          <Flex width="100%" direction="row" justify="between">
            <TwitterShareButton url={process.env.NEXT_PUBLIC_SITE_URL}>
              <button className="icon-button small">
                <XIcon round size={32} />
              </button>
            </TwitterShareButton>
            <TelegramShareButton url={process.env.NEXT_PUBLIC_SITE_URL}>
              <button className="icon-button small">
                <TelegramIcon round size={32} />
              </button>
            </TelegramShareButton>
            <IconButton
              icon="message"
              size="small"
              className="bg-violet"
              onClick={shareMessage}
            />
            <IconButton
              icon="fileDownload"
              size="small"
              className="bg-orange"
              onClick={downloadFile}
            />
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
