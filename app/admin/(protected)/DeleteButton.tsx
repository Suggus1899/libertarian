'use client';

import { useTransition } from 'react';
import { deleteArticle } from '../actions';

export function DeleteButton({ id }: { id: number }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm('¿Eliminar este artículo? Esta acción no se puede deshacer.')) return;
    startTransition(() => {
      deleteArticle(id);
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="border border-red-200 px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-widest text-red-600 transition hover:bg-red-50 disabled:opacity-50"
    >
      {pending ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
}
