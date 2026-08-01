import { useTranslations } from 'next-intl';
import { Button } from './Button';
import { GraduationCap, Flame, Landmark, Handshake } from 'lucide-react';

export function AboutPreview() {
  const t = useTranslations('about');

  const values = [
    { key: 'rigor', icon: GraduationCap },
    { key: 'freedom', icon: Flame },
    { key: 'state', icon: Landmark },
    { key: 'network', icon: Handshake },
  ] as const;

  return (
    <section className="bg-gray-dark py-24">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">
        <div>
          <div className="eyebrow">{t('eyebrow')}</div>
          <h2 className="mt-6 text-3xl font-bold leading-tight text-foreground md:text-4xl">
            {t.rich('h2', {
              em: (chunks) => <em className="text-gold not-italic">{chunks}</em>,
            })}
          </h2>
          <div className="gold-rule mt-6" />
          <p className="mt-6 leading-relaxed text-foreground/80">
            {t.rich('p1', {
              strong: (chunks) => <strong className="text-foreground">{chunks}</strong>,
            })}
          </p>
          <p className="mt-4 leading-relaxed text-foreground/80">
            {t.rich('p2', {
              strong: (chunks) => <strong className="text-foreground">{chunks}</strong>,
            })}
          </p>
          <p className="mt-4 leading-relaxed text-foreground/80">{t('p3')}</p>
          <div className="mt-8">
            <Button href="/nosotros">{t('cta')}</Button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {values.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="rounded-sm border border-border bg-background p-6 transition hover:border-gold/40"
            >
              <Icon className="h-8 w-8 text-gold" />
              <h4 className="mt-4 font-bold text-foreground">
                {t(`values.${key}.title`)}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                {t(`values.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
