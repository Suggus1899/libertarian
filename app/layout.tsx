import localFont from 'next/font/local';
import { headers } from 'next/headers';
import { ReactNode } from 'react';
import { Metadata } from 'next';
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
  const headersList = await headers();
  const locale = headersList.get('x-next-intl-locale') ?? 'es';

  return (
    <html lang={locale} data-scroll-behavior="smooth" className={`${gotham.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Prevents flash of wrong theme on load */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t;}catch(e){}})();` }} />
      </head>
      <body className="min-h-screen bg-blanco text-negro font-sans">
        {children}
      </body>
    </html>
  );
}
