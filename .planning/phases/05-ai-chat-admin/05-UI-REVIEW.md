# UI Review — Phase 5: AI Chat & Admin

**Overall Score: 17/24**
**Date:** 2026-04-11

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| Copywriting | 3/4 | Copy is specific and product-branded; Filter button promises functionality not yet wired |
| Visuals | 3/4 | Strong visual hierarchy and animations; chat widget leaks onto `/admin` page |
| Color | 3/4 | Consistent dark palette; 53 hardcoded hex literals make future rebrand risky |
| Typography | 2/4 | 9 distinct font sizes in each file is excessive for the surface area |
| Spacing | 4/4 | Disciplined 4-point scale (4/8/12/16/20/24/40/48) — no arbitrary values |
| Experience Design | 2/4 | Admin query error states unhandled; FAQ items not keyboard accessible |

## Top 3 Priority Fixes

1. **Admin query errors are silent** — When `/admin/stats` or `/admin/users` API calls fail, `useQuery`'s `isError` flag is never checked. `OverviewView` receives `undefined` props and renders nothing with no message. Fix: read `isError` from each `useQuery` call and render an error callout.

2. **Chat widget renders on `/admin` route** — CONTEXT.md states the widget should appear on `/assessment/*` and `/dashboard/*` but not admin. It's placed unconditionally in the `(protected)` layout. Fix: add `usePathname()` inside `ChatWidget` and return `null` when `pathname.startsWith('/admin')`.

3. **FAQ items are click-only, no keyboard access** — Each FAQ accordion item is a `<div onClick>` with no `role`, `tabIndex`, or `onKeyDown`. Fix: change to `role="button"`, `tabIndex={0}`, add `onKeyDown` handler for Enter/Space.

## Detailed Findings

### Pillar 1: Copywriting (3/4)

Strong copy throughout. Kira's greeting is specific and warm: "I'm Kira — your personal financial advisor." Quick suggestion chips use real financial questions ("What's my savings rate?" not "Ask something"). The admin login copy "MyFinancial — Restricted Access" is clear.

**Deduction:** The Filter button in `admin/page.tsx` renders as a UI affordance but has no state or functionality behind it — no filter panel, no dropdown, no onChange. Copy-in-UI promising a feature that doesn't exist undermines trust.

### Pillar 2: Visuals (3/4)

The chat widget has well-executed visual polish: float/pulse animation on the trigger button, slide-up panel entry, typing indicator with three animated dots, gradient header. The glass-morphism panel (`backdropFilter: blur(20px)`) is appropriate for a floating overlay.

The admin panel achieves strong data hierarchy: eyebrow labels above section titles, supporting text in muted color. The SVG completion ring and color-coded step badges create quick scannable signal.

**Deduction:** The floating chat widget appears on the `/admin` route where the user is looking at a dense data dashboard with a right-side user detail panel, causing visual conflict in the bottom-right corner.

### Pillar 3: Color (3/4)

The palette is consistent: `#0B0F1A` backgrounds, `#0F172A` surfaces, `#F1F5F9`/`#CBD5E1`/`#94A3B8` text ramp, `#10B981` accent, semantic colors for signals. The 60/30/10 split is maintained.

The chat widget uses a teal-to-blue gradient (`#0D9488` to `#0284C7`) on user messages and the floating button, slightly different from the admin's `#10B981` accent. Both are green-family but visually inconsistent.

53 hardcoded hex values across the two files means any brand update requires grep-and-replace across 1300+ lines.

### Pillar 4: Typography (2/4)

**Chat widget font sizes:** 10, 11, 12, 13, 14, 15, 16, 20, 26 — 9 distinct sizes in a 380x560px panel. The 10px status text is below comfortable reading threshold. Quick suggestion chips at 11px are marginally small for touch targets.

**Admin page font sizes:** 10, 11, 12, 13, 14, 15, 22, 24, 28 — also 9 values. The 10px sidebar label has the same concern.

A tighter scale of 5-6 sizes would serve both surfaces adequately.

### Pillar 5: Spacing (4/4)

Both files use a disciplined spacing rhythm: 4, 6, 8, 10, 12, 14, 16, 20, 24, 40, 48. All values are multiples of 4 (8-point grid with 4 as half-step). No arbitrary pixel values. Full marks.

### Pillar 6: Experience Design (2/4)

**Positive:**
- Chat widget: loading state (typing indicator), error state with friendly copy, disabled states during loading
- Admin panel: skeleton loading for all data tables, empty states for audit logs and search
- Login form: loading state, error message for bad password

**Gaps:**
1. Admin `useQuery` error states never checked — blank page on API failure
2. Filter button is a dead control (no onClick, no connected state)
3. FAQ items not keyboard accessible (`<div onClick>` without tabIndex/role)
4. Chat widget on admin route — overlaps admin UI unexpectedly
5. No confirmation toast for CSV export

## Files Audited

- `src/components/ai/chat-widget.tsx`
- `src/app/(protected)/admin/page.tsx`
- `src/app/(protected)/layout.tsx`
