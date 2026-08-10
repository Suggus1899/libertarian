'use client';

import { useState } from 'react';

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const tweet = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-[0.65rem] font-semibold uppercase tracking-[2px] text-gris-cla">
        Compartir
      </span>
      <a
        href={tweet}
        target="_blank"
        rel="noopener noreferrer"
        className="border border-gris-brd px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-widest text-gris-med transition hover:border-negro hover:text-negro"
      >
        X / Twitter
      </a>
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="border border-gris-brd px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-widest text-gris-med transition hover:border-negro hover:text-negro"
      >
        WhatsApp
      </a>
      <button
        onClick={copy}
        className="border border-gris-brd px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-widest text-gris-med transition hover:border-negro hover:text-negro"
      >
        {copied ? '✓ Copiado' : 'Copiar link'}
      </button>
    </div>
  );
}
