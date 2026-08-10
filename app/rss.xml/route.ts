import { NextResponse } from 'next/server';
import { desc, eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { articles } from '@/lib/db/schema';

export const revalidate = 3600;

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function GET() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://libertarianforum.org').replace(/\/$/, '');

  const rows = await db
    .select()
    .from(articles)
    .where(and(eq(articles.locale, 'es'), eq(articles.published, true)))
    .orderBy(desc(articles.createdAt))
    .limit(30);

  const items = rows
    .map(
      (r) => `
  <item>
    <title><![CDATA[${r.title}]]></title>
    <link>${base}/es/ensayos/${r.slug}</link>
    <guid isPermaLink="true">${base}/es/ensayos/${r.slug}</guid>
    <description><![CDATA[${r.description}]]></description>
    <pubDate>${r.createdAt.toUTCString()}</pubDate>
    <category>${esc(r.category)}</category>
    <author>${esc(r.author)}</author>
  </item>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Libertarian Forum — Ensayos</title>
    <link>${base}</link>
    <description>Ensayos y artículos de opinión sobre libertad, economía y filosofía política.</description>
    <language>es-AR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
