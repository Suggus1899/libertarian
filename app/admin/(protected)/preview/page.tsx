'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type Preview = {
  title: string;
  description: string;
  category: string;
  author: string;
  locale: string;
  featuredImage: string;
  content: string;
  ts: number;
};

export default function PreviewPage() {
  const [p, setP] = useState<Preview | null>(null);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('article-preview');
    if (!raw) return setEmpty(true);
    try {
      setP(JSON.parse(raw) as Preview);
    } catch {
      setEmpty(true);
    }
  }, []);

  if (empty) {
    return (
      <div className="mx-auto max-w-2xl p-10 text-center">
        <h1 className="mb-4 font-display text-2xl font-black uppercase">Sin borrador</h1>
        <p className="text-gris-med">
          Abrí esta página desde el editor de artículos usando el botón «Vista previa».
        </p>
      </div>
    );
  }

  if (!p) return null;

  const dateStr = new Intl.DateTimeFormat(p.locale === 'es' ? 'es-ES' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(p.ts));

  return (
    <>
      <div className="border-b border-dorado bg-dorado/10 px-6 py-2 text-center text-xs font-semibold uppercase tracking-widest text-negro">
        Vista previa · No visible al público
      </div>
      <article className="bg-blanco px-6 py-16 lg:px-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 border-b border-gris-brd pb-10">
            <span className="font-display text-[0.72rem] font-bold uppercase tracking-[2px] text-dorado">
              {p.category || 'Sin categoría'}
            </span>
            <h1 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.8rem)] font-black leading-[1.15] text-negro">
              {p.title || 'Sin título'}
            </h1>
            <div className="mt-4 flex gap-4 text-sm text-gris-cla">
              <span>{dateStr}</span>
              <span>·</span>
              <span>{p.author || 'Sin autor'}</span>
            </div>
            {p.description && (
              <p className="mt-4 text-base text-gris-med">{p.description}</p>
            )}
          </div>
          {p.featuredImage && (
            <div className="relative mb-10 h-72 w-full overflow-hidden bg-gris-bg sm:h-96">
              <Image
                src={p.featuredImage}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}
          <div
            className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-negro prose-p:text-gris-med prose-a:text-dorado"
            dangerouslySetInnerHTML={{ __html: p.content }}
          />
        </div>
      </article>
    </>
  );
}
