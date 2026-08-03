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
  contentHtml: string;
  featuredImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  type: 'ensayo' | 'opinion' | null;
};

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
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

  const staticMapped: EssayItem[] = staticItems.map((item) => ({
    slug: item.slug,
    category: item.category,
    title: item.title,
    description: item.description,
    date: item.date,
    author: item.author,
    contentHtml: item.full.map((p) => `<p>${escapeHtml(p)}</p>`).join(''),
    featuredImage: null,
    seoTitle: null,
    seoDescription: null,
    type: null,
  }));

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
      // Rich HTML authored by the (single, trusted) admin in the Tiptap editor.
      contentHtml: row.content,
      featuredImage: row.featuredImage,
      seoTitle: row.seoTitle,
      seoDescription: row.seoDescription,
      type: row.type,
    }));
  } catch {
    // DB not configured yet (e.g. local dev without DATABASE_URL) — fall back to static content only.
    dbItems = [];
  }

  // Deduplicate: if a DB article has the same slug as a static essay, skip
  // the static one. This lets the admin "override" or delete original essays
  // by managing them from the DB.
  const dbSlugs = new Set(dbItems.map((i) => i.slug));
  const staticFiltered = staticMapped.filter((i) => !dbSlugs.has(i.slug));

  return [...dbItems, ...staticFiltered];
}

export async function getEssayBySlug(locale: string, slug: string): Promise<EssayItem | null> {
  const items = await getEssays(locale);
  return items.find((item) => item.slug === slug) ?? null;
}
