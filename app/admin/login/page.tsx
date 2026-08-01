'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft, Sparkles } from 'lucide-react';
import { login, demoLogin } from './actions';

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, null);
  const [demoState, demoAction, demoPending] = useActionState(demoLogin, null);
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-negro px-6 py-16">
      <span className="page-hero-watermark pointer-events-none absolute right-[-4%] top-1/2 -translate-y-1/2 select-none font-display">
        ADMIN
      </span>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="eyebrow eyebrow-center">Acceso restringido</div>
          <h1 className="font-display text-2xl font-black uppercase tracking-[1px] text-blanco">
            Libertarian Forum
          </h1>
          <p className="mt-2 text-sm text-white/40">Panel de administración</p>
        </div>

        <form
          action={formAction}
          className="border border-white/10 bg-gris-osc p-8 shadow-[0_24px_60px_rgba(0,0,0,0.4)]"
        >
          <div className="mb-5 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center border border-dorado/40 bg-negro">
              <Lock className="h-5 w-5 text-dorado" strokeWidth={1.5} />
            </div>
          </div>

          <label
            htmlFor="email"
            className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[2px] text-white/45"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mb-5 w-full border border-white/15 bg-negro px-3.5 py-3 text-sm text-blanco outline-none transition focus:border-dorado"
          />

          <label
            htmlFor="password"
            className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[2px] text-white/45"
          >
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mb-6 w-full border border-white/15 bg-negro px-3.5 py-3 text-sm text-blanco outline-none transition focus:border-dorado"
          />

          {state?.error && (
            <p className="mb-5 border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm font-medium text-red-400">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="btn-p w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? 'Ingresando...' : 'Ingresar'}
          </button>

          {state?.error && (
            <p className="mt-5 border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm font-medium text-red-400">
              {state.error}
            </p>
          )}
        </form>

        {demoMode && (
          <form action={demoAction} className="mt-5">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-[0.65rem] font-semibold uppercase tracking-[2px] text-white/30">
                o
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <button
              type="submit"
              disabled={demoPending}
              className="flex w-full items-center justify-center gap-2 border border-dorado/40 bg-dorado/10 px-4 py-3 text-sm font-bold uppercase tracking-[1px] text-dorado transition hover:bg-dorado/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              {demoPending ? 'Entrando...' : 'Probar demo'}
            </button>
            {demoState?.error && (
              <p className="mt-3 border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm font-medium text-red-400">
                {demoState.error}
              </p>
            )}
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white/35 transition hover:text-dorado"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  );
}
