import { desc, count, eq, and, SQL } from 'drizzle-orm';
import Link from 'next/link';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import { articles } from '@/lib/db/schema';
import { ArticlesTable } from './ArticlesTable';

export const metadata: Metadata = {
  title: 'Admin · Libertarian Forum',
};

function filterHref(locale?: string, status?: string) {
  const params = new URLSearchParams();
  if (locale) params.set('locale', locale);
  if (status) params.set('status', status);
  const q = params.toString();
  return `/admin${q ? `?${q}` : ''}`;
}

type Filters = { locale?: string; status?: string };

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<Filters>;
}) {
  const { locale: lf, status: sf } = await searchParams;

  const conds: SQL[] = [];
  if (lf === 'es' || lf === 'en') conds.push(eq(articles.locale, lf));
  if (sf === 'published') conds.push(eq(articles.published, true));
  if (sf === 'draft') conds.push(eq(articles.published, false));

  const [items, [{ total }], [{ pub }], [{ draft }], topRead] = await Promise.all([
    db
      .select()
      .from(articles)
      .where(conds.length ? (conds.length === 1 ? conds[0] : and(...conds)) : undefined)
      .orderBy(desc(articles.createdAt)),
    db.select({ total: count() }).from(articles),
    db.select({ pub: count() }).from(articles).where(eq(articles.published, true)),
    db.select({ draft: count() }).from(articles).where(eq(articles.published, false)),
    db
      .select({ id: articles.id, title: articles.title, locale: articles.locale, slug: articles.slug, views: articles.views })
      .from(articles)
      .orderBy(desc(articles.views))
      .limit(5),
  ]);

  const filterDefs = [
    { label: 'Todos' },
    { label: 'ES', locale: 'es' },
    { label: 'EN', locale: 'en' },
    { label: 'Publicados', status: 'published' },
    { label: 'Borradores', status: 'draft' },
  ] as { label: string; locale?: string; status?: string }[];

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-xl font-black uppercase tracking-[1px] text-negro sm:text-2xl">
          Artículos
        </h1>
        <Link href="/admin/articles/new" className="btn-p">
          + Nuevo artículo
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {([
          { label: 'Total', value: total, cls: 'text-negro' },
          { label: 'Publicados', value: pub, cls: 'text-green-700' },
          { label: 'Borradores', value: draft, cls: 'text-gris-cla' },
        ] as { label: string; value: number; cls: string }[]).map(({ label, value, cls }) => (
          <div key={label} className="border border-gris-brd bg-blanco px-4 py-3">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[2px] text-gris-med">{label}</p>
            <p className={`mt-1 font-display text-2xl font-black ${cls}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Analytics: most-read */}
      {topRead.some((r) => (r.views ?? 0) > 0) && (
        <div className="mb-6 border border-gris-brd bg-blanco p-4">
          <h2 className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[2px] text-gris-med">
            Más leídos
          </h2>
          <ol className="space-y-2">
            {topRead.filter((r) => (r.views ?? 0) > 0).map((r, i) => (
              <li key={r.id} className="flex items-center gap-3 text-sm">
                <span className="w-4 shrink-0 text-right text-[0.6rem] font-bold text-gris-cla">{i + 1}</span>
                <Link
                  href={`/admin/articles/${r.id}/edit`}
                  className="flex-1 truncate font-medium text-negro hover:text-dorado"
                >
                  {r.title}
                </Link>
                <span className="shrink-0 border border-gris-brd px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-gris-med">
                  {r.locale}
                </span>
                <span className="shrink-0 text-xs font-semibold text-gris-med">{r.views} vistas</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {filterDefs.map(({ label, locale, status }) => {
          const active =
            (locale ?? '') === (lf ?? '') && (status ?? '') === (sf ?? '');
          return (
            <Link
              key={label}
              href={filterHref(locale, status)}
              className={`border px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[2px] transition ${
                active
                  ? 'border-negro bg-negro text-blanco'
                  : 'border-gris-brd bg-blanco text-gris-med hover:border-negro hover:text-negro'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {items.length === 0 ? (
        <p className="py-8 text-center text-gris-med">No hay artículos que coincidan.</p>
      ) : (
        <ArticlesTable items={items} />
      )}
    </div>
  );
}
