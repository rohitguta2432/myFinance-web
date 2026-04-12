---
phase: 08-pdf-report-generation-financial-plan-tax-summary
plan: "01"
subsystem: pdf-generation
tags: [pdf, jspdf, html2canvas, dashboard, client-side]
dependency_graph:
  requires: []
  provides:
    - src/lib/pdf-utils.ts
    - src/components/pdf/generateFinancialPlan.ts
  affects:
    - dashboard download button (08-02)
tech_stack:
  added:
    - jspdf@4.2.1
    - jspdf-autotable@5.0.7
    - html2canvas@1.4.1
  patterns:
    - Dynamic import pattern for SSR safety (jsPDF + html2canvas inside async function)
    - jspdf-autotable v5 standalone function: autoTable(doc, {...})
    - Rs. prefix for PDF currency (not rupee symbol — jsPDF built-in font limitation)
key_files:
  created:
    - src/lib/pdf-utils.ts
    - src/components/pdf/generateFinancialPlan.ts
  modified:
    - package.json
    - package-lock.json
decisions:
  - "All jsPDF/html2canvas imports are dynamic (inside async function body) — prevents SSR window is not defined crash"
  - "jspdf-autotable v5 uses standalone autoTable(doc, {...}) function — not doc.autoTable()"
  - "Currency uses Rs. prefix in PDF output — rupee symbol U+20B9 not in Helvetica/Times/Courier font set"
  - "Asset allocation rendered as table not pie chart — jsPDF imperative API has no native chart primitives"
  - "didParseCell hook typed as any to avoid CellHookData Color type incompatibility"
metrics:
  duration_min: ~18
  completed: "2026-04-12"
  tasks_completed: 2
  files_created: 2
  files_modified: 2
---

# Phase 8 Plan 01: PDF Foundation + Financial Plan Generator Summary

**One-liner:** jsPDF + html2canvas PDF foundation with 9-section Financial Plan generator using dynamic imports and Rs. currency formatting.

## What Was Built

### Task 1: Dependencies + pdf-utils.ts
Installed jspdf@4.2.1, jspdf-autotable@5.0.7, html2canvas@1.4.1 and created `src/lib/pdf-utils.ts` with:
- **Constants:** PDF_PAGE_W (210), PDF_PAGE_H (297), PDF_MARGIN (14), PDF_CONTENT_W (182), FOOTER_RESERVE (20)
- **formatForPdf()** — Indian compact currency with "Rs." prefix (handles Cr/L/plain, NaN safety)
- **checkPageBreak()** — Adds new page when content would overflow footer zone
- **captureChartAsImage()** — Dynamic html2canvas import, white background fix, 2x scale for print quality
- **addBrandedHeader()** — Green #10B981 header bar with MyFinancial branding
- **addDisclaimerFooter()** — Iterates all pages, adds separator line + disclaimer text + page number
- **getDateString() / getFormattedDate()** — Date helpers for file names and report header

### Task 2: generateFinancialPlan.ts
Created `src/components/pdf/generateFinancialPlan.ts` with:
- **FinancialPlanData interface** — 13 fields covering all dashboard data sections
- **generateFinancialPlan(data)** — Async function with 9 PDF sections:
  1. Branded header with user name and generation date
  2. Financial Health Score table (total score + pillar breakdown)
  3. Red Flags & Alerts (conditional, severity color-coded via didParseCell hook)
  4. Financial Goals & SIP Projections (conditional)
  5. Asset Allocation table (conditional, D-05 requirement)
  6. Priority Action Plan (top 5 actions, descriptions truncated to 80 chars)
  7. Insurance Coverage Summary (term life + health insurance gaps)
  8. Wealth Projection (html2canvas chart capture if hasProjectionChart)
  9. Summary Metrics (net worth + monthly surplus)
  + Disclaimer footer on all pages

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed CellHookData type incompatibility in didParseCell**
- **Found during:** TypeScript check after Task 2 implementation
- **Issue:** The `didParseCell` hook parameter type specified `textColor: [number, number, number]` but jspdf-autotable's `CellHookData.cell.styles.textColor` is typed as `Color` (a union including `string`), making the types incompatible
- **Fix:** Typed the hook callback parameter as `any` with eslint-disable comment — preserves runtime correctness while satisfying TypeScript
- **Files modified:** src/components/pdf/generateFinancialPlan.ts

## Build Status

- TypeScript: No errors (`npx tsc --noEmit --skipLibCheck` passes)
- Next.js build: `✓ Compiled successfully` — PDF code does not cause SSR crashes
- Pre-existing build failure on `/assessment/step-3` (NEXT_PUBLIC_GOOGLE_CLIENT_ID not set in build env) is unrelated to this plan's changes

## Known Stubs

None — both files are complete implementations with no placeholder data or TODO stubs.

## Threat Flags

None — PDF generation is fully client-side. No new network endpoints, auth paths, or file access patterns introduced. The `src/components/pdf/` directory contains generator functions only, invoked client-side from a future button component (08-02).

## Self-Check: PASSED

- [x] `src/lib/pdf-utils.ts` exists and exports all required functions
- [x] `src/components/pdf/generateFinancialPlan.ts` exists with FinancialPlanData + generateFinancialPlan
- [x] No top-level jsPDF or html2canvas imports in either file
- [x] package.json contains jspdf@^4.2.1, jspdf-autotable@^5.0.7, html2canvas@^1.4.1
- [x] Commits: ccdbaed (Task 1), fa96e98 (Task 2)
