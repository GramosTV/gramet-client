// app/[locale]/layout.tsx (Server Component)
import { notFound } from 'next/navigation';
import { locales } from '../../i18n';
import ReactQueryProvider from '../components/ReactQueryProvider';
import LocaleClientLayout from './LocaleClientLayout';
import { JSX } from 'react';

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
        {children}
      </LocaleClientLayout>
    </ReactQueryProvider>
  );
}
