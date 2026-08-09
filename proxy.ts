import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const intlResponse = intlMiddleware(request);

  // Redirects (path normalization): pass through as-is
  if (intlResponse?.status && intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse;
  }

  // For passthroughs and rewrites, ensure x-next-intl-locale is set in request
  // headers so server components (including root layout) can read it via headers().
  // createMiddleware sets this for rewrites but not always for plain passthroughs
  // when using proxy.ts in Next.js 16.
  const pathname = request.nextUrl.pathname;
  const locale = pathname.match(/^\/(es|en)(\/|$)/)?.[1] ?? routing.defaultLocale;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-next-intl-locale', locale);

  // If intlMiddleware wants a URL rewrite, honour it
  const rewriteTarget = intlResponse?.headers.get('x-middleware-rewrite');
  if (rewriteTarget) {
    return NextResponse.rewrite(rewriteTarget, {
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    '/((?!api|admin|_next|_vercel|.*\\..*|icon|opengraph-image|twitter-image).*)',
  ],
};
