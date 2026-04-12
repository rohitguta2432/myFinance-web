# Phase 6: Dark/Light Theme Toggle - Context

**Gathered:** 2026-04-12
**Status:** Ready for planning
**Mode:** Auto-generated (autonomous mode)

<domain>
## Phase Boundary

Add a dark/light theme toggle to the application. Users can switch between dark mode (current default) and light mode. The preference should persist across sessions and respect system preference on first visit.

</domain>

<decisions>
## Implementation Decisions

### Theme Storage
- Store theme preference in `localStorage` key `myfinancial_theme` with values `dark` | `light` | `system`
- Default to `system` (auto-detect from OS) on first visit
- Persist choice across sessions

### Theme Toggle Location
- Add toggle button in the navbar (top-right, near user avatar/sign-in)
- Simple sun/moon icon toggle (no dropdown for v1)
- Use Lucide `Sun` and `Moon` icons

### CSS Strategy
- Landing pages already use CSS variables (`--color-bg`, `--color-s1`, etc.) in `globals.css` — extend these with light theme values
- Assessment/dashboard pages use hardcoded hex in inline styles — these need a CSS class-based approach: add `data-theme="light"` on `<html>` and use CSS overrides
- For inline styles: create a theme context hook (`useTheme`) that returns the current palette object so components can read colors from it instead of hardcoding

### Light Theme Palette
- Background: `#F8FAFC` (slate-50)
- Surface 1: `#FFFFFF`
- Surface 2: `#F1F5F9` (slate-100)
- Text primary: `#0F172A` (slate-900)
- Text secondary: `#475569` (slate-600)
- Text muted: `#94A3B8` (slate-400)
- Accent: `#10B981` (keep emerald — works on both themes)
- Border: `rgba(0, 0, 0, 0.08)`
- Card shadow: `0 2px 8px rgba(0,0,0,0.06)`

### Scope
- Phase 1: Landing pages + navbar + blog (CSS variable swap — fast)
- Phase 2: Assessment wizard + dashboard (inline style refactor — more work)
- Both phases in this single phase, prioritize landing+navbar first

### Claude's Discretion
- Transition animation timing
- Toggle button exact positioning
- How to handle the blog admin pages (can stay dark-only for v1)

</decisions>

<code_context>
## Existing Code Insights

- `globals.css` defines CSS custom properties under `@theme {}` — these power the landing page
- Assessment/dashboard pages use hardcoded hex values (`#0B0F1A`, `#0F172A`, `#F1F5F9`) in React `CSSProperties` objects
- No existing theme context or provider
- Tailwind CSS 4 is configured via PostCSS
- `next-themes` is NOT installed — would be a natural fit for Next.js theme management

</code_context>

<specifics>
## Specific Ideas

- Use `next-themes` package for SSR-safe theme management (prevents flash of wrong theme)
- Add `class` strategy (not `data-attribute`) so Tailwind's `dark:` variant works if needed later
- The Kira chat widget should also respect theme

</specifics>

<deferred>
## Deferred Ideas

- Custom theme colors (user picks their own accent color) — separate phase
- Per-page theme override — not needed now

</deferred>
