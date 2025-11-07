// app/layout.tsx

import '@/app/[locale]/globals.css'; // Or wherever your global styles are

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // NO NextIntlClientProvider here
  // NO getMessages or getRequestConfig here
  // NO 'locale' prop here
  return (
    <html>
      <body> 
        {children}
        
      </body>
    </html>
  );
}