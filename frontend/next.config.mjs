import createNextIntlPlugin from 'next-intl/plugin';

// Point the plugin to your i18n config file
const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your other Next.js config (if any)
};

export default withNextIntl(nextConfig);