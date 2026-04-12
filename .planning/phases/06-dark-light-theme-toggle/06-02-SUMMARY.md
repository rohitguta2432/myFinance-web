---
phase: 06-dark-light-theme-toggle
plan: "02"
subsystem: theming
tags: [theming, dark-mode, light-mode, inline-styles, refactor]
dependency_graph:
  requires: [06-01-PLAN.md]
  provides: [fully-themed-app-routes]
  affects: [assessment-wizard, dashboard, chat-widget, navbar]
tech_stack:
  added: []
  patterns: [useAppTheme-in-subcomponents, move-module-constants-inside-component, palette-aware-token-object]
key_files:
  modified:
    - src/app/(protected)/assessment/layout.tsx
    - src/app/(protected)/assessment/step-1/page.tsx
    - src/app/(protected)/assessment/step-2/page.tsx
    - src/app/(protected)/assessment/step-3/page.tsx
    - src/app/(protected)/assessment/step-4/page.tsx
    - src/app/(protected)/assessment/step-5/page.tsx
    - src/app/(protected)/assessment/step-6/page.tsx
    - src/app/(protected)/dashboard/layout.tsx
    - src/app/(protected)/dashboard/page.tsx
    - src/app/(protected)/dashboard/action-plan/page.tsx
    - src/app/(protected)/dashboard/insurance/page.tsx
    - src/app/(protected)/dashboard/tax/page.tsx
    - src/components/ai/chat-widget.tsx
    - src/components/layout/navbar.tsx
decisions:
  - "Module-level style constants (const S, const card, const T) that reference palette must be moved inside component body — they cannot access hooks at module scope"
  - "Module-level helper functions that return colors are given default parameters (e.g. formatNetWorth(amount, dangerColor, txtColor)) called from inside component with palette values"
  - "Sub-components at module level (GuidancePanel, StepsPanel, SectionCard, etc.) each call useAppTheme() independently — hook rule satisfied since they are rendered as React components"
  - "Kira chat widget T token object moved inside ChatWidget component; all 23 tokens derived from palette"
  - "Navbar glassmorphism background uses resolvedTheme ternary: light=rgba(248,250,252,0.80) dark=rgba(8,14,18,0.75) — not in palette since it is a transparency overlay not a solid color"
  - "Accent and status colors (#10B981, #34D399, #FBBF24, #F87171, #60A5FA, #2DD4BF) remain as literals — they are brand/semantic colors that do not change between themes"
metrics:
  duration: "~2 hours (split across 2 sessions)"
  completed: 2026-04-12
  tasks_completed: 2
  files_modified: 14
---

# Phase 6 Plan 02: Inline Style Theme Refactor Summary

**One-liner:** Replace 400+ hardcoded dark-only hex values across 14 app files with `useAppTheme()` palette tokens so the entire assessment + dashboard flow responds to the dark/light toggle.

## What Was Built

Two tasks completed in sequence:

**Task 1 — Assessment Wizard (steps 1-6 + layout)**
- `assessment/layout.tsx`: Added `useAppTheme`, passed palette to `StepButton` via prop (sub-component could not call hook directly due to non-component shape — resolved by prop drilling)
- `step-1` to `step-6`: Added `import { useAppTheme }`, moved module-level `const card`, `const S`, `const inputStyle` objects inside component body, replaced all hex values with palette keys
- `step-3`: Special case — `formatNetWorth()` helper at module level referenced palette after sed injection; fixed by adding default color parameters and calling from inside component

**Task 2 — Dashboard, Chat Widget, Navbar**
- `dashboard/layout.tsx`: `UpgradeModal` sub-component at module level — `useAppTheme()` placed before early return (valid hook usage)
- `dashboard/page.tsx`: Standard import + hook pattern
- `dashboard/action-plan/page.tsx`: Four sub-components each call `useAppTheme()` independently
- `dashboard/insurance/page.tsx`: `GuidancePanel`, `CoverBar`, `MetricRow`, `InsurancePage` each call `useAppTheme()`; `MetricRow.borderBottom` and `CoverBar` progress bar track use `palette.brd`
- `dashboard/tax/page.tsx`: `SectionCard`, `SectionHeader`, `TaxPage` each call `useAppTheme()`; table ternary color expressions manually fixed (sed cannot handle inline ternaries)
- `chat-widget.tsx`: Module-level `const T` object removed; moved inside `ChatWidget` after `const palette = useAppTheme()`; all 23 token values derived from palette
- `navbar.tsx`: Added `useAppTheme`; navbar glassmorphism background uses `resolvedTheme` ternary; dropdown, links, mobile menu, theme toggle icon color all use palette

## Decisions Made

- Moving module-level style constants inside component body is the canonical fix when palette access is needed — no significant performance cost since these are plain objects reconstructed on each render
- Helper functions at module level that return colors: add default parameters for color values and pass palette colors from call site
- Sub-components at module level are React components themselves, so each independently calling `useAppTheme()` is correct React hook usage
- The glassmorphism navbar background requires a `resolvedTheme` ternary rather than a palette key because it is an alpha-blended overlay value (not a solid color) that differs between themes in a way the 12-key palette does not expose

## Verification

```
grep -r "useAppTheme" src/app/(protected)/ --include="*.tsx" -l
# Returns 12 files: 7 assessment + 5 dashboard

grep "useAppTheme" src/components/ai/chat-widget.tsx
# Returns match

grep "useAppTheme" src/components/layout/navbar.tsx
# Returns match

npm run build
# Compiled successfully — 0 errors
```

Build output confirmed: all 39 routes generated successfully with TypeScript checking passing.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] formatNetWorth module-level function referenced palette after sed replacement**
- **Found during:** Task 1, step-3
- **Issue:** `sed` replaced `"#F87171"` and `"#F0F4F8"` inside `formatNetWorth(amount)` at module level, but `palette` is only defined inside `Step3Page`; TypeScript would reject the build
- **Fix:** Added default parameters `function formatNetWorth(amount: number, dangerColor = "#F87171", txtColor = "#F0F4F8")` and call site inside component passes `formatNetWorth(netWorth, palette.danger, palette.txt)`
- **Files modified:** `src/app/(protected)/assessment/step-3/page.tsx`
- **Commit:** 4a8882b

**2. [Rule 2 - Pattern] Kira chat T tokens kept in sync with palette**
- **Found during:** Task 2, chat-widget
- **Issue:** The module-level `const T` was a static dark-only token object; simply moving it inside the component without referencing palette would leave it hard-coded
- **Fix:** Moved T inside component after `useAppTheme()` and rewired all 23 token values to palette keys (`palette.s1`, `palette.brd`, `palette.mute`, etc.)
- **Files modified:** `src/components/ai/chat-widget.tsx`
- **Commit:** d3f6d10

## Commits

| Task | Commit | Files |
|------|--------|-------|
| Task 1 — assessment wizard | 4a8882b | 7 files (layout + steps 1-6) |
| Task 2 — dashboard + chat + navbar | d3f6d10 | 7 files (5 dashboard + chat-widget + navbar) |

## Known Stubs

None. All data sources are wired; no placeholder colors or text remain.

## Threat Flags

None. Theme token values are hardcoded constants in source, not user-supplied data. No new network endpoints, auth paths, or schema changes introduced.

## Self-Check: PASSED

- `src/app/(protected)/assessment/layout.tsx` — exists, contains `useAppTheme`
- `src/app/(protected)/assessment/step-1/page.tsx` — exists, contains `useAppTheme`
- `src/app/(protected)/assessment/step-2/page.tsx` — exists, contains `useAppTheme`
- `src/app/(protected)/assessment/step-3/page.tsx` — exists, contains `useAppTheme`
- `src/app/(protected)/assessment/step-4/page.tsx` — exists, contains `useAppTheme`
- `src/app/(protected)/assessment/step-5/page.tsx` — exists, contains `useAppTheme`
- `src/app/(protected)/assessment/step-6/page.tsx` — exists, contains `useAppTheme`
- `src/app/(protected)/dashboard/layout.tsx` — exists, contains `useAppTheme`
- `src/app/(protected)/dashboard/page.tsx` — exists, contains `useAppTheme`
- `src/app/(protected)/dashboard/action-plan/page.tsx` — exists, contains `useAppTheme`
- `src/app/(protected)/dashboard/insurance/page.tsx` — exists, contains `useAppTheme`
- `src/app/(protected)/dashboard/tax/page.tsx` — exists, contains `useAppTheme`
- `src/components/ai/chat-widget.tsx` — exists, contains `useAppTheme`
- `src/components/layout/navbar.tsx` — exists, contains `useAppTheme`
- Commits 4a8882b and d3f6d10 — verified present in git log
- `npm run build` — passed with zero errors
