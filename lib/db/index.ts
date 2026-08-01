import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Connections are lazy (postgres-js only connects on the first query), so this
// module can be safely imported even when DATABASE_URL is not configured yet
// (e.g. during `next build` or local dev without a database). Any attempt to
// actually query without a valid URL will fail at call time, which callers
// (see lib/essays.ts) handle gracefully.
const client = postgres(process.env.DATABASE_URL ?? '', { prepare: false });

export const db = drizzle(client, { schema });
