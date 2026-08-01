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
      className="text-xs font-semibold uppercase tracking-widest text-red-600 hover:text-red-800"
    >
      {pending ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
}
