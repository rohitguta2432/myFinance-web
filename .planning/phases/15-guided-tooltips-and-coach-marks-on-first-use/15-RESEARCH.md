# Phase 15: Guided Tooltips and Coach Marks on First Use - Research

**Researched:** 2026-04-13
**Domain:** React onboarding / product tour / coach mark systems
**Confidence:** HIGH

---

## Summary

Phase 15 adds a "first use" onboarding system that walks new users through the assessment wizard steps and dashboard sections with sequential tooltip coach marks. The system must show only once (localStorage-gated), match the dark theme palette, work with Next.js 15 App Router, and fit the project's inline-styles convention.

The ecosystem landscape for React 19 + Next.js 15 onboarding libraries has significant fragmentation. The two most popular choices — `react-joyride` and `intro.js` — have known React 19 breakage (removed deprecated React DOM APIs). Two viable library options exist for this stack: `nextstepjs` (published January 2026, peer deps `react >= 18`) and `onborda` (published December 2024, peer deps `react >= 18`). Both depend on `motion`/`framer-motion` which is not currently installed in this project, adding bundle weight. Given the project's inline-styles-only convention and the thin scope of this feature (a handful of steps, no multi-page routing), a custom zero-dependency implementation using `ReactDOM.createPortal` + `getBoundingClientRect` is the cleanest fit — it avoids the motion dependency, stays consistent with the codebase style, and can be done in under 150 lines.

**Primary recommendation:** Build a custom `TourProvider` + `useCoachMark` hook using `ReactDOM.createPortal`, `getBoundingClientRect`, and `localStorage` — no new library dependency required.

---

## Project Constraints (from CLAUDE.md)

- Styling: Inline styles or component-scoped `<style>` tags only — no CSS modules, no Tailwind utility classes in components
- Colors: Dark theme palette — `#0B0F1A`/`#0F172A` backgrounds, `#F1F5F9`/`#CBD5E1` text, `#10B981` accent
- Font: `var(--font-display)` (Bricolage Grotesque) for assessment/dashboard components
- All assessment/dashboard components must be `"use client"` — no SSR
- State: Zustand for cross-component state; `useState`/`useEffect` for component-local UI state
- No CSS modules; use React `CSSProperties` objects
- Component filenames: `kebab-case.tsx`; React component names: PascalCase
- Imports: `@/` absolute paths only
- Error handling: try-catch in all async/localStorage operations; silently ignore storage failures

---

## Standard Stack

### Core (no new dependencies required)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React (already installed) | 19.0.0 | `ReactDOM.createPortal` for overlay rendering | Native, zero cost |
| Zustand (already installed) | ^5 | Tour active state + current step index | Already the project state primitive |
| localStorage | Browser API | "has seen tour" persistence | Already the project pattern (streak, badges, theme) |

### If a library is preferred over custom build

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| nextstepjs | 2.2.0 | Next.js-native tour with multi-page routing | Published 2026-01-02, peer deps `react >= 18`, App Router aware |
| motion | 12.38.0 | Required peer dep for nextstepjs | `react ^18 OR ^19` — compatible |

[VERIFIED: npm registry — nextstepjs 2.2.0, published 2026-01-02, peerDeps: react>=18, motion>=11]
[VERIFIED: npm registry — motion 12.38.0, peerDeps: react ^18||^19]

### Alternatives Rejected

| Library | Reason Rejected |
|---------|----------------|
| react-joyride | Uses removed React 19 APIs (`unmountComponentAtNode`, `unstable_renderSubtreeIntoContainer`) — broken on React 19 [VERIFIED: GitHub issue #1122] |
| intro.js | GPL license; commercial use requires paid license [VERIFIED: introjs.com] |
| onborda | Requires `framer-motion` AND `@radix-ui/react-portal` — two new deps; last published Dec 2024 [VERIFIED: npm registry] |
| driver.js | No React bindings; vanilla JS only [ASSUMED] |

**Installation (custom approach — no new deps):**
```bash
# Nothing to install — uses ReactDOM.createPortal already available in React 19
```

**Installation (nextstepjs approach, if chosen):**
```bash
npm install nextstepjs motion
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/
│   └── onboarding/
│       ├── tour-provider.tsx       # Context + portal overlay
│       ├── coach-mark-tooltip.tsx  # Positioned tooltip card
│       └── tour-steps.ts           # Step definitions per surface
├── hooks/
│   └── onboarding/
│       └── useTour.ts              # Hook to control tour from any component
```

### Pattern 1: Custom Portal Coach Mark (recommended)

**What:** A `TourProvider` renders a full-screen semi-transparent overlay using `ReactDOM.createPortal` appended to `document.body`. The active step's target element is located via `document.getElementById(stepId)`, its position read with `getBoundingClientRect()`, and a tooltip card positioned absolutely near it. A "spotlight" cutout is achieved with a `box-shadow: 0 0 0 9999px rgba(0,0,0,0.65)` trick applied inline to the highlighted element.

**When to use:** Fewer than 10 steps per surface, no multi-page navigation required between steps, inline-styles project.

```typescript
// Source: established React portal positioning pattern [ASSUMED — well-known technique]
"use client";

import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface TourStep {
    targetId: string;        // id of the DOM element to highlight
    title: string;
    body: string;
    placement: "top" | "bottom" | "left" | "right";
}

interface CoachMarkTooltipProps {
    step: TourStep;
    stepIndex: number;
    totalSteps: number;
    onNext: () => void;
    onSkip: () => void;
}

function CoachMarkTooltip({ step, stepIndex, totalSteps, onNext, onSkip }: CoachMarkTooltipProps) {
    const [pos, setPos] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const el = document.getElementById(step.targetId);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setPos({
            top: rect.top + window.scrollY - 120,
            left: rect.left + window.scrollX + rect.width / 2 - 160,
        });
        const prevShadow = el.style.boxShadow;
        const prevZIndex = el.style.zIndex;
        el.style.boxShadow = "0 0 0 9999px rgba(11,15,26,0.80)";
        el.style.borderRadius = "8px";
        el.style.position = "relative";
        el.style.zIndex = "10001";
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        return () => {
            el.style.boxShadow = prevShadow;
            el.style.zIndex = prevZIndex;
        };
    }, [step.targetId]);

    const tooltipStyle: React.CSSProperties = {
        position: "absolute",
        top: pos.top,
        left: pos.left,
        width: 320,
        background: "#0F172A",
        border: "1px solid #1E293B",
        borderRadius: 12,
        padding: "16px 20px",
        zIndex: 10002,
        color: "#F1F5F9",
        fontFamily: "var(--font-display)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    };

    return ReactDOM.createPortal(
        <div style={tooltipStyle}>
            <p style={{ color: "#10B981", fontSize: 11, fontWeight: 600, marginBottom: 4 }}>
                Step {stepIndex + 1} of {totalSteps}
            </p>
            <p style={{ fontWeight: 700, marginBottom: 8 }}>{step.title}</p>
            <p style={{ color: "#CBD5E1", fontSize: 14 }}>{step.body}</p>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                <button onClick={onSkip} style={{ color: "#64748B", fontSize: 13, background: "none", border: "none", cursor: "pointer" }}>
                    Skip tour
                </button>
                <button
                    onClick={onNext}
                    style={{ background: "#10B981", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 14, cursor: "pointer" }}
                >
                    {stepIndex + 1 === totalSteps ? "Done" : "Next"}
                </button>
            </div>
        </div>,
        document.body
    );
}
```

### Pattern 2: First-Use Detection via localStorage

**What:** Same pattern used by `useStreak` and `useBadges` — read a key on mount, gate display, write when dismissed.

```typescript
// Source: matches existing useStreak pattern in src/hooks/gamification/useStreak.ts [VERIFIED: codebase]
const TOUR_KEYS = {
    assessment: "myfinancial_tour_assessment",
    dashboard:  "myfinancial_tour_dashboard",
};

function hasSeenTour(key: string): boolean {
    try {
        return localStorage.getItem(key) === "done";
    } catch {
        return true; // fail-safe: do not show if storage unavailable
    }
}

function markTourDone(key: string): void {
    try {
        localStorage.setItem(key, "done");
    } catch { /* silent */ }
}
```

### Pattern 3: Tour Steps Data Definitions

**What:** Static arrays colocated in a `tour-steps.ts` file. Add `id="tour-step-X"` attributes to target elements. Tour step `title` and `body` must always be hardcoded static strings — never pass user-generated content here.

```typescript
// src/components/onboarding/tour-steps.ts [ASSUMED structure]
export const ASSESSMENT_TOUR_STEPS: TourStep[] = [
    {
        targetId: "tour-step-profile",
        title: "Your Personal Profile",
        body: "We start by understanding your age, location, and risk appetite to personalize your plan.",
        placement: "bottom",
    },
    {
        targetId: "tour-step-income",
        title: "Income & Expenses",
        body: "Add all your income sources and monthly expenses — this drives your savings rate calculation.",
        placement: "right",
    },
];

export const DASHBOARD_TOUR_STEPS: TourStep[] = [
    {
        targetId: "tour-dash-score",
        title: "Your Financial Health Score",
        body: "This score is calculated from 5 pillars: Liquidity, Protection, Growth, Allocation, and Tax.",
        placement: "top",
    },
];
```

### Anti-Patterns to Avoid

- **Rendering the overlay inside the wizard layout:** Causes z-index battles with existing modals and sticky sidebars. Always use `ReactDOM.createPortal(content, document.body)`.
- **Querying DOM elements synchronously before mount:** `document.getElementById` returns `null` before the target renders. Always run inside `useEffect`.
- **Using CSS modules or Tailwind classes in the tooltip:** Violates project styling convention. Use `CSSProperties` inline objects only.
- **Running the tour on SSR:** All tour components must have `"use client"` and must guard localStorage access behind `useEffect` or `typeof window !== "undefined"` checks.
- **Rendering user-supplied content in tooltip:** Tour `title` and `body` fields must be hardcoded static strings only — never interpolate dynamic data from API responses into tooltip text.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll to target | Manual scroll calculation | `el.scrollIntoView({ behavior: 'smooth', block: 'center' })` | One-liner, handles all edge cases |
| Focus trap | Custom tab-key intercept | `el.focus()` + `tabIndex` on tooltip buttons | Full focus trap library is overkill for a 2-button tooltip |
| Tooltip progress bar | Custom animated bar | Simple inline `width: \`${((step+1)/total)*100}%\`` | Sufficient for this scope |
| Spotlight effect | Custom SVG mask | CSS box-shadow: `0 0 0 9999px rgba(...)` on target element | GPU-accelerated, works in dark mode, 1 line |

**Key insight:** The core complexity of onboarding tours is positioning + z-index + first-render timing. Everything else is data-driven configuration. A custom 100-line implementation beats pulling in a 40 KB animation library.

---

## Common Pitfalls

### Pitfall 1: Stale `getBoundingClientRect` after layout shift
**What goes wrong:** Tour tooltip shows in wrong position when the target element renders asynchronously (e.g., skeleton replaced by real content).
**Why it happens:** The `useEffect` fires before the skeleton finishes loading, so `getBoundingClientRect()` returns the skeleton's dimensions.
**How to avoid:** Gate tour start until page data has loaded — check `isLoading` from the relevant dashboard/assessment hooks before activating the tour.
**Warning signs:** Tooltip appears offset from its target by a fixed amount matching the skeleton height.

### Pitfall 2: `document.body` not available during SSR
**What goes wrong:** `ReactDOM.createPortal(content, document.body)` throws on the server — `document` is undefined.
**Why it happens:** Next.js runs a single SSR pass even for `"use client"` components.
**How to avoid:** Use a `mounted` state gate: `const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), []);` — render portal only when `mounted === true`.
**Warning signs:** `ReferenceError: document is not defined` during build or first navigation.

### Pitfall 3: Tour re-appears after localStorage cleared
**What goes wrong:** Users who clear browser data always see the tour again, even if they are returning users.
**Why it happens:** localStorage is per-browser, not per-account.
**How to avoid:** Key tour completion on user ID: `myfinancial_tour_assessment_${userId}`. Derive userId from Zustand store.
**Warning signs:** Returning users who switch browsers or use incognito see a tour they already completed.

### Pitfall 4: z-index collision with existing dashboard modals
**What goes wrong:** The overlay appears behind an already-open modal or bottom sheet.
**Why it happens:** Dashboard components use modal-like overlays; if their z-index exceeds the tour overlay, the tour is invisible.
**How to avoid:** Set tour overlay z-index to 10000+. Existing project modals appear to be at z-index ~1000 based on visual review [ASSUMED].
**Warning signs:** Overlay is invisible or partially clipped by another element.

### Pitfall 5: Scroll position not accounted for
**What goes wrong:** Tooltip appears at the correct screen position on mount but floats away when the user scrolls.
**Why it happens:** `getBoundingClientRect()` returns viewport-relative coordinates; combined with `position: absolute` on the portal (document-relative), `window.scrollY` must be added.
**How to avoid:** Use `top: rect.top + window.scrollY` and `left: rect.left + window.scrollX`. Alternatively use `position: fixed` to avoid scroll offset math entirely.
**Warning signs:** Tooltip is correct on scroll-top pages but misaligned on scrolled pages.

---

## Code Examples

### Full `useTour` hook pattern
```typescript
// Source: synthesized from useStreak.ts pattern + ReactDOM.createPortal [ASSUMED]
// src/hooks/onboarding/useTour.ts
"use client";

import { useState, useCallback } from "react";

export interface TourStep {
    targetId: string;
    title: string;
    body: string;
    placement: "top" | "bottom" | "left" | "right";
}

interface UseTourOptions {
    steps: TourStep[];
    storageKey: string;
}

export function useTour({ steps, storageKey }: UseTourOptions) {
    const [active, setActive] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        try {
            return localStorage.getItem(storageKey) !== "done";
        } catch {
            return false;
        }
    });
    const [stepIndex, setStepIndex] = useState(0);

    const next = useCallback(() => {
        if (stepIndex + 1 >= steps.length) {
            try { localStorage.setItem(storageKey, "done"); } catch { /* silent */ }
            setActive(false);
        } else {
            setStepIndex(i => i + 1);
        }
    }, [stepIndex, steps.length, storageKey]);

    const skip = useCallback(() => {
        try { localStorage.setItem(storageKey, "done"); } catch { /* silent */ }
        setActive(false);
    }, [storageKey]);

    return { active, stepIndex, step: steps[stepIndex], totalSteps: steps.length, next, skip };
}
```

### Spotlight box-shadow pattern (save and restore existing shadow)
```typescript
// Source: established CSS box-shadow trick [ASSUMED]
useEffect(() => {
    const el = document.getElementById(step.targetId);
    if (!el) return;
    const prevShadow = el.style.boxShadow;
    const prevZIndex = el.style.zIndex;
    el.style.boxShadow = "0 0 0 9999px rgba(11,15,26,0.80)";
    el.style.borderRadius = "8px";
    el.style.position = "relative";
    el.style.zIndex = "10001";
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    return () => {
        el.style.boxShadow = prevShadow;
        el.style.zIndex = prevZIndex;
    };
}, [step.targetId]);
```

### Portal mount guard (SSR safety)
```typescript
// Source: standard Next.js "use client" portal pattern [ASSUMED]
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

if (!mounted || !active) return null;
return ReactDOM.createPortal(<CoachMarkTooltip ... />, document.body);
```

### localStorage key naming convention (consistent with existing project)
```typescript
// Source: matches STREAK_KEY="myfinancial_streak", BADGES_KEY="myfinancial_badges" [VERIFIED: codebase]
const TOUR_ASSESSMENT_KEY = "myfinancial_tour_assessment";
const TOUR_DASHBOARD_KEY  = "myfinancial_tour_dashboard";
```

---

## Runtime State Inventory

Not applicable — this is a greenfield UI feature with no rename, refactor, or migration involved.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build | Available | 20+ | — |
| React 19 `createPortal` | Overlay rendering | Available | 19.0.0 | — |
| localStorage | First-use detection | Available (browser) | — | Fail-safe: always return `true` from `hasSeenTour` if unavailable |
| motion (only if nextstepjs) | Animation | Not installed | — | Custom CSS transitions OR skip animation |

**Missing dependencies with no fallback:** None — custom approach requires zero new dependencies.

**Missing dependencies with fallback:** `motion` would be needed only if `nextstepjs` is chosen; custom approach skips it entirely.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| react-joyride (dominant 2018-2023) | nextstepjs / custom portal (2024-2026) | React 19 removed legacy DOM APIs (2024) | react-joyride broken on React 19 |
| framer-motion (animation lib) | motion (standalone package) | 2024 — split from framer-motion | Same code, lighter package name |
| CSS Anchor Positioning (future) | getBoundingClientRect + absolute position | Not yet baseline (Chrome 125+, Safari 18+) | Cannot rely on it for production yet |

**Deprecated/outdated:**
- `react-joyride`: Uses `ReactDOM.unmountComponentAtNode` and `unstable_renderSubtreeIntoContainer` — both removed in React 19 [VERIFIED: GitHub issue gilbarbara/react-joyride#1122]
- `intro.js`: GPL-licensed, requires commercial license for paid products [VERIFIED: introjs.com]

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Custom 100-line implementation is simpler than nextstepjs given project scope | Summary, Standard Stack | If requirements expand to multi-page tour, nextstepjs would be needed |
| A2 | Existing dashboard/assessment modals use z-index <= 9000 | Pitfall 4 | Tour overlay might appear behind a modal; set overlay z-index to 10000+ as precaution |
| A3 | spotlight box-shadow trick does not conflict with existing component box-shadows when saved/restored | Code Examples | Overwriting `el.style.boxShadow` could clear existing shadow; save/restore pattern in examples mitigates |
| A4 | driver.js has no React bindings | Standard Stack alternatives | If driver.js added React wrappers post-training, it would be another option |

---

## Open Questions (RESOLVED)

1. **How many tour steps per surface and which specific elements get highlights?**
   - What we know: 6 assessment steps + 4-8 dashboard sections to potentially highlight
   - What's unclear: Product owner has not specified exact elements
   - Recommendation: Define 3-5 steps for assessment wizard and 3-4 for dashboard — keep it tight to maximize completion rates
   - **(RESOLVED):** 5 assessment steps defined in tour-steps.ts (tour-step-profile, tour-step-income, tour-step-assets, tour-step-goals, tour-step-nav) + 4 dashboard steps (tour-dash-score, tour-dash-redflags, tour-dash-actions, tour-dash-tabs). See 15-01-PLAN.md Task 2.

2. **Should tour completion be tied to userId (per-account) or device (per-browser)?**
   - What we know: localStorage is per-browser; Zustand store holds user session data
   - What's unclear: Whether users expect "I already did this" after signing in on a new browser
   - Recommendation: Key localStorage entry on userId from Zustand store for per-account tracking
   - **(RESOLVED):** userId-scoped via `getTourUserId()` helper that extracts user ID from the `user_profile` cookie. Storage key format: `myfinancial_tour_assessment_${userId}` / `myfinancial_tour_dashboard_${userId}`. Falls back to "anon" if cookie unavailable. See 15-01-PLAN.md Task 1.

3. **Should assessment step tour advance with the wizard step, or run as a full overlay independently?**
   - What we know: Assessment wizard has 6 URL-based steps; full independent overlay could conflict with wizard navigation
   - What's unclear: Preferred UX model
   - Recommendation: One tooltip per wizard step, shown on step mount — non-disruptive and simpler
   - **(RESOLVED):** Tour runs as a full overlay on assessment step-1 only (`enabled={activeStep === 1}`), highlighting all 5 sidebar elements sequentially. Does not advance with wizard steps — runs independently as a one-time orientation. See 15-02-PLAN.md Task 1.

---

## Validation Architecture

> workflow.nyquist_validation key absent from config — treated as enabled.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright (already in devDependencies: `@playwright/test`) |
| Config file | `playwright.config.ts` (exists, verified) |
| Quick run command | `npx playwright test --grep "tour"` |
| Full suite command | `npx playwright test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TOUR-01 | Tour tooltip appears on first visit to assessment | e2e | `npx playwright test --grep "assessment tour first visit"` | Yes — tests/e2e/tour.spec.ts (created in 15-02 Task 3) |
| TOUR-02 | Tour does not appear on second visit (localStorage gate) | e2e | `npx playwright test --grep "assessment tour second visit"` | Yes — tests/e2e/tour.spec.ts (created in 15-02 Task 3) |
| TOUR-03 | Skip button dismisses tour and sets localStorage key | e2e | `npx playwright test --grep "tour skip"` | Yes — tests/e2e/tour.spec.ts (created in 15-02 Task 3) |
| TOUR-04 | Next advances to next step; Done on last step closes tour | e2e | `npx playwright test --grep "tour navigation"` | Yes — tests/e2e/tour.spec.ts (created in 15-02 Task 3) |

### Sampling Rate
- **Per task commit:** `npx playwright test --grep "tour" --headed` (visual check)
- **Per wave merge:** `npx playwright test`
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [x] `tests/e2e/tour.spec.ts` — covers TOUR-01 through TOUR-04 (created in 15-02-PLAN.md Task 3)
- [x] `playwright.config.ts` exists (verified — already present in project root)

---

## Security Domain

> security_enforcement not explicitly set — section included.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Tour is purely client-side UI — no auth surface |
| V3 Session Management | no | Tour state is cosmetic localStorage — no session data |
| V4 Access Control | no | Tour is read-only UI overlay |
| V5 Input Validation | yes | Tour step content must be hardcoded static strings only |
| V6 Cryptography | no | No secrets stored |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via dynamic tooltip content | Tampering | Tour `title`/`body` must be hardcoded static strings — never render dynamic API data in tooltip text |
| Clickjack via z-index overlay | Tampering | Tour overlay must not obscure auth forms or financial action buttons; confine highlight to target element only |

---

## Sources

### Primary (HIGH confidence)
- npm registry (registry.npmjs.org) — nextstepjs 2.2.0 version, peerDeps, publish date: 2026-01-02 [VERIFIED]
- npm registry — onborda 1.2.5, peerDeps, publish date: 2024-12-22 [VERIFIED]
- npm registry — motion 12.38.0, peerDeps: react ^18||^19 [VERIFIED]
- npm registry — @radix-ui/react-portal, peerDeps: react ^16.8 || ^17 || ^18 || ^19 [VERIFIED]
- GitHub issue gilbarbara/react-joyride#1122 — React 19 breakage confirmed [VERIFIED]
- Codebase grep — localStorage keys pattern (`myfinancial_*`), useStreak/useBadges hook structure [VERIFIED]

### Secondary (MEDIUM confidence)
- nextstepjs.com/docs/nextjs — API shape: steps array, useNextStep hook, provider setup
- onboardjs.com/blog/5-best-react-onboarding-libraries-in-2025-compared — ecosystem state as of 2026

### Tertiary (LOW confidence)
- Spotlight box-shadow trick — training knowledge confirmed via search
- z-index range assumption for existing dashboard modals — visual assumption, not grep-verified

---

## Metadata

**Confidence breakdown:**
- Standard stack (library options): HIGH — verified via npm registry with exact versions and publish dates
- Architecture (custom portal pattern): MEDIUM — established React pattern, not verified against project-specific edge cases
- Pitfalls: MEDIUM — derived from React 19 SSR/portal first principles; partially training knowledge

**Research date:** 2026-04-13
**Valid until:** 2026-07-13 (stable ecosystem; nextstepjs 2.2.0 is current as of research date)
