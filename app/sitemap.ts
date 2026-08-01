import type { MetadataRoute } from 'next';
import { routing, getPathname } from '@/i18n/routing';
import { getEssays } from '@/lib/essays';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const staticPaths = [
  '/',
  '/nosotros',
  '/servicios',
  '/ensayos',
  '/contacto',
  '/equipo',
  '/recursos',
  '/suscribirse',
  '/donar',
  '/privacidad',
  '/terminos',
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${siteUrl}${getPathname({ locale, href: path })}`,
        lastModified: new Date(),
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${siteUrl}${getPathname({ locale: l, href: path })}`]),
          ),
        },
      });
    }
  }

  for (const locale of routing.locales) {
    const essays = await getEssays(locale);
    for (const essay of essays) {
      entries.push({
        url: `${siteUrl}${getPathname({ locale, href: { pathname: '/ensayos/[slug]', params: { slug: essay.slug } } })}`,
        lastModified: new Date(),
      });
    }
  }

  return entries;
}
