import { desc, count, eq, and, SQL } from 'drizzle-orm';
import Link from 'next/link';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import { articles } from '@/lib/db/schema';
import { DeleteButton } from './DeleteButton';
import { TranslateButton } from './TranslateButton';

export const metadata: Metadata = {
  title: 'Admin · Libertarian Forum',
};

function publicUrl(locale: string, slug: string) {
  const path = locale === 'en' ? 'essays' : 'ensayos';
  return `/${locale}/${path}/${slug}`;
}

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

  const [items, [{ total }], [{ pub }], [{ draft }]] = await Promise.all([
    db
      .select()
      .from(articles)
      .where(conds.length ? (conds.length === 1 ? conds[0] : and(...conds)) : undefined)
      .orderBy(desc(articles.createdAt)),
    db.select({ total: count() }).from(articles),
    db.select({ pub: count() }).from(articles).where(eq(articles.published, true)),
    db.select({ draft: count() }).from(articles).where(eq(articles.published, false)),
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
        <>
          {/* Desktop: table */}
          <div className="hidden overflow-x-auto border border-gris-brd bg-blanco md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gris-brd bg-gris-bg text-xs uppercase tracking-widest text-gris-cla">
                <tr>
                  <th className="px-4 py-3">Título</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Idioma</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-gris-brd last:border-0 transition hover:bg-gris-bg/50">
                    <td className="px-4 py-3 font-medium text-negro">{item.title}</td>
                    <td className="px-4 py-3 capitalize text-gris-med">{item.type}</td>
                    <td className="px-4 py-3">
                      <span className="border border-gris-brd px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-gris-med">
                        {item.locale}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.published ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-green-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-gris-cla">
                          <span className="h-1.5 w-1.5 rounded-full bg-gris-cla" />
                          Borrador
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {item.published && (
                          <a
                            href={publicUrl(item.locale, item.slug)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-gris-brd px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-widest text-gris-med transition hover:border-negro hover:text-negro"
                          >
                            Ver
                          </a>
                        )}
                        <Link
                          href={`/admin/articles/${item.id}/edit`}
                          className="border border-negro px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-widest text-negro transition hover:bg-negro hover:text-blanco"
                        >
                          Editar
                        </Link>
                        <TranslateButton id={item.id} locale={item.locale} />
                        <DeleteButton id={item.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {items.map((item) => (
              <article key={item.id} className="border border-gris-brd bg-blanco p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-negro">{item.title}</h3>
                  <span className="shrink-0 border border-gris-brd px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-gris-med">
                    {item.locale}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-2 text-xs text-gris-med">
                  <span className="capitalize">{item.type}</span>
                  <span>·</span>
                  {item.published ? (
                    <span className="font-semibold text-green-700">Publicado</span>
                  ) : (
                    <span>Borrador</span>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.published && (
                    <a
                      href={publicUrl(item.locale, item.slug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-gris-brd px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-widest text-gris-med transition hover:border-negro hover:text-negro"
                    >
                      Ver
                    </a>
                  )}
                  <Link
                    href={`/admin/articles/${item.id}/edit`}
                    className="border border-negro px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-widest text-negro transition hover:bg-negro hover:text-blanco"
                  >
                    Editar
                  </Link>
                  <TranslateButton id={item.id} locale={item.locale} />
                  <DeleteButton id={item.id} />
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
