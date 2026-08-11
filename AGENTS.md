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
- **Rich text editor**: Tiptap (`components/admin/RichTextEditor.tsx`) — WordPress-level editor: bold/italic/underline/strike, headings, text align, lists, blockquote, horizontal rule, links, tables (with row/column controls), a custom `FigureImage` node (align/width/caption — `components/admin/tiptap/FigureImage.ts`), YouTube embeds, and a generic `EmbedHtml` node (`components/admin/tiptap/EmbedHtml.tsx`) that auto-converts Vimeo/Spotify URLs to iframes or renders pasted embed codes (Twitter/X, Instagram, TikTok, etc.) as-is. Article `content` is stored as HTML
- **Media library**: `media` DB table + `app/admin/media/route.ts` (list) and `app/admin/upload/route.ts` (upload via `lib/uploads.ts`, also records the upload in `media`). `components/admin/MediaLibrary.tsx` is a reusable picker modal used both for the article's featured image and for inserting images in the content editor. Two upload drivers: `vercel-blob` (default, needs `BLOB_READ_WRITE_TOKEN`) and `local` (`UPLOAD_DRIVER=local`, writes to `./public/uploads` — for VPS). Falls back to a clear error (use "Imagen (URL)" instead) when neither is configured
- **Featured image & SEO fields**: `articles.featuredImage`, `articles.seoTitle`, `articles.seoDescription` — shown on essay cards/detail pages and used in `generateMetadata` (falls back to title/description when empty)
- **Demo mode**: `DEMO_MODE=true` + `NEXT_PUBLIC_DEMO_MODE=true` show a "Probar demo" button on `/admin/login` that bypasses the password check via the `demoLogin` server action. ONLY for local dev/demos — never enable in production.
- **SEO**: `lib/seo.ts` (`buildAlternates` for hreflang), `app/sitemap.ts` (dynamic: pages + published essays), `app/robots.ts` (blocks `/admin`), `app/[locale]/opengraph-image.tsx` (1200×630 dynamic OG image), `app/icon.tsx`, `app/manifest.ts`. DB pooling (`lib/db/index.ts`) is `max: 1` by default for serverless; set `DB_POOL_MAX=10` on VPS for a real pool.
- **Slug auto-generation**: typing a title auto-generates the slug in real-time (client-side `slugify`). The slug field shows "generado del título" / "editado manualmente" and has an "Auto" button to reset back to auto-generation after manual editing.
- **Word count & reading time**: `useWordCount` hook in `RichTextEditor` shows "X palabras · ~Y min de lectura" in a status bar below the editor (200 wpm).
- **Callout extension**: custom Tiptap node (`components/admin/tiptap/Callout.ts`) for `<blockquote class="callout" data-variant="quote|info|warning">` blocks with optional `<footer class="callout-cite">` for author attribution. Keyboard shortcut: `Ctrl+Shift+C`. Contextual toolbar for variant switching and cite editing. Styles in `globals.css`.
- **DB autosave**: every 30s the `ArticleForm` calls `saveDraft` server action to upsert an unpublished draft row in the DB. Status shows "Guardando en DB..." / "DB guardado hace Xs". Falls back to localStorage autosave (5s) as safety net. The `draftIdRef` tracks the DB row so new articles get an ID on first save.
- **DB-based preview**: `/admin/preview/[id]` reads the article from DB (works across tabs/devices/sessions). Falls back to sessionStorage-based `/admin/preview` for brand-new unsaved articles.
- **Table of contents**: `components/TableOfContents.tsx` extracts H2/H3 headings from article HTML and renders a collapsible "Contenido" nav with anchor links. `addHeadingIds()` injects `id` attributes on headings. Used on the public essay detail page and admin preview.

## Commands

| Command        | Description                 |
|----------------|-----------------------------|
| `pnpm install` | Install dependencies        |
| `pnpm dev`     | Start development server    |
| `pnpm build`   | Production build            |
| `pnpm lint`    | Run ESLint (`eslint`)       |
| `pnpm start`   | Start production server     |
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
- **Deploy:** SSH `root@169.58.139.164`, luego: `cd /var/www/libertarian && git pull && rm -rf .next && pnpm build && pm2 restart libertarian`
- The middleware file convention is deprecated in Next.js 16; `proxy.ts` is the new convention, but `middleware.ts` still works.
- `pnpm` ignored build scripts for native deps (`sharp`, `@swc/core`). If image optimization is needed later, approve builds or use a CI with native tooling.
- Required env vars for the admin/articles feature: `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (see `.env.local.example`). Without `DATABASE_URL` the site still works — `lib/essays.ts` falls back to the static JSON essays only.
- The `articles` table (`ensayo` | `opinion` type) is the single source for admin-created content; the JSON `essays.items` arrays remain as the original seed essays and are always merged in alongside DB rows.
- **IMPORTANT**: any `$` in `.env.local` values (e.g. bcrypt hashes like `$2b$12$...`) MUST be escaped as `\$`. Next.js expands unescaped `$VAR`/`${VAR}` patterns in env files, which silently corrupts bcrypt hashes and breaks admin login with no obvious error.
- Local Postgres for dev: this machine runs `postgresql-x64-18` as a Windows service (binaries at `D:\DB\bin`, data at `D:\DB\data`, port 5432, user `postgres`). The `libertarian` database was created for this project.
- `drizzle.config.ts` manually parses `.env.local` (drizzle-kit is a standalone CLI and doesn't get Next.js's automatic env loading).
- Tiptap v3's `StarterKit` already bundles `Link` and `Underline` — they must be disabled via `StarterKit.configure({ link: false, underline: false })` when adding your own instance, or Tiptap warns about "duplicate extension names" and behaves unpredictably.
- `@tiptap/extension-table` v3 bundles `Table`, `TableRow`, `TableHeader` and `TableCell` as named exports from one package (no separate `-row`/`-header`/`-cell` packages needed).
- Custom Tiptap node attributes must set `rendered: false` if `renderHTML` builds the DOM manually — otherwise Tiptap auto-serializes every attribute as a raw HTML attribute on top of your custom markup.
- When syncing an editor's HTML to a hidden `<input>` via `setState` on Tiptap's `update`/`selectionUpdate` events: a selection-only change (e.g. clicking an image) doesn't change the HTML string, so `setState(sameString)` is a no-op in React and contextual toolbars relying on `editor.isActive(...)` won't refresh. Use a separate incrementing counter state to force re-render on `selectionUpdate`.
- **File-based metadata routes** (`icon`, `opengraph-image`, `twitter-image`) have no file extension, so the next-intl middleware matcher (`/((?!api|admin|_next|_vercel|.*\\..*).*)`) was intercepting them and redirecting to `/es/opengraph-image` → 404. The matcher now explicitly excludes `icon|opengraph-image|twitter-image`.
- `opengraph-image.tsx` lives in `app/[locale]/` (not `app/`) because any `openGraph` object in the `[locale]` layout's `generateMetadata` overrides the file-based convention from the parent. A child `openGraph` without `images` still suppresses the parent's file-based image, so pages that want the default image must omit `openGraph` entirely (the essay detail page does this when no featured image is set).
