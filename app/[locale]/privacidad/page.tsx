import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { buildAlternates } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t('privacyPage.pageTitle'),
    description: t('metadata.description'),
    alternates: buildAlternates('/privacidad'),
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const paragraphs = t.raw('privacyPage.content') as string[];

  return (
    <>
      <PageHero
        eyebrowKey="privacyPage.eyebrow"
        titleKey="privacyPage.h1"
        introKey="metadata.description"
        bgText="PRIVACY"
      />
      <div className="gold-divider" />
      <section className="bg-blanco px-6 py-16 lg:px-14">
        <div className="mx-auto max-w-3xl">
          {paragraphs.map((p) => (
            <p key={p.slice(0, 20)} className="mb-6 text-base leading-[1.9] text-gris-med">
              {p}
            </p>
          ))}
        </div>
      </section>
    </>
  );
}
