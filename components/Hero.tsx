'use client';

import { useTranslations } from 'next-intl';
import { Button } from './Button';

export function Hero() {
  const t = useTranslations('hero');

  const stats = [
    { label: t('stats.ideas.label'), desc: t('stats.ideas.desc') },
    { label: t('stats.tesis.label'), desc: t('stats.tesis.desc') },
    { label: t('stats.strat.label'), desc: t('stats.strat.desc') },
    { label: t('stats.mktg.label'), desc: t('stats.mktg.desc') },
  ];

  return (
    <section className="hero-bg relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <div className="max-w-2xl">
          <div className="eyebrow animate-fade-in-up opacity-0">
            {t('eyebrow')}
          </div>
          <h1 className="animate-fade-in-up animation-delay-100 opacity-0 mt-6 text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {t.rich('h1', {
              br: () => <br />,
              em: (chunks) => <em className="text-gold not-italic">{chunks}</em>,
            })}
          </h1>
          <div className="animate-fade-in-up animation-delay-200 opacity-0 gold-rule mt-8" />
          <p className="animate-fade-in-up animation-delay-200 opacity-0 mt-8 text-lg leading-relaxed text-foreground/80">
            {t.rich('description', {
              strong: (chunks) => <strong className="text-foreground">{chunks}</strong>,
            })}
          </p>
          <div className="animate-fade-in-up animation-delay-300 opacity-0 mt-10 flex flex-wrap gap-4">
            <Button href="/servicios">{t('ctaPrimary')}</Button>
            <Button href="/ensayos" variant="outline">
              {t('ctaSecondary')}
            </Button>
          </div>
        </div>

        <div className="animate-fade-in-up animation-delay-300 opacity-0 hidden lg:block">
          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-sm border border-border bg-gray-dark/50 p-6 backdrop-blur-sm transition hover:border-gold/30"
              >
                <div className="text-2xl font-bold text-gold">{stat.label}</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-widest text-foreground/60">
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
