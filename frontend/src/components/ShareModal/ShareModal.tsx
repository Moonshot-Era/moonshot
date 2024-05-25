'use client';

import { IconButton } from '@/legos';
import { Dialog, Flex, Text } from '@radix-ui/themes';
import Image from 'next/image';
import {
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  XIcon,
} from 'react-share';
import './style.scss';

export const ShareModal = () => {
  const imageUrl = new URL(
    '/api/functions/v1/og-image',
    process.env.NEXT_PUBLIC_SITE_URL
  );

  imageUrl.searchParams.append('name', 'Michi');
  imageUrl.searchParams.append('profitPercent', '2700');
  imageUrl.searchParams.append('entry', '372');
  imageUrl.searchParams.append('profit', '10070');
  imageUrl.searchParams.append('purchaseDate', '4/05/24');
  imageUrl.searchParams.append('soldDate', '5/08/24');

  const imageLoader = () => {
    return imageUrl.href;
  };

  const shareMessage = () => {
    navigator.share({ url: process.env.NEXT_PUBLIC_SITE_URL });
  };

  const isMobileDevice = () => {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  const downloadImage = async () => {
    try {
      const response = await fetch(imageUrl.href);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'moonshot.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading the image:', error);
    }
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
            {isMobileDevice() ? (
              <a href="sms:?body=Check out my Moonshot at https://moonshot.tech/culture/WIF">
                <IconButton icon="message" size="small" className="bg-violet" />
              </a>
            ) : (
              <IconButton
                icon="message"
                size="small"
                className="bg-violet"
                onClick={shareMessage}
              />
            )}
            <a id="moonshot-image">
              <IconButton
                icon="fileDownload"
                size="small"
                className="bg-orange"
                onClick={downloadImage}
              />
            </a>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
