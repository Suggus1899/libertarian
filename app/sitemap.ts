import type { MetadataRoute } from 'next';
import { desc, eq } from 'drizzle-orm';
import { routing, getPathname } from '@/i18n/routing';
import { getEssays } from '@/lib/essays';
import { db } from '@/lib/db';
import { articles } from '@/lib/db/schema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const revalidate = 3600;

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

  const staticLastMod = new Date(process.env.VERCEL_GIT_COMMIT_SHA ? Date.now() : 0);

  for (const path of staticPaths) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${siteUrl}${getPathname({ locale, href: path })}`,
        lastModified: staticLastMod,
        changeFrequency: path === '/' || path === '/ensayos' ? 'weekly' : 'monthly',
        priority: path === '/' ? 1.0 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${siteUrl}${getPathname({ locale: l, href: path })}`]),
          ),
        },
      });
    }
  }

  const slugPresence = new Map<string, { locales: Set<string>; updated: Date }>();
  try {
    const rows = await db
      .select({ slug: articles.slug, locale: articles.locale, updatedAt: articles.updatedAt })
      .from(articles)
      .where(eq(articles.published, true))
      .orderBy(desc(articles.updatedAt));

    for (const row of rows) {
      const entry = slugPresence.get(row.slug) ?? { locales: new Set<string>(), updated: row.updatedAt };
      entry.locales.add(row.locale);
      if (row.updatedAt > entry.updated) entry.updated = row.updatedAt;
      slugPresence.set(row.slug, entry);
    }
  } catch {
    // DB not available (e.g. build without DATABASE_URL) — fall back to per-locale essays call.
    for (const locale of routing.locales) {
      const essays = await getEssays(locale);
      for (const essay of essays) {
        entries.push({
          url: `${siteUrl}${getPathname({ locale, href: { pathname: '/ensayos/[slug]', params: { slug: essay.slug } } })}`,
          lastModified: staticLastMod,
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
    return entries;
  }

  for (const [slug, { locales, updated }] of slugPresence) {
    for (const locale of locales) {
      const languages: Record<string, string> = {};
      if (locales.size > 1) {
        for (const l of locales) {
          languages[l] = `${siteUrl}${getPathname({ locale: l, href: { pathname: '/ensayos/[slug]', params: { slug } } })}`;
        }
      }
      entries.push({
        url: `${siteUrl}${getPathname({ locale, href: { pathname: '/ensayos/[slug]', params: { slug } } })}`,
        lastModified: updated,
        changeFrequency: 'monthly',
        priority: 0.6,
        ...(locales.size > 1 && { alternates: { languages } }),
      });
    }
  }

  return entries;
}
