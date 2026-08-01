import { useTranslations } from 'next-intl';
import { FileText, Megaphone, Target } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from './Button';

export function ServicesPreview() {
  const t = useTranslations('services');

  const services = [
    { key: 'platforms', icon: FileText },
    { key: 'marketing', icon: Megaphone },
    { key: 'consulting', icon: Target },
  ] as const;

  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <div className="eyebrow justify-center">{t('eyebrow')}</div>
          <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-bold leading-tight md:text-4xl">
            {t.rich('h2', {
              em: (chunks) => <em className="text-gold not-italic">{chunks}</em>,
            })}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-foreground/70">
            {t('description')}
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {services.map(({ key, icon: Icon }) => (
            <Link
              key={key}
              href="/servicios"
              className="group block rounded-sm border border-border bg-gray-dark/40 p-8 transition hover:border-gold/40 hover:bg-gray-dark/60"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gold/60">
                  {t(`list.${key}.num`)}
                </span>
                <Icon className="h-6 w-6 text-gold transition group-hover:scale-110" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-foreground">
                {t(`list.${key}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                {t(`list.${key}.description`)}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Button href="/servicios" variant="outline">
            {t('cta')}
          </Button>
        </div>
      </div>
    </section>
  );
}
