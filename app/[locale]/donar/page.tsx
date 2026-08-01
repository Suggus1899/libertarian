import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { Link } from '@/i18n/routing';
import { Heart } from 'lucide-react';
import { buildAlternates } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t('donatePage.pageTitle'),
    description: t('metadata.description'),
    alternates: buildAlternates('/donar'),
  };
}

export default async function DonatePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const methods = t.raw('donatePage.methods') as Array<{ name: string; description: string }>;

  return (
    <>
      <PageHero
        eyebrowKey="donatePage.eyebrow"
        titleKey="donatePage.h1"
        introKey="donatePage.intro"
        bgText="SUPPORT"
      />
      <div className="gold-divider" />
      <section className="bg-blanco px-6 py-16 lg:px-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center font-display text-2xl font-black uppercase tracking-[1px] text-negro">
            {t('donatePage.methodsTitle')}
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {methods.map((method) => (
              <div
                key={method.name}
                className="flex flex-col items-start border border-gris-brd bg-gris-bg p-8 transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center bg-negro text-blanco">
                  <Heart className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg font-bold text-negro">
                  {method.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-[1.75] text-gris-med">
                  {method.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Link href="/contacto" className="btn-p">
              {t('donatePage.cta')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
