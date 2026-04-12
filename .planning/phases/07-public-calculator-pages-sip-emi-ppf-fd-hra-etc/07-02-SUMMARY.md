---
phase: 07-public-calculator-pages-sip-emi-ppf-fd-hra-etc
plan: "02"
subsystem: calculators
tags: [calculator, sip, lumpsum, emi, fd, ppf, recharts, seo, schema-org]
dependency_graph:
  requires: [07-01-SUMMARY.md]
  provides: [/calculators/sip, /calculators/lumpsum, /calculators/emi, /calculators/fd, /calculators/ppf]
  affects: [src/app/calculators/]
tech_stack:
  added: []
  patterns: [server-shell + _client.tsx split, FAQPage JSON-LD, recharts AreaChart/BarChart, segmented button toggle]
key_files:
  created:
    - src/app/calculators/sip/page.tsx
    - src/app/calculators/sip/_client.tsx
    - src/app/calculators/lumpsum/page.tsx
    - src/app/calculators/lumpsum/_client.tsx
    - src/app/calculators/emi/page.tsx
    - src/app/calculators/emi/_client.tsx
    - src/app/calculators/fd/page.tsx
    - src/app/calculators/fd/_client.tsx
    - src/app/calculators/ppf/page.tsx
    - src/app/calculators/ppf/_client.tsx
  modified: []
decisions:
  - "Each page uses server shell (page.tsx) + interactive client (_client.tsx) split for Next.js 15 metadata + React hooks coexistence"
  - "Recharts AreaChart for compound growth visualization (SIP, Lumpsum, FD); BarChart for discrete breakdowns (EMI principal/interest, PPF year-by-year)"
  - "FD compounding toggle uses segmented button group with freq state (4/2/1) feeding calcFD directly"
  - "PPF duration fixed at 15 years with informational panel instead of slider — enforces legal lock-in"
  - "Zero-rate guard on EMI and zero-deposit guard on PPF applied per threat model (T-07-04, T-07-05)"
metrics:
  duration_minutes: 4
  completed_date: "2026-04-11"
  tasks_completed: 2
  files_created: 10
  files_modified: 0
---

# Phase 07 Plan 02: 5 Core Calculator Pages Summary

**One-liner:** Five SEO-ready interactive calculator pages (SIP, Lumpsum, EMI, FD, PPF) with Recharts visualization, FAQPage JSON-LD schema, and Indian number formatting.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | SIP + Lumpsum calculator pages | 8d2ba43 | sip/page.tsx, sip/_client.tsx, lumpsum/page.tsx, lumpsum/_client.tsx |
| 2 | EMI, FD, and PPF calculator pages | 02bdbf3 | emi/page.tsx, emi/_client.tsx, fd/page.tsx, fd/_client.tsx, ppf/page.tsx, ppf/_client.tsx |

## What Was Built

### SIP Calculator (`/calculators/sip`)
- Sliders: monthly amount (₹500–₹1L), annual return (1–30%), duration (1–30 yrs)
- Results: Maturity value (accent), total invested, estimated returns
- Chart: Stacked AreaChart showing invested vs returns growth year-by-year
- FAQPage JSON-LD with 3 questions about SIP basics
- Related links: Lumpsum, PPF, NPS calculators

### Lumpsum Calculator (`/calculators/lumpsum`)
- Sliders: principal (₹10K–₹1Cr), annual return (1–30%), duration (1–30 yrs)
- Results: Maturity value (accent), total invested, estimated gains
- Chart: Stacked AreaChart showing principal vs returns over time
- FAQPage JSON-LD with 3 questions about lumpsum vs SIP
- Related links: SIP, FD, Retirement calculators

### EMI Calculator (`/calculators/emi`)
- Sliders: loan amount (₹10K–₹1Cr), interest rate (1–36%), tenure (6–360 months)
- Results: Monthly EMI (accent, formatIndianCurrency), total payment, total interest with % sublabel
- Chart: Stacked BarChart showing principal vs interest breakdown
- Zero-rate guard: calcEMI returns principal/tenure if rate <= 0 (T-07-04)
- FAQPage JSON-LD with 3 questions about EMI, flat vs reducing rate
- Related links: SIP, FD, Blog

### FD Calculator (`/calculators/fd`)
- Sliders: principal (₹1K–₹1Cr), interest rate (1–15%), duration (1–10 yrs)
- Compounding toggle: Quarterly / Half-Yearly / Annually segmented button group
- Results: Maturity amount (accent), interest earned
- Chart: Stacked AreaChart showing principal vs interest growth; updates on toggle
- FAQPage JSON-LD with 3 questions about FD, compounding formula, tax treatment
- Related links: PPF, SIP, Retirement calculators

### PPF Calculator (`/calculators/ppf`)
- Slider: yearly deposit (₹500–₹1.5L — max enforced per law)
- Duration: fixed 15-year informational panel (no slider; legal lock-in)
- Results: Maturity value (accent), total invested, interest earned
- Chart: Stacked BarChart (year-by-year; green for interest over grey invested base)
- Zero-deposit guard applied via calcPPF's internal max(0, yearlyDeposit)
- Disclaimer: "Interest rate 7.1% p.a. (subject to change by Govt. of India)"
- FAQPage JSON-LD with 3 questions about PPF, early withdrawal, EEE tax status
- Related links: SIP, NPS, FD calculators

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Linter type-coercion on Recharts Tooltip formatter**
- **Found during:** Post-task linter auto-fix
- **Issue:** Recharts Tooltip `formatter` callback typed value as `ValueType` (not `number`) — TypeScript strict mode rejected `formatLakhsCrores(value)` directly
- **Fix:** Changed `formatter={(value: number) => ...}` to `formatter={(value) => formatLakhsCrores(Number(value))}` in sip, lumpsum, emi, and fd clients
- **Files modified:** sip/_client.tsx, lumpsum/_client.tsx, emi/_client.tsx, fd/_client.tsx
- **Commits:** 14cc30f, db85652

## Threat Mitigations Applied

| Threat ID | Disposition | Implementation |
|-----------|-------------|----------------|
| T-07-04 | mitigated | calcEMI uses `Math.max(0.01, interestRate)` guard in EMI client before calling calcEMI; calcEMI itself returns `principal / tenureMonths` if r === 0 |
| T-07-05 | mitigated | calcPPF internally applies `Math.max(0, yearlyDeposit)` per prior implementation; slider min=500 also prevents 0 input |
| T-07-06 | accepted | FAQ content is public educational information |

## Known Stubs

None — all 5 calculators are fully wired with real formula computations, interactive sliders, and Recharts charts. No placeholder data.

## Threat Flags

None — all new routes are static client-side pages. No new network endpoints, auth paths, or DynamoDB schema changes introduced.

## Self-Check: PASSED

- src/app/calculators/sip/page.tsx: FOUND
- src/app/calculators/sip/_client.tsx: FOUND
- src/app/calculators/lumpsum/page.tsx: FOUND
- src/app/calculators/lumpsum/_client.tsx: FOUND
- src/app/calculators/emi/page.tsx: FOUND
- src/app/calculators/emi/_client.tsx: FOUND
- src/app/calculators/fd/page.tsx: FOUND
- src/app/calculators/fd/_client.tsx: FOUND
- src/app/calculators/ppf/page.tsx: FOUND
- src/app/calculators/ppf/_client.tsx: FOUND
- Commit 8d2ba43: FOUND (SIP + Lumpsum)
- Commit 02bdbf3: FOUND (EMI + FD + PPF)
- Build: PASSED (0 TS errors, 0 module-not-found errors)
