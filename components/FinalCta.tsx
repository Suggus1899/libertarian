import { useTranslations } from 'next-intl';
import { Button } from './Button';

export function FinalCta() {
  const t = useTranslations('cta');

  return (
    <section className="relative overflow-hidden bg-gray-dark py-24">
      <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-transparent" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <div className="eyebrow justify-center">{t('eyebrow')}</div>
        <h2 className="mt-6 text-3xl font-bold leading-tight md:text-5xl">
          {t.rich('h2', {
            br: () => <br />,
            em: (chunks) => <em className="text-gold not-italic">{chunks}</em>,
          })}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-foreground/80">
          {t('description')}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/contacto">{t('ctaPrimary')}</Button>
          <Button href="/servicios" variant="outline">
            {t('ctaSecondary')}
          </Button>
        </div>
      </div>
    </section>
  );
}
