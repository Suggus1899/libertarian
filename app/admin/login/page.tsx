'use client';

import { useActionState } from 'react';
import { login } from './actions';

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-negro px-6">
      <form
        action={formAction}
        className="w-full max-w-sm border border-white/10 bg-gris-osc p-8"
      >
        <h1 className="mb-6 font-display text-xl font-black uppercase tracking-[1px] text-blanco">
          Admin — Libertarian Forum
        </h1>

        <label htmlFor="email" className="mb-1 block text-xs font-semibold uppercase tracking-widest text-white/50">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mb-4 w-full border border-white/15 bg-negro px-3 py-2.5 text-sm text-blanco outline-none focus:border-dorado"
        />

        <label htmlFor="password" className="mb-1 block text-xs font-semibold uppercase tracking-widest text-white/50">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mb-6 w-full border border-white/15 bg-negro px-3 py-2.5 text-sm text-blanco outline-none focus:border-dorado"
        />

        {state?.error && (
          <p className="mb-4 text-sm font-semibold text-red-400">{state.error}</p>
        )}

        <button type="submit" disabled={pending} className="btn-p w-full">
          {pending ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
