# Phase 3: Assessment Steps 4-6 + Complete — Summary

**Completed:** 2026-04-11
**Plans Executed:** 3 (03-01, 03-02, 03-03)
**Build:** Passed — `npm run build` green, 34 static/dynamic routes

---

## What Was Built

### API Layer (src/lib/assessment-api.ts)
Added full DTO mappers and API functions for Steps 4-6:

**Step 4 — Goals:**
- `getGoals()` — fetches goal list, maps goalType/goalName/targetAmount ↔ type/name/cost
- `addGoal()`, `updateGoal()`, `deleteGoal()` — full CRUD
- `getGoalProjection()` — projection data (SIP, surplus, feasibility, emergency fund)
- `getRetirementAutoFill()` — corpus, gap, flat/step-up SIP from backend

**Step 5 — Insurance:**
- `getInsurance()`, `saveInsurance()` — life/health totals
- `getInsuranceGap()` — recommended covers (HLV method) from backend

**Step 6 — Tax:**
- `getTax()`, `saveTax()` — regime + 80C persistence
- `getTaxCalculation(params)` — debounced old/new regime comparison with manual deductions

### Hooks (src/hooks/assessment/)
New files created:
- `useGoals.ts` — useGoalsQuery, useAddGoalMutation, useUpdateGoalMutation, useDeleteGoalMutation
- `useGoalProjection.ts` — useGoalProjectionQuery (30s stale)
- `useRetirementAutoFill.ts` — useRetirementAutoFillQuery (30s stale)
- `useInsurance.ts` — useInsuranceQuery (store hydration on mount), useInsuranceMutation
- `useInsuranceGap.ts` — useInsuranceGapQuery (5m stale)
- `useTax.ts` — useTaxQuery (store hydration on mount), useTaxMutation
- `useTaxCalculation.ts` — useTaxCalculationQuery (parameterized by deductions, placeholderData for smooth recalc)

### Pages

**`/assessment/step-4`** — Financial Goals
- 8-type goal carousel (horizontal scroll); retirement type toggles auto-fill panel
- Retirement panel: What You Need vs What You Have grid, gap progress bar, flat/step-up SIP, delay impact warning, "Add Retirement Goal" button
- Emergency fund card: coverage progress, aggressive/conservative build-up scenarios
- Goal cards with backend per-goal SIP and progress percent
- Add/Edit modal with live projection preview (futureCost × 1.2 buffer, SIP formula, lump sum)
- Limit modal for 2-goal free plan cap
- All Goals Summary with feasibility check (achievable vs over-capacity)
- StepNavigation validates goals.length > 0

**`/assessment/step-5`** — Insurance Gap
- 4-tab section nav (Corporate / Health & Life / Checklist / Summary)
- Corporate section only shown for Salaried employmentType
- Personal Health + Life sections with add-policy modals and remove
- Coverage analysis panels comparing recommended (backend) vs actual (corporate + personal)
- Life gap shows % covered and estimated premium to close
- Toggle-switch checklist (Critical Illness, Personal Accident, Disability, Maternity)
- Action summary ranking life → health gap items to address
- StepNavigation saves totals to API then navigates to step-6

**`/assessment/step-6`** — Tax Optimization
- 4-tab section nav (Regime / Comparison / Deductions / HRA)
- Recommendation banner showing recommended regime + savings amount
- Clickable regime toggle and comparison table columns
- 10-row comparison table (Gross Income → FINAL TAX), active regime column highlighted
- Accordion deductions: 80C (auto EPF/life + 4 manual inputs, unused warning), 80D (3 medical tiers), Others (NPS, loans, donations)
- Debounced recalculation (300ms) triggers useTaxCalculationQuery with placeholderData to avoid flicker
- HRA exemption card (auto-calculated from backend)
- Premium upsell cards (Tax Harvesting in amber, Family Income in purple)
- StepNavigation with "Complete Assessment" CTA → validates regime selected → saves → navigates to /assessment/complete

**`/assessment/complete`** — Celebration Screen
- Glowing trophy icon with Sparkles animation
- Staggered checklist fade-in (4 items, 150ms delay each)
- Card fades in after 300ms
- "View Your Dashboard" button → /dashboard
- completeAssessment() called on mount to set isComplete=true in Zustand

---

## Key Decisions Made

| Decision | Rationale |
|----------|-----------|
| All inline styles, no Tailwind | Project constraint — matches existing Steps 1-3 pattern |
| `isPremium = true` hardcoded | Source React app had TODO to restore localStorage check; kept consistent |
| StepNavigation for nav bar | Reused from Phase 2 — consistent UX across all 6 steps |
| Debounce 300ms for tax calc | Prevents API hammering on keystrokes in accordion inputs |
| `placeholderData: prev => prev` | Shows last known tax values while recalculating (no layout shift) |
| useInsuranceQuery hydrates store | Matches source pattern — API data flows into Zustand on mount if store empty |

---

## Artifacts Created

| Path | Lines | Purpose |
|------|-------|---------|
| src/lib/assessment-api.ts | +~170 appended | Goals + Insurance + Tax API functions |
| src/hooks/assessment/useGoals.ts | 45 | Goal CRUD mutations |
| src/hooks/assessment/useGoalProjection.ts | 14 | Projection query |
| src/hooks/assessment/useRetirementAutoFill.ts | 13 | Retirement auto-fill query |
| src/hooks/assessment/useInsurance.ts | 47 | Insurance query + mutation |
| src/hooks/assessment/useInsuranceGap.ts | 14 | Gap query |
| src/hooks/assessment/useTax.ts | 30 | Tax query + mutation |
| src/hooks/assessment/useTaxCalculation.ts | 20 | Parameterized tax calc query |
| src/app/(protected)/assessment/step-4/page.tsx | 810 | Step 4 full page |
| src/app/(protected)/assessment/step-5/page.tsx | 530 | Step 5 full page |
| src/app/(protected)/assessment/step-6/page.tsx | 380 | Step 6 full page |
| src/app/(protected)/assessment/complete/page.tsx | 180 | Assessment complete |

---

## Build Output

```
ƒ /assessment/complete    2.86 kB   107 kB
ƒ /assessment/step-4      9.46 kB   132 kB
ƒ /assessment/step-5      6.12 kB   129 kB
ƒ /assessment/step-6      5.44 kB   128 kB
```

All dynamic server-rendered, protected by middleware.

---

## Git Commit

`734ada6` — feat(phase-3): port assessment steps 4-6 and complete screen to Next.js
