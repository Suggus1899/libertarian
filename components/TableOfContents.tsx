'use client';

import { useMemo, useState } from 'react';

type TocItem = { id: string; text: string; level: number };

function slugifyHeading(text: string, index: number): string {
  return (
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `heading-${index}`
  );
}

function extractHeadings(html: string): TocItem[] {
  const regex = /<h([23])(?:\s[^>]*)?>(.+?)<\/h\1>/gi;
  const items: TocItem[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = Number(match[1]);
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    if (!text) continue;
    items.push({ id: slugifyHeading(text, items.length), text, level });
  }
  return items;
}

export function TableOfContents({ html }: { html: string }) {
  const headings = useMemo(() => extractHeadings(html), [html]);
  const [open, setOpen] = useState(true);

  if (headings.length < 2) return null;

  return (
    <nav
      aria-label="Tabla de contenidos"
      className="mb-10 border border-gris-brd bg-gris-bg px-6 py-5"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between"
      >
        <span className="font-display text-xs font-black uppercase tracking-[2px] text-negro">
          Contenido
        </span>
        <span className="text-xs text-gris-cla">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <ol className="mt-4 list-none space-y-1.5 pl-0">
          {headings.map((h) => (
            <li key={h.id} className={h.level === 3 ? 'pl-5' : ''}>
              <a
                href={`#${h.id}`}
                className="text-sm text-gris-med transition hover:text-dorado"
              >
                {h.text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}

/**
 * Inject `id` attributes onto H2/H3 tags in article HTML so the
 * TOC anchor links work. Call this server-side before rendering.
 */
export function addHeadingIds(html: string): string {
  let counter = 0;
  return html.replace(
    /<h([23])(\s[^>]*)?>(.+?)<\/h\1>/gi,
    (_match, level, attrs = '', content) => {
      const text = content.replace(/<[^>]*>/g, '').trim();
      const id = slugifyHeading(text, counter++);
      // Preserve existing attributes, prepend id
      return `<h${level} id="${id}"${attrs}>${content}</h${level}>`;
    }
  );
}
