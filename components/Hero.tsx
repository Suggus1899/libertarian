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
    <section className="relative grid min-h-screen items-start gap-12 overflow-hidden bg-blanco px-6 pb-20 pt-32 lg:grid-cols-2 lg:items-start lg:px-14 lg:pb-20 lg:pt-32">
      {/* Decorative clipped background */}
      <div className="absolute right-0 top-0 -z-0 hidden h-full w-[45%] bg-gris-bg hero-bg-shape lg:block" />

      <div className="relative z-10 max-w-2xl">
        <div className="eyebrow animate-fade-up opacity-0">{t('eyebrow')}</div>
        <h1 className="animate-fade-up animation-delay-200 font-display text-[clamp(2.8rem,5vw,4.4rem)] font-black uppercase leading-[1.08] tracking-[1px] text-negro opacity-0">
          {t.rich('h1', {
            br: () => <br />,
            em: (chunks) => <em className="italic text-dorado">{chunks}</em>,
          })}
        </h1>
        <div className="gold-rule animate-fade-up animation-delay-200 opacity-0" />
        <p className="animate-fade-up animation-delay-300 max-w-[500px] text-[1.05rem] leading-[1.85] text-gris-med opacity-0">
          {t.rich('description', {
            strong: (chunks) => <strong className="font-semibold text-negro">{chunks}</strong>,
          })}
        </p>
        <div className="animate-fade-up animation-delay-400 mt-10 flex flex-wrap gap-3.5 opacity-0">
          <Button href="/servicios">{t('ctaPrimary')}</Button>
          <Button href="/ensayos" variant="outline">
            {t('ctaSecondary')}
          </Button>
        </div>
      </div>

      <div className="animate-fade-up animation-delay-200 relative z-10 hidden lg:block lg:pt-16">
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`border border-gris-brd bg-gris-bg p-7 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] ${
                index === 0 || index === 3 ? 'border-t-[3px] border-t-dorado' : 'border-t-[3px] border-t-negro'
              }`}
            >
              <div className="inline-block bg-negro px-3 py-1.5 font-display text-sm font-black uppercase tracking-[2px] text-blanco">
                {stat.label}
              </div>
              <div className="mt-3 text-xs font-semibold uppercase tracking-[1.5px] text-gris-med">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
