import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Exclude: API routes, admin panel, Next.js internals, Vercel internals,
  // files with extensions (favicon.ico, robots.txt, sitemap.xml, manifest.webmanifest),
  // and Next.js file-based metadata routes that have no extension (icon, opengraph-image, twitter-image).
  matcher: [
    '/((?!api|admin|_next|_vercel|.*\\..*|icon|opengraph-image|twitter-image).*)',
  ],
};
