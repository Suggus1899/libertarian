'use client';

import { useParams } from 'next/navigation';
import { Montserrat } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'es';

  return (
    <html lang={locale} className={`${montserrat.variable} antialiased`}>
      <body className="min-h-screen bg-blanco text-negro font-sans">
        {children}
      </body>
    </html>
  );
}
