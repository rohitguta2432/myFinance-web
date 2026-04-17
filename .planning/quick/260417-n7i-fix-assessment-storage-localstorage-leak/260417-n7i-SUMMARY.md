---
phase: 260417-n7i
plan: 01
subsystem: assessment-store / auth
tags: [security, privacy, localstorage, zustand, auth]
type: quick-fix
status: awaiting-human-verification
dependency-graph:
  requires: []
  provides:
    - per-user-scoped-assessment-storage
    - wipe-on-logout
    - mismatch-reload-on-user-switch
  affects:
    - assessment-wizard-hydration
    - logout-flow
    - inactivity-timeout-flow
    - root-layout-mount
tech-stack:
  added: []
  patterns:
    - "Per-user persist key resolved at module load (resolveAssessmentStorageKey)"
    - "Module-top legacy migration BEFORE persist hydrates"
    - "Defense-in-depth: scope key + wipe on logout + mismatch reload on login"
key-files:
  created:
    - src/lib/assessment-storage-cleanup.ts
  modified:
    - src/store/useAssessmentStore.ts
    - src/components/layout/navbar.tsx
    - src/components/auth/inactivity-guard.tsx
    - src/components/auth/AuthProvider.tsx
decisions:
  - "Use window.location.assign() over persist.setOptions+rehydrate for mismatch path — full reload re-imports the store module so the resolver binds to the new userId"
  - "Run legacy key migration at module top, not inside persist migrate hook — migrate hook runs AFTER name resolution, too late to influence which key is read"
  - "Logout removes LAST_USER_KEY so the next login is treated as a fresh first-login (no false-mismatch reload)"
  - "checkedRef in AuthProvider effect guards against React 19 Strict Mode double-invoke that would cause a second reload"
metrics:
  duration: 3 tasks (Tasks 1-3 of 4)
  completed-tasks: 3
  total-tasks: 4
  remaining: "Task 4 (checkpoint:human-verify) — awaiting manual repro"
  completed-date: 2026-04-17
---

# Quick Task 260417-n7i: Fix Assessment Storage localStorage Leak

Per-user-scoped Zustand persist key with logout wipe and login mismatch reload — closes the cross-user data-leak privacy bug on shared devices.

## What Was Built

Three layers of defense against a single shared `assessment-storage` localStorage key leaking User A's wizard data into User B's session on a shared browser:

1. **Per-user scoping** — `useAssessmentStore` now persists under `assessment-storage-{userId}`, resolved once at module load via `readUserIdFromCookie()` against the `user_profile` cookie.
2. **Legacy migration** — On first hydration after deploy, the existing `assessment-storage` key is renamed to `assessment-storage-{userId}` if a user is logged in, else deleted. Runs at module top under a `typeof window !== "undefined"` guard, BEFORE `create(persist(...))` so hydration sees the right key.
3. **Mismatch wipe + logout wipe** — `AuthProvider` compares the cookie userId against `myfinancial_last_user_id` in localStorage on mount; on mismatch it wipes all `assessment-storage*` keys and calls `window.location.assign(...)` to force a full reload. Both `handleSignOut` (navbar) and `logoutAndRedirect` (inactivity-guard) wipe localStorage AND call `resetAssessment()` BEFORE the cookie clear so a network failure still protects the next user.

## Files Changed (5 total)

| File | Change |
| --- | --- |
| `src/lib/assessment-storage-cleanup.ts` | NEW — exports `readUserIdFromCookie`, `resolveAssessmentStorageKey`, `wipeAllAssessmentStorage`, `migrateLegacyAssessmentKey`, `LAST_USER_KEY`, `ASSESSMENT_STORAGE_PREFIX`, `LEGACY_ASSESSMENT_STORAGE_KEY`. Pure module, SSR-safe (typeof window/document guards). |
| `src/store/useAssessmentStore.ts` | Added imports + module-top `migrateLegacyAssessmentKey()` call under SSR guard; lifted defaults to `INITIAL_STATE` constant; added `resetAssessment` action on `AssessmentState` interface and in store body (preserves `_hasHydrated`); changed persist `name` from literal `"assessment-storage"` to `resolveAssessmentStorageKey()`. |
| `src/components/layout/navbar.tsx` | Imported `wipeAllAssessmentStorage` + `LAST_USER_KEY`; added selector for `resetAssessment`; rewrote `handleSignOut` to wipe localStorage + reset in-memory state BEFORE the logout fetch. |
| `src/components/auth/inactivity-guard.tsx` | Same wipe + reset sequence in module-level `logoutAndRedirect` using `useAssessmentStore.getState().resetAssessment()`. |
| `src/components/auth/AuthProvider.tsx` | Added `useEffect` (guarded by `checkedRef` for React 19 Strict Mode) that compares cookie userId vs `LAST_USER_KEY`. On mismatch: wipe + record + `window.location.assign(pathname + search)`. On first-login: record. On match/anonymous: no-op. |

## Commits

| Task | Commit | Message |
| --- | --- | --- |
| 1 | `d4da9a1` | feat(260417-n7i-01): scope assessment localStorage per user |
| 2 | `f091509` | feat(260417-n7i-01): wipe assessment storage on logout flows |
| 3 | `f4af71a` | feat(260417-n7i-01): detect user-switch and reload in AuthProvider |

## Decision Rationale

### Why `window.location.assign` over `persist.setOptions({ name }) + persist.rehydrate()`

Zustand's persist `name` is bound at `create()` time. Calling `persist.setOptions({ name })` followed by `rehydrate()` *can* re-target the persist middleware, but:

- Components subscribed to the store may already be reading the in-memory state derived from the WRONG user's persisted data; a single hot rebind doesn't atomically re-render them with cleared values.
- Same-tab races: any in-flight `set()` from a component could overwrite the new key with stale values mid-rehydrate.
- The persisted snapshot held in memory between `setOptions` and `rehydrate` is User A's data; an interleaved read sees the leak.

A full page reload via `window.location.assign(pathname + search)` re-imports `useAssessmentStore.ts` from scratch. The persist `name` is re-evaluated against the NEW cookie, the in-memory store starts empty, and every subscriber mounts fresh. There is no race window. The path + search is preserved so the user lands on the same page they navigated to.

### Why legacy migration runs at module top, not inside persist `migrate` hook

The persist `migrate` hook fires AFTER the `name`-keyed slot has been read from storage. By that point, the store has already been initialized using whichever key the resolver returned (e.g. `assessment-storage-42` for User A) — it never sees the legacy `assessment-storage` data. To preserve that data we must rename the slot BEFORE persist is even called.

The module-top `migrateLegacyAssessmentKey()` call (under `typeof window !== "undefined"`) runs at module evaluation time, which precedes the `create(persist(...))` invocation in the same module. Hydration then finds the just-renamed `assessment-storage-{userId}` key.

### Why logout removes `LAST_USER_KEY`

If logout left `LAST_USER_KEY` populated, the next login of the SAME user would correctly no-op, but the next login of a DIFFERENT user would trip the mismatch path even though logout already wiped storage. Worse, the page reload triggered by the false-mismatch path would interrupt the post-login redirect (`router.push('/assessment/step-1')` or `/dashboard`). Removing `LAST_USER_KEY` on logout makes every post-logout login a "first login" (record + return), avoiding both false-mismatch reloads and the redirect collision.

### Why `resetAssessment` preserves `_hasHydrated`

Components in the assessment wizard guard their first render against the pre-hydration state by checking `_hasHydrated`. Resetting it to `false` would push consumers back into a loading state after logout, which is jarring (and on the navbar's logout, the user is mid-page). Preserving the flag keeps the UI smooth across the reset.

## Verification

- `npx tsc --noEmit` — passes with zero errors after each task
- `npm run build` — passes after Task 3, confirming SSR guards work (no `document`/`localStorage` reads during prerender)

## Deviations from Plan

**[Pre-existing - lint command unusable]** `npm run lint` is interactive in this repo: there is no ESLint config file, and `next lint` prompts for a configuration choice with no way to skip. Verification fell back to `npx tsc --noEmit` (clean) and `npm run build` for Task 3 (clean). This is pre-existing project state, NOT caused by this plan's changes — out of scope per the SCOPE BOUNDARY rule. Logged for future cleanup: migrate to `eslint` CLI per the deprecation notice.

**[Pre-existing - Node version]** The shell defaults to system Node v12.22.9 with a broken npm. Activated fnm v22.22.2 via `eval "$(fnm env)"` for all verifications — satisfies the project's Node 20+ requirement.

## Awaiting Human Verification (Task 4)

Task 4 is a `checkpoint:human-verify` gate. Per the plan, the developer must run:

```
cd /home/t0266li/Documents/myFinance-web
npm run dev
```

…and run **Repros 1-4** documented in the PLAN under Task 4:

- **Repro 1** — Original cross-user leak (User A → logout → User B sees defaults, not User A's data)
- **Repro 2** — Mismatch path (delete cookies without logout, then log in as User B → auto-reload, defaults visible)
- **Repro 3** — Legacy key migration (manually inject `assessment-storage` payload → confirm rename to `assessment-storage-{userId}` after refresh)
- **Repro 4** — Inactivity logout (smoke test that auto-logout also wipes `assessment-storage*`)

Report PASS/FAIL per repro. Manual repro results to be appended here once verification completes.

## Self-Check: PASSED

- `src/lib/assessment-storage-cleanup.ts` — FOUND
- `src/store/useAssessmentStore.ts` — FOUND (modified)
- `src/components/layout/navbar.tsx` — FOUND (modified)
- `src/components/auth/inactivity-guard.tsx` — FOUND (modified)
- `src/components/auth/AuthProvider.tsx` — FOUND (modified)
- Commit `d4da9a1` — FOUND
- Commit `f091509` — FOUND
- Commit `f4af71a` — FOUND
