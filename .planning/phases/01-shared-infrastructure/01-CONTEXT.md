# Phase 1: Shared Infrastructure - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

The foundational plumbing is in place — all protected routes are guarded, API calls reach the Spring Boot backend, wizard state survives refresh, and shared UI primitives are available for every downstream phase.

Requirements: INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06, UI-01, UI-02, UI-03, UI-04

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions.

Key constraints from today's session:
- API proxy should use catch-all route handler at `/api/proxy/[...path]/route.ts`
- JWT is in httpOnly cookie named "session" — extract server-side, forward as Bearer header
- Zustand assessment store needs `_hasHydrated` guard to prevent SSR hydration mismatch
- Do NOT port `useAuthStore` — cookie-based auth already exists
- User profile is in `user_profile` cookie (readable, not httpOnly)
- Middleware must extend matcher to include `/assessment/:path*`
- React Query provider wraps protected routes only (no SSR prefetching needed)
- Recharts components need `next/dynamic({ ssr: false })` — but that's Phase 4
- Use inline styles matching project convention (no CSS modules)
- Dark theme: backgrounds #0B0F1A/#0F172A, text #F1F5F9/#CBD5E1, accent #10B981

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/auth.ts` — `getSession()` reads session cookie, decodes JWT payload
- `src/components/auth/AuthProvider.tsx` — GoogleOAuthProvider wrapper
- `src/components/auth/GoogleSignInButton.tsx` — sign-in button with auth-code flow
- `src/app/api/auth/google/route.ts` — auth proxy to Spring Boot
- `middleware.ts` — currently protects `/dashboard/:path*` only

### Established Patterns
- All styles use inline styles (no CSS modules, no Tailwind classes in most components)
- Client components use `"use client"` directive
- Server components handle auth checks in layouts
- API routes use `cookies()` from `next/headers`
- Font variables: `--font-display` (Bricolage Grotesque), `--font-serif` (Newsreader)

### Integration Points
- `src/app/layout.tsx` — root layout wraps in AuthProvider, needs React Query + assessment store providers
- `middleware.ts` — needs `/assessment` added to matcher
- `.env.local` — `BACKEND_URL=https://api-preprod.myfinancial.in`

### Source Code Reference (React app to port from)
- `src/services/api.js` at `/home/t0266li/Documents/myFinance/src/services/api.js` — fetch wrapper
- `src/features/assessment/store/useAssessmentStore.js` — Zustand store (122 lines)
- `src/utils/formatters.js` — currency/date/percentage formatters (51 lines)
- `src/constants/enums.js` — DB enum mappings (49 lines)
- `src/components/auth/InactivityGuard.jsx` — session timeout (133 lines)
- `src/components/ui/AssessmentSkeleton.jsx` — loading skeletons
- `src/components/layout/Layout.jsx` — layout with step sidebar (211 lines)

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase. Follow codebase conventions and research findings.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
