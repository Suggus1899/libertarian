import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { ServicesList } from '@/components/ServicesList';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: `${t('metadata.title')} — ${t('servicesPage.pageTitle')}`,
    description: t('metadata.description'),
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrowKey="servicesPage.eyebrow"
        titleKey="servicesPage.h1"
        introKey="servicesPage.intro"
        bgText="STRATEGY"
      />
      <div className="gold-divider" />
      <ServicesList />
    </>
  );
}
