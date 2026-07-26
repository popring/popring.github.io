import './global.css';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Navbar } from '@/components/nav';
import Script from 'next/script';
import Footer from '@/components/footer';
import { BackToTop } from '@/components/back-to-top';
import { baseUrl } from './sitemap';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "popring's blog",
    template: "%s | popring's blog",
  },
  description: '探索、记录、分享',
  keywords: ['popring', '前端', '全栈', '增长工程', 'AI', 'JavaScript', 'React', 'Vue', 'Next.js', 'TypeScript'],
  openGraph: {
    title: "popring's blog",
    description: '探索、记录、分享',
    url: baseUrl,
    siteName: "popring's blog",
    locale: 'zh_CN',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "popring's blog",
    description: '探索、记录、分享',
    images: ['/og-default.png'],
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/rss',
    },
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
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark');else document.documentElement.classList.add('light');if(/[?&]thumb=1\\b/.test(location.search))document.documentElement.classList.add('thumb-mode')}catch(e){}})()`,
          }}
        />
      </head>
      <body className='antialiased max-w-3xl mx-auto px-4 mt-8'>
        <main className='flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0'>
          <Navbar />
          {children}
          <Footer />
          <BackToTop />
          <Script
            src='https://www.googletagmanager.com/gtag/js?id=G-WN0V7KJRVS'
            strategy='lazyOnload'
          />
          <Script id='google-analytics' strategy='lazyOnload'>
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-WN0V7KJRVS');`}
          </Script>
          <Script id='baidu-analytics' strategy='lazyOnload'>
            {`var _hmt=_hmt||[];(function(){var hm=document.createElement("script");hm.src="https://hm.baidu.com/hm.js?f869367a20c50f7b23f96c1e4169d803";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm,s)})();`}
          </Script>
        </main>
      </body>
    </html>
  );
}
