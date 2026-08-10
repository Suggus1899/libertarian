'use client';

import { useState, useTransition } from 'react';
import { translateArticle } from '@/app/admin/actions';

export function TranslateButton({ id, locale }: { id: number; locale: string }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const targetLocale = locale === 'es' ? 'EN' : 'ES';

  function handleClick() {
    setMessage(null);
    startTransition(async () => {
      const result = await translateArticle(id);
      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage(`Traducido al ${targetLocale} ✓`);
        // Reload to show the new article in the list
        window.location.reload();
      }
    });
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <button
        onClick={handleClick}
        disabled={pending}
        className="border border-dorado/50 bg-dorado/5 px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-widest text-dorado transition hover:bg-dorado/15 disabled:opacity-50"
      >
        {pending ? 'Traduciendo...' : `Traducir ${targetLocale}`}
      </button>
      {message && (
        <span className="text-[0.6rem] text-gris-med">{message}</span>
      )}
    </span>
  );
}
