import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { ContactForm } from '@/components/ContactForm';
import { Mail } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: `${t('title')} — ${locale === 'es' ? 'Contacto' : 'Contact'}`,
    description: t('description'),
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
      />
      <div className="gold-divider" />

      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          <div>
            <h3 className="text-2xl font-bold text-foreground">
              {t('contactPage.infoTitle')}
            </h3>
            <p className="mt-4 leading-relaxed text-foreground/80">
              {t('contactPage.infoDescription')}
            </p>

            <a
              href="mailto:info@libertarianforum.org"
              className="mt-8 inline-flex items-center gap-3 text-gold transition hover:text-gold-light"
            >
              <Mail className="h-5 w-5" />
              info@libertarianforum.org
            </a>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
