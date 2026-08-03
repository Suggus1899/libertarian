'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Button } from './Button';
import type { EssayItem } from '@/lib/essays';

type FilterType = 'all' | 'ensayo' | 'opinion';

export function EssaysList({ items }: { items: EssayItem[] }) {
  const t = useTranslations('essays');
  const searchParams = useSearchParams();
  const initialFilter = (searchParams.get('type') as FilterType) || 'all';
  const [filter, setFilter] = useState<FilterType>(initialFilter);

  // Only show filter tabs if there are DB articles with a type
  const hasEnsayos = items.some((i) => i.type === 'ensayo');
  const hasOpinion = items.some((i) => i.type === 'opinion');
  const showFilters = hasEnsayos || hasOpinion;

  const filtered = showFilters
    ? items.filter((i) => {
        if (filter === 'all') return true;
        if (filter === 'ensayo') return i.type === 'ensayo' || i.type === null;
        if (filter === 'opinion') return i.type === 'opinion';
        return true;
      })
    : items;

  const tabs: { key: FilterType; label: string; show: boolean }[] = [
    { key: 'all', label: t('filter.all'), show: true },
    { key: 'ensayo', label: t('filter.essays'), show: true },
    { key: 'opinion', label: t('filter.opinion'), show: hasOpinion },
  ];

  return (
    <section className="bg-blanco px-6 py-16 lg:px-14">
      <div className="mx-auto max-w-6xl">
        {showFilters && (
          <div className="mb-10 flex flex-wrap gap-2 border-b border-gris-brd pb-4">
            {tabs.filter((tab) => tab.show).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-5 py-2.5 text-[0.72rem] font-bold uppercase tracking-[1.5px] transition ${
                  filter === tab.key
                    ? 'bg-negro text-blanco'
                    : 'border border-gris-brd text-gris-med hover:border-negro hover:text-negro'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((item) => (
            <Link
              key={item.slug}
              href={{
                pathname: '/ensayos/[slug]',
                params: { slug: item.slug },
              } as Parameters<typeof Link>[0]['href']}
              className="block overflow-hidden border border-gris-brd transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)]"
            >
              <article>
                {item.featuredImage && (
                  <div className="relative h-48 w-full overflow-hidden bg-gris-bg">
                    <Image src={item.featuredImage} alt="" fill unoptimized className="object-cover" />
                  </div>
                )}
                <div className="border-b border-gris-brd bg-gris-bg p-8">
                  <span className="font-display text-[0.68rem] font-bold uppercase tracking-[2.5px] text-dorado">
                    {item.category}
                  </span>
                  <h3 className="mt-2.5 font-display text-[1.25rem] font-bold leading-[1.35] text-negro">
                    {item.title}
                  </h3>
                </div>
                <div className="p-8">
                  <p className="text-[0.9rem] leading-[1.72] text-gris-med">
                    {item.description}
                  </p>
                  <div className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[1px] text-gris-cla">
                    {item.author} · {item.date}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-sm border border-gris-brd bg-gris-bg p-12 text-center">
          <div className="eyebrow eyebrow-center">{t('soon.eyebrow')}</div>
          <h3 className="mt-4 font-display text-2xl font-bold text-negro">
            {t('soon.title')}
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-gris-med">
            {t('soon.description')}
          </p>
          <div className="mt-8">
            <Button href="/contacto">{t('soon.cta')}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
