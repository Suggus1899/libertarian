'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from './Button';
import type { EssayItem } from '@/lib/essays';

export function EssaysPreview({ items }: { items: EssayItem[] }) {
  const t = useTranslations('essays');
  const preview = items.slice(0, 3);

  return (
    <section className="bg-gris-bg px-6 py-24 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="section-hdr text-center">
          <div className="eyebrow eyebrow-center">{t('eyebrow')}</div>
          <h2>
            {t.rich('h2', {
              em: (chunks) => <em className="italic text-dorado">{chunks}</em>,
            })}
          </h2>
          <p className="mx-auto">{t('description')}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {preview.map((item, index) => (
            <Link
              key={item.slug}
              href={{
                pathname: '/ensayos/[slug]',
                params: { slug: item.slug },
              } as Parameters<typeof Link>[0]['href']}
              className="group block cursor-pointer overflow-hidden border border-gris-brd bg-blanco transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
            >
              <div
                className={`h-[3px] ${index % 2 === 0 ? 'bg-dorado' : 'bg-negro'}`}
              />
              <div className="p-7">
                <span
                  className={`font-display text-[0.68rem] font-bold uppercase tracking-[2.5px] ${
                    index % 2 === 0 ? 'text-dorado' : 'text-negro'
                  }`}
                >
                  {item.category}
                </span>
                <h3 className="mt-2.5 font-display text-[1.15rem] font-bold leading-[1.35] text-negro">
                  {item.title}
                </h3>
                <p className="mb-4 mt-2.5 text-[0.85rem] leading-[1.65] text-gris-med">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[1px] text-gris-cla">
                  <span className="text-dorado">—</span>
                  {item.author} · {item.date}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Button href="/ensayos">{t('cta')}</Button>
        </div>
      </div>
    </section>
  );
}
