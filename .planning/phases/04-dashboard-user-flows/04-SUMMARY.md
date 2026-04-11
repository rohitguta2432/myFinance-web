# Phase 04 — Dashboard + User Flows: SUMMARY

**Status:** Complete  
**Commit:** 5249cdb  
**Build:** Pass (37 static/dynamic routes)

---

## What Was Built

### Plan 1 — Dashboard Infrastructure + Summary Tab (DASH-01 to DASH-10)

**12 consumer hooks** in `src/hooks/dashboard/`:
- `useDashboardSummary` — single cached TanStack Query call to `GET /dashboard/summary`, `staleTime: 5min`
- `useFinancialHealthScore` — typed `Pillar[]` + `ScoreLabel`, `sortedPillars`, `mostCritical`
- `useHookText` — pillar interpretation map `Record<string, HookTextData>`
- `useRedFlags` — `allFlags`, `topFlags`, `hiddenCount`, severity-typed
- `usePriorityActions` — `allActions`, `topActions`, `howTo` field
- `useActionPlan` — maps raw backend actions to `ActionPlanItem` with `mapCategory`/`mapPillar`
- `useInsuranceAnalysis` — typed `TermLife`, `HealthInsurance`, `AdditionalCoverageCard[]`
- `useTaxAnalysis` — full regime comparison with `old/new` key normalization, `fmt` formatter
- `useProjection` — transforms backend `YearPointDTO[]` to `ProjectionDataPoint[]` with earlyStart calc
- `usePersonalisedBenchmarks` — `green/yellow/red` → `green/amber/red` traffic light mapping
- `useTimeMachine` — daily cost of inaction + annualized penalty
- `useLockedInsights` — premium teaser card mapping

**8 dashboard components** in `src/components/dashboard/`:
- `ScoreRing` — animated SVG progress ring with counter (`setTimeout` animation)
- `PillarInterpretationCard` — collapsible with `STATUS_CONFIG` (critical/warn/ok)
- `BenchmarkComparison` — `TRAFFIC_COLORS` table with progress bars
- `ExcessReallocationCard` — surplus deployment with equity/debt split, typed via explicit extraction
- `LockedPremiumInsights` — premium feature teaser grid
- `SectionNav` — fixed right-side scroll spy with `IntersectionObserver`
- `ProjectionChartInner` — Recharts `AreaChart` with 3 series (optimized/current/earlyStart) + milestones
- `ProjectionChart` — `next/dynamic({ ssr: false })` wrapper (SSR crash prevention)
- `FinancialTimeMachine` — animated daily cost ticker + ProjectionChart (premium-gated)

**Key decisions:**
- No `useAuthStore` — proxy reads JWT from httpOnly session cookie automatically
- `next/dynamic({ ssr: false })` for Recharts — touches `window` at import time
- `recharts@^3.8.1` installed

### Plan 2 — Dashboard Tabs (DASH-04 to DASH-09)

**4 pages** in `src/app/(protected)/dashboard/`:
- `layout.tsx` — `"use client"` sidebar with `UpgradeModal`, mobile tab bar, premium gating via `localStorage`
- `page.tsx` — full summary: ScoreRing, pillar cards, TimeMachine, red flags (free: 1, premium: all), priority actions (free: 3, premium: all), benchmarks, excess reallocation, locked insights, upgrade CTA
- `action-plan/page.tsx` — `GuidancePanel`/`StepsPanel`/`ActionCard` with category badges and urgency/feasibility indicators
- `insurance/page.tsx` — term life (HLV method) + health (city-tier benchmark) + additional coverage cards + `GuidancePanel`
- `tax/page.tsx` — regime comparison table, TDS reconciliation, rental income treatment, deductions (80C/NPS), employer NPS

**Style bug fixed:** Multiple files had duplicate CSS-in-JS keys (`marginBottom: 8, margin: 0, marginBottom: 8`) — TypeScript strict mode rejects these. Fixed by removing leading duplicate key in all occurrences.

**Type bug fixed:** `ExcessReallocationCard` spread `...Record<string, unknown>` produced `unknown` children; fixed by extracting all fields explicitly with `String()/Number()/Boolean()` casts.

### Plan 3 — User Flow Routing (FLOW-01 to FLOW-03)

**`src/components/layout/navbar.tsx`:**
- Imports `useAssessmentStore` and reads `isComplete` selector
- Post-login Google callback: `router.push(isComplete ? "/dashboard" : "/assessment/step-1")` (FLOW-01)
- `handleGetStarted` for logged-in users also uses same conditional routing
- `dropdownLinks` now includes `Assessment → /assessment/step-1` and `Dashboard → /dashboard` (FLOW-02)
- Mobile menu uses same `dropdownLinks` array

**Old placeholder removed (FLOW-03):**
- Deleted `src/app/dashboard/dashboard-content.tsx`, `layout.tsx`, `page.tsx`
- These created a route conflict with `src/app/(protected)/dashboard/page.tsx` (both resolve to `/dashboard` in the browser under Next.js App Router)

---

## Files Created/Modified

```
src/hooks/dashboard/
  useDashboardSummary.ts
  useFinancialHealthScore.ts
  useHookText.ts
  useRedFlags.ts
  usePriorityActions.ts
  useActionPlan.ts            # explicit field extraction, not spread
  useInsuranceAnalysis.ts
  useTaxAnalysis.ts
  useProjection.ts
  usePersonalisedBenchmarks.ts
  useTimeMachine.ts
  useLockedInsights.ts

src/components/dashboard/
  ScoreRing.tsx
  PillarInterpretationCard.tsx
  BenchmarkComparison.tsx
  ExcessReallocationCard.tsx  # typed via explicit extraction
  LockedPremiumInsights.tsx
  SectionNav.tsx
  ProjectionChartInner.tsx    # Recharts, no ssr
  ProjectionChart.tsx         # next/dynamic({ ssr: false })
  FinancialTimeMachine.tsx

src/app/(protected)/dashboard/
  layout.tsx
  page.tsx
  action-plan/page.tsx
  insurance/page.tsx
  tax/page.tsx

src/components/layout/navbar.tsx   # FLOW-01/02/03

DELETED:
  src/app/dashboard/dashboard-content.tsx
  src/app/dashboard/layout.tsx
  src/app/dashboard/page.tsx
```

---

## Patterns Established

- **Single API + thin slices**: All 12 hooks call `useDashboardSummary()` once; React Query deduplicates
- **SSR-safe Recharts**: Two-file pattern (`Inner` + `dynamic` wrapper) is the project standard
- **Premium gating**: `localStorage.getItem("myfinancial_premium") === "true"` — consistent across layout + summary
- **Route conflict resolution**: `(protected)` route groups don't change URLs; delete the conflicting non-grouped route
- **Inline styles only**: All new components follow the project convention — no Tailwind class strings on divs
- **TypeScript strict**: Avoid spreading `Record<string, unknown>` into typed interfaces; extract fields explicitly
