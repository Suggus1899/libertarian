import { getPathname } from '@/i18n/routing';

type Href = Parameters<typeof getPathname>[0]['href'];

/**
 * Builds `alternates.languages` (hreflang) for a static page that exists at a
 * known path in both locales. Not meant for per-article routes (e.g. essay
 * detail), since admin-authored articles generally don't have a matching
 * translation at the same slug in the other locale — sending hreflang links
 * there would point Google to a page that doesn't actually correspond.
 */
export function buildAlternates(href: Href) {
  return {
    languages: {
      es: getPathname({ locale: 'es', href }),
      en: getPathname({ locale: 'en', href }),
      'x-default': getPathname({ locale: 'es', href }),
    },
  };
}
