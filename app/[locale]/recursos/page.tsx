import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { FileText } from 'lucide-react';
import { buildAlternates } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t('resourcesPage.pageTitle'),
    description: t('resourcesPage.intro'),
    alternates: buildAlternates(locale, '/recursos'),
  };
}

export default async function ResourcesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const items = t.raw('resources.items') as Array<{
    title: string;
    description: string;
    format: string;
    size: string;
  }>;

  return (
    <>
      <PageHero
        eyebrowKey="resourcesPage.eyebrow"
        titleKey="resourcesPage.h1"
        introKey="resourcesPage.intro"
        bgText="RESOURCES"
      />
      <div className="gold-divider" />
      <section className="bg-blanco px-6 py-16 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.title}
                className="flex flex-col border border-gris-brd bg-gris-bg p-6 sm:p-8 transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center bg-negro text-blanco">
                  <FileText className="h-7 w-7" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg font-bold text-negro">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-[1.75] text-gris-med">
                  {item.description}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-gris-cla">
                    {item.format} · {item.size}
                  </span>
                  <a
                    href="#"
                    download
                    className="btn-p py-2.5 text-xs"
                  >
                    {t('resources.download')}
                  </a>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-12 text-center text-gris-med">{t('resources.soon')}</p>
        </div>
      </section>
    </>
  );
}
