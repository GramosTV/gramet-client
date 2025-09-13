// app/[locale]/LocaleClientLayout.tsx (Client Component)
'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQueryProvider from '../components/ReactQueryProvider';
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
  return (
    <html lang={locale}>
      <body>
        <ReactQueryProvider>
          <NextIntlClientProvider locale={locale} messages={messages} timeZone={'Europe/Vienna'}>
            <AuthProvider>
              <Header />
              {children}
              <Footer />
            </AuthProvider>
          </NextIntlClientProvider>
          <ToastContainer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
