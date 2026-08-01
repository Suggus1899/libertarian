import { readFileSync, existsSync } from 'fs';
import { defineConfig } from 'drizzle-kit';

// drizzle-kit runs as a standalone CLI (not through Next.js), so `.env.local`
// isn't loaded automatically. Parse it manually instead of adding a dotenv dependency.
if (existsSync('.env.local')) {
  for (const line of readFileSync('.env.local', 'utf-8').split('\n')) {
    const match = line.match(/^([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2] ?? '';
    }
  }
}

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
