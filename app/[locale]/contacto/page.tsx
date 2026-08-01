import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { ContactForm } from '@/components/ContactForm';
import { buildAlternates } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t('contactPage.pageTitle'),
    description: t('metadata.description'),
    alternates: buildAlternates('/contacto'),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  return (
    <>
      <PageHero
        eyebrowKey="contactPage.eyebrow"
        titleKey="contactPage.h1"
        introKey="contactPage.intro"
        bgText="CONTACT"
      />
      <div className="gold-divider" />

      <section className="bg-blanco px-6 py-16 lg:px-14">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1fr_2fr]">
          <div>
            <h3 className="font-display text-[1.4rem] font-bold text-negro">
              {t('contactPage.infoTitle')}
            </h3>
            <p className="mt-4 text-[0.92rem] leading-[1.75] text-gris-med">
              {t('contactPage.infoDescription')}
            </p>

            <a
              href="mailto:info@libertarianforum.org"
              className="mt-8 flex items-center gap-3 text-sm text-gris-med transition hover:text-negro"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center bg-negro text-[0.8rem] font-bold text-blanco">
                @
              </span>
              info@libertarianforum.org
            </a>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
