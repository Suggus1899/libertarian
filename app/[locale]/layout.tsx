import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';
import { Metadata } from 'next';
import { routing, getPathname } from '@/i18n/routing';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SkipLink } from '@/components/SkipLink';
import { Intro } from '@/components/Intro';
import { buildCanonical } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

// Default Open Graph / Twitter Card metadata inherited by every page in the
// site unless a page overrides it (e.g. the essay detail page sets its own
// image). Without this, sharing most pages on WhatsApp/Twitter/Slack shows no
// preview image or title.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: {
      template: `%s — ${t('title')}`,
      default: t('title'),
    },
    description: t('description'),
    alternates: {
      canonical: buildCanonical(locale, '/'),
      languages: {
        es: getPathname({ locale: 'es', href: '/' }),
        en: getPathname({ locale: 'en', href: '/' }),
        'x-default': getPathname({ locale: 'es', href: '/' }),
      },
    },
    // `images` is intentionally omitted so the file-based
    // app/[locale]/opengraph-image.tsx convention supplies the default image.
    openGraph: {
      siteName: 'Libertarian Forum',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
      url: buildCanonical(locale, '/'),
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

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
    <NextIntlClientProvider messages={messages}>
      <Intro />
      <SkipLink />
      <Navigation />
      <main id="main-content">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
