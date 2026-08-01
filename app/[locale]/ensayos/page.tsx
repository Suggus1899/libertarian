import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { EssaysList } from '@/components/EssaysList';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: `${t('title')} — ${locale === 'es' ? 'Ensayos' : 'Essays'}`,
    description: t('description'),
  };
}

export default async function EssaysPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrowKey="essaysPage.eyebrow"
        titleKey="essaysPage.h1"
        introKey="essaysPage.intro"
      />
      <div className="gold-divider" />
      <EssaysList />
    </>
  );
}
