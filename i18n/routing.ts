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
    '/ensayos/[slug]': {
      es: '/ensayos/[slug]',
      en: '/essays/[slug]',
    },
    '/contacto': {
      es: '/contacto',
      en: '/contact',
    },
    '/equipo': {
      es: '/equipo',
      en: '/team',
    },
    '/recursos': {
      es: '/recursos',
      en: '/resources',
    },
    '/suscribirse': {
      es: '/suscribirse',
      en: '/subscribe',
    },
    '/donar': {
      es: '/donar',
      en: '/donate',
    },
    '/privacidad': {
      es: '/privacidad',
      en: '/privacy',
    },
    '/terminos': {
      es: '/terminos',
      en: '/terms',
    },
  },
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
