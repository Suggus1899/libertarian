'use client';

import { useEffect, useRef } from 'react';

export type PromptField = {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
};

export function PromptModal({
  open,
  title,
  fields,
  submitLabel = 'Insertar',
  onSubmit,
  onClose,
}: {
  open: boolean;
  title: string;
  fields: PromptField[];
  submitLabel?: string;
  onSubmit: (values: Record<string, string>) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  useEffect(() => {
    if (open) {
      formRef.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>('input,textarea')?.focus();
    }
  }, [open, fields]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values: Record<string, string> = {};
    for (const f of fields) values[f.name] = String(fd.get(f.name) ?? '');
    onSubmit(values);
    onClose();
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      className="w-full max-w-md border border-gris-brd bg-blanco p-0 backdrop:bg-negro/50"
    >
      <form ref={formRef} onSubmit={handleSubmit}>
        <header className="border-b border-gris-brd bg-gris-bg px-5 py-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-negro">{title}</h2>
        </header>
        <div className="space-y-4 px-5 py-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label
                htmlFor={`pm-${f.name}`}
                className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gris-med"
              >
                {f.label}
              </label>
              {f.multiline ? (
                <textarea
                  id={`pm-${f.name}`}
                  name={f.name}
                  defaultValue={f.defaultValue}
                  placeholder={f.placeholder}
                  required={f.required}
                  rows={4}
                  className="w-full border border-gris-brd bg-blanco px-3 py-2 text-sm outline-none focus:border-negro"
                />
              ) : (
                <input
                  id={`pm-${f.name}`}
                  name={f.name}
                  defaultValue={f.defaultValue}
                  placeholder={f.placeholder}
                  required={f.required}
                  className="w-full border border-gris-brd bg-blanco px-3 py-2 text-sm outline-none focus:border-negro"
                />
              )}
            </div>
          ))}
        </div>
        <footer className="flex justify-end gap-2 border-t border-gris-brd bg-gris-bg px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="border border-gris-brd bg-blanco px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gris-med hover:border-negro hover:text-negro"
          >
            Cancelar
          </button>
          <button type="submit" className="btn-p px-4 py-2 text-xs">
            {submitLabel}
          </button>
        </footer>
      </form>
    </dialog>
  );
}
