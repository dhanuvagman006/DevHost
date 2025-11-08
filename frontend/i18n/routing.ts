import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  locales: ['en', 'fi', 'se','no','dk','is'],
  defaultLocale: 'en'
});