import { NextRequest, NextResponse } from 'next/server';
import { desc, eq, and } from 'drizzle-orm';
import { readFileSync } from 'fs';
import { join } from 'path';
import { db } from '@/lib/db';
import { articles } from '@/lib/db/schema';

const CORS = { 'Access-Control-Allow-Origin': '*' };

type EssayCard = {
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  type: string | null;
  featuredImage: string | null;
};

function staticEssays(locale: string): EssayCard[] {
  try {
    const raw = readFileSync(join(process.cwd(), `messages/${locale}.json`), 'utf-8');
    const msgs = JSON.parse(raw) as { essays: { items: EssayCard[] } };
    return msgs.essays.items.map((i) => ({ ...i, type: null, featuredImage: null }));
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get('locale') === 'en' ? 'en' : 'es';
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') ?? '3', 10), 6);

  let dbRows: EssayCard[] = [];
  let dbSlugs = new Set<string>();

  try {
    const rows = await db
      .select({
        slug: articles.slug,
        title: articles.title,
        description: articles.description,
        category: articles.category,
        author: articles.author,
        type: articles.type,
        featuredImage: articles.featuredImage,
      })
      .from(articles)
      .where(and(eq(articles.locale, locale), eq(articles.published, true)))
      .orderBy(desc(articles.createdAt))
      .limit(limit);

    dbRows = rows;
    dbSlugs = new Set(rows.map((r) => r.slug));
  } catch {
    // DB unavailable — fall back to static only
  }

  const needed = limit - dbRows.length;
  const statics = needed > 0
    ? staticEssays(locale).filter((i) => !dbSlugs.has(i.slug)).slice(0, needed)
    : [];

  return NextResponse.json([...dbRows, ...statics], { headers: CORS });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}
