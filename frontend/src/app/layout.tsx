import { ReactQueryProvider } from '@/helpers/ReactQueryProvider';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import { Toaster } from 'sonner';

import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import { DesktopMessage } from '@/components/DesktopMessage/DesktopMessage';

import './globals.css';
import './globals.scss';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `${process.env.SITE_URL}`;

const clashDisplayFont = localFont({
  src: [
    {
      path: '../assets/fonts/ClashDisplay-Regular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../assets/fonts/ClashDisplay-Medium.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../assets/fonts/ClashDisplay-Semibold.woff2',
      weight: '600',
      style: 'normal'
    }
  ]
});

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Moonshot',
  description: 'Make It All Back',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['nextjs', 'nextjs14', 'next14', 'pwa', 'next-pwa'],
  authors: [{ name: 'Moonshot' }],
  icons: [
    { rel: 'apple-touch-icon', url: 'icons/icon-128x128.png' },
    { rel: 'icon', url: 'icons/icon-128x128.png' }
  ],
  openGraph: {
    images: {
      url: 'images/white_logo.png'
    }
  }
};

export const viewport: Viewport = {
  themeColor: 'black',
  viewportFit: 'cover',
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={clashDisplayFont.className}>
        <link
          rel="manifest"
          href={`https://progressier.app/${process.env.NEXT_PUBLIC_PROGRESSIER_ID}/progressier.json`}
        />
        <Script
          src={`https://progressier.app/${process.env.NEXT_PUBLIC_PROGRESSIER_ID}/script.js`}
        />
        <Script
          src={`https://sandbox.crypto.shift4.com/sdk/v1/shift4crypto-sdk-latest.js`}
        />
        <Toaster />
        <ServiceWorkerRegister />
        <ReactQueryProvider>
          <Theme
            className="bg-transparent"
            style={{ width: '100%', maxWidth: 430 }}
          >
            <DesktopMessage />
            {children}
          </Theme>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
