---
phase: 07-public-calculator-pages-sip-emi-ppf-fd-hra-etc
plan: "01"
subsystem: calculators
tags: [calculators, shared-infrastructure, utilities, components, navbar]
dependency_graph:
  requires: []
  provides: [calculator-utils, calculator-layout, slider-input, result-card, calculators-index]
  affects: [navbar, plans-02-03]
tech_stack:
  added: []
  patterns: [indian-number-formatting, financial-formulas, responsive-grid, useAppTheme]
key_files:
  created:
    - src/lib/calculator-utils.ts
    - src/components/calculators/calculator-layout.tsx
    - src/components/calculators/slider-input.tsx
    - src/components/calculators/result-card.tsx
    - src/app/calculators/page.tsx
  modified:
    - src/components/layout/navbar.tsx
decisions:
  - "calcPPF years capped to max 40 (T-07-03 DoS mitigation per threat model)"
  - "Server component /calculators/page.tsx uses hardcoded dark palette hex values; useAppTheme only in client components"
  - "SliderInput uses inline style for dynamic gradient fill (pct) since CSS custom props cannot be set inline in SSR-friendly way"
  - "CALCULATOR_META is a plain JS object exported from pure TS file — usable by both server and client"
metrics:
  duration: "~20 minutes"
  tasks_completed: 3
  tasks_total: 3
  files_created: 5
  files_modified: 1
  completed_date: "2026-04-12"
---

# Phase 7 Plan 01: Shared Calculator Infrastructure Summary

**One-liner:** Indian-currency-aware financial formula library + CalculatorLayout/SliderInput/ResultCard shared components + 10-calculator index page with navbar link.

## What Was Built

### Task 1 — calculator-utils.ts + navbar update (commit a8fe91a)

Created `src/lib/calculator-utils.ts` as a pure TypeScript module (no "use client") exporting:

- `formatIndianCurrency(n)` — Indian grouping (₹12,34,567)
- `formatLakhsCrores(n)` — smart Lakhs/Cr label based on magnitude
- `calcSIP` — SIP future value with monthly compounding
- `calcLumpsum` — lumpsum future value
- `calcEMI` — loan EMI using standard formula
- `calcFD` — fixed deposit with configurable compounding frequency
- `calcPPF` — PPF with year-by-year 7.1% compounding, capped at 40 years (T-07-03)
- `calcHRA` — minimum-of-three HRA exemption limits (metro/non-metro)
- `calcNPS` — corpus via SIP at 10% + 40% annuity at 6%
- `calcRetirement` — inflation-adjusted future expenses / 4% SWR
- `calcSWP` — month-by-month corpus drain simulation, capped at 600 months
- `calcInflation` — compound inflation future cost
- `CALCULATOR_META` — record of 10 calculator configs (title, description, href, icon)

Updated `src/components/layout/navbar.tsx`: added `{ label: "Calculators", href: "/calculators" }` after Blog in `navLinks`. Mobile menu iterates the same array — no separate mobile change needed.

### Task 2 — CalculatorLayout component (commit eaf9658)

Created `src/components/calculators/calculator-layout.tsx` as a "use client" component:

- Props: `title`, `description`, `inputs`, `results`, `relatedLinks?`
- Responsive via `.calc-grid` CSS class with `@media (min-width: 768px)` style tag
- Desktop: two-column 1fr/1fr grid with 32px gap
- Mobile: stacked single column
- Left/right panels: `palette.s1` background, `palette.brd` border, 16px radius, 28px padding
- CTA "Get Your Full Financial Diagnosis →" links to `/assessment/step-1` using `.btn-teal` class
- Optional `relatedLinks` chips rendered as flex row below CTA

### Task 3 — SliderInput + ResultCard + /calculators index (commit 2cd07ac)

**SliderInput** (`src/components/calculators/slider-input.tsx`):
- Teal-filled range slider with custom webkit/moz thumb styles
- Dynamic gradient fill via inline style (pct computed from value/min/max)
- Label row: label left, formatted value right in `palette.accent` color
- Number input: right-aligned, transparent background, clamps to [min, max] on blur
- `formatDisplay` prop for custom value display (e.g., formatLakhsCrores)

**ResultCard** (`src/components/calculators/result-card.tsx`):
- `palette.s2` background with border and 12px radius
- Label in small muted uppercase text (13px)
- Value in 1.75rem font-display 800 weight; accent prop switches color to `palette.accent`
- Optional sublabel below value

**Calculators index page** (`src/app/calculators/page.tsx`):
- React Server Component with Next.js metadata export (title, description, OG)
- Hero with `.section-tag` "Free & Instant" overline, h1, subtitle
- Grid of 10 cards via `Object.entries(CALCULATOR_META)` — no hardcoded JSX
- Responsive: 2 col mobile → 3 col tablet → 4 col desktop
- Each card: emoji icon, title, description, "Calculate →" teal label
- `.calc-card` hover: teal border glow, translateY(-2px)
- CTA at bottom linking to `/assessment/step-1`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Security/Correctness] Applied T-07-03 DoS mitigation in calcPPF**
- **Found during:** Task 1
- **Issue:** Threat model assigned `mitigate` disposition to T-07-03 (infinite loop in calcPPF)
- **Fix:** Added `Math.min(Math.max(0, years), 40)` cap at top of calcPPF, plus `Math.max(0, yearlyDeposit)` guard
- **Files modified:** src/lib/calculator-utils.ts
- **Commit:** a8fe91a

**2. [Rule 2 - Correctness] Added input guards to all formula functions**
- **Found during:** Task 1 code review
- **Issue:** calcSWP and calcInflation needed Math.max(0, ...) guards per threat model note "validate all inputs with Math.max(0, value)"
- **Fix:** Added Math.max(0, ...) on corpus/withdrawal/cost/rate/years in calcSWP and calcInflation
- **Files modified:** src/lib/calculator-utils.ts
- **Commit:** a8fe91a

## Known Stubs

None — all 10 CALCULATOR_META entries link to `/calculators/[slug]` pages that will be built by Plans 02 and 03. The index page itself is complete and functional.

## Threat Flags

No new threat surface beyond what was analyzed in plan's threat model. All calculator inputs are client-side; /calculators index page is public and stateless.

## Self-Check: PASSED

Files verified:
- FOUND: src/lib/calculator-utils.ts
- FOUND: src/components/calculators/calculator-layout.tsx
- FOUND: src/components/calculators/slider-input.tsx
- FOUND: src/components/calculators/result-card.tsx
- FOUND: src/app/calculators/page.tsx

Commits verified:
- a8fe91a: feat(07-01): add calculator-utils.ts with 10 formulas + navbar Calculators link
- eaf9658: feat(07-01): add CalculatorLayout responsive two-column component
- 2cd07ac: feat(07-01): add SliderInput, ResultCard, and /calculators index page
