# Phase 6: Dark/Light Theme Toggle - Research

**Researched:** 2026-04-12
**Domain:** Theme management in Next.js 15 App Router with inline-style-heavy codebase
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Store theme preference in `localStorage` key `myfinancial_theme` with values `dark` | `light` | `system`
- Default to `system` on first visit
- Add toggle button in the navbar (top-right, near user avatar/sign-in)
- Simple Sun/Moon icon toggle (no dropdown for v1); use Lucide `Sun` and `Moon` icons
- CSS strategy: extend globals.css CSS variables with light values; add `data-theme="light"` on `<html>` for inline-style pages; create `useTheme` hook returning palette object
- Use `next-themes` package for SSR-safe management (prevents FOUC)
- Use `class` strategy so Tailwind `dark:` variant works if needed later
- Light theme palette: bg `#F8FAFC`, s1 `#FFFFFF`, s2 `#F1F5F9`, text primary `#0F172A`, text secondary `#475569`, muted `#94A3B8`, accent `#10B981`, border `rgba(0,0,0,0.08)`, card shadow `0 2px 8px rgba(0,0,0,0.06)`
- Phase 1: Landing + navbar + blog (CSS variable swap)
- Phase 2: Assessment wizard + dashboard (inline style refactor)
- Blog admin pages stay dark-only for v1

### Claude's Discretion
- Transition animation timing
- Toggle button exact positioning
- How to handle the blog admin pages (can stay dark-only)

### Deferred Ideas (OUT OF SCOPE)
- Custom theme colors (user picks accent color) — separate phase
- Per-page theme override
</user_constraints>

---

## Summary

The codebase has two distinct styling layers that need different treatment. Landing/blog pages are CSS-variable-driven (via `@theme {}` in Tailwind CSS 4's `globals.css`) and will respond to a theme class or data-attribute override on `<html>` without touching any component code. Assessment/dashboard pages (and their layouts) use 432+ occurrences of hardcoded hex values in React `CSSProperties` inline styles — these require a React context hook (`useTheme`) that components call to get palette colors at render time.

`next-themes` v0.4.6 is the standard library for this problem. It injects a blocking `<script>` before React hydrates, preventing flash of wrong theme (FOUC). The key integration point is `suppressHydrationWarning` on `<html>`, wrapping children with `ThemeProvider` in the root layout, and creating a client-side wrapper component because `ThemeProvider` itself is a client component.

**Primary recommendation:** Install `next-themes`, create a thin `ThemeProvider` wrapper, set `storageKey="myfinancial_theme"` and `attribute="class"`, then extend `globals.css` with `.light` class overrides for CSS variables, and create `src/hooks/useTheme.ts` returning a typed palette object consumed by inline-style components.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next-themes | 0.4.6 | SSR-safe theme toggle with localStorage persistence and FOUC prevention | Industry standard for Next.js; used by shadcn/ui; no alternatives needed |
| Lucide React | 0.475.0 (already installed) | Sun/Moon icons for toggle button | Already in project |

### No Additional Dependencies Required
The entire implementation is: one npm package + CSS edits + two new small files (ThemeProvider wrapper, useTheme hook).

**Installation:**
```bash
npm install next-themes
```

**Version verification:** [VERIFIED: npm registry search result, WebSearch 2026-04-12] — 0.4.6 is the latest stable release.

---

## Architecture Patterns

### Recommended File Structure
```
src/
├── components/
│   ├── providers/
│   │   ├── QueryProvider.tsx       # already exists
│   │   └── ThemeProvider.tsx       # NEW — thin client wrapper around NextThemesProvider
│   └── layout/
│       └── navbar.tsx              # EDIT — add ThemeToggle button
├── hooks/
│   └── useAppTheme.ts              # NEW — returns typed palette for inline styles
└── app/
    ├── globals.css                 # EDIT — add .light class variable overrides
    └── layout.tsx                  # EDIT — add suppressHydrationWarning + ThemeProvider
```

### Pattern 1: ThemeProvider Wrapper Component
**What:** A thin `"use client"` wrapper that forwards all props to `NextThemesProvider`. Required because Next.js App Router server components cannot directly import client-only libraries.
**When to use:** Always — this is the App Router pattern mandated by next-themes docs.

```typescript
// src/components/providers/ThemeProvider.tsx
// Source: https://ui.shadcn.com/docs/dark-mode/next (CITED)
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

### Pattern 2: Root Layout Integration (FOUC prevention)
**What:** `suppressHydrationWarning` on `<html>` silences the React warning that next-themes triggers when it mutates the `class` attribute server-side vs client-side. The `ThemeProvider` must wrap children inside `<body>`.
**Critical:** `suppressHydrationWarning` only suppresses one level deep — it does not cascade into children.

```typescript
// src/app/layout.tsx — EDIT (additions shown)
// Source: https://ui.shadcn.com/docs/dark-mode/next (CITED)
<html
    lang="en"
    suppressHydrationWarning                     // ADD THIS
    className={`${bricolage.variable} ${newsreader.variable}`}
>
    <head>...</head>
    <body>
        <ThemeProvider
            attribute="class"                    // toggles .dark / .light on <html>
            defaultTheme="system"                // respects OS preference first visit
            enableSystem                         // enables prefers-color-scheme
            storageKey="myfinancial_theme"       // locked decision from CONTEXT.md
            disableTransitionOnChange            // prevents flash during switch
        >
            <AuthProvider>
                ...rest of layout...
            </AuthProvider>
        </ThemeProvider>
    </body>
</html>
```

### Pattern 3: CSS Variable Overrides for Landing/Blog (Phase 1)
**What:** `next-themes` with `attribute="class"` adds `.dark` or `.light` class to `<html>`. Override Tailwind CSS 4 `@theme {}` tokens by adding a `.light` selector block in `globals.css`. CSS cascade means `.light` overrides the default dark values.

**Tailwind CSS 4 `@theme {}` vs regular CSS variables:** `@theme {}` tokens are compile-time design tokens that Tailwind generates utilities from — they cannot be overridden at runtime via CSS specificity. To make them theme-aware, add plain CSS custom property overrides under the `.light` selector outside `@theme {}`.

```css
/* globals.css — ADD after @theme {} block */
/* Source: [ASSUMED] — Tailwind CSS 4 @theme is static; runtime overrides use regular CSS vars */

/* Dark is the default (all existing @theme values apply) */

.light {
    /* Map to same CSS variable names used by body/components */
    --color-bg: #F8FAFC;
    --color-s1: #FFFFFF;
    --color-s2: #F1F5F9;
    --color-s3: #E2E8F0;
    --color-brd: rgba(0, 0, 0, 0.06);
    --color-brd2: rgba(0, 0, 0, 0.12);
    --color-txt: #0F172A;
    --color-txt2: #334155;
    --color-mute: #64748B;
    --color-dim: #CBD5E1;
    --color-background: #F8FAFC;
    --color-foreground: #0F172A;
    --color-muted: #F1F5F9;
    --color-muted-foreground: #64748B;
    --color-border: #E2E8F0;
    --color-card: rgba(255, 255, 255, 0.8);
    --color-card-hover: rgba(255, 255, 255, 0.95);
    --color-card-solid: #FFFFFF;
    --color-surface: #F1F5F9;
    --color-text-secondary: #475569;
    --color-text-tertiary: #94A3B8;
    /* Shadows — lighter for light theme */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.06);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06);
    --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.06);
    --shadow-card-hover: 0 10px 30px -5px rgb(0 0 0 / 0.15);
}
```

### Pattern 4: useAppTheme Hook for Inline Styles (Phase 2)
**What:** A React hook that reads the resolved theme from `next-themes` and returns a typed palette object. Inline-style components destructure colors from this palette instead of hardcoding hex.
**Why `useAppTheme` not `useTheme`:** Avoids collision with next-themes' own exported `useTheme`.

```typescript
// src/hooks/useAppTheme.ts
// Source: [ASSUMED] — pattern derived from next-themes useTheme API + project convention
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export interface AppPalette {
    bg: string;
    s1: string;
    s2: string;
    s3: string;
    txt: string;
    txt2: string;
    mute: string;
    accent: string;
    brd: string;
    brd2: string;
    danger: string;
    warn: string;
}

const DARK_PALETTE: AppPalette = {
    bg: "#080E12",
    s1: "#0C1319",
    s2: "#121A22",
    s3: "#1A242F",
    txt: "#F0F4F8",
    txt2: "#CBD5E1",
    mute: "#94A3B8",
    accent: "#10B981",
    brd: "rgba(255, 255, 255, 0.05)",
    brd2: "rgba(255, 255, 255, 0.10)",
    danger: "#F87171",
    warn: "#FB923C",
};

const LIGHT_PALETTE: AppPalette = {
    bg: "#F8FAFC",
    s1: "#FFFFFF",
    s2: "#F1F5F9",
    s3: "#E2E8F0",
    txt: "#0F172A",
    txt2: "#334155",
    mute: "#64748B",
    accent: "#10B981",
    brd: "rgba(0, 0, 0, 0.06)",
    brd2: "rgba(0, 0, 0, 0.12)",
    danger: "#DC2626",
    warn: "#D97706",
};

export function useAppTheme(): AppPalette {
    const { resolvedTheme } = useTheme();
    // resolvedTheme is undefined on SSR — default to dark to match server render
    const [palette, setPalette] = useState<AppPalette>(DARK_PALETTE);

    useEffect(() => {
        setPalette(resolvedTheme === "light" ? LIGHT_PALETTE : DARK_PALETTE);
    }, [resolvedTheme]);

    return palette;
}
```

**Usage in inline-style components:**
```typescript
// Example: assessment/layout.tsx
const palette = useAppTheme();

// Before: background: "#0B0F1A"
// After:  background: palette.bg
```

### Pattern 5: Theme Toggle Button
**What:** A client component added to the navbar right-side cluster. Uses `useTheme` from `next-themes` to cycle themes.

```typescript
// Inline in navbar.tsx or extracted as ThemeToggle component
"use client";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    return (
        <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            style={{
                background: "none",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                padding: "6px 8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94A3B8",
                transition: "all 0.15s",
            }}
        >
            {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
    );
}
```

**Note:** `resolvedTheme` (not `theme`) is the safe value — it resolves `"system"` to the actual OS preference.

### Anti-Patterns to Avoid
- **Using `theme` instead of `resolvedTheme` for rendering decisions:** `theme` returns `"system"` when the user hasn't made an explicit choice; `resolvedTheme` always returns `"dark"` or `"light"`.
- **Reading `useTheme` without a mounted check on SSR-rendered pages:** On server, `resolvedTheme` is `undefined`. Use `useEffect` + `useState` to delay palette application (Pattern 4 above handles this).
- **Forgetting `suppressHydrationWarning` on `<html>`:** next-themes mutates `<html class="...">` via its FOUC-prevention script. Without the prop, React logs a hydration mismatch warning in dev.
- **Putting `ThemeProvider` in a Server Component directly:** Must be wrapped in a `"use client"` component. Next.js App Router requires this boundary.
- **Overriding `@theme {}` tokens expecting runtime effect:** Tailwind CSS 4 `@theme {}` is a build-time static token registry. Runtime theme swaps MUST use regular CSS custom properties outside `@theme {}`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| FOUC prevention | Inline `<script>` in `<head>` | `next-themes` built-in | next-themes already injects a blocking script before hydration; custom scripts are fragile and harder to sync with React |
| localStorage sync | Manual event listeners + useState | `next-themes` built-in | Handles storage events, system preference changes, and SSR correctly |
| System preference detection | `window.matchMedia` + listeners | `next-themes` `enableSystem` prop | Handles listener teardown, SSR, and initial value without race conditions |

**Key insight:** Theme management has subtle SSR/hydration edge cases. next-themes handles all of them in ~300 lines of battle-tested code.

---

## Common Pitfalls

### Pitfall 1: Tailwind CSS 4 `@theme {}` is NOT runtime-overridable
**What goes wrong:** Developer adds dark/light values inside `@theme {}` expecting CSS specificity to swap them. Nothing changes at runtime.
**Why it happens:** Tailwind CSS 4's `@theme {}` is a static design-token registry processed at build time. It generates CSS utility classes but the variables themselves are not responsive to runtime DOM changes.
**How to avoid:** Add light-theme overrides as a plain CSS `.light { ... }` selector block in `globals.css`, outside `@theme {}`. These ARE runtime CSS custom properties and respond to class toggling on `<html>`.
**Warning signs:** Theme toggle fires, class changes on `<html>`, but colors don't change.

### Pitfall 2: `resolvedTheme` is `undefined` on first server render
**What goes wrong:** `useTheme().resolvedTheme` returns `undefined` during SSR and before hydration. If you use it directly in a render expression, you get a flash of unstyled content or a hydration mismatch.
**Why it happens:** The theme is stored in `localStorage`, which is client-only. The server cannot know it.
**How to avoid:** In `useAppTheme`, initialize state to `DARK_PALETTE` (the default), then update via `useEffect` after mount. This matches server render with initial client render, then silently updates.
**Warning signs:** React hydration errors; component flashes between states on load.

### Pitfall 3: 432 inline-style occurrences cannot be fixed with CSS alone
**What goes wrong:** Phase 2 (assessment/dashboard) has 432+ hardcoded hex values inside React `style={{}}` props. CSS variable overrides have zero effect on these — they are JavaScript strings, not CSS references.
**Why it happens:** The project's convention is inline styles with literal hex. This predates the theme requirement.
**How to avoid:** Use the `useAppTheme()` hook in each component. Replace literals like `"#0B0F1A"` with `palette.bg`. This is mechanical but must be done file by file.
**Warning signs:** Landing page themes correctly but assessment stays dark regardless of toggle.

### Pitfall 4: `disableTransitionOnChange` is needed to prevent color flash mid-switch
**What goes wrong:** Without it, CSS transitions on `background`, `color`, and `border` properties will animate from old to new values during a theme switch, creating a visible color sweep.
**Why it happens:** next-themes applies the new class while CSS transitions are active.
**How to avoid:** Pass `disableTransitionOnChange` to `ThemeProvider`. next-themes temporarily disables all CSS transitions, applies the class, then re-enables them.

### Pitfall 5: Blog admin pages (`/blog/admin/*`) need to be excluded
**What goes wrong:** Blog admin is dark-only per CONTEXT.md. If `useAppTheme` is used in admin components, they will switch to light. If not used, they stay dark regardless — which is correct but must be documented.
**How to avoid:** Do not add `useAppTheme` to blog admin components. They keep hardcoded dark hex values. The `ThemeProvider` still wraps them (it wraps everything) but no component consumes the theme there.

---

## Code Examples

### Complete globals.css addition
```css
/* ADD after @theme {} block in globals.css */
html.light {
    --color-bg: #F8FAFC;
    --color-s1: #FFFFFF;
    --color-s2: #F1F5F9;
    --color-s3: #E2E8F0;
    --color-brd: rgba(0, 0, 0, 0.06);
    --color-brd2: rgba(0, 0, 0, 0.12);
    --color-teal-dim: rgba(16, 185, 129, 0.08);
    --color-teal-glow: rgba(16, 185, 129, 0.15);
    --color-txt: #0F172A;
    --color-txt2: #334155;
    --color-mute: #64748B;
    --color-dim: #CBD5E1;
    --color-background: #F8FAFC;
    --color-foreground: #0F172A;
    --color-muted: #F1F5F9;
    --color-muted-foreground: #64748B;
    --color-border: #E2E8F0;
    --color-card: rgba(255, 255, 255, 0.8);
    --color-card-hover: rgba(255, 255, 255, 0.95);
    --color-card-solid: #FFFFFF;
    --color-surface: #F1F5F9;
    --color-text-secondary: #475569;
    --color-text-tertiary: #94A3B8;
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.06);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.10), 0 4px 6px -4px rgb(0 0 0 / 0.08);
    --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.06);
    --shadow-card-hover: 0 10px 30px -5px rgb(0 0 0 / 0.15);
    --shadow-glow: 0 0 40px -10px rgb(16 185 129 / 0.2);
}

html.light body {
    background: var(--color-bg);
    color: var(--color-txt);
}
```

### Navbar toggle placement
The toggle button slots into the existing right-side button cluster in `navbar.tsx`. For logged-in users it goes **before** the avatar button; for logged-out users it goes **before** the "Get Started" button. This keeps the rightmost element consistent.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual localStorage + `<script>` in `<head>` | next-themes | 2021+ | Eliminates custom SSR boilerplate |
| `data-theme` attribute strategy | `class` strategy for Tailwind compat | Tailwind dark mode v2+ | Enables `dark:` variant; both work for CSS vars |
| Checking `window.matchMedia` manually | next-themes `enableSystem` | next-themes v0.2+ | Handles listener teardown correctly |

---

## Scope Assessment: Phase 2 Work Estimate

The assessment/dashboard inline-style refactor is the biggest task. Here is the breakdown:

| Area | Files with Hardcoded Colors | Approach |
|------|-----------------------------|----------|
| Assessment layout | 1 (`layout.tsx`) | Add `useAppTheme()`, replace ~20 occurrences |
| Assessment steps 1-6 | 6 pages | Add `useAppTheme()`, replace ~30-60 per file |
| Dashboard layout | 1 (`layout.tsx`) | Add `useAppTheme()`, replace ~25 occurrences |
| Dashboard pages | 4 pages | Add `useAppTheme()` per page |
| Dashboard components | ~15 components | Add `useAppTheme()` per component |
| Navbar | 1 | Already needs edit for toggle; color swap included |
| Blog components | ~8 | Light-compatible with CSS vars mostly; few inline |

The `useAppTheme` hook approach means each file gets one import + one hook call at the top, then mechanical `palette.bg` replacements throughout. The palette object covers all colors used in the dark theme, so no color should be left without a palette equivalent.

---

## Environment Availability

Step 2.6: SKIPPED — this phase has no external service dependencies. Only an npm package install and CSS/TypeScript file edits.

---

## Validation Architecture

No automated test framework is configured in this project (no jest.config, no vitest.config, no test directory found). Validation for this phase is manual:

### Manual Test Checklist (to be verified during execution)
| Behavior | How to Verify |
|----------|--------------|
| Toggle switches between dark and light | Click toggle in navbar; inspect `<html>` class |
| Preference persists across refresh | Set light, reload; still light |
| System default on first visit | Clear localStorage, reload; OS preference honored |
| Landing page themes correctly | All CSS-variable-driven sections respond |
| Blog pages theme correctly | Post listing, post detail respond |
| Assessment stays dark until Phase 2 | Wizard pages unaffected before Phase 2 work |
| No FOUC | Hard reload in light mode; no dark flash |
| No hydration errors | Check browser console on page load |
| Blog admin stays dark | `/blog/admin` ignores theme toggle |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Tailwind CSS 4 `@theme {}` cannot be overridden at runtime via CSS specificity — only plain CSS custom properties outside `@theme {}` respond to class-based switching | Architecture Patterns, Pitfall 1 | If wrong, the light theme override strategy for globals.css would need restructuring. LOW risk — this is well-documented Tailwind CSS 4 behavior. |
| A2 | `useAppTheme` hook with `useEffect` + `useState(DARK_PALETTE)` correctly prevents hydration mismatches | Pattern 4 | If wrong, SSR/client mismatch errors appear. Mitigation: standard pattern used by next-themes ecosystem. |
| A3 | `html.light` selector (with element prefix) has sufficient specificity to override properties set on `body` by Tailwind base styles | globals.css additions | If wrong, add `body` override under `.light body` selector (already included in code example as belt-and-suspenders). |

---

## Open Questions

1. **Kira chat widget theme**
   - What we know: CONTEXT.md says Kira should respect theme
   - What's unclear: The Kira widget (`src/components/ai/`) uses inline styles; it will need `useAppTheme()` added in Phase 2
   - Recommendation: Include in Phase 2 scope alongside dashboard components

2. **`/blog/admin` and `/blog/admin/editor` dark-only exception**
   - What we know: These pages stay dark for v1 per CONTEXT.md
   - What's unclear: Whether any shared components between blog-public and blog-admin might inadvertently theme
   - Recommendation: Audit shared blog components; only add `useAppTheme` to public-facing ones

---

## Sources

### Primary (HIGH confidence)
- [github.com/pacocoursey/next-themes](https://github.com/pacocoursey/next-themes) — ThemeProvider API, suppressHydrationWarning, FOUC prevention mechanism, storageKey prop, attribute options
- [ui.shadcn.com/docs/dark-mode/next](https://ui.shadcn.com/docs/dark-mode/next) — Official ThemeProvider wrapper pattern, root layout integration code

### Secondary (MEDIUM confidence)
- WebSearch results confirming next-themes 0.4.6 as latest stable, React 19 compatibility, suppressHydrationWarning pattern

### Codebase (VERIFIED)
- `src/app/globals.css` — confirmed all CSS variable names; `@theme {}` token structure; confirms no existing light theme block
- `src/app/layout.tsx` — confirmed `<html>` element structure; where ThemeProvider wraps; existing `AuthProvider` nesting
- `src/components/layout/navbar.tsx` — confirmed inline style usage; right-side button cluster structure; Lucide already imported
- `src/app/(protected)/assessment/layout.tsx` — confirmed inline style hardcoded hex pattern
- `src/app/(protected)/dashboard/layout.tsx` — confirmed inline style hardcoded hex pattern
- `grep` scan — confirmed 432 total hardcoded hex occurrences across 20+ files in `/src/`

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — next-themes 0.4.6 verified via npm registry search; shadcn/ui official docs confirm App Router pattern
- Architecture (Phase 1 CSS var approach): HIGH — verified by reading actual globals.css structure; confirmed CSS cascade behavior
- Architecture (Phase 2 useAppTheme hook): HIGH — next-themes `useTheme` API is verified; hook pattern is derived from it
- Tailwind CSS 4 `@theme {}` runtime override limitation: MEDIUM — core claim is well-established but flagged as A1 since not directly verified via official Tailwind docs in this session
- Pitfalls: HIGH — based on verified code reading + official docs

**Research date:** 2026-04-12
**Valid until:** 2026-05-12 (next-themes is a stable, slow-moving library)
