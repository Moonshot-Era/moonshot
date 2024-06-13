'use client';

import { useShareImage } from '@/hooks/useShareImage';
import { createBrowserClient } from '@/supabase/client';
import { Dialog, Flex, Spinner, Text } from '@radix-ui/themes';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  XIcon
} from 'react-share';

import { useWidth } from '@/hooks/useWidth';
import { IconButton } from '@/legos';
import './style.scss';

export const ShareModal = ({ tokenPrice }: { tokenPrice: number }) => {
  const { mdScreen } = useWidth();
  const pathname = usePathname();

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}`;
  const supabaseClient = createBrowserClient();

  const { imageUrl, isLoading } = useShareImage(supabaseClient, tokenPrice);

  const imageLoader = () => {
    return imageUrl?.href || '';
  };

  const shareMessage = () => {
    navigator.share({ url: process.env.NEXT_PUBLIC_SITE_URL });
  };

  const isMobileDevice = () => {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(global.navigator?.userAgent);
  };

  const downloadImage = async () => {
    try {
      if (!imageUrl) {
        throw new Error(`No image found`);
      }
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
    <Dialog.Content maxWidth="293px" className="dialog-content">
      <Flex direction="column" gap="4" align="center">
        <Text size={mdScreen ? '5' : '4'}>Share your moonshot!</Text>
        {isLoading ? (
          <Spinner />
        ) : (
          imageUrl && (
            <div className="share-image-wrapper">
              <Image
                loader={imageLoader}
                src={imageUrl.href}
                alt="monshootShareImage"
                width={235}
                height={237}
              />
            </div>
          )
        )}

        <Flex width="100%" direction="row" justify="between">
          <TwitterShareButton url={shareUrl}>
            <button className="icon-button small">
              <XIcon round size={32} />
            </button>
          </TwitterShareButton>
          <TelegramShareButton url={shareUrl}>
            <button className="icon-button small">
              <TelegramIcon round size={32} />
            </button>
          </TelegramShareButton>
          {isMobileDevice() ? (
            <a href={`sms:?body=Check out my Moonshot at ${shareUrl}`}>
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
          {imageUrl && (
            <a id="moonshot-image">
              <IconButton
                icon="fileDownload"
                size="small"
                className="bg-orange"
                onClick={downloadImage}
              />
            </a>
          )}
        </Flex>
      </Flex>
    </Dialog.Content>
  );
};
