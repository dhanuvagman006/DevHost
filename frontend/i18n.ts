import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// List your supported locales
const locales = ['en', 'sv', 'no', 'da'];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    locale: locale || 'en', // Provide a default locale
    messages: (await import(`./messages/${locale || 'en'}.json`)).default, // Use default locale for messages
  };
});