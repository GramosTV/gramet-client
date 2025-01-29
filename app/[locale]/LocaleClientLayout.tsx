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
