'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? 'es';
  const [isOpen, setIsOpen] = useState(false);

  const navItems: { label: string; href: Parameters<typeof Link>[0]['href'] }[] = [
    { label: t('nosotros'), href: '/nosotros' },
    { label: t('servicios'), href: '/servicios' },
    { label: t('ensayos'), href: '/ensayos' },
    { label: t('contacto'), href: '/contacto' },
  ];

  function switchLocale(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale });
  }

  const activeClass = 'text-gold';
  const inactiveClass = 'text-foreground hover:text-gold';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-foreground">
          Libertarian Forum
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const hrefString = item.href as string;
            const isActive = pathname === hrefString;
            return (
              <Link
                key={hrefString}
                href={item.href}
                className={`text-xs font-bold uppercase tracking-widest transition ${
                  isActive ? activeClass : inactiveClass
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="ml-4 flex items-center gap-1 border-l border-border pl-4">
            {(['es', 'en'] as const).map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                aria-pressed={locale === l}
                className={`px-2 py-1 text-xs font-bold uppercase transition ${
                  locale === l
                    ? 'text-background bg-gold'
                    : 'text-foreground hover:text-gold'
                }`}
              >
                {t(`lang.${l}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          className="p-2 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-border bg-background px-6 pb-6 md:hidden">
          <div className="flex flex-col gap-4 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.href as string}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-bold uppercase tracking-widest text-foreground hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-6 flex gap-2 border-t border-border pt-4">
            {(['es', 'en'] as const).map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className={`px-3 py-1 text-xs font-bold uppercase ${
                  locale === l
                    ? 'bg-gold text-background'
                    : 'text-foreground hover:text-gold'
                }`}
              >
                {t(`lang.${l}`)}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
