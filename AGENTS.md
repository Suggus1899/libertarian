# Agent Instructions

## Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Internationalization**: next-intl (locales: `es`, `en`)
- **Package Manager**: pnpm
- **Icons**: lucide-react
- **Validation**: Zod (contact form server action)

## Commands

| Command        | Description                 |
|----------------|-----------------------------|
| `pnpm install` | Install dependencies        |
| `pnpm dev`     | Start development server    |
| `pnpm build`   | Production build            |
| `pnpm lint`    | Run ESLint (`eslint`)       |
| `pnpm start`   | Start production server     |

## Project Structure

- `app/[locale]/` — localized routes using `next-intl`
- `components/` — React components
- `i18n/` — Routing and request config
- `messages/` — Translation files (`es.json`, `en.json`)
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

- The middleware file convention is deprecated in Next.js 16; `proxy.ts` is the new convention, but `middleware.ts` still works.
- `pnpm` ignored build scripts for native deps (`sharp`, `@swc/core`). If image optimization is needed later, approve builds or use a CI with native tooling.
