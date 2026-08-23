import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { Button } from '@/components/Button';
import { buildAlternates } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t('aboutPage.pageTitle'),
    description: t('aboutPage.intro'),
    alternates: buildAlternates(locale, '/nosotros'),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  const values = [
    { key: 'research', title: t('features.research.title') },
    { key: 'debate', title: t('features.debate.title') },
    { key: 'advice', title: t('features.advice.title') },
    { key: 'network', title: t('about.values.network.title') },
  ] as const;

  return (
    <>
      <PageHero
        eyebrowKey="aboutPage.eyebrow"
        titleKey="aboutPage.h1"
        introKey="aboutPage.intro"
        bgText="IDEAS"
      />
      <div className="gold-divider" />

      <section className="bg-blanco px-6 py-16 lg:px-14">
        <div className="mx-auto max-w-4xl">
          <p className="text-base leading-[1.9] text-gris-med">
            {t.rich('aboutPage.p1', {
              strong: (chunks) => <strong className="font-semibold text-negro">{chunks}</strong>,
            })}
          </p>
          <p className="mt-5 text-base leading-[1.9] text-gris-med">
            {t.rich('aboutPage.p2', {
              strong: (chunks) => <strong className="font-semibold text-negro">{chunks}</strong>,
            })}
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="border-l-[3px] border-l-dorado bg-gris-bg p-6 sm:p-8">
              <h3 className="font-display text-[1.5rem] font-bold text-negro">
                {t('aboutPage.missionTitle')}
              </h3>
              <p className="mt-4 leading-[1.8] text-gris-med">
                {t('aboutPage.mission')}
              </p>
            </div>
            <div className="border-l-[3px] border-l-dorado bg-gris-bg p-6 sm:p-8">
              <h3 className="font-display text-[1.5rem] font-bold text-negro">
                {t('aboutPage.visionTitle')}
              </h3>
              <p className="mt-4 leading-[1.8] text-gris-med">
                {t('aboutPage.vision')}
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map(({ key, title }) => (
              <div
                key={key}
                className="relative border border-gris-brd bg-gris-bg p-6 sm:p-8"
              >
                <span className="absolute left-0 top-0 h-full w-[3px] bg-dorado" />
                <h4 className="font-display text-[0.9rem] font-extrabold uppercase tracking-[2px] text-negro">
                  {title}
                </h4>
                <p className="mt-2.5 text-[0.9rem] leading-[1.72] text-gris-med">
                  {key === 'network'
                    ? t('about.values.network.description')
                    : t(`${key === 'research' || key === 'debate' || key === 'advice' ? 'features' : 'about.values'}.${key}.description`)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3.5">
            <Button href="/servicios">{t('aboutPage.ctaPrimary')}</Button>
            <Button href="/contacto" variant="outline">
              {t('aboutPage.ctaSecondary')}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
