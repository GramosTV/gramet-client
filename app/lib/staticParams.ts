import { locales } from '../../i18n';
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
