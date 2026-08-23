import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHero } from '@/components/PageHero';
import { EssaysList } from '@/components/EssaysList';
import { getEssays } from '@/lib/essays';
import { buildAlternates } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://libertarianforum.org').replace(/\/$/, '');
  const alternates = buildAlternates(locale, '/ensayos');
  return {
    title: t('essaysPage.pageTitle'),
    description: t('essaysPage.intro'),
    alternates:
      locale === 'es'
        ? { ...alternates, types: { 'application/rss+xml': `${base}/rss.xml` } }
        : alternates,
  };
}

export default async function EssaysPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const items = await getEssays(locale);

  return (
    <>
      <PageHero
        eyebrowKey="essaysPage.eyebrow"
        titleKey="essaysPage.h1"
        introKey="essaysPage.intro"
        bgText="ENSAYOS"
      />
      <div className="gold-divider" />
      <Suspense fallback={null}>
        <EssaysList items={items} />
      </Suspense>
    </>
  );
}
