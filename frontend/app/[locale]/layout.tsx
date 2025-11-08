import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // Adjust path if needed
import CardNav from "@/components/CardNav";
import MapSelector from "@/components/ui/MapSelector";

import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
//import Navbar from '@/components/Navbar';
const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}
 
export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
 
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          {/* //<Navbar /> */}
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

//import logo from '@/public/logo2.png';
//  const items = [
//     {
//       label: "About",
//       bgColor: "#0D0716",
//       textColor: "#fff",
//       links: [
//         { label: "Company", ariaLabel: "About Company", href: "/about/company" },
//         { label: "Careers", ariaLabel: "About Careers", href: "/about/careers" }
//       ]
//     },
//     {
//       label: "Projects", 
//       bgColor: "#170D27",
//       textColor: "#fff",
//       links: [
//         { label: "Featured", ariaLabel: "Featured Projects" ,href: "/landing"},
//         { label: "Case Studies", ariaLabel: "Project Case Studies", href: "/projects/case-studies" }
//       ]
//     },
//     {
//       label: "Contact",
//       bgColor: "#271E37", 
//       textColor: "#fff",
//       links: [
//         { label: "Email", ariaLabel: "Email us", href: "/contact/email" },
//         { label: "Twitter", ariaLabel: "Twitter", href: "/contact/twitter" },
//         { label: "LinkedIn", ariaLabel: "LinkedIn", href: "/contact/linkedin" }
//       ]
//     }
//   ];




// export const metadata: Metadata = {
//   title: "FolkSpace - Your All-in-One Deployment Platform",
//   description: "FolkSpace is your all-in-one platform for deploying, managing, and scaling your applications seamlessly.",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
        
    
//         <AuthProvider>
//           {children}
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }