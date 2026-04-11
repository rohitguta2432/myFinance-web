# Phase 02: Assessment Steps 1-3 — Summary

**Completed:** 2026-04-11
**Status:** Complete — all 3 plans delivered

## What Was Built

### Assessment API Layer (`src/lib/assessment-api.ts`)
Full TypeScript port of the React app's `assessmentApi.js`. Contains:
- Enum conversion maps (marital status, risk tolerance, frequency)
- DTO mapper functions for all 4 data domains: Profile, Financials, Balance Sheet
- All API functions for steps 1-3: profile, cashflow (income/expense), networth (assets/liabilities), portfolio-analysis, risk-scoring
- Uses `api` from `@/lib/api-client` — all calls proxy through `/api/proxy/`

### React Query Hooks (`src/hooks/assessment/`)
5 hook files created:
- `useProfile.ts` — `useProfileQuery`, `useProfileMutation`
- `useRiskScoring.ts` — `useRiskScoringQuery`
- `useFinancials.ts` — 7 hooks: query + 6 CRUD mutations (add/delete/update income & expense)
- `useBalanceSheet.ts` — 7 hooks: query + 6 CRUD mutations (add/delete/update asset & liability) — invalidates balance-sheet + portfolio-analysis + downstream queries
- `usePortfolioAnalysis.ts` — `usePortfolioAnalysisQuery`

### Shared Component (`src/components/assessment/step-navigation.tsx`)
Reusable `StepNavigation` fixed-bottom bar used by all 3 steps:
- Props: `step`, `backPath`, `onNext`, `isValid`, `isSaving`, `validationMessage`
- Shows Back button (when backPath provided), Step N/6 indicator, Next button
- Calls `toast.error(validationMessage)` when Next clicked and `!isValid`
- Fully inline-styled, dark theme

### Step 1: Personal Risk Profile (`src/app/(protected)/assessment/step-1/page.tsx`)
Port of Step1PersonalRisk.jsx (635 lines). Features:
- Age slider (18-75)
- State + City cascading searchable dropdowns (fetches from `/api/proxy/location/states` and `cities?state=`)
- Marital status button grid (Single/Married/Divorced/Widowed)
- Dependents counter with children sub-question (appears when deps >= 1)
- Employment + Residency dropdowns
- 7-question risk investor questionnaire accordion (auto-advance on answer, collapsed shows checkmark when answered)
- Validation: all fields + all 7 questions required
- Hydrates Zustand from API on mount via useEffect
- Saves to backend on Next click (swallows API error, continues with local state)

### Step 2: Income & Expenses (`src/app/(protected)/assessment/step-2/page.tsx`)
Port of Step2IncomeExpenses.jsx (595 lines). Features:
- Income list with emoji icons, edit (Pencil) + delete (X) per item
- Expense list with type badge (Essential/Discretionary)
- "Add Income Source" / "Add Expense" dashed buttons
- Cash flow summary card (shows when both incomes + expenses exist): Income / Expenses / EMIs / SURPLUS / Savings Rate with green/red feedback
- EMI mismatch warning (cross-validates EMI expenses vs liabilities in store)
- Optimistic updates: add/update/delete updates store immediately, reverts on API failure
- Modal: bottom sheet with income or expense form (category select with emoji options, amount, description, frequency, essential/discretionary toggle, TDS toggle for income)

### Step 3: Assets & Liabilities (`src/app/(protected)/assessment/step-3/page.tsx`)
Port of Step3AssetsLiabilities.jsx (878 lines). Features:
- Premium net worth card with glassmorphism effect, shows total assets + liabilities + net worth
- Asset allocation donut chart (conic-gradient, equity/debt/real estate/gold/other with legend)
- Current vs target allocation table (uses risk scoring data from backend)
- Liabilities summary card: total outstanding, EMI, avg interest rate, DTI ratio gauge (color-coded bar)
- Assets/Liabilities tab toggle
- List view with edit + delete per item
- "Save & Add Another" keeps modal open for bulk entry
- Modal with full asset fields (category, sub-category, name, purchase value, current value, time horizon, liquidity) and liability fields (category, name, outstanding, EMI, interest rate, months left, moratorium for education loans)

### Store Type Extensions (`src/store/useAssessmentStore.ts`)
Extended the slim Zustand interface types to include optional fields matching the API shape:
- `IncomeItem`: added `taxDeducted?`, `tdsPercentage?`, `description?`
- `ExpenseItem`: added `description?`
- `AssetItem`: added `subCategory?`, `timeHorizon?`, `purchaseValue?`, `liquidity?`
- `LiabilityItem`: added `emi?`, `interestRate?`, `monthsLeft?`, `moratoriumMonths?`

## Technical Decisions

| Decision | Rationale |
|----------|-----------|
| DTO mapper constants inlined in assessment-api.ts | Self-contained, no circular import risk |
| Store types extended with optional fields | Single source of truth — store holds all data fields, not just display fields |
| Location endpoints fetched via raw `fetch` not api-client | Location API is not an assessment endpoint, doesn't need the proxy error handling wrapper |
| Optimistic updates in Step 2 | Better UX — immediate feedback, revert on error |
| API errors swallowed in Step 1 save | Graceful degradation — continue wizard with local state if backend unavailable |

## Files Created

- `src/lib/assessment-api.ts`
- `src/hooks/assessment/useProfile.ts`
- `src/hooks/assessment/useRiskScoring.ts`
- `src/hooks/assessment/useFinancials.ts`
- `src/hooks/assessment/useBalanceSheet.ts`
- `src/hooks/assessment/usePortfolioAnalysis.ts`
- `src/components/assessment/step-navigation.tsx`
- `src/app/(protected)/assessment/step-1/page.tsx`
- `src/app/(protected)/assessment/step-2/page.tsx`
- `src/app/(protected)/assessment/step-3/page.tsx`

## Files Modified

- `src/store/useAssessmentStore.ts` — extended interface types with optional fields
- `.planning/ROADMAP.md` — updated Phase 2 plan list
- `.planning/phases/02-assessment-steps-1-3/02-01-PLAN.md` — created
- `.planning/phases/02-assessment-steps-1-3/02-02-PLAN.md` — created
- `.planning/phases/02-assessment-steps-1-3/02-03-PLAN.md` — created

## Build Verification

- `npx tsc --noEmit --skipLibCheck` — 0 errors
- `npm run build` — success, all 3 routes compiled:
  - `/assessment/step-1` — 5.7 kB
  - `/assessment/step-2` — 6.05 kB
  - `/assessment/step-3` — 8.39 kB

## Requirements Addressed

- ASSESS-01: Step 1 Personal Risk Profile ✓
- ASSESS-02: Step 2 Income & Expenses ✓
- ASSESS-03: Step 3 Assets & Liabilities ✓
- ASSESS-08: Step navigation (Back/Next) ✓
- ASSESS-09: Data persistence to backend on Next ✓
- ASSESS-10: Zustand + React Query data persistence across refresh ✓
