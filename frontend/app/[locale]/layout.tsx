import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import CardNav from "@/components/CardNav";
import MapSelector from "@/components/ui/MapSelector";

// Imports for i18n
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';

const inter = Inter({ subsets: ["latin"] });

// Your metadata (Next.js will handle this)
export const metadata: Metadata = {
  title: "FolkSpace - Your All-in-One Deployment Platform",
  description: "FolkSpace is your all-in-one platform for deploying, managing, and scaling your applications seamlessly.",
};




export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // --- 1. Load messages for the provider ---
  const messages = await getMessages();

  // --- 2. Load translations for static content ---
  const t = await getTranslations('Navigation');

  // --- 3. Build your `items` array dynamically ---
  // This lets you translate your navigation
  const items = [
    {
      label: t('about'),
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: t('links.company'), ariaLabel: t('aria.company'), href: "/about/company" },
        { label: t('links.careers'), ariaLabel: t('aria.careers'), href: "/about/careers" }
      ]
    },
    {
      label: t('projects'),
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: t('links.featured'), ariaLabel: t('aria.featured'), href: "/landing" },
        { label: t('links.caseStudies'), ariaLabel: t('aria.caseStudies'), href: "/projects/case-studies" }
      ]
    },
    {
      label: t('contact'),
      bgColor: "#271E37",
      textColor: "#fff",
      links: [
        { label: t('links.email'), ariaLabel: t('aria.email'), href: "/contact/email" },
        { label: t('links.twitter'), ariaLabel: t('aria.twitter'), href: "/contact/twitter" },
        { label: t('links.linkedin'), ariaLabel: t('aria.linkedin'), href: "/contact/linkedin" }
      ]
    }
  ];

  return (
    <html lang={locale}> {/* Use the dynamic locale here */}
      <body className={inter.className}>
        {/* The provider wraps everything */}
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <CardNav items={items} /> {/* Pass the translated items */}
            {/* <MapSelector />  <-- You can place this wherever it needs to go */}
            
            {children}
            
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}