import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { AboutPreview } from '@/components/AboutPreview';
import { ServicesPreview } from '@/components/ServicesPreview';
import { EssaysPreview } from '@/components/EssaysPreview';
import { FinalCta } from '@/components/FinalCta';
import { RevealSection } from '@/components/RevealSection';
import { getEssays } from '@/lib/essays';
import { buildAlternates } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: { absolute: t('title') },
    description: t('description'),
    alternates: buildAlternates(locale, '/'),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const essays = await getEssays(locale);

  return (
    <>
      <Hero />
      <RevealSection><Features /></RevealSection>
      <RevealSection><AboutPreview /></RevealSection>
      <RevealSection><ServicesPreview /></RevealSection>
      <RevealSection><EssaysPreview items={essays} /></RevealSection>
      <RevealSection><FinalCta /></RevealSection>
    </>
  );
}
