// app/[locale]/LocaleClientLayout.tsx (Client Component)
'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/globals.css';
import '../styles/embla.css';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { AuthProvider } from '@/context/AuthContext';
import { useEffect } from 'react';
import Head from 'next/head';

declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

config.autoAddCss = false;

export default function LocaleClientLayout({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, string>;
}) {
  //
  return (
    <html lang={locale}>
      <Head>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              window.$crisp = [];
              window.CRISP_WEBSITE_ID = '38ef16c3-c164-4ab1-901e-cd7d0e257ed5';
              (function() {
                var d = document;
                var s = d.createElement('script');
                s.src = 'https://client.crisp.chat/l.js';
                s.async = 1;
                d.getElementsByTagName('head')[0].appendChild(s);
              })();
            `,
          }}
        />
      </Head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages} timeZone={'Europe/Vienna'}>
          <AuthProvider>
            <Header />
            {children}
            <Footer />
          </AuthProvider>
        </NextIntlClientProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
