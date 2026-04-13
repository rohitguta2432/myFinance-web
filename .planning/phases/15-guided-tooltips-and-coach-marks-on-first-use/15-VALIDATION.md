---
phase: 15
slug: guided-tooltips-and-coach-marks-on-first-use
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-13
---

# Phase 15 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright (`@playwright/test` ^1.59.1, already in devDependencies) |
| **Config file** | `playwright.config.ts` (exists, testDir: `./tests/e2e`) |
| **Quick run command** | `npx playwright test --grep "tour"` |
| **Full suite command** | `npx playwright test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run quick command
- **After every plan wave:** Run full suite
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 15-01-T1 | 15-01 | 1 | TOUR-06, TOUR-07, TOUR-08 | T-15-03 | localStorage try/catch, no dynamic content | grep | `grep -c "export function useTour" src/hooks/onboarding/useTour.ts && grep -c "export interface TourStep" src/hooks/onboarding/useTour.ts && grep -c "export function getTourUserId" src/hooks/onboarding/useTour.ts` | After W1 | pending |
| 15-01-T2 | 15-01 | 1 | TOUR-01, TOUR-02, TOUR-03, TOUR-04, TOUR-09 | T-15-01, T-15-02 | Static strings only, portal z-index 10002 | grep + tsc | `grep -c "export function CoachMarkTooltip" src/components/onboarding/coach-mark-tooltip.tsx && grep -c "export function TourProvider" src/components/onboarding/tour-provider.tsx && grep -c "ASSESSMENT_TOUR_STEPS" src/components/onboarding/tour-steps.ts && npx tsc --noEmit --pretty 2>&1 \| tail -5` | After W1 | pending |
| 15-02-T1 | 15-02 | 2 | TOUR-01, TOUR-05 | T-15-01 | Hardcoded step arrays only | grep + tsc | `grep -c "TourProvider" src/app/\(protected\)/assessment/layout.tsx && grep -c "tour-step-profile" src/app/\(protected\)/assessment/layout.tsx && grep -c "tour-step-nav" src/app/\(protected\)/assessment/layout.tsx && npx tsc --noEmit --pretty 2>&1 \| tail -5` | After W2 | pending |
| 15-02-T2 | 15-02 | 2 | TOUR-01, TOUR-05 | T-15-01, T-15-02 | Hardcoded step arrays, gated on !isLoading | grep + tsc | `grep -c "TourProvider" src/app/\(protected\)/dashboard/page.tsx && grep -c "tour-dash-score" src/app/\(protected\)/dashboard/page.tsx && grep -c "tour-dash-tabs" src/app/\(protected\)/dashboard/page.tsx && npx tsc --noEmit --pretty 2>&1 \| tail -5` | After W2 | pending |
| 15-02-T3 | 15-02 | 2 | TOUR-01, TOUR-02, TOUR-03, TOUR-04 | — | N/A | e2e | `npx playwright test --grep "tour" --list` | After W2 | pending |

*Status: pending -- all tasks awaiting execution*

---

## Wave 0 Requirements

- [x] Test framework already configured (`playwright.config.ts` exists, `@playwright/test` in devDependencies)
- [x] Test file `tests/e2e/tour.spec.ts` created in 15-02-PLAN.md Task 3 (covers TOUR-01 through TOUR-04)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual spotlight overlay renders correctly | TOUR-05 | Visual appearance cannot be fully captured by e2e assertions | Open assessment step-1 as new user, verify spotlight appears over target element with dark overlay |
| Theme adaptation | TOUR-09 | Theme toggle interaction is visual | Toggle dark/light theme while tour is active, verify tooltip colors match palette |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify commands
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (tour.spec.ts created in 15-02 Task 3)
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** ready for execution
