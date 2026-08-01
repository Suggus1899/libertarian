import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { EssaysList } from '@/components/EssaysList';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: `${t('metadata.title')} — ${t('essaysPage.pageTitle')}`,
    description: t('metadata.description'),
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
        bgText="ENSAYOS"
      />
      <div className="gold-divider" />
      <EssaysList />
    </>
  );
}
