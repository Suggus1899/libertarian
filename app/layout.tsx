import localFont from 'next/font/local';
import { getLocale } from 'next-intl/server';
import { ReactNode } from 'react';
import { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const gotham = localFont({
  src: [
    { path: './fonts/gotham/Gotham-Light.otf',      weight: '300', style: 'normal' },
    { path: './fonts/gotham/Gotham-Book.otf',        weight: '400', style: 'normal' },
    { path: './fonts/gotham/Gotham-BookItalic.otf',  weight: '400', style: 'italic' },
    { path: './fonts/gotham/Gotham-Medium.otf',      weight: '500', style: 'normal' },
    { path: './fonts/gotham/Gotham-Bold.otf',        weight: '700', style: 'normal' },
    { path: './fonts/gotham/Gotham-BoldItalic.otf',  weight: '700', style: 'italic' },
    { path: './fonts/gotham/Gotham-Black.otf',       weight: '900', style: 'normal' },
  ],
  variable: '--font-gotham',
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
    <html lang={locale} data-scroll-behavior="smooth" className={`${gotham.variable} antialiased`}>
      <body className="min-h-screen bg-blanco text-negro font-sans">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
