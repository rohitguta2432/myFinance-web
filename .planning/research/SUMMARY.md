# Research Summary — React to Next.js Migration

## Executive Summary

1:1 feature-parity migration of React 19 + Vite SPA into the existing Next.js 15 App Router project. Source app has 6-step financial assessment wizard, 12-calculator dashboard, AI chat, and admin panel (~12,500 lines, 78 files). Four libraries to add. Every assessment and dashboard component is `"use client"` — server components serve only as thin auth-guarded shells.

## Stack Decisions

| Library | Version | Notes |
|---------|---------|-------|
| `zustand` | ^5.0 | Use Context Provider pattern for App Router (not global `create()`) |
| `@tanstack/react-query` | ^5.90 | Standard `QueryClientProvider`, no SSR prefetching needed |
| `recharts` | ^3.8 | Must wrap in `next/dynamic({ ssr: false })` |
| `react-hot-toast` | ^2.6 | Keep as-is, don't switch to Sonner during migration |

**Don't port:** `dexie` (unused in assessment flow), `useAuthStore` (replaced by cookie auth)

## Critical Pitfalls

1. **Zustand hydration mismatch** — `persist` reads localStorage on client, server sees defaults. Fix: `_hasHydrated` guard with skeleton fallback.
2. **Recharts SSR crash** — Touches `window` at import time. Fix: `next/dynamic({ ssr: false })` on every chart component.
3. **Dual auth conflict** — Don't port `useAuthStore`. Cookie-based auth already exists. Read user from `user_profile` cookie.
4. **Middleware gaps** — Extend matcher to include `/assessment/:path*` alongside `/dashboard/:path*`.

## Suggested Phases (5)

1. **Shared Infrastructure** — Providers, API proxy, Zustand stores, middleware. Prerequisite for everything.
2. **Assessment Steps 1-3** — Establishes component patterns. Step 3 (878 lines) needs most decomposition.
3. **Assessment Steps 4-6 + Complete** — Complex calculations (SIP projections, HLV insurance, tax regime).
4. **Dashboard** — All tabs from single `useDashboardSummary` call. Recharts needs dynamic import.
5. **AI Chat + Admin + Polish** — Kira chat, admin panel, premium gating, cleanup.

## Architecture Pattern

```
Server Component (layout.tsx)     → auth guard, read session cookie
  └── Client Shell ("use client")  → providers, Zustand, React Query
       └── Feature Component       → forms, charts, state
            └── API call            → fetch("/api/proxy/...") 
                 └── Route Handler  → extract JWT from cookie, forward to Spring Boot
```

## Build Order Dependencies

```
Infrastructure (stores, proxy, providers)
  ├── Assessment Step 1 (profile — consumed by Steps 5, 6)
  │   ├── Step 2 (income/expenses)
  │   │   └── Step 3 (assets/liabilities)
  │   │       └── Step 4 (goals — uses income data)
  │   │           └── Step 5 (insurance — uses age, employment)
  │   │               └── Step 6 (tax — uses income, regime)
  │   │                   └── Complete screen
  └── Dashboard (needs assessment data to exist)
      └── AI Chat (needs dashboard context)
```
