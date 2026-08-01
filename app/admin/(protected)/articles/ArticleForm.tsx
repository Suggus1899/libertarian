'use client';

import { useActionState, useState } from 'react';
import Image from 'next/image';
import type { Article } from '@/lib/db/schema';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { MediaLibrary } from '@/components/admin/MediaLibrary';

type FormAction = (prevState: unknown, formData: FormData) => Promise<{ error: string } | void>;

export function ArticleForm({
  action,
  article,
}: {
  action: FormAction;
  article?: Article;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const [featuredImage, setFeaturedImage] = useState(article?.featuredImage ?? '');
  const [mediaOpen, setMediaOpen] = useState(false);

  return (
    <form action={formAction} className="max-w-3xl space-y-5">
      <div>
        <label htmlFor="title" className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gris-med">
          Título *
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={article?.title}
          className="w-full border border-gris-brd bg-blanco px-3 py-2.5 text-sm outline-none focus:border-negro"
        />
      </div>

      <div>
        <label htmlFor="slug" className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gris-med">
          Slug (URL) — se genera del título si lo dejás vacío
        </label>
        <input
          id="slug"
          name="slug"
          defaultValue={article?.slug}
          placeholder="mi-articulo-de-opinion"
          className="w-full border border-gris-brd bg-blanco px-3 py-2.5 text-sm outline-none focus:border-negro"
        />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label htmlFor="locale" className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gris-med">
            Idioma *
          </label>
          <select
            id="locale"
            name="locale"
            required
            defaultValue={article?.locale ?? 'es'}
            className="w-full border border-gris-brd bg-blanco px-3 py-2.5 text-sm outline-none focus:border-negro"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>

        <div>
          <label htmlFor="type" className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gris-med">
            Tipo *
          </label>
          <select
            id="type"
            name="type"
            required
            defaultValue={article?.type ?? 'opinion'}
            className="w-full border border-gris-brd bg-blanco px-3 py-2.5 text-sm outline-none focus:border-negro"
          >
            <option value="ensayo">Ensayo</option>
            <option value="opinion">Artículo de opinión</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label htmlFor="category" className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gris-med">
            Categoría *
          </label>
          <input
            id="category"
            name="category"
            required
            defaultValue={article?.category}
            placeholder="Economía, Filosofía Política..."
            className="w-full border border-gris-brd bg-blanco px-3 py-2.5 text-sm outline-none focus:border-negro"
          />
        </div>

        <div>
          <label htmlFor="author" className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gris-med">
            Autor *
          </label>
          <input
            id="author"
            name="author"
            required
            defaultValue={article?.author}
            className="w-full border border-gris-brd bg-blanco px-3 py-2.5 text-sm outline-none focus:border-negro"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gris-med">
          Descripción corta (para las tarjetas) *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={2}
          defaultValue={article?.description}
          className="w-full border border-gris-brd bg-blanco px-3 py-2.5 text-sm outline-none focus:border-negro"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gris-med">
          Imagen destacada
        </label>
        <input type="hidden" name="featuredImage" value={featuredImage} />
        {featuredImage ? (
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-40 overflow-hidden border border-gris-brd bg-gris-bg">
              <Image src={featuredImage} alt="" fill unoptimized className="object-cover" />
            </div>
            <div className="flex flex-col gap-2">
              <button type="button" onClick={() => setMediaOpen(true)} className="text-xs font-semibold uppercase tracking-widest text-negro hover:text-dorado">
                Cambiar
              </button>
              <button type="button" onClick={() => setFeaturedImage('')} className="text-xs font-semibold uppercase tracking-widest text-red-600 hover:text-red-800">
                Quitar
              </button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setMediaOpen(true)} className="btn-o py-2.5 text-xs">
            Elegir imagen destacada
          </button>
        )}
        <MediaLibrary open={mediaOpen} onClose={() => setMediaOpen(false)} onSelect={setFeaturedImage} />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gris-med">
          Contenido completo *
        </label>
        <RichTextEditor name="content" defaultValue={article?.content} />
      </div>

      <fieldset className="border border-gris-brd p-4">
        <legend className="px-2 text-xs font-semibold uppercase tracking-widest text-gris-med">
          SEO (opcional — si se deja vacío se usa el título/descripción)
        </legend>
        <div className="space-y-4">
          <div>
            <label htmlFor="seoTitle" className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gris-cla">
              Título SEO
            </label>
            <input
              id="seoTitle"
              name="seoTitle"
              defaultValue={article?.seoTitle ?? ''}
              className="w-full border border-gris-brd bg-blanco px-3 py-2.5 text-sm outline-none focus:border-negro"
            />
          </div>
          <div>
            <label htmlFor="seoDescription" className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gris-cla">
              Descripción SEO
            </label>
            <textarea
              id="seoDescription"
              name="seoDescription"
              rows={2}
              defaultValue={article?.seoDescription ?? ''}
              className="w-full border border-gris-brd bg-blanco px-3 py-2.5 text-sm outline-none focus:border-negro"
            />
          </div>
        </div>
      </fieldset>

      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={article?.published ?? true}
          className="h-4 w-4"
        />
        <label htmlFor="published" className="text-sm text-gris-med">
          Publicado (visible en el sitio)
        </label>
      </div>

      {state?.error && (
        <p className="text-sm font-semibold text-red-600">{state.error}</p>
      )}

      <button type="submit" disabled={pending} className="btn-p">
        {pending ? 'Guardando...' : 'Guardar artículo'}
      </button>
    </form>
  );
}
