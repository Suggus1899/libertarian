/**
 * Migration: change articles unique constraint from (slug) to (slug, locale)
 */
import postgres from 'postgres';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const envPath = resolve(process.cwd(), '.env.local');
const envFile = readFileSync(envPath, 'utf-8');
for (const line of envFile.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim();
  if (key && !process.env[key]) process.env[key] = val;
}

const DATABASE_URL = process.env.DATABASE_URL!;
const isLocal = DATABASE_URL.includes('localhost') || DATABASE_URL.includes('127.0.0.1');
const sql = postgres(DATABASE_URL, {
  ssl: isLocal ? false : { rejectUnauthorized: false },
  max: 1,
  idle_timeout: 20,
  connect_timeout: 30,
});

async function migrate() {
  console.log('Migrating unique constraint: (slug) -> (slug, locale)...');

  // Drop the old column-level unique constraint
  // The constraint name for .unique() in drizzle is typically 'articles_slug_unique'
  try {
    await sql`ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_slug_unique`;
    console.log('  Dropped articles_slug_unique');
  } catch {
    console.log('  (articles_slug_unique not found, trying alternative name)');
    try {
      await sql`ALTER TABLE articles DROP CONSTRAINT IF EXISTS slug_unique`;
      console.log('  Dropped slug_unique');
    } catch {
      console.log('  No old unique constraint found, continuing...');
    }
  }

  // Add the new composite unique constraint
  try {
    await sql`ALTER TABLE articles ADD CONSTRAINT articles_slug_locale_unique UNIQUE (slug, locale)`;
    console.log('  Added articles_slug_locale_unique');
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('already exists')) {
      console.log('  articles_slug_locale_unique already exists, skipping');
    } else {
      throw err;
    }
  }

  console.log('Done!');
  await sql.end();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
