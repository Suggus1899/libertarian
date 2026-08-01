import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { routing } from '@/i18n/routing';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SkipLink } from '@/components/SkipLink';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-background text-foreground font-sans">
        <NextIntlClientProvider messages={messages}>
          <SkipLink />
          <Navigation />
          <main id="main-content">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
