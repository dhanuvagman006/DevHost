import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'de'],

  // Used when no locale prefix is present
  defaultLocale: 'en',
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Skip all internal paths (_next, api, etc.)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    
    // Match root separately if needed (though the above line covers it)
    '/',
  ],
};