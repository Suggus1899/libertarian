import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { Button } from '@/components/Button';
import { GraduationCap, Flame, Landmark, Handshake } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: `${t('title')} — ${locale === 'es' ? 'Nosotros' : 'About'}`,
    description: t('description'),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  const values = [
    { key: 'rigor', icon: GraduationCap, title: t('about.values.rigor.title') },
    { key: 'freedom', icon: Flame, title: t('about.values.freedom.title') },
    { key: 'state', icon: Landmark, title: t('about.values.state.title') },
    { key: 'network', icon: Handshake, title: t('about.values.network.title') },
  ];

  return (
    <>
      <PageHero
        eyebrowKey="aboutPage.eyebrow"
        titleKey="aboutPage.h1"
        introKey="aboutPage.intro"
      />
      <div className="gold-divider" />

      <section className="bg-background py-20">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-lg leading-relaxed text-foreground/80">
            {t.rich('aboutPage.p1', {
              strong: (chunks) => (
                <strong className="text-foreground">{chunks}</strong>
              ),
            })}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-foreground/80">
            {t.rich('aboutPage.p2', {
              strong: (chunks) => (
                <strong className="text-foreground">{chunks}</strong>
              ),
            })}
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <div className="rounded-sm border border-border bg-gray-dark/40 p-8">
              <h3 className="text-xl font-bold text-gold">
                {t('aboutPage.missionTitle')}
              </h3>
              <p className="mt-4 leading-relaxed text-foreground/80">
                {t('aboutPage.mission')}
              </p>
            </div>
            <div className="rounded-sm border border-border bg-gray-dark/40 p-8">
              <h3 className="text-xl font-bold text-gold">
                {t('aboutPage.visionTitle')}
              </h3>
              <p className="mt-4 leading-relaxed text-foreground/80">
                {t('aboutPage.vision')}
              </p>
            </div>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ key, icon: Icon, title }) => (
              <div
                key={key}
                className="rounded-sm border border-border bg-gray-dark/40 p-6 text-center transition hover:border-gold/40"
              >
                <Icon className="mx-auto h-8 w-8 text-gold" />
                <h4 className="mt-4 font-bold text-foreground">{title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                  {t(`about.values.${key}.description`)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-wrap gap-4">
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
