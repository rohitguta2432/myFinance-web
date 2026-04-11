# MyFinancial — React to Next.js Migration

## What This Is

MyFinancial is a personal finance platform for Indian users. It has a 6-step financial assessment wizard, a 12-calculator dashboard, AI advisory chat, and a blog. The frontend is currently split across two repos — a Next.js landing site (this repo) and a React (Vite) app. This project unifies everything into one Next.js application while keeping the Spring Boot backend on EC2.

## Core Value

Users complete the financial assessment wizard and see their personalized dashboard — this flow must work end-to-end after migration without regressions.

## Requirements

### Validated

- ✓ Landing page with SEO — existing
- ✓ Blog with admin dashboard — existing
- ✓ Google OAuth sign-in with popup flow — existing (built 2026-04-11)
- ✓ Navbar with profile avatar dropdown — existing
- ✓ Dashboard route protection (middleware + layout) — existing
- ✓ API proxy to Spring Boot backend — existing

### Active

- [ ] Shared infrastructure (API client, Zustand stores, React Query provider, layout system)
- [ ] Assessment Step 1: Personal Risk Profile (age, location, marital status, dependents, risk tolerance)
- [ ] Assessment Step 2: Income & Expenses (add/edit/delete income sources and expense categories)
- [ ] Assessment Step 3: Assets & Liabilities (asset/liability CRUD with net worth summary)
- [ ] Assessment Step 4: Financial Goals (goals with projections, inflation, SIP calculators)
- [ ] Assessment Step 5: Insurance Gap Analysis (corporate + personal policies, gap checklist)
- [ ] Assessment Step 6: Tax Optimization (old vs new regime comparison, 80C investments)
- [ ] Assessment Complete celebration screen
- [ ] Dashboard: Financial health score with animated SVG rings
- [ ] Dashboard: Red flags section (critical/warn/info tiers)
- [ ] Dashboard: Action plan tab with prioritized items
- [ ] Dashboard: Insurance analysis tab (HLV method, coverage gaps)
- [ ] Dashboard: Tax planning tab (regime comparison, recommendations)
- [ ] Dashboard: Projection charts (recharts line graphs)
- [ ] Dashboard: Benchmark comparison tables
- [ ] Dashboard: Financial Time Machine (year slider scenarios)
- [ ] AI Chat Widget (Kira) — floating chat powered by AWS Bedrock
- [ ] Admin panel (user list, audit logs)
- [ ] New user flow: sign-in → assessment wizard → dashboard
- [ ] Returning user flow: sign-in → dashboard directly

### Out of Scope

- Redesigning the UI/UX — port + improve, not redesign
- Adding new features not in the React app — migration only
- Modifying the Spring Boot backend — stays as-is
- Mobile app (React Native) — web only
- Google One Tap sign-in — can add later
- Multi-provider auth (GitHub, Apple) — Google only for now
- Payment/billing integration — not part of migration

## Context

**Source codebase:** `/home/t0266li/Documents/myFinance/src/` — React 19 + Vite 7, ~12,500 lines, 78 files

**Target codebase:** `/home/t0266li/Documents/myFinance-web/` — Next.js 15, currently has landing page + blog + Google auth

**Key dependencies to port:**
- `zustand` 5.0 — state management (2 stores: auth + assessment)
- `@tanstack/react-query` 5.90 — server state / API caching
- `recharts` 3.8 — charts (dashboard projections)
- `react-hot-toast` — notifications
- `lucide-react` — icons (already in target)

**Migration approach:** Port + improve
- Convert JSX → TSX with proper TypeScript types
- Break large step files (600-900 lines) into smaller components
- Replace `react-router` navigation with Next.js `useRouter` / `Link`
- Add `"use client"` to all interactive components
- Keep Zustand stores and React Query hooks largely as-is
- Follow existing Next.js project conventions (inline styles, dark theme palette)

**Backend API:** Spring Boot on EC2 at `https://api-preprod.myfinancial.in`
- Auth: `POST /api/v1/auth/google`
- Assessment: `GET/POST /api/v1/assessment/{step}/{userId}`
- Dashboard: `GET /api/v1/dashboard/summary/{userId}`
- AI Chat: AWS Bedrock (Amazon Nova) via backend

**Deployment:**
- Frontend: AWS Amplify (auto-deploys from `main`)
- Backend: EC2 Docker Compose (Spring Boot + PostgreSQL)
- Preprod: `develop` branch → `preprod.myfinancial.in` + `api-preprod.myfinancial.in`
- Prod: `main` branch → `myfinancial.in` + `api.myfinancial.in`

## Constraints

- **Tech stack**: Next.js 15 App Router, React 19, Tailwind CSS 4, TypeScript
- **Styling**: Inline styles or component-scoped `<style>` tags (no CSS modules) — matches existing project convention
- **Colors**: Dark theme palette — backgrounds `#0B0F1A`/`#0F172A`, text `#F1F5F9`/`#CBD5E1`, accent `#10B981`
- **Backend**: Spring Boot API is unchanged — all endpoints remain the same
- **Auth**: Google OAuth via `@react-oauth/google` with auth-code flow (already implemented)
- **No SSR for assessment/dashboard**: All wizard and dashboard components are `"use client"` — purely interactive

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js over keeping React SPA | Industry standard (6/8 Indian fintech competitors use Next.js), one codebase, Amplify auto-scaling | — Pending |
| Separate repos (Next.js + Spring Boot) | Different languages/build tools/deploy targets, monorepo adds complexity for 1-2 devs | — Pending |
| Amplify for frontend, EC2 for backend | Amplify auto-scales SSR, built-in CDN, preview branches. EC2 gives full control for Spring Boot + PostgreSQL | — Pending |
| Auth-code flow for Google OAuth | Backend expects ID token, `useGoogleLogin` implicit returns access_token, auth-code + server exchange gets ID token | ✓ Good |
| Two cookies (session + user_profile) | JWT only has sub + email, no name/pictureUrl. Backend has no /me endpoint | ✓ Good |
| Port + improve (not as-is or redesign) | Break large files into components, add TypeScript, but don't redesign UI | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-11 after initialization*
