'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft, Sparkles, Eye, EyeOff } from 'lucide-react';
import { login, demoLogin } from './actions';

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, null);
  const [demoState, demoAction, demoPending] = useActionState(demoLogin, null);
  const [showPassword, setShowPassword] = useState(false);
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gris-bg px-6 py-16">
      {/* Watermark */}
      <span className="pointer-events-none absolute right-[-2%] top-1/2 -translate-y-1/2 select-none font-display text-[20vw] font-black uppercase leading-none tracking-tighter text-negro/[0.04]">
        ADMIN
      </span>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="eyebrow eyebrow-center mb-3">Acceso restringido</div>
          <h1 className="font-display text-2xl font-black uppercase tracking-[1px] text-negro">
            Libertarian Forum
          </h1>
          <p className="mt-1.5 text-sm text-gris-med">Panel de administración</p>
        </div>

        {/* Card */}
        <form
          action={formAction}
          className="border border-gris-brd bg-blanco p-8 shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
        >
          {/* Lock icon */}
          <div className="mb-6 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center border border-dorado/50 bg-dorado/5">
              <Lock className="h-5 w-5 text-dorado" strokeWidth={1.5} />
            </div>
          </div>

          <label
            htmlFor="email"
            className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[2px] text-gris-med"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mb-5 w-full border border-gris-brd bg-blanco px-3.5 py-3 text-sm text-negro outline-none transition focus:border-negro"
          />

          <label
            htmlFor="password"
            className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[2px] text-gris-med"
          >
            Contraseña
          </label>
          <div className="relative mb-6">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              className="w-full border border-gris-brd bg-blanco px-3.5 py-3 pr-11 text-sm text-negro outline-none transition focus:border-negro"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gris-med transition hover:text-negro"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {state?.error && (
            <p className="mb-5 border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-600">
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
        </form>

        {demoMode && (
          <form action={demoAction} className="mt-5">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-gris-brd" />
              <span className="text-[0.65rem] font-semibold uppercase tracking-[2px] text-gris-med">o</span>
              <span className="h-px flex-1 bg-gris-brd" />
            </div>
            <button
              type="submit"
              disabled={demoPending}
              className="flex w-full items-center justify-center gap-2 border border-dorado/40 bg-dorado/5 px-4 py-3 text-sm font-bold uppercase tracking-[1px] text-dorado transition hover:bg-dorado/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              {demoPending ? 'Entrando...' : 'Probar demo'}
            </button>
            {demoState?.error && (
              <p className="mt-3 border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-600">
                {demoState.error}
              </p>
            )}
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gris-med transition hover:text-negro"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  );
}
