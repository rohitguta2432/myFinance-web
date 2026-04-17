# myFinance-web

Personal finance platform for Indian users. 6-step assessment wizard, dashboard, AI chat (Kira), tax optimizer, insurance gap, blog.

## Stack

- Next.js 15 (App Router, Turbopack) + React 19 + TS 5.7
- Tailwind CSS 4 (no CSS modules — inline styles or `<style>` tags)
- Zustand (assessment store) + TanStack Query (server state)
- Google OAuth (`@react-oauth/google`) + JWT session cookie
- AWS: DynamoDB (blog/comments), Bedrock Nova Pro (blog AI), Amplify (deploy from `main`)
- Spring Boot backend on EC2 `3.218.140.100:8081` (Postgres)
- Node 20 (`nvm use 20`), dev port 3001

## Structure

- `src/app/(protected)/` — assessment, dashboard, admin (session guard in layout)
- `src/app/api/auth/` Google OAuth + session
- `src/app/api/proxy/[...path]` forwards to Spring Boot with JWT
- `src/app/api/{admin,blog,chat}/` — admin CRUD, public blog, Kira proxy
- `src/app/blog/` public blog + `/blog/admin` editor
- `src/components/{ai,assessment,dashboard,auth,layout,blog}/`
- `src/hooks/{assessment,dashboard}/` TanStack Query hooks
- `src/store/useAssessmentStore.ts` Zustand + persist per-user
- `src/lib/` auth, dynamodb, types, assessment-api helpers

## Conventions

- Files: `kebab-case.tsx` (components `PascalCase.tsx` ok — mixed repo). Pages `page.tsx`. Utils `kebab-case.ts`.
- Identifiers: PascalCase components/types, camelCase vars/funcs, UPPER constants
- Imports: `@/*` → `./src/*` (no relative paths)
- Indent 4 spaces. Named exports (default only for Next pages)
- Dark palette: bg `#0B0F1A`/`#0F172A`, text `#F1F5F9`/`#CBD5E1`, accent `#10B981`
- Theme tokens via `useAppTheme` hook — avoid hardcoded hex in new code
- `"use client"` required for hooks/interactivity. Assessment + dashboard all client.
- Blog: Markdown in DynamoDB, rendered with `marked`

## Auth flow

Google ID token → `/api/auth/google` → backend validates → JWT (7d) → `session` cookie (httpOnly) + `user_profile` cookie (client-readable JSON with `id`) → all API calls include `Authorization: Bearer <jwt>` via proxy.

Admin routes: SHA256 password → `admin_session` cookie → `isAuthenticated()` in `src/lib/admin-auth.ts`.

## Commands

- `/start` — bootstrap dev env + server
- `/deploy` — push main + monitor Amplify
- `/import-blog <url>` — import + AI improve + publish
- `npm run dev` — port 3001
- `npm run build` / `npm run lint`

## Env vars

`MYAPP_AWS_REGION`, `BEDROCK_{REGION,ACCESS_KEY_ID,SECRET_ACCESS_KEY}`, `DYNAMODB_{ACCESS_KEY_ID,SECRET_ACCESS_KEY}` (fallback to Bedrock), `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BACKEND_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` (SHA256).

## Backend API (separate repo, unchanged)

`~/Documents/myFinance/backend/` | Port 8081 | All `/api/v1/*` require JWT.

Key endpoints: `/auth/google`, `/profile`, `/cashflow[/summary]`, `/networth[/asset|/liability]`, `/goals`, `/goal-projection`, `/insurance[/gap]`, `/tax[/calculation]`, `/portfolio-analysis`, `/risk-scoring`, `/dashboard/summary`, `/chat`, `/location/{states,cities}`, `/admin/{stats,users,activity}`.
