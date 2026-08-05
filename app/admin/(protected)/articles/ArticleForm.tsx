'use client';

import { useActionState, useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import type { Article } from '@/lib/db/schema';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { MediaLibrary } from '@/components/admin/MediaLibrary';
import { saveDraft } from '../../actions';

type FormAction = (prevState: unknown, formData: FormData) => Promise<{ error: string } | void>;

type Draft = {
  ts: number;
  values: Record<string, string>;
  content: string;
};

const AUTOSAVE_MS = 5000;
const DB_AUTOSAVE_MS = 30_000;

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function relativeTime(from: number): string {
  const s = Math.round((Date.now() - from) / 1000);
  if (s < 60) return `hace ${s}s`;
  const m = Math.round(s / 60);
  if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.round(h / 24)} d`;
}

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
  const [content, setContent] = useState(article?.content ?? '');
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [dbSavedAt, setDbSavedAt] = useState<number | null>(null);
  const [dbSaving, setDbSaving] = useState(false);
  const [draftOffer, setDraftOffer] = useState<Draft | null>(null);
  const [, tick] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  // Slug auto-generation
  const [slug, setSlug] = useState(article?.slug ?? '');
  const [slugManual, setSlugManual] = useState(!!article?.slug);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!slugManual) {
      setSlug(slugify(e.target.value));
    }
  }, [slugManual]);

  const handleSlugChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManual(true);
    setSlug(e.target.value);
  }, []);

  const handleSlugReset = useCallback(() => {
    setSlugManual(false);
    const titleInput = formRef.current?.elements.namedItem('title') as HTMLInputElement | null;
    if (titleInput) setSlug(slugify(titleInput.value));
  }, []);

  const storageKey = `article-draft-${article?.id ?? 'new'}`;

  // Offer to restore a draft on mount if one exists and differs from the article.
  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (!raw) return;
    try {
      const draft = JSON.parse(raw) as Draft;
      const differs =
        draft.content !== (article?.content ?? '') ||
        draft.values.title !== (article?.title ?? '') ||
        draft.values.description !== (article?.description ?? '');
      if (differs) setDraftOffer(draft);
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey, article]);

  // Autosave loop.
  useEffect(() => {
    const id = setInterval(() => {
      if (!formRef.current) return;
      const fd = new FormData(formRef.current);
      const values: Record<string, string> = {};
      for (const [k, v] of fd.entries()) {
        if (typeof v === 'string' && k !== 'content') values[k] = v;
      }
      const draft: Draft = { ts: Date.now(), values, content };
      localStorage.setItem(storageKey, JSON.stringify(draft));
      setSavedAt(draft.ts);
    }, AUTOSAVE_MS);
    return () => clearInterval(id);
  }, [content, storageKey]);

  // DB autosave — debounced 30s, creates/updates an unpublished draft row.
  const draftIdRef = useRef<number | undefined>(article?.id);
  useEffect(() => {
    const id = setInterval(async () => {
      if (!formRef.current || dbSaving) return;
      const fd = new FormData(formRef.current);
      const title = String(fd.get('title') ?? '');
      // Don't save empty drafts
      if (!title && !content) return;
      setDbSaving(true);
      try {
        const res = await saveDraft(draftIdRef.current, {
          title,
          slug: String(fd.get('slug') ?? ''),
          locale: String(fd.get('locale') ?? 'es'),
          type: String(fd.get('type') ?? 'opinion'),
          category: String(fd.get('category') ?? ''),
          description: String(fd.get('description') ?? ''),
          author: String(fd.get('author') ?? ''),
          content,
          featuredImage: String(fd.get('featuredImage') ?? ''),
          seoTitle: String(fd.get('seoTitle') ?? ''),
          seoDescription: String(fd.get('seoDescription') ?? ''),
        });
        if (!res.error && res.id) {
          draftIdRef.current = res.id;
          setDbSavedAt(Date.now());
        }
      } catch {
        // silent — localStorage autosave is still the safety net
      } finally {
        setDbSaving(false);
      }
    }, DB_AUTOSAVE_MS);
    return () => clearInterval(id);
  }, [content, dbSaving]);

  // Tick every 15s so "hace Xs" updates without saving.
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 15000);
    return () => clearInterval(id);
  }, []);

  function restoreDraft() {
    if (!draftOffer || !formRef.current) return;
    const form = formRef.current;
    for (const [name, value] of Object.entries(draftOffer.values)) {
      const el = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      if (!el) continue;
      if (el instanceof HTMLInputElement && el.type === 'checkbox') {
        el.checked = value === 'on';
      } else {
        el.value = value;
      }
    }
    if (draftOffer.values.featuredImage) setFeaturedImage(draftOffer.values.featuredImage);
    setContent(draftOffer.content);
    setDraftOffer(null);
  }

  function discardDraft() {
    localStorage.removeItem(storageKey);
    setDraftOffer(null);
    setSavedAt(null);
  }

  function handleSubmit() {
    localStorage.removeItem(storageKey);
  }

  function openPreview() {
    const id = draftIdRef.current;
    if (id) {
      // Use the DB-based preview route (works across tabs/devices)
      window.open(`/admin/preview/${id}`, '_blank', 'noopener');
      return;
    }
    // Fallback: sessionStorage for brand-new unsaved articles
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const preview = {
      title: String(fd.get('title') ?? ''),
      description: String(fd.get('description') ?? ''),
      category: String(fd.get('category') ?? ''),
      author: String(fd.get('author') ?? ''),
      locale: String(fd.get('locale') ?? 'es'),
      featuredImage: String(fd.get('featuredImage') ?? ''),
      content,
      ts: Date.now(),
    };
    sessionStorage.setItem('article-preview', JSON.stringify(preview));
    window.open('/admin/preview', '_blank', 'noopener');
  }

  return (
    <form ref={formRef} action={formAction} onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      {draftOffer && (
        <div className="flex items-center justify-between border border-dorado bg-dorado/10 px-4 py-3">
          <span className="text-sm text-negro">
            Hay un borrador sin guardar de {relativeTime(draftOffer.ts)}.
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={restoreDraft}
              className="border border-negro bg-negro px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-blanco"
            >
              Restaurar
            </button>
            <button
              type="button"
              onClick={discardDraft}
              className="border border-gris-brd bg-blanco px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-gris-med hover:border-negro hover:text-negro"
            >
              Descartar
            </button>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="title" className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gris-med">
          Título *
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={article?.title}
          onChange={handleTitleChange}
          className="w-full border border-gris-brd bg-blanco px-3 py-2.5 text-sm outline-none focus:border-negro"
        />
      </div>

      <div>
        <label htmlFor="slug" className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gris-med">
          Slug (URL) {slugManual ? '· editado manualmente' : '· generado del título'}
        </label>
        <div className="flex gap-2">
          <input
            id="slug"
            name="slug"
            value={slug}
            onChange={handleSlugChange}
            placeholder="mi-articulo-de-opinion"
            className="w-full border border-gris-brd bg-blanco px-3 py-2.5 text-sm outline-none focus:border-negro"
          />
          {slugManual && (
            <button
              type="button"
              onClick={handleSlugReset}
              className="whitespace-nowrap border border-gris-brd bg-blanco px-3 py-2.5 text-xs font-semibold uppercase tracking-widest text-gris-med hover:border-negro hover:text-negro"
              title="Volver a generar automáticamente del título"
            >
              Auto
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
        <RichTextEditor name="content" defaultValue={article?.content} onChange={setContent} />
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

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="btn-p">
          {pending ? 'Guardando...' : 'Guardar artículo'}
        </button>
        <button type="button" onClick={openPreview} className="btn-o py-2.5 text-xs">
          Vista previa
        </button>
        <span className="text-xs text-gris-cla">
          {dbSaving
            ? 'Guardando en DB...'
            : dbSavedAt
              ? `DB guardado ${relativeTime(dbSavedAt)}`
              : savedAt
                ? `Local guardado ${relativeTime(savedAt)}`
                : 'Autosave activo'}
        </span>
      </div>
    </form>
  );
}
