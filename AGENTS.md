# Agent Instructions

## Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Internationalization**: next-intl (locales: `es`, `en`)
- **Package Manager**: pnpm
- **Icons**: lucide-react
- **Font**: Montserrat (Google Fonts) — used because Gotham in the wireframe is not freely redistributable
- **Validation**: Zod (contact form server action)
- **Database**: Postgres via Drizzle ORM (`lib/db`) — stores admin-created essays/opinion articles
- **Admin auth**: single admin user, JWT session in httpOnly cookie (`lib/auth.ts`) + bcrypt password hash (no NextAuth, kept intentionally lightweight for one admin)
- **Rich text editor**: Tiptap (`components/admin/RichTextEditor.tsx`) — WordPress-style editor with images (upload via Vercel Blob or URL) and YouTube video embeds. Article `content` is stored as HTML
- **File uploads**: `@vercel/blob` via `app/admin/upload/route.ts`, protected by `requireAdmin()`. Falls back to a clear error (use "Imagen (URL)" instead) when `BLOB_READ_WRITE_TOKEN` isn't configured

## Commands

| Command        | Description                 |
|----------------|-----------------------------|
| `pnpm install` | Install dependencies        |
| `pnpm dev`     | Start development server    |
| `pnpm build`   | Production build            |
| `pnpm lint`    | Run ESLint (`eslint`)       |
| `pnpm start`   | Start production server     |
| `pnpm exec vercel --prod` | Deploy to Vercel production |
| `pnpm db:push`   | Push Drizzle schema to the configured `DATABASE_URL` |
| `pnpm db:studio` | Open Drizzle Studio to inspect the DB |
| `pnpm hash-password "pw"` | Generate a bcrypt hash for `ADMIN_PASSWORD_HASH` |

## Project Structure

- `app/[locale]/` — localized public routes using `next-intl`
- `app/admin/` — admin panel (NOT locale-prefixed, excluded from next-intl middleware). `app/admin/login` is public; `app/admin/(protected)` requires a valid session
- `components/` — React components
- `i18n/` — Routing and request config
- `messages/` — Translation files (`es.json`, `en.json`) — still hold the original hardcoded essays as seed content
- `lib/db/` — Drizzle schema (`articles` table) and DB client
- `lib/auth.ts` — admin session helpers (`createSession`, `getSession`, `requireAdmin`, `destroySession`)
- `lib/essays.ts` — merges static JSON essays with published DB articles for public pages
- `reference/` — Original HTML wireframe

## Conventions

- App Router with `next-intl` dynamic `[locale]` segment.
- Server components by default; client components use `'use client'`.
- Use `useTranslations` for client components and `getTranslations` for async server components.
- Navigation uses `Link` and `useRouter` from `@/i18n/routing` for localized pathnames.
- Contact form is a server action at `app/[locale]/actions/contact.ts` with Zod validation.
- The real email provider must be wired via environment variables (Resend/SendGrid/SES/nodemailer).
- Images use `unoptimized: true` in `next.config.ts` to avoid native dependency issues in this environment.

## Notes

- The frontend is designed to match the original HTML wireframe: light theme, gold/black palette, uppercase display typography and clip-path hero background.
- Project is linked to Vercel and deployed to production. Run `pnpm exec vercel --prod` to redeploy after committing.
- The middleware file convention is deprecated in Next.js 16; `proxy.ts` is the new convention, but `middleware.ts` still works.
- `pnpm` ignored build scripts for native deps (`sharp`, `@swc/core`). If image optimization is needed later, approve builds or use a CI with native tooling.
- Required env vars for the admin/articles feature: `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (see `.env.local.example`). Without `DATABASE_URL` the site still works — `lib/essays.ts` falls back to the static JSON essays only.
- The `articles` table (`ensayo` | `opinion` type) is the single source for admin-created content; the JSON `essays.items` arrays remain as the original seed essays and are always merged in alongside DB rows.
- **IMPORTANT**: any `$` in `.env.local` values (e.g. bcrypt hashes like `$2b$12$...`) MUST be escaped as `\$`. Next.js expands unescaped `$VAR`/`${VAR}` patterns in env files, which silently corrupts bcrypt hashes and breaks admin login with no obvious error.
- Local Postgres for dev: this machine runs `postgresql-x64-18` as a Windows service (binaries at `D:\DB\bin`, data at `D:\DB\data`, port 5432, user `postgres`). The `libertarian` database was created for this project.
- `drizzle.config.ts` manually parses `.env.local` (drizzle-kit is a standalone CLI and doesn't get Next.js's automatic env loading).
