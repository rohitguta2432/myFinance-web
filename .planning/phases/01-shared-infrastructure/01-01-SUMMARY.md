---
phase: 01-shared-infrastructure
plan: 01
subsystem: infrastructure
tags: [proxy, react-query, zustand, middleware, auth]
dependency_graph:
  requires: []
  provides:
    - API proxy at /api/proxy/[...path] forwarding to Spring Boot with Bearer JWT
    - apiFetch/api client helper targeting /api/proxy/... paths
    - getQueryClient singleton with 5-minute staleTime
    - QueryProvider client component wrapping QueryClientProvider
    - (protected) route group layout with auth-guard and Toaster
    - middleware extended to protect /assessment/:path* in addition to /dashboard/:path*
  affects:
    - All assessment and dashboard pages (depend on QueryProvider)
    - All API calls from client components (depend on api-client)
tech_stack:
  added:
    - zustand@^5.0.12
    - "@tanstack/react-query@^5.97.0"
    - react-hot-toast@^2.6.0
  patterns:
    - Catch-all Next.js route handler for transparent server-side proxy
    - Singleton QueryClient (server creates fresh, browser reuses)
    - Route group (protected) with shared auth layout
key_files:
  created:
    - src/app/api/proxy/[...path]/route.ts (73 lines)
    - src/lib/api-client.ts (57 lines)
    - src/lib/query-client.ts (26 lines)
    - src/components/providers/QueryProvider.tsx (14 lines)
    - src/app/(protected)/layout.tsx (38 lines)
  modified:
    - middleware.ts (added /assessment/:path* to matcher)
    - package.json (3 new runtime dependencies)
decisions:
  - "Proxy reads httpOnly session cookie server-side and injects Bearer header — client never sees raw JWT (T-01-01, T-01-04)"
  - "api-client targets /api/proxy/... not BACKEND_URL directly — auth header injection stays server-side"
  - "src/app/dashboard/ contains real content — not moved into (protected)/dashboard/ now; migration deferred to Phase 4 per plan note"
  - "Toaster placed in (protected)/layout.tsx only, not root layout — toast notifications scoped to protected pages"
metrics:
  duration: "~10 minutes"
  completed: "2026-04-11"
  tasks_completed: 3
  files_created: 5
  files_modified: 2
---

# Phase 01 Plan 01: Core Infrastructure Summary

Built the foundational proxy, API client, React Query provider, protected route group, and extended middleware — enabling every downstream assessment and dashboard component to make authenticated API calls without ever touching the raw JWT.

## What Was Built

### Task 1: Install dependencies and extend middleware
- Installed three new runtime dependencies: `zustand@^5.0.12`, `@tanstack/react-query@^5.97.0`, `react-hot-toast@^2.6.0`
- Extended `middleware.ts` matcher from `["/dashboard/:path*"]` to `["/dashboard/:path*", "/assessment/:path*"]`
- Commit: `9e15b84`

### Task 2: API proxy catch-all route (INFRA-01)
- Created `src/app/api/proxy/[...path]/route.ts` (73 lines)
- Awaits Next.js 15 async `params` to extract path segments
- Reads httpOnly `session` cookie; returns `{"error":"Unauthorized"}` with status 401 if absent
- Forwards GET/POST/PUT/DELETE to `BACKEND_URL/api/v1/{path}` with `Authorization: Bearer {token}`
- Preserves query string; reads body as text for POST/PUT; handles 204 No Content (empty body)
- Backend response status passed through transparently; errors logged server-side only
- Commit: `09fed91`

### Task 3: API client, Query singleton, QueryProvider, protected layout (INFRA-03, INFRA-05)
- `src/lib/api-client.ts` (57 lines): `apiFetch<T>` and `api.{get,post,put,delete}` targeting `/api/proxy/...`; handles 401 by redirecting to `/` via `window.location.replace`; throws on non-OK with backend error message
- `src/lib/query-client.ts` (26 lines): `getQueryClient()` singleton — server always creates fresh client, browser reuses one instance; 5-minute staleTime, 1 retry
- `src/components/providers/QueryProvider.tsx` (14 lines): `"use client"` wrapper around `QueryClientProvider` using `getQueryClient()`
- `src/app/(protected)/layout.tsx` (38 lines): server component; calls `getSession()`; redirects to `/` if null; wraps children in `QueryProvider`; adds dark-themed `Toaster` (top-right, `#1E293B` background, `#10B981` success / `#EF4444` error icons)
- Commit: `ba0eea3`

## Decisions Made During Implementation

1. **No dashboard migration this plan**: `src/app/dashboard/` has three real files (`page.tsx`, `layout.tsx`, `dashboard-content.tsx`). Per the plan's explicit note, these are NOT moved into `(protected)/dashboard/` now. The `(protected)` group layout exists for assessment routes to use immediately. Dashboard migration is deferred to Phase 4.

2. **api-client never sets Authorization header**: The client only sends requests to `/api/proxy/...`. The proxy server-side adds the Bearer token. This enforces the trust boundary — the raw JWT stays in httpOnly cookie land.

3. **Toaster scoped to protected layout only**: Toast notifications are only relevant for assessment/dashboard interactions. Placing in root layout would be unnecessary for landing/blog pages.

## Deviations from Plan

None — plan executed exactly as written.

## Threat Mitigations Applied

| Threat | Status |
|--------|--------|
| T-01-01 Spoofing: proxy returns 401 without session cookie | Mitigated |
| T-01-02 Info Disclosure: errors logged server-side, token never in response | Mitigated |
| T-01-03 Elevation of Privilege: middleware now guards /assessment + /dashboard | Mitigated |
| T-01-04 Tampering: client never has raw JWT — proxy handles all auth | Accepted (by design) |
| T-01-05 DoS: no rate limiting at proxy layer | Accepted (Spring Boot handles) |

## Known Stubs

None — all files are fully wired and functional.

## Self-Check: PASSED

All files verified to exist on disk. All three task commits verified in git log.
