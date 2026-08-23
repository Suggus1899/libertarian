'use client';

import { useTranslations } from 'next-intl';
import { BookOpen, Scale, Globe } from 'lucide-react';

export function Features() {
  const t = useTranslations('features');

  const items = [
    { key: 'research', icon: BookOpen },
    { key: 'debate', icon: Scale },
    { key: 'advice', icon: Globe },
  ] as const;

  return (
    <section className="section-dark grid gap-px bg-negro px-6 lg:grid-cols-3 lg:px-14">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.key}
            className="border-b border-r-0 border-white/[0.06] px-10 py-12 transition last:border-r-0 hover:bg-white/[0.03] lg:border-b-0 lg:border-r lg:px-10 lg:py-12"
          >
            <div className="font-display text-5xl font-black leading-none text-dorado-v">
              {t(`${item.key}.num`)}
            </div>
            <div className="mb-4 mt-5 text-[1.8rem]">
              <Icon className="h-8 w-8 text-blanco" strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-[1.1rem] font-extrabold uppercase tracking-[1.5px] text-blanco">
              {t(`${item.key}.title`)}
            </h2>
            <p className="mt-3 text-[0.9rem] leading-[1.75] text-white/50">
              {t(`${item.key}.description`)}
            </p>
            <div className="gold-rule mt-6" />
          </div>
        );
      })}
    </section>
  );
}
