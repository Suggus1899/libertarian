'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from './Button';

export function FinalCta() {
  const t = useTranslations('cta');

  return (
    <section className="relative overflow-hidden bg-negro px-6 py-24 text-center lg:px-14">
      <div className="pointer-events-none absolute inset-0 flex select-none items-center justify-center">
        <span className="font-display text-[clamp(15rem,30vw,40rem)] font-black leading-none text-white/[0.015]">
          &rsquo;
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="eyebrow eyebrow-center mb-5">{t('eyebrow')}</div>
        <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-black leading-[1.15] text-blanco">
          {t.rich('h2', {
            br: () => <br />,
            em: (chunks) => <em className="italic text-dorado">{chunks}</em>,
          })}
        </h2>
        <p className="mx-auto mt-5 max-w-[560px] text-base leading-[1.8] text-white/55">
          {t('description')}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3.5">
          <Button href="/contacto" variant="secondary">
            {t('ctaPrimary')}
          </Button>
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 border-2 border-white/20 bg-transparent px-8 py-3.5 font-display text-[0.88rem] font-bold uppercase tracking-[2px] text-white transition hover:border-white"
          >
            {t('ctaSecondary')}
          </Link>
        </div>
      </div>
    </section>
  );
}
