import { getPathname } from '@/i18n/routing';

type Href = Parameters<typeof getPathname>[0]['href'];

/**
 * Builds the canonical URL for a page. Uses NEXT_PUBLIC_SITE_URL as the base
 * (must be set in production) and the localized path for the given href.
 * Accepts a string path for dynamic routes (e.g. `/ensayos/my-slug`) that
 * aren't in the typed route list.
 */
export function buildCanonical(locale: string, href: Href | string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const path = getPathname({ locale, href: href as Href });
  return `${base.replace(/\/$/, '')}${path}`;
}

/**
 * Builds `alternates` (canonical + hreflang languages) for a static page that
 * exists at a known path in both locales. Not meant for per-article routes
 * (e.g. essay detail), since admin-authored articles generally don't have a
 * matching translation at the same slug in the other locale — sending hreflang
 * links there would point Google to a page that doesn't actually correspond.
 */
export function buildAlternates(locale: string, href: Href) {
  return {
    canonical: buildCanonical(locale, href),
    languages: {
      es: getPathname({ locale: 'es', href }),
      en: getPathname({ locale: 'en', href }),
      'x-default': getPathname({ locale: 'es', href }),
    },
  };
}
