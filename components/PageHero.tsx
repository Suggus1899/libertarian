'use client';

import { useTranslations } from 'next-intl';

interface PageHeroProps {
  eyebrowKey: string;
  titleKey: string;
  introKey: string;
  bgText?: string;
}

export function PageHero({ eyebrowKey, titleKey, introKey, bgText }: PageHeroProps) {
  const t = useTranslations();

  return (
    <div className="relative overflow-hidden bg-negro px-6 py-20 lg:px-14 lg:py-24">
      {bgText && (
        <div className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none overflow-hidden sm:right-0">
          <span className="page-hero-watermark block -translate-x-5 font-display font-black uppercase">
            {bgText}
          </span>
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-3xl lg:mx-0">
        <div className="eyebrow mb-3.5">{t(eyebrowKey)}</div>
        <h1 className="font-display text-[clamp(2.4rem,4.5vw,3.6rem)] font-black leading-[1.1] text-blanco">
          {t.rich(titleKey, {
            br: () => <br />,
            em: (chunks) => <em className="italic text-dorado">{chunks}</em>,
          })}
        </h1>
        <p className="mt-5 max-w-[640px] text-base leading-[1.8] text-white/60">
          {t(introKey)}
        </p>
      </div>
    </div>
  );
}
