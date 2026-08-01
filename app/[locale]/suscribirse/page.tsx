import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { SubscribeForm } from '@/components/SubscribeForm';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: `${t('metadata.title')} — ${t('subscribePage.pageTitle')}`,
    description: t('metadata.description'),
  };
}

export default async function SubscribePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrowKey="subscribePage.eyebrow"
        titleKey="subscribePage.h1"
        introKey="subscribePage.intro"
        bgText="NEWSLETTER"
      />
      <div className="gold-divider" />
      <section className="bg-blanco px-6 py-20 text-center lg:px-14">
        <div className="mx-auto max-w-2xl">
          <SubscribeForm />
        </div>
      </section>
    </>
  );
}
