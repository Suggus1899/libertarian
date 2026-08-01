import { desc, eq, and } from 'drizzle-orm';
import { getTranslations } from 'next-intl/server';
import { db } from './db';
import { articles } from './db/schema';

export type EssayItem = {
  slug: string;
  category: string;
  title: string;
  description: string;
  date: string;
  author: string;
  full: string[];
};

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/** Merges the static (hardcoded) essays from messages/*.json with DB-backed
 * articles (essays and opinion pieces) created from the admin panel. */
export async function getEssays(locale: string): Promise<EssayItem[]> {
  const t = await getTranslations({ locale });
  const staticItems = t.raw('essays.items') as Array<{
    slug: string;
    category: string;
    title: string;
    description: string;
    date: string;
    author: string;
    full: string[];
  }>;

  let dbItems: EssayItem[] = [];
  try {
    const rows = await db
      .select()
      .from(articles)
      .where(and(eq(articles.locale, locale as 'es' | 'en'), eq(articles.published, true)))
      .orderBy(desc(articles.createdAt));

    dbItems = rows.map((row) => ({
      slug: row.slug,
      category: row.category,
      title: row.title,
      description: row.description,
      date: formatDate(row.createdAt, locale),
      author: row.author,
      full: row.content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    }));
  } catch {
    // DB not configured yet (e.g. local dev without DATABASE_URL) — fall back to static content only.
    dbItems = [];
  }

  return [...dbItems, ...staticItems];
}

export async function getEssayBySlug(locale: string, slug: string): Promise<EssayItem | null> {
  const items = await getEssays(locale);
  return items.find((item) => item.slug === slug) ?? null;
}
