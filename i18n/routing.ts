import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  pathnames: {
    '/': '/',
    '/nosotros': {
      es: '/nosotros',
      en: '/about',
    },
    '/servicios': {
      es: '/servicios',
      en: '/services',
    },
    '/ensayos': {
      es: '/ensayos',
      en: '/essays',
    },
    '/contacto': {
      es: '/contacto',
      en: '/contact',
    },
  },
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
