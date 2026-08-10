'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Button } from './Button';
import type { EssayItem } from '@/lib/essays';

type FilterType = 'all' | 'ensayo' | 'opinion';
const ITEMS_PER_PAGE = 12;

export function EssaysList({ items }: { items: EssayItem[] }) {
  const t = useTranslations('essays');
  const searchParams = useSearchParams();
  const initialFilter = (searchParams.get('type') as FilterType) || 'all';
  const initialAuthor = searchParams.get('autor') || '';

  const [filter, setFilter] = useState<FilterType>(initialFilter);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState(initialAuthor);
  const [page, setPage] = useState(1);

  const hasEnsayos = items.some((i) => i.type === 'ensayo');
  const hasOpinion = items.some((i) => i.type === 'opinion');
  const showFilters = hasEnsayos || hasOpinion;

  const categories = [...new Set(items.map((i) => i.category))].filter(Boolean).sort();
  const authors = [...new Set(items.map((i) => i.author))].filter(Boolean).sort();

  function resetPage() { setPage(1); }

  const filtered = items.filter((i) => {
    const matchType =
      filter === 'all' ||
      (filter === 'ensayo' ? i.type === 'ensayo' || i.type === null : i.type === 'opinion');
    const matchCategory = !category || i.category === category;
    const matchAuthor = !author || i.author === author;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.author.toLowerCase().includes(q);
    return matchType && matchCategory && matchAuthor && matchSearch;
  });

  const paginated = filtered.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = filtered.length > page * ITEMS_PER_PAGE;

  const tabs: { key: FilterType; label: string; show: boolean }[] = [
    { key: 'all', label: t('filter.all'), show: true },
    { key: 'ensayo', label: t('filter.essays'), show: true },
    { key: 'opinion', label: t('filter.opinion'), show: hasOpinion },
  ];

  return (
    <section className="bg-blanco px-6 py-16 lg:px-14">
      <div className="mx-auto max-w-6xl">

        {/* Search + Author filter */}
        <div className="mb-6 flex flex-wrap gap-3">
          <input
            type="search"
            placeholder={t('filter.search')}
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            className="w-full border border-gris-brd bg-blanco px-4 py-3 text-sm text-negro outline-none transition placeholder:text-gris-cla focus:border-negro sm:max-w-sm"
          />
          {authors.length > 1 && (
            <select
              value={author}
              onChange={(e) => { setAuthor(e.target.value); resetPage(); }}
              className="border border-gris-brd bg-blanco px-4 py-3 text-sm text-negro outline-none transition focus:border-negro"
            >
              <option value="">{t('filter.allAuthors')}</option>
              {authors.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          )}
        </div>

        {/* Type tabs */}
        {showFilters && (
          <div className="mb-4 flex flex-wrap gap-2">
            {tabs.filter((tab) => tab.show).map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setFilter(tab.key); resetPage(); }}
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

        {/* Category chips */}
        {categories.length > 1 && (
          <div className="mb-10 flex flex-wrap gap-2 border-b border-gris-brd pb-6">
            <button
              onClick={() => { setCategory(''); resetPage(); }}
              className={`px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[2px] transition ${
                !category
                  ? 'bg-dorado/10 text-dorado border border-dorado/40'
                  : 'border border-gris-brd text-gris-cla hover:border-dorado/40 hover:text-dorado'
              }`}
            >
              {t('filter.allCategories')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat === category ? '' : cat); resetPage(); }}
                className={`px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[2px] transition ${
                  category === cat
                    ? 'bg-dorado/10 text-dorado border border-dorado/40'
                    : 'border border-gris-brd text-gris-cla hover:border-dorado/40 hover:text-dorado'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-gris-med">{t('filter.noResults')}</p>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              {paginated.map((item) => (
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
                      <p className="text-[0.9rem] leading-[1.72] text-gris-med">{item.description}</p>
                      <div className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[1px] text-gris-cla">
                        {item.author} · {item.date} · {item.readingTime} min
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="btn-o py-3 text-xs"
                >
                  {t('filter.loadMore')}
                </button>
              </div>
            )}
          </>
        )}

        <div className="mt-16 rounded-sm border border-gris-brd bg-gris-bg p-12 text-center">
          <div className="eyebrow eyebrow-center">{t('soon.eyebrow')}</div>
          <h3 className="mt-4 font-display text-2xl font-bold text-negro">{t('soon.title')}</h3>
          <p className="mx-auto mt-3 max-w-xl text-gris-med">{t('soon.description')}</p>
          <div className="mt-8">
            <Button href="/contacto">{t('soon.cta')}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
