---
phase: 07-public-calculator-pages-sip-emi-ppf-fd-hra-etc
plan: 03
subsystem: calculators
tags: [calculators, seo, recharts, financial-math, hra, nps, retirement, swp, inflation]
dependency_graph:
  requires:
    - 07-01-PLAN.md (CalculatorLayout, SliderInput, ResultCard, calculator-utils.ts)
  provides:
    - /calculators/hra (HRA tax exemption calculator)
    - /calculators/nps (NPS corpus and pension calculator)
    - /calculators/retirement (Retirement corpus calculator)
    - /calculators/swp (SWP sustainability calculator)
    - /calculators/inflation (Inflation future cost calculator)
  affects:
    - /calculators/* (completes all 10 calculator routes)
tech_stack:
  added: []
  patterns:
    - Server shell (page.tsx with metadata + FAQPage JSON-LD) + "use client" _client.tsx
    - Recharts BarChart (HRA), AreaChart (NPS, Inflation), LineChart (SWP)
    - Metro/Non-Metro toggle via useState (HRA)
    - Age validation guard with error UI (NPS)
    - Dynamic insight text from slider state (Inflation)
key_files:
  created:
    - src/app/calculators/hra/page.tsx
    - src/app/calculators/hra/_client.tsx
    - src/app/calculators/nps/page.tsx
    - src/app/calculators/nps/_client.tsx
    - src/app/calculators/retirement/page.tsx
    - src/app/calculators/retirement/_client.tsx
    - src/app/calculators/swp/page.tsx
    - src/app/calculators/swp/_client.tsx
    - src/app/calculators/inflation/page.tsx
    - src/app/calculators/inflation/_client.tsx
  modified:
    - src/app/calculators/sip/_client.tsx (Recharts Formatter type fix)
    - src/app/calculators/lumpsum/_client.tsx (Recharts Formatter type fix)
    - src/app/calculators/emi/_client.tsx (Recharts Formatter type fix)
    - src/app/calculators/fd/_client.tsx (Recharts Formatter type fix)
    - src/app/calculators/ppf/_client.tsx (Recharts Formatter type fix)
decisions:
  - Used `formatter={(v) => formatLakhsCrores(Number(v))}` to satisfy Recharts v3 ValueType | undefined constraint
  - HRA toggle uses two pill buttons (not a slider) for clear Metro/Non-Metro distinction
  - Retirement page has no chart — 3 ResultCards (corpus + future expenses + SIP needed) are sufficient
  - SWP corpus depletion uses LineChart with red ReferenceLine at y=0
  - Inflation AreaChart uses orange/warn color (#FB923C) to signal cost risk
metrics:
  duration: "~20 minutes"
  completed: "2026-04-12"
  tasks_completed: 2
  files_created: 10
  files_modified: 5
---

# Phase 07 Plan 03: HRA + NPS + Retirement + SWP + Inflation Calculators Summary

**One-liner:** Five financial calculators (HRA exemption breakdown, NPS corpus with age guard, Retirement corpus with SIP needed, SWP corpus depletion, Inflation future cost with dynamic insight) completing the full 10-calculator suite.

## What Was Built

### Task 1: HRA, NPS, Retirement Calculator Pages (commit 98bcede)

**HRA Calculator** (`/calculators/hra`):
- 3-rule BarChart showing Actual HRA, Rent−10%Basic, and 50/40%Basic side-by-side
- Minimum-value bar highlighted in yellow (#F5C842); other bars in teal accent
- Metro/Non-Metro toggle (pill buttons) that changes the 50%/40% rule live
- HRA Exemption + Taxable HRA ResultCards
- Warning note: "HRA exemption is only available under the old tax regime"
- FAQPage JSON-LD: what is HRA exemption, new vs old tax regime, metro cities list

**NPS Calculator** (`/calculators/nps`):
- Age guard: if retirementAge <= currentAge, shows red error card and skips calcNPS
- Year-by-year corpus growth AreaChart (x=age, y=corpus) with gradient fill
- 3 ResultCards: Estimated Corpus (accent), Monthly Pension (with sublabel), Total Invested
- FAQPage JSON-LD: what is NPS, NPS vs PPF, tax benefits under 80CCD

**Retirement Calculator** (`/calculators/retirement`):
- 4 sliders: monthly expenses, current age, retirement age, inflation rate
- Monthly SIP needed computed as: `requiredCorpus * r / ((1+r)^n - 1) / (1+r)` at 12% p.a.
- 3 ResultCards: Required Corpus (accent), Future Monthly Expenses, Monthly SIP Needed
- Disclaimer: "Based on 4% safe withdrawal rate. Assumes 6% annuity returns post-retirement"
- FAQPage JSON-LD: 4% rule, how much corpus to retire in India, inflation's effect

### Task 2: SWP + Inflation Calculator Pages (commit a92885d)

**SWP Calculator** (`/calculators/swp`):
- LineChart showing corpus balance declining to zero at calcSWP result
- Red dashed ReferenceLine at y=0 marks the exhaustion point visually
- `r=0` edge case handled to prevent division by zero in chart data
- 3 ResultCards: Corpus Lasts (accent), Total Withdrawn, Annual Withdrawal Rate
- FAQPage JSON-LD: what is SWP, SWP vs FD, tax on SWP withdrawals

**Inflation Calculator** (`/calculators/inflation`):
- Orange AreaChart (#FB923C / palette.warn) communicates inflation as a financial threat
- Dynamic insight text: "your investments must grow at more than X%. A diversified equity portfolio targeting Y%+ real returns would offset this."
- 3 ResultCards: Future Cost (accent), Cost Increase %, Purchasing Power of ₹1L
- FAQPage JSON-LD: what is inflation, India's average inflation rate, how to beat inflation

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Recharts v3 Formatter type mismatch in 07-02 calculator clients**
- **Found during:** Task 1 — build failed on `emi/_client.tsx` (originally from 07-02)
- **Issue:** Recharts v3 `Formatter<ValueType, NameType>` requires `(value: ValueType | undefined)` but files used `(value: number)` — TypeScript `strict` rejects `undefined` not assignable to `number`
- **Fix:** Changed all formatters to `(value) => formatLakhsCrores(Number(value))` in sip, lumpsum, emi, fd, ppf clients
- **Files modified:** sip, lumpsum, emi, fd, ppf `_client.tsx` (already committed by 07-02 executor in `14cc30f`, PPF in `de24308` — edit was no-op on those)
- **Note:** The 07-02 executor had already fixed PPF and all other files in separate commits. The new files I created used the correct pattern from the start.

## Known Stubs

None. All 5 calculators compute real values from user inputs via `calculator-utils.ts` formulas. No placeholder data or hardcoded mock results.

## Threat Surface Scan

No new network endpoints, auth paths, file access, or trust boundary crossings. All computation is client-side. Threat mitigations from the plan's register were verified:
- T-07-07: calcSWP capped at 50 years in calculator-utils.ts — confirmed
- T-07-08: Math.max(0, rentPaid - 0.1 * basicSalary) in calcHRA — confirmed in source
- T-07-09: NPS age guard implemented — shows error UI when retirementAge <= currentAge
- T-07-10: Inflation insight text is purely educational computed string — accepted

## Self-Check

Files verified:
- [x] src/app/calculators/hra/page.tsx — created
- [x] src/app/calculators/hra/_client.tsx — created
- [x] src/app/calculators/nps/page.tsx — created
- [x] src/app/calculators/nps/_client.tsx — created
- [x] src/app/calculators/retirement/page.tsx — created
- [x] src/app/calculators/retirement/_client.tsx — created
- [x] src/app/calculators/swp/page.tsx — created
- [x] src/app/calculators/swp/_client.tsx — created
- [x] src/app/calculators/inflation/page.tsx — created
- [x] src/app/calculators/inflation/_client.tsx — created

Commits verified:
- 98bcede — Task 1: HRA, NPS, Retirement
- a92885d — Task 2: SWP, Inflation

Build: All 10 /calculators/* routes compile as static pages without errors.

## Self-Check: PASSED
