---
phase: 06-dark-light-theme-toggle
plan: "01"
subsystem: theme
tags: [theme, next-themes, css-variables, navbar, ux]
dependency_graph:
  requires: []
  provides:
    - ThemeProvider (client wrapper for next-themes)
    - useAppTheme hook (typed palette for inline-style components)
    - html.light CSS variable block (globals.css)
    - Sun/Moon toggle in Navbar
  affects:
    - src/app/layout.tsx
    - src/app/globals.css
    - src/components/layout/navbar.tsx
tech_stack:
  added:
    - next-themes 0.4.x
  patterns:
    - "SSR-safe theme toggle via next-themes (class strategy)"
    - "CSS cascade: @theme tokens overridden by html.light selector block"
    - "Hydration-safe palette hook: init to DARK_PALETTE, update via useEffect"
key_files:
  created:
    - src/components/providers/ThemeProvider.tsx
    - src/hooks/useAppTheme.ts
  modified:
    - src/app/layout.tsx
    - src/app/globals.css
    - src/components/layout/navbar.tsx
decisions:
  - "Use next-themes class strategy (not data-attribute) for forward Tailwind dark: compatibility"
  - "storageKey=myfinancial_theme to avoid collision with any other localStorage keys"
  - "Initialize useAppTheme state to DARK_PALETTE (not undefined) to match SSR render"
  - "ThemeToggle defined inline in Navbar (not a separate file) — too small to warrant extraction"
metrics:
  duration: "~15 minutes"
  completed: "2026-04-12"
  tasks_completed: 3
  tasks_total: 4
  files_created: 2
  files_modified: 3
---

# Phase 6 Plan 01: Theme Infrastructure Summary

**One-liner:** SSR-safe dark/light toggle via next-themes with CSS variable cascade and typed useAppTheme palette hook.

## What Was Built

Theme infrastructure fully wired for the myFinancial landing site and blog:

1. **next-themes installed** — SSR-safe theme management with FOUC prevention
2. **ThemeProvider** (`src/components/providers/ThemeProvider.tsx`) — thin "use client" wrapper enabling App Router server component compatibility
3. **useAppTheme hook** (`src/hooks/useAppTheme.ts`) — typed `AppPalette` interface with `DARK_PALETTE` and `LIGHT_PALETTE` constants; initializes to dark to prevent hydration mismatch
4. **Root layout updated** (`src/app/layout.tsx`) — `suppressHydrationWarning` on `<html>`, ThemeProvider wrapping AuthProvider with `attribute="class"`, `defaultTheme="system"`, `storageKey="myfinancial_theme"`
5. **globals.css light block** (`src/app/globals.css`) — `html.light { ... }` selector overrides all 30+ CSS custom properties; also overrides `html.light body` and `html.light .hero-grid`
6. **Navbar toggle** (`src/components/layout/navbar.tsx`) — Sun/Moon button in desktop right cluster and mobile dropdown; border color adapts to theme

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | b7f4a47 | Install next-themes, ThemeProvider, useAppTheme |
| 2 | b77225d | Wire ThemeProvider in layout + html.light CSS block |
| 3 | 133bf95 | Sun/Moon ThemeToggle in navbar desktop + mobile |

## Verification Checklist

- [x] npm ls next-themes confirms installation
- [x] src/components/providers/ThemeProvider.tsx exists with "use client" and NextThemesProvider wrapper
- [x] src/hooks/useAppTheme.ts exists with AppPalette, DARK_PALETTE, LIGHT_PALETTE, useAppTheme
- [x] src/app/layout.tsx has suppressHydrationWarning and ThemeProvider wrapping
- [x] src/app/globals.css has html.light block
- [x] src/components/layout/navbar.tsx has Sun/Moon toggle wired to setTheme
- [x] npm run build succeeds (verified after each task)
- [ ] Manual verify: toggle works, landing page themes, localStorage persists, no console errors (awaiting human checkpoint)

## Deviations from Plan

None — plan executed exactly as written. All file modifications match the plan's action specifications.

## Known Stubs

None. The ThemeProvider and useAppTheme hook are fully wired. The toggle button is functional.
Note: Assessment wizard and dashboard pages still use hardcoded hex in inline styles — this is intentional scope for Plan 02 (inline-style refactor).

## Self-Check: PASSED

Files exist:
- src/components/providers/ThemeProvider.tsx: FOUND
- src/hooks/useAppTheme.ts: FOUND
- src/app/layout.tsx modified with suppressHydrationWarning and ThemeProvider: FOUND
- src/app/globals.css modified with html.light block: FOUND
- src/components/layout/navbar.tsx modified with Sun/Moon toggle: FOUND

Commits:
- b7f4a47: FOUND
- b77225d: FOUND
- 133bf95: FOUND
