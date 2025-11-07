import { createNavigation } from 'next-intl/navigation';

// List all your locales, including the new ones
// from your LanguageSwitcher
export const locales = ['en', 'sv', 'no', 'da', 'fi', 'is'];

// This is the magic!
// Create and export the hooks and Link component
export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  localePrefix: 'always', // Or 'as-needed'
});