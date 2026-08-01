import { ReactNode } from 'react';
import { requireAdmin } from '@/lib/auth';
import { logout } from '../actions';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen bg-gris-bg">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-gris-brd bg-negro px-4 py-4 sm:px-6">
        <span className="font-display text-sm font-black uppercase tracking-[1px] text-blanco">
          Admin — Libertarian Forum
        </span>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden text-xs text-white/50 sm:inline">{session.email}</span>
          <form action={logout}>
            <button
              type="submit"
              className="text-xs font-semibold uppercase tracking-widest text-white/60 transition hover:text-dorado"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
