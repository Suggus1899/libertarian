'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { bulkUpdateArticles } from '@/app/admin/actions';
import { TranslateButton } from './TranslateButton';
import { DeleteButton } from './DeleteButton';
import type { Article } from '@/lib/db/schema';

function publicUrl(locale: string, slug: string) {
  const path = locale === 'en' ? 'essays' : 'ensayos';
  return `/${locale}/${path}/${slug}`;
}

function articleStatus(item: Article): 'published' | 'scheduled' | 'draft' {
  if (item.published) return 'published';
  if (item.publishAt && new Date(item.publishAt) > new Date()) return 'scheduled';
  return 'draft';
}

function StatusBadge({ item }: { item: Article }) {
  const status = articleStatus(item);
  if (status === 'published')
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-green-700">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Publicado
      </span>
    );
  if (status === 'scheduled')
    return (
      <span className="inline-flex flex-col gap-0.5">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-dorado">
          <span className="h-1.5 w-1.5 rounded-full bg-dorado" />
          Programado
        </span>
        <span className="text-[0.6rem] text-gris-cla">
          {new Date(item.publishAt!).toLocaleDateString('es-AR', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
          })}
        </span>
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-gris-cla">
      <span className="h-1.5 w-1.5 rounded-full bg-gris-cla" />
      Borrador
    </span>
  );
}

export function ArticlesTable({ items }: { items: Article[] }) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [pending, startTransition] = useTransition();

  const allSelected = items.length > 0 && selected.size === items.length;

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(items.map((i) => i.id)));
  }

  function toggle(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function bulk(action: 'publish' | 'unpublish' | 'delete') {
    if (action === 'delete' && !confirm(`¿Eliminar ${selected.size} artículo(s)?`)) return;
    startTransition(async () => {
      await bulkUpdateArticles([...selected], action);
      setSelected(new Set());
    });
  }

  return (
    <div>
      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 border border-dorado/30 bg-dorado/5 px-4 py-2.5">
          <span className="text-xs font-semibold text-negro">{selected.size} seleccionado(s)</span>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => bulk('publish')}
              disabled={pending}
              className="border border-green-600 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-widest text-green-700 transition hover:bg-green-50 disabled:opacity-50"
            >
              Publicar
            </button>
            <button
              onClick={() => bulk('unpublish')}
              disabled={pending}
              className="border border-gris-brd px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-widest text-gris-med transition hover:border-negro hover:text-negro disabled:opacity-50"
            >
              Despublicar
            </button>
            <button
              onClick={() => bulk('delete')}
              disabled={pending}
              className="border border-red-200 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-widest text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              Eliminar
            </button>
          </div>
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden overflow-x-auto border border-gris-brd bg-blanco md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gris-brd bg-gris-bg text-xs uppercase tracking-widest text-gris-cla">
            <tr>
              <th className="px-4 py-3">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-3.5 w-3.5" />
              </th>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Idioma</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Vistas</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className={`border-b border-gris-brd last:border-0 transition hover:bg-gris-bg/50 ${selected.has(item.id) ? 'bg-dorado/5' : ''}`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(item.id)}
                    onChange={() => toggle(item.id)}
                    className="h-3.5 w-3.5"
                  />
                </td>
                <td className="px-4 py-3 font-medium text-negro">{item.title}</td>
                <td className="px-4 py-3 capitalize text-gris-med">{item.type}</td>
                <td className="px-4 py-3">
                  <span className="border border-gris-brd px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-gris-med">
                    {item.locale}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge item={item} />
                </td>
                <td className="px-4 py-3 text-sm text-gris-med">{item.views ?? 0}</td>
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

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {items.map((item) => (
          <article
            key={item.id}
            className={`border border-gris-brd bg-blanco p-4 ${selected.has(item.id) ? 'border-dorado/40 bg-dorado/5' : ''}`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selected.has(item.id)}
                onChange={() => toggle(item.id)}
                className="mt-1 h-3.5 w-3.5 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-negro">{item.title}</h3>
                  <span className="shrink-0 border border-gris-brd px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-gris-med">
                    {item.locale}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gris-med">
                  <span className="capitalize">{item.type}</span>
                  <span>·</span>
                  <StatusBadge item={item} />
                  <span>·</span>
                  <span>{item.views ?? 0} vistas</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
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
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
