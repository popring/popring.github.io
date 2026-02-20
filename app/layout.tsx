import './global.css';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Navbar } from '@/components/nav';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Footer from '@/components/footer';
import { baseUrl } from './sitemap';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "popring's blog",
    template: "%s | popring's blog",
  },
  description: '探索、记录、分享',
  openGraph: {
    title: "popring's blog",
    description: '探索、记录、分享',
    url: baseUrl,
    siteName: "popring's blog",
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const cx = (...classes: string[]) => classes.filter(Boolean).join(' ');

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='zh-CN'
      suppressHydrationWarning
      className={cx(
        'text-black bg-white dark:text-white dark:bg-black',
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body className='antialiased max-w-2xl mx-auto px-4 mt-8'>
        <main className='flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0'>
          <Navbar />
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  );
}
