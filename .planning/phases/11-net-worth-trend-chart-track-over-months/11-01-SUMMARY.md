---
phase: 11-net-worth-trend-chart-track-over-months
plan: "01"
subsystem: dashboard
tags: [net-worth, recharts, dashboard, visualization]
dependency_graph:
  requires:
    - useBalanceSheetQuery (src/hooks/assessment/useBalanceSheet.ts)
    - useAppTheme (src/hooks/useAppTheme.ts)
    - formatCurrency (src/lib/formatters.ts)
  provides:
    - /dashboard/net-worth route
    - Net Worth tab in dashboard sidebar
  affects:
    - src/app/(protected)/dashboard/layout.tsx (added Wallet icon + Net Worth tab)
tech_stack:
  added: []
  patterns:
    - dynamic Recharts imports (ssr: false) — same as goals page
    - inline styles with palette from useAppTheme
    - nw-grid CSS class for responsive two-column layout
key_files:
  created:
    - src/app/(protected)/dashboard/net-worth/page.tsx
  modified:
    - src/app/(protected)/dashboard/layout.tsx
decisions:
  - "Used PieChart with innerRadius for donut chart — cleaner center label support"
  - "Tooltip formatter typed as (value: unknown) => [...] to match Recharts ValueType"
  - "Projection uses Math.pow(1 + 0.08/12, i) for monthly compounding per D-08"
  - "XAxis interval=2 to avoid crowded month labels in 13-point chart"
metrics:
  duration: "~20 minutes"
  completed: "2026-04-12"
  tasks_completed: 1
  tasks_total: 1
  files_created: 1
  files_modified: 1
---

# Phase 11 Plan 01: Net Worth Dashboard Tab Summary

**One-liner:** Net Worth dashboard tab with donut chart, category breakdown table, and 12-month projection area chart sourced from balance sheet data.

## What Was Built

- **Dashboard layout** (`src/app/(protected)/dashboard/layout.tsx`): Added `Wallet` import from lucide-react and new `net-worth` entry to `SIDEBAR_TABS`, appearing after Goals in both the desktop sidebar and mobile tab bar.

- **Net Worth page** (`src/app/(protected)/dashboard/net-worth/page.tsx`): Full dashboard tab with:
  - **Summary card**: Total Assets (green), Total Liabilities (red), Net Worth (color-coded by sign) — all formatted with `formatCurrency(v, true)` for Indian Cr/L notation
  - **Asset vs Liability donut chart**: Recharts PieChart with innerRadius=55/outerRadius=80, two segments (green assets, red liabilities), center label showing net worth, legend below
  - **Category breakdown table**: Groups assets by `category` field, sums amounts, sorts descending, shows Amount and % of Total columns
  - **12-month projection area chart**: 13 data points (month 0-12), assets grow at 8% p.a. compounded monthly, liabilities decrease by EMI sum × months (floored at 0), Recharts AreaChart with gradient fill and INR-formatted tooltip
  - **Projection disclaimer**: "Projected based on current portfolio and EMI schedule."
  - **Responsive layout**: `.nw-grid` CSS class applies `1fr 1.4fr` two-column on desktop, single column on mobile via `@media (max-width: 767px)`
  - **Loading state**: Shimmer skeleton cards
  - **Empty state**: Wallet icon + "No assets or liabilities recorded" + Link to `/assessment/step-3` with "Add Assets" CTA

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Recharts Tooltip formatter TypeScript type error**
- **Found during:** Build verification (TypeScript compilation)
- **Issue:** `formatter={(value: number) => [...]}` — Recharts types `value` as `ValueType | undefined` which is incompatible with `number` parameter type
- **Fix:** Changed to `formatter={(value: unknown) => [formatCurrency(Number(value), true), ""]}` matching Recharts' generic ValueType
- **Files modified:** `src/app/(protected)/dashboard/net-worth/page.tsx`
- **Commit:** fca2097 (same task commit)

## Known Stubs

None — all data comes from `useBalanceSheetQuery` which fetches live balance sheet data from the backend.

## Threat Flags

None — no new network endpoints, auth paths, or trust boundary changes introduced. Page reads from existing authenticated balance-sheet endpoint only.

## Self-Check: PASSED

- `src/app/(protected)/dashboard/net-worth/page.tsx` — created (verified)
- `src/app/(protected)/dashboard/layout.tsx` — modified with Wallet + net-worth entry (verified)
- Commit `fca2097` — exists in git log
- TypeScript compilation: ✓ Compiled successfully in 5.0s
- All 10 acceptance criteria: PASS

## Commits

| Hash | Message |
|------|---------|
| fca2097 | feat(11-01): add Net Worth dashboard tab — sidebar entry and full page |
