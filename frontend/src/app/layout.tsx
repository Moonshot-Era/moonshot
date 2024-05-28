import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import localFont from 'next/font/local';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { ReactQueryProvider } from '@/helpers/ReactQueryProvider'

import './globals.scss';
import './globals.css';
import { Header } from '@/components/Header/Header';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import { SplashScreen } from '@/components/SplashScreen/SplashScreen';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `${process.env.SITE_URL}`;

const clashDisplayFont = localFont({
  src: [
    {
      path: '../assets/fonts/ClashDisplay-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/ClashDisplay-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/ClashDisplay-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Moonshot',
  description: 'Moonshot application',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['nextjs', 'nextjs14', 'next14', 'pwa', 'next-pwa'],
  authors: [{ name: 'Moonshot' }],
  icons: [
    { rel: 'apple-touch-icon', url: 'icons/icon-128x128.png' },
    { rel: 'icon', url: 'icons/icon-128x128.png' },
  ],
  openGraph: {
    images: {
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/og-image`,
    },
  },
};

export const viewport: Viewport = {
  themeColor: 'black',
  viewportFit: 'cover',
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width',
};

export default function RootLayout({
  children,
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
        <Script src="https://sandbox.crypto.shift4.com/sdk/v1/shift4crypto-sdk-latest.js" />
        <ServiceWorkerRegister />
        <SplashScreen />
        <Header />
        <ReactQueryProvider>
          <Theme className="bg-transparent">{children}</Theme>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
