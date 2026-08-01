import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Connections are lazy (postgres-js only connects on the first query), so this
// module can be safely imported even when DATABASE_URL is not configured yet
// (e.g. during `next build` or local dev without a database). Any attempt to
// actually query without a valid URL will fail at call time, which callers
// (see lib/essays.ts) handle gracefully.
//
// Pool sizing:
//  - Serverless (Vercel functions): each invocation gets its own module
//    instance, so a large per-client pool multiplies into far more DB
//    connections than Postgres allows. `max: 1` + `prepare: false` is the
//    safe default. Use a pooled connection string (e.g. Neon's "-pooler"
//    host, which uses PgBouncer in transaction mode) as DATABASE_URL —
//    `prepare: false` disables prepared statements, which transaction-mode
//    poolers don't support.
//  - VPS (long-running `next start`): a single process can afford a small
//    pool. Set DB_POOL_MAX (e.g. 10) to enable it; prepared statements are
//    kept enabled since there's no transaction-mode pooler in front.
const poolMax = Number(process.env.DB_POOL_MAX ?? '1');
const isServerless = poolMax === 1;

const client = postgres(process.env.DATABASE_URL ?? '', {
  prepare: !isServerless,
  max: poolMax,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
