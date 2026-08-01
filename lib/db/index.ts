import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Connections are lazy (postgres-js only connects on the first query), so this
// module can be safely imported even when DATABASE_URL is not configured yet
// (e.g. during `next build` or local dev without a database). Any attempt to
// actually query without a valid URL will fail at call time, which callers
// (see lib/essays.ts) handle gracefully.
//
// `max: 1` + `prepare: false` are required for serverless (Vercel functions):
// each function invocation gets its own module instance, so a large per-client
// pool multiplies into far more DB connections than the Postgres server allows.
// Use a pooled connection string (e.g. Neon's "-pooler" host, which uses
// PgBouncer in transaction mode) as DATABASE_URL in production — `prepare:
// false` disables prepared statements, which transaction-mode poolers don't
// support.
const client = postgres(process.env.DATABASE_URL ?? '', {
  prepare: false,
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
