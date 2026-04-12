---
phase: 12-gamification-streaks-badges-milestones
plan: "01"
subsystem: gamification
tags: [hooks, localStorage, streaks, badges, react-hot-toast, zustand]
dependency_graph:
  requires: []
  provides: [useStreak, useBadges, BADGE_DEFINITIONS]
  affects: [src/hooks/gamification/]
tech_stack:
  added: []
  patterns: [custom-hook, localStorage-persistence, zustand-selectors, useRef-strictmode-guard]
key_files:
  created:
    - src/hooks/gamification/useStreak.ts
    - src/hooks/gamification/useBadges.ts
  modified: []
decisions:
  - "Used useRef to guard against double-toast in React StrictMode (hasCheckedRef)"
  - "debt-free badge always fires true when liabilities is empty (default state) — UI layer in Plan 02 should only show badge after assessment is started"
  - "tax-smart badge tied to isComplete since tax is the final step"
metrics:
  duration: ~8 minutes
  completed: 2026-04-12
  tasks_completed: 2
  tasks_total: 2
  files_created: 2
  files_modified: 0
---

# Phase 12 Plan 01: Gamification Hooks (useStreak + useBadges) Summary

Login streak tracking and badge engine hooks with localStorage persistence and toast notifications for all milestone events.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Create useStreak hook with localStorage persistence and milestone toasts | 3590bd7 | src/hooks/gamification/useStreak.ts |
| 2 | Create useBadges hook with 8 badge definitions and assessment store evaluation | 5d63dd4 | src/hooks/gamification/useBadges.ts |

## What Was Built

### useStreak (`src/hooks/gamification/useStreak.ts`)

- Reads/writes `myfinancial_streak` localStorage key (`{ count, lastVisit }` schema)
- On mount: compares today vs stored `lastVisit` using `daysBetween()` helper
  - Same day: no change
  - 1-2 day gap: increment (48h grace period)
  - 3+ day gap: reset to 1
- Fires `toast.success` with flame emoji at 7, 30, and 100-day milestones (dedup ID: `streak-milestone`)
- Returns `{ count, lastVisit, isNewMilestone }`

### useBadges (`src/hooks/gamification/useBadges.ts`)

- Exports `BADGE_DEFINITIONS` constant — 8 badge objects with `id`, `name`, `description`, `howToEarn`, `icon` (Lucide names)
- Reads assessment store selectors: `currentStep`, `isComplete`, `goals`, `assets`, `liabilities`, `insurance`
- Calls `useStreak()` for `streak-master` criterion (>= 30 days)
- Compares newly earned badges against `myfinancial_badges` localStorage array
- Fires `toast.success` with party emoji for each newly earned badge (dedup ID: `badge-${id}`)
- Uses `useRef` guard to prevent double-toast in React StrictMode
- Returns `{ earned, totalEarned, totalBadges: 8, newlyEarned, definitions }`

### Badge Criteria

| Badge ID | Criterion |
|----------|-----------|
| `first-steps` | `currentStep >= 2` |
| `money-map` | `isComplete === true` |
| `goal-setter` | `goals.length > 0` |
| `diversified` | distinct asset categories >= 3 |
| `debt-free` | `liabilities.length === 0` |
| `protected` | both personalLife and personalHealth non-empty |
| `tax-smart` | `isComplete === true` |
| `streak-master` | `streakCount >= 30` |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — both hooks are fully functional. Badge UI rendering is deferred to Plan 02 as designed.

## Threat Flags

None — localStorage gamification data carries no security impact (accepted per T-12-01 and T-12-02 in the plan's threat model).

## Self-Check: PASSED

- [x] `src/hooks/gamification/useStreak.ts` exists
- [x] `src/hooks/gamification/useBadges.ts` exists
- [x] Commit 3590bd7 — useStreak hook
- [x] Commit 5d63dd4 — useBadges hook
- [x] Both files have `"use client"` directive
- [x] Both files import `react-hot-toast`
- [x] TypeScript check: no errors in gamification hooks
