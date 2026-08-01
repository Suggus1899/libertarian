'use client';

import { useState } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { LocaleSwitcher } from './LocaleSwitcher';

export function Navigation() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      label: t('nosotros'),
      href: '/nosotros',
      dropdown: [
        { label: t('dropdown.who'), href: '/nosotros' },
        { label: t('dropdown.mission'), href: '/nosotros' },
        { label: t('dropdown.values'), href: '/nosotros' },
      ],
    },
    { label: t('servicios'), href: '/servicios' },
    { label: t('ensayos'), href: '/ensayos' },
  ];

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-20 border-b border-gris-brd bg-blanco/97 backdrop-blur-md">
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-14">
        <Link href="/" className="text-xl font-black uppercase tracking-tight text-negro">
          {t('brand')}
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <div key={item.href} className="group relative">
              <Link
                href={item.href as Parameters<typeof Link>[0]['href']}
                className={`flex items-center gap-1 px-4 py-2 text-[0.78rem] font-semibold uppercase tracking-[1.2px] text-gris-med transition-colors hover:text-negro ${
                  pathname === (item.href as string) ? 'text-negro' : ''
                }`}
              >
                {item.label}
                {item.dropdown && <span className="text-[0.6rem]">▾</span>}
              </Link>

              {item.dropdown && (
                <div className="absolute left-0 top-full min-w-[220px] border border-gris-brd bg-blanco p-2 opacity-0 shadow-lg transition-all group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none translate-y-[-6px]">
                  {item.dropdown.map((d) => (
                    <Link
                      key={d.label}
                      href={d.href as Parameters<typeof Link>[0]['href']}
                      className="block px-5 py-3 text-[0.78rem] font-semibold uppercase tracking-[1px] text-gris-med transition-all hover:bg-gris-bg hover:pl-6 hover:text-negro"
                    >
                      {d.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link
            href="/contacto"
            className="btn-contacto ml-2 bg-negro px-6 py-2.5 text-[0.78rem] font-semibold uppercase tracking-[1.2px] text-blanco transition-colors hover:bg-gris-osc"
          >
            {t('contacto')}
          </Link>

          <div className="ml-3 flex items-center">
            <LocaleSwitcher />
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex flex-col gap-[5px] p-2 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? t('closeMenu') : t('openMenu')}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-negro" />
          ) : (
            <>
              <span className="block h-[2px] w-6 bg-negro" />
              <span className="block h-[2px] w-6 bg-negro" />
              <span className="block h-[2px] w-6 bg-negro" />
            </>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-b border-gris-brd bg-blanco px-6 pb-6 md:hidden">
          <div className="flex flex-col gap-1 pt-4">
            {navItems.map((item) => (
              <div key={item.href as string}>
                <Link
                  href={item.href as Parameters<typeof Link>[0]['href']}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 text-sm font-semibold uppercase tracking-widest text-negro hover:text-dorado"
                >
                  {item.label}
                </Link>
                {item.dropdown && (
                  <div className="ml-4 border-l border-gris-brd pl-4">
                    {item.dropdown.map((d) => (
                      <Link
                        key={d.label}
                        href={d.href as Parameters<typeof Link>[0]['href']}
                        onClick={() => setIsOpen(false)}
                        className="block py-2.5 text-xs font-semibold uppercase tracking-widest text-gris-med hover:text-negro"
                      >
                        {d.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/contacto"
              onClick={() => setIsOpen(false)}
              className="block py-3 text-sm font-semibold uppercase tracking-widest text-negro hover:text-dorado"
            >
              {t('contacto')}
            </Link>
          </div>
          <div className="mt-6 flex gap-2 border-t border-gris-brd pt-4">
            <LocaleSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
