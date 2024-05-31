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
import { createBrowserClient } from '@/supabase/client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const ShareModal = () => {
  const pathname = usePathname()
  const imageUrl = new URL(
    '/api/functions/v1/og-image',
    process.env.NEXT_PUBLIC_SITE_URL
  );

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}`

  useEffect(() => {
    generateImageSearchParams();
  }, []);

  const generateImageSearchParams = async () => {
    const supabaseClient = createBrowserClient();
    const { data } = await supabaseClient.auth.getSession();
    const userId = data.session?.user?.id;

    //TODO: change to real data
    const tokenName = 'test_token';

    const { data: transactions } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('user_id', userId || '')
      .eq('token_name', tokenName);

    if (transactions?.length) {
      const lastTransaction = transactions[transactions.length - 1];

      const purchaseTransactions = transactions.filter(
        (item) => !!item.date_purchased
      );
      const sellTransactions = transactions.filter((item) => !!item.date_sold);

      const lastPurchaseTransaction =
        purchaseTransactions[purchaseTransactions.length - 1];
      const lastSellTransaction = sellTransactions[sellTransactions.length - 1];

      const tokenAmount = lastTransaction.token_amount || 0;
      const totalCost = purchaseTransactions.reduce((acc, transaction) => {
        return (
          acc + (transaction.token_amount || 0) * (transaction.token_price || 0)
        );
      }, 0);
      const totalRevenue = sellTransactions.reduce((acc, transaction) => {
        return (
          acc + (transaction.token_amount || 0) * (transaction.token_price || 0)
        );
      }, 0);
      const profit = totalRevenue - totalCost;

      const profitPercent = (profit / totalCost) * 100;

      const datePurchased = new Date(
        lastPurchaseTransaction.date_purchased || ''
      ).toLocaleDateString('en-US');
      const dateSold = new Date(
        lastSellTransaction.date_sold || ''
      ).toLocaleDateString('en-US');

      imageUrl.searchParams.append('name', tokenName);
      imageUrl.searchParams.append('profitPercent', profitPercent.toString());
      imageUrl.searchParams.append('entry', tokenAmount.toString());
      imageUrl.searchParams.append('profit', profit.toFixed(2));
      imageUrl.searchParams.append('purchaseDate', datePurchased);
      imageUrl.searchParams.append('soldDate', dateSold);
    }
  };

  const imageLoader = () => {
    return imageUrl.href;
  };

  const shareMessage = () => {
    navigator.share({ url: process.env.NEXT_PUBLIC_SITE_URL });
  };

  const isMobileDevice = () => {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(global.navigator?.userAgent);
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
