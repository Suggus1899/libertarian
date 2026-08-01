'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X, Upload } from 'lucide-react';

type MediaItem = {
  id: number;
  url: string;
  filename: string;
  contentType: string;
  size: number;
};

export function MediaLibrary({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}) {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    fetch('/admin/media')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setItems(data.items ?? []);
      })
      .catch(() => {
        if (!cancelled) setError('No se pudo cargar la biblioteca de medios.');
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al subir el archivo');
      onSelect(data.url);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir el archivo');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-6">
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col border border-gris-brd bg-blanco">
        <div className="flex items-center justify-between border-b border-gris-brd px-5 py-4">
          <h2 className="font-display text-sm font-black uppercase tracking-[1px] text-negro">
            Biblioteca de medios
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <X className="h-5 w-5 text-gris-med hover:text-negro" />
          </button>
        </div>

        <div className="flex items-center gap-3 border-b border-gris-brd px-5 py-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-p flex items-center gap-2 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload className="h-3.5 w-3.5" />
            {uploading ? 'Subiendo...' : 'Subir nueva imagen'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items === null ? (
            <p className="text-sm text-gris-med">Cargando...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-gris-med">
              Todavía no subiste ninguna imagen. Usá &quot;Subir nueva imagen&quot;.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item.url);
                    onClose();
                  }}
                  className="group relative aspect-square overflow-hidden border border-gris-brd bg-gris-bg"
                  title={item.filename}
                >
                  <Image
                    src={item.url}
                    alt={item.filename}
                    fill
                    unoptimized
                    className="object-cover transition group-hover:opacity-75"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
