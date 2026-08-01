import { Montserrat } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import { ReactNode } from 'react';
import { Metadata } from 'next';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Resolves the locale negotiated by the next-intl middleware for the current
  // request. Works even here in the true root layout — which sits *above* the
  // `[locale]` segment and therefore has no access to it via `params` — because
  // it reads the middleware's own resolution instead of a route param. This
  // keeps the whole layout a Server Component (no client-side JS needed just
  // to set <html lang>).
  const locale = await getLocale();

  return (
    <html lang={locale} data-scroll-behavior="smooth" className={`${montserrat.variable} antialiased`}>
      <body className="min-h-screen bg-blanco text-negro font-sans">
        {children}
      </body>
    </html>
  );
}
