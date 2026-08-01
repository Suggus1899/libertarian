import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { db } from '@/lib/db';
import { articles } from '@/lib/db/schema';
import { DeleteButton } from './DeleteButton';

function publicUrl(locale: string, slug: string) {
  const path = locale === 'en' ? 'essays' : 'ensayos';
  return `/${locale}/${path}/${slug}`;
}

export default async function AdminDashboard() {
  const items = await db.select().from(articles).orderBy(desc(articles.createdAt));

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-xl font-black uppercase tracking-[1px] text-negro sm:text-2xl">
          Artículos
        </h1>
        <Link href="/admin/articles/new" className="btn-p">
          + Nuevo artículo
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-gris-med">Todavía no hay artículos cargados.</p>
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
                  <tr key={item.id} className="border-b border-gris-brd last:border-0">
                    <td className="px-4 py-3 font-medium text-negro">{item.title}</td>
                    <td className="px-4 py-3 capitalize text-gris-med">{item.type}</td>
                    <td className="px-4 py-3 uppercase text-gris-med">{item.locale}</td>
                    <td className="px-4 py-3">
                      {item.published ? (
                        <span className="text-xs font-semibold uppercase text-green-700">Publicado</span>
                      ) : (
                        <span className="text-xs font-semibold uppercase text-gris-cla">Borrador</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        {item.published && (
                          <a
                            href={publicUrl(item.locale, item.slug)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold uppercase tracking-widest text-gris-med hover:text-negro"
                          >
                            Ver
                          </a>
                        )}
                        <Link
                          href={`/admin/articles/${item.id}/edit`}
                          className="text-xs font-semibold uppercase tracking-widest text-negro hover:text-dorado"
                        >
                          Editar
                        </Link>
                        <DeleteButton id={item.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <div className="flex flex-col gap-4 md:hidden">
            {items.map((item) => (
              <article key={item.id} className="border border-gris-brd bg-blanco p-4">
                <h3 className="font-medium text-negro">{item.title}</h3>
                <div className="mt-2 flex flex-wrap gap-2 text-xs uppercase tracking-widest text-gris-med">
                  <span className="capitalize">{item.type}</span>
                  <span>·</span>
                  <span>{item.locale}</span>
                  <span>·</span>
                  {item.published ? (
                    <span className="font-semibold text-green-700">Publicado</span>
                  ) : (
                    <span className="text-gris-cla">Borrador</span>
                  )}
                </div>
                <div className="mt-4 flex gap-4">
                  {item.published && (
                    <a
                      href={publicUrl(item.locale, item.slug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold uppercase tracking-widest text-gris-med hover:text-negro"
                    >
                      Ver
                    </a>
                  )}
                  <Link
                    href={`/admin/articles/${item.id}/edit`}
                    className="text-xs font-semibold uppercase tracking-widest text-negro hover:text-dorado"
                  >
                    Editar
                  </Link>
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
