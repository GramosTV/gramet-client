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
  useEffect(() => {
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = '38ef16c3-c164-4ab1-901e-cd7d0e257ed5';

    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);
  return (
    <html lang={locale}>
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
