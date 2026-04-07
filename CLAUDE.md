# myFinance-web

Personal finance platform built with Next.js 15 (App Router), React 19, Tailwind CSS 4, AWS DynamoDB, and AWS Bedrock.

## Stack

- **Framework**: Next.js 15 with Turbopack (`npm run dev`)
- **UI**: React 19, Radix UI, Lucide icons, Tailwind CSS 4
- **Database**: AWS DynamoDB (tables: `myfinancial-blog-posts`, `myfinancial-comments`)
- **AI**: AWS Bedrock (Amazon Nova Pro) for blog content generation
- **Deployment**: AWS Amplify (auto-deploys on push to `main`)
- **Content**: Cheerio for URL scraping, Marked for Markdown rendering

## Project Structure

- `src/app/` — Next.js App Router pages and API routes
- `src/app/api/admin/` — Protected admin API routes (blog CRUD, URL import, AI write)
- `src/app/api/blog/` — Public API routes (posts listing, comments)
- `src/app/blog/` — Public blog pages and admin dashboard
- `src/components/blog/` — Blog components (card, TOC, share bar, comments)
- `src/lib/` — Shared utilities (DynamoDB client, auth, types)

## Conventions

- All styles use inline styles or component-scoped `<style>` tags (no CSS modules)
- Colors use the dark theme palette: backgrounds `#0B0F1A`/`#0F172A`, text `#F1F5F9`/`#CBD5E1`
- Admin routes are protected via `isAuthenticated()` from `src/lib/admin-auth.ts`
- Blog content is stored as Markdown in DynamoDB, rendered with `marked`
- Category colors are defined as `{ bg, text }` objects in components that need them

## Commands

- `npm run dev` — Start dev server (requires Node 20+, use `nvm use 20`)
- `npm run build` — Production build
- `npm run lint` — ESLint
- `/deploy` — Push to main and monitor Amplify deployment
- `/import-blog <url>` — Import, improve, and publish a blog post from URL
