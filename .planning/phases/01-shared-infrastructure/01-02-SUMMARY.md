---
phase: 01-shared-infrastructure
plan: 02
subsystem: stores-shared-ui
tags: [zustand, formatters, enums, skeleton, inactivity, assessment-layout]
dependency_graph:
  requires: []
  provides:
    - useAssessmentStore (Zustand persist store with _hasHydrated guard)
    - formatCurrency / formatPercentage / formatDate
    - CITY_TIERS / MARITAL_STATUS / RISK_TOLERANCE / FREQUENCY / INSURANCE_TYPE / TAX_REGIME / EMPLOYMENT_TYPE / RESIDENCY_STATUS
    - InactivityGuard (session timeout 15/20 min)
    - ProfileSkeleton / CashFlowSkeleton / AssetsLiabilitiesSkeleton / GoalsSkeleton / InsuranceGapSkeleton / TaxOptimizationSkeleton
    - AssessmentLayout (step sidebar + mobile progress bar)
  affects:
    - All Phase 2+ assessment step pages (import useAssessmentStore)
    - All pages displaying INR amounts (import formatCurrency)
    - Assessment route group /assessment/* (layout.tsx wraps all step pages)
tech_stack:
  added:
    - zustand@^5.0.12 (already installed via Plan 01-01 prerequisites)
  patterns:
    - Zustand persist with onRehydrateStorage + _hasHydrated guard for SSR safety
    - Inline CSS keyframe animations via style tags (no CSS module, no Tailwind animate-*)
    - CSS media query via style tag in client component for responsive sidebar/progress bar
    - Cookie-based user presence check (document.cookie includes "user_profile=")
key_files:
  created:
    - src/store/useAssessmentStore.ts
    - src/lib/formatters.ts
    - src/lib/enums.ts
    - src/components/auth/inactivity-guard.tsx
    - src/components/ui/assessment-skeleton.tsx
    - src/app/(protected)/assessment/layout.tsx
  modified: []
decisions:
  - "Store name kept as 'assessment-storage' to match React app — localStorage survives migration without data loss"
  - "activeStep derived from URL pathname in layout (not store) — more reliable for browser navigation"
  - "user_profile cookie check (not httpOnly) used for InactivityGuard session presence — avoids server round-trip"
  - "ShimmerStyles injected as first child of each skeleton — ensures CSS is in DOM when skeleton mounts"
  - "assessment-sidebar and assessment-mobile-progress use className + style tag media query — only correct approach for responsive layout with inline styles in client components"
metrics:
  duration_minutes: 18
  completed_date: "2026-04-11"
  tasks_completed: 3
  tasks_total: 3
  files_created: 6
  files_modified: 0
---

# Phase 01 Plan 02: Stores and Shared UI Summary

**One-liner:** Zustand assessment store (all 6 steps) with TypeScript types and SSR hydration guard, INR formatters, DB enum maps, InactivityGuard with Next.js router, six inline-animated loading skeletons, and assessment route layout with step sidebar.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Port Zustand store + formatters + enums | 556e5ff | src/store/useAssessmentStore.ts, src/lib/formatters.ts, src/lib/enums.ts |
| 2 | Port InactivityGuard + assessment skeletons | 9d18a64 | src/components/auth/inactivity-guard.tsx, src/components/ui/assessment-skeleton.tsx |
| 3 | Build assessment layout with step sidebar | a6f1d89 | src/app/(protected)/assessment/layout.tsx |

## What Was Built

### useAssessmentStore (src/store/useAssessmentStore.ts)

Full TypeScript port of the React Zustand store covering all 6 assessment wizard steps. Exports typed interfaces for every data shape (IncomeItem, ExpenseItem, AssetItem, LiabilityItem, GoalItem, InsuranceState, AssessmentState). Uses `persist` middleware with `assessment-storage` key (matching the React app's key, so existing localStorage data survives migration). The `_hasHydrated` guard is set via `onRehydrateStorage` callback — components can gate rendering on `useAssessmentStore((s) => s._hasHydrated)` to prevent React hydration mismatches.

### Formatters + Enums (src/lib/formatters.ts, src/lib/enums.ts)

Exact TypeScript ports. `formatCurrency` handles INR with optional compact notation (₹1.5L, ₹2.3Cr). All enum objects use `as const` for literal type inference. Enum values match Spring Boot DB CHECK constraints exactly.

### InactivityGuard (src/components/auth/inactivity-guard.tsx)

Client component wrapping children. Tracks user activity (mousedown, keydown, scroll, touchstart, mousemove) throttled to 1/second. Shows amber warning modal at 15 minutes idle with countdown timer. At 20 minutes calls `POST /api/auth/logout` then `router.replace("/")`. User presence detected via `document.cookie.includes("user_profile=")` — skips all timers if no active session. Modal uses inline CSS keyframe (`scaleIn`) injected via a `<style>` tag.

### Assessment Skeletons (src/components/ui/assessment-skeleton.tsx)

Six skeleton components replicating each step's layout structure using inline styles. Shimmer animation defined once as a CSS keyframe (`shimmer-pulse 1.5s ease-in-out infinite`) injected by `ShimmerStyles` as first child of each skeleton. No Tailwind `animate-pulse` used. Exact row/item counts preserved from source (6 form fields in ProfileSkeleton, 2 income + 3 expense rows in CashFlowSkeleton, etc.).

### Assessment Layout (src/app/(protected)/assessment/layout.tsx)

Client component for the `(protected)/assessment` route group. Renders:
- **Desktop (1024px+):** Fixed left sidebar (256px) with step buttons showing active/completed/future states, overall progress bar at bottom
- **Mobile:** Horizontal progress strip with "Step N of 6" label and animated progress bar
- **InactivityGuard** wrapping `{children}` (all assessment step pages)

Active step derived from `usePathname()` — pathname is the source of truth, not the store. Responsive behavior implemented via CSS media queries in a `<style>` tag (required for inline-styles approach in a client component).

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — these are pure infrastructure primitives with no data rendering.

## Threat Flags

None — no new network endpoints, auth paths, or trust boundaries introduced. The InactivityGuard reads the `user_profile` cookie client-side (readable, not httpOnly) as a presence signal only — no sensitive data extracted.

## Self-Check: PASSED

Files created:
- src/store/useAssessmentStore.ts — FOUND
- src/lib/formatters.ts — FOUND
- src/lib/enums.ts — FOUND
- src/components/auth/inactivity-guard.tsx — FOUND
- src/components/ui/assessment-skeleton.tsx — FOUND
- src/app/(protected)/assessment/layout.tsx — FOUND

Commits:
- 556e5ff — FOUND
- 9d18a64 — FOUND
- a6f1d89 — FOUND

Build: `npm run build` passes with "✓ Compiled successfully" — no TypeScript errors.
