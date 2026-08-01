import { NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { media } from '@/lib/db/schema';

export async function GET() {
  await requireAdmin();

  try {
    const items = await db.select().from(media).orderBy(desc(media.createdAt)).limit(60);
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
