// app/[locale]/layout.tsx (Server Component)
import { notFound } from 'next/navigation';
import { locales } from '../../i18n';
import ReactQueryProvider from '../components/ReactQueryProvider';
import LocaleClientLayout from './LocaleClientLayout';
import { JSX } from 'react';
import Head from 'next/head';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LayoutParams {
  locale: string;
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: LayoutParams | Promise<LayoutParams>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps): Promise<JSX.Element> {
  const { locale } = await params;

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <ReactQueryProvider>
      <LocaleClientLayout locale={locale} messages={messages}>
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
        {children}
      </LocaleClientLayout>
    </ReactQueryProvider>
  );
}
