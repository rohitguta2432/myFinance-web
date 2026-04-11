# Domain Pitfalls: React SPA → Next.js 15 App Router Migration

**Domain:** Personal finance wizard + dashboard (React 19 + Vite → Next.js 15 App Router)
**Researched:** 2026-04-11
**Confidence:** HIGH — pitfalls verified across official Next.js docs, Zustand GitHub discussions, TanStack Query docs, and community post-mortems

---

## Critical Pitfalls

Mistakes that cause runtime errors, security vulnerabilities, data loss, or full rewrites.

---

### Pitfall 1: Zustand localStorage Persist Causes Hydration Mismatch

**What goes wrong:**
Both `useAuthStore` and `useAssessmentStore` use `persist` with localStorage. Next.js renders `"use client"` components on the server first (SSR pass), then hydrates on the client. The server renders with the Zustand default values (e.g., `user: null`, `currentStep: 0`). The client then loads persisted localStorage data — a completely different state — causing React's hydration to throw `Text content does not match server-rendered HTML` or silently corrupt the DOM.

**Why it happens:**
`"use client"` does NOT mean "skip SSR." Next.js renders Client Components on the server to produce the initial HTML, then hydrates. localStorage does not exist on the server. The server renders with defaults; the client re-renders with persisted state. React sees a mismatch.

**Consequences:**
- React hydration error in development (console error)
- Silent DOM corruption in production (React skips reconciliation)
- Assessment wizard shows stale/wrong step state from a previous session
- Auth state flickers: page renders as logged-out, then snaps to logged-in

**Warning signs:**
- `Hydration failed because the initial UI does not match what was rendered on the server`
- Auth-dependent UI (avatar, redirect) flickers on page load
- `currentStep` jumps after first render

**Prevention:**
Use a `_hasHydrated` guard pattern. Add a `hasHydrated: false` flag to both stores and set it to `true` inside a `useEffect` (or use Zustand's `onRehydrateStorage` callback). Render a skeleton or `null` until `hasHydrated` is `true`.

```typescript
// In the store
persist(
  (set) => ({ ...state, _hasHydrated: false }),
  {
    name: 'assessment-storage',
    onRehydrateStorage: () => (state) => {
      state?._setHasHydrated(true);
    },
  }
)

// In components
const hasHydrated = useAssessmentStore((s) => s._hasHydrated);
if (!hasHydrated) return <AssessmentSkeleton />;
```

**Phase:** Shared infrastructure setup (before any wizard step is built).

---

### Pitfall 2: Zustand Auth Store Duplicates Existing Cookie-Based Auth

**What goes wrong:**
The React app uses `useAuthStore` (Zustand + localStorage) as the single source of truth for auth. The Next.js project already has a cookie-based session (`session` cookie + `user_profile` cookie) with middleware protection. Porting `useAuthStore` naively creates two auth systems that go out of sync: middleware sees the cookie (correct), but components read from Zustand (which may be stale from localStorage after logout).

**Why it happens:**
The original SPA had no server and no middleware — localStorage was the only option. Next.js already solved auth at the server level. Carrying the Zustand auth store across without reconciling it with the existing cookie system creates a dual-truth problem.

**Consequences:**
- User logs out → cookie cleared → middleware blocks access — but Zustand still shows user as logged in, so UI renders dashboard
- User in a new browser tab has no Zustand state but has valid cookie — components show "not logged in" incorrectly
- Security: client-visible localStorage token can be read by XSS, whereas httpOnly cookies cannot

**Warning signs:**
- `isSessionValid()` check in Zustand diverges from what middleware enforces
- Logout clears cookie but UI doesn't update until Zustand is also reset

**Prevention:**
Eliminate `useAuthStore` as auth source of truth. Replace it with a thin client-side user context that is populated from the `user_profile` cookie (already set at login). Keep Zustand only for transient UI state if needed. The middleware's cookie check is the real auth gate.

```typescript
// Read user from cookie on client (already set by login API)
// No Zustand needed for auth — cookie is the source of truth
function getUserFromCookie(): User | null {
  const raw = document.cookie.match(/user_profile=([^;]+)/)?.[1];
  return raw ? JSON.parse(decodeURIComponent(raw)) : null;
}
```

**Phase:** Shared infrastructure. Must be resolved before Assessment Step 1.

---

### Pitfall 3: Missing `"use client"` on Zustand / React Query / Hook-Using Components

**What goes wrong:**
Every component ported from the React SPA that uses `useState`, `useEffect`, Zustand hooks, React Query hooks, or browser APIs will crash at runtime with `Error: useState can only be called in a Client Component`. All six assessment step files, dashboard tabs, and the AI chat widget fall into this category.

**Why it happens:**
Next.js App Router defaults every file to a Server Component. `"use client"` must be explicitly added at the top of any file that uses React hooks or browser APIs. When porting large JSX files, it is easy to forget this, especially in files that feel "obviously interactive."

**Consequences:**
- Build succeeds (TypeScript doesn't catch this)
- Runtime crash when the page renders
- Error surfaces only when that specific component tree is loaded

**Warning signs:**
- `Error: useState can only be called in a Client Component. Add the "use client" directive`
- `ReferenceError: window is not defined` inside a component marked `"use client"` (see Pitfall 5)

**Prevention:**
Establish a rule: every file in `src/components/assessment/`, `src/components/dashboard/`, and any file that imports from `zustand`, `@tanstack/react-query`, or uses hooks gets `"use client"` at line 1. Add an ESLint rule or a pre-commit check if the codebase grows large.

**Phase:** Every migration phase. Flag in code review checklist.

---

### Pitfall 4: Recharts Crashes Because `"use client"` Does Not Skip SSR

**What goes wrong:**
Recharts accesses `window`, `document`, and `ResizeObserver` during module initialization — not inside a component, but at import time. Even if the component file has `"use client"`, Next.js still executes the module on the server during the SSR pass. The result is `ReferenceError: window is not defined` at build time or at runtime on the server.

**Why it happens:**
`"use client"` marks the component boundary for React rendering, but it does not prevent the JavaScript module from being loaded in the Node.js process. Libraries that call browser APIs at module scope (not in a hook or event) break during SSR.

**Consequences:**
- Server crash on any page that imports Recharts
- `npm run build` may pass but SSR fails at request time
- Dashboard projection charts are blocked until fixed

**Warning signs:**
- `ReferenceError: window is not defined` in server logs
- Error points to a Recharts internal file, not your component

**Prevention:**
Wrap all chart components with `next/dynamic` with `ssr: false`. This defers module loading entirely until the browser.

```typescript
// src/components/dashboard/ProjectionChart.tsx
import dynamic from 'next/dynamic';

const ProjectionChart = dynamic(
  () => import('./ProjectionChartInner'),
  { ssr: false, loading: () => <ChartSkeleton /> }
);
```

The inner component (`ProjectionChartInner`) contains the Recharts imports and can use `"use client"`. The outer wrapper is the one used in page files.

**Phase:** Dashboard phase (projection charts). Also applies if any step uses inline charts.

---

### Pitfall 5: React Query Provider Not Wrapped in `"use client"` or Placed Wrong

**What goes wrong:**
`QueryClientProvider` uses React context internally. Context providers cannot live in Server Components. If `QueryClientProvider` is placed directly in `app/layout.tsx` without wrapping it in a separate `"use client"` component, Next.js throws `Error: createContext only works in Client Components`.

The second failure mode: initializing `QueryClient` outside of `useState`. Creating it at module scope (e.g., `const queryClient = new QueryClient()`) means all server requests share the same client instance, leaking cached data between users.

**Why it happens:**
A common copy-paste from Pages Router or plain React puts the provider directly in the layout. Pages Router layouts are effectively client-side; App Router layouts are Server Components by default.

**Consequences:**
- Build error if `QueryClientProvider` is used in a Server Component
- Data leakage between users if `QueryClient` is a module-level singleton on the server

**Warning signs:**
- `Error: createContext only works in Client Components`
- Dashboard shows another user's data (in high-traffic scenarios with shared QueryClient)

**Prevention:**
Create a `Providers` component with `"use client"` and initialize `QueryClient` inside `useState`:

```typescript
// src/components/Providers.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  }));
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

Then import `Providers` into `app/layout.tsx` (which stays a Server Component).

**Phase:** Shared infrastructure. Must be done before any hook using `useQuery` is rendered.

---

### Pitfall 6: `useSearchParams` Without Suspense Boundary Breaks Production Build

**What goes wrong:**
If any component uses Next.js's `useSearchParams()` (likely in the assessment wizard for `?step=` or in auth callback handling) without wrapping it in a `<Suspense>` boundary, `npm run build` fails with: `useSearchParams() should be wrapped in a suspense boundary at page "/..."`.

**Why it happens:**
`useSearchParams` causes the page to opt out of static prerendering. Next.js enforces that this must be isolated inside a Suspense boundary so only that subtree is dynamically rendered, not the entire page.

**Consequences:**
- Build fails entirely — Amplify deployment fails
- This is a production-only failure; `npm run dev` does not catch it

**Warning signs:**
- Build works locally in dev mode but fails on Amplify
- Error message mentions `useSearchParams` and a specific page route

**Prevention:**
Any component using `useSearchParams` must be wrapped:

```typescript
import { Suspense } from 'react';
import { SearchParamsReader } from './SearchParamsReader';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SearchParamsReader />
    </Suspense>
  );
}
```

Alternatively, avoid `useSearchParams` entirely for wizard navigation — use Zustand's `currentStep` state instead, which is already the pattern in the source React app. This eliminates the need for URL-based step params.

**Phase:** Any step or page that reads URL params. Check during infrastructure phase.

---

## Moderate Pitfalls

Mistakes that cause bugs or degraded UX but not complete failure.

---

### Pitfall 7: Assessment State Lost on Hard Refresh If `persist` Is Not Validated

**What goes wrong:**
`useAssessmentStore` persists the entire wizard state to localStorage under `assessment-storage`. If the store schema changes between versions (e.g., adding a new field to `insurance` or renaming `state` → `stateOfResidence`), Zustand's `persist` middleware will merge old localStorage data with new defaults — silently keeping stale keys and ignoring new ones. Users who started an assessment before a deployment will have corrupted state.

**Why it happens:**
Zustand `persist` uses a shallow merge by default. Old data in localStorage has different shape than the new store definition. No version check is performed unless explicitly configured.

**Consequences:**
- User's wizard data appears partially filled with incorrect values
- New required fields are `undefined` despite having defaults in the store
- Hard to debug — only affects users with existing localStorage data

**Warning signs:**
- QA shows "it works for new users but not returning users"
- Fields that should have defaults show as empty or undefined

**Prevention:**
Use Zustand's `version` and `migrate` options in persist:

```typescript
persist(
  (set) => ({ ...initialState }),
  {
    name: 'assessment-storage',
    version: 1, // increment this on breaking schema changes
    migrate: (persistedState: unknown, fromVersion: number) => {
      if (fromVersion === 0) {
        // handle migration from v0 → v1
      }
      return persistedState;
    },
  }
)
```

**Phase:** Shared infrastructure. Revisit whenever assessment store schema changes.

---

### Pitfall 8: react-router Navigation APIs Don't Exist in Next.js

**What goes wrong:**
The source app uses `useNavigate`, `useLocation`, `useParams`, and `<Navigate>` from `react-router-dom`. None of these exist in Next.js. A mechanical find-and-replace migration that misses one of these calls will cause a runtime error the first time that code path is executed.

**Why it happens:**
Direct imports from `react-router-dom` will resolve only if the package is installed. If it is not installed (correct for Next.js), TypeScript/ESLint will catch it at compile time. But if it was accidentally left in `package.json` from a copy-paste, it silently compiles and then fails at runtime with "cannot find module."

**Replacement map:**

| react-router | Next.js equivalent |
|---|---|
| `useNavigate()` → `navigate('/path')` | `useRouter()` from `next/navigation` → `router.push('/path')` |
| `useLocation().pathname` | `usePathname()` from `next/navigation` |
| `useParams()` | `useParams()` from `next/navigation` (different API) |
| `<Navigate to="/path" />` | `redirect('/path')` (Server) or `router.replace('/path')` (Client) |
| `<Link to="/path">` | `<Link href="/path">` from `next/link` |

**Warning signs:**
- `Module not found: Can't resolve 'react-router-dom'`
- Navigation works in some places but not others (mixed imports)

**Prevention:**
Do not install `react-router-dom` in the Next.js project. Its absence forces TypeScript to catch every missed import. Use the replacement map above as a migration checklist per file.

**Phase:** Every assessment step and dashboard file that uses navigation. Apply during each step's migration.

---

### Pitfall 9: React Query Double-Fetches Because `staleTime` Defaults to 0

**What goes wrong:**
React Query's default `staleTime` is 0ms. In Next.js with SSR, if a query is fetched during the server render, it is considered immediately stale on the client. React Query refetches it on mount. For the assessment wizard (which hits the backend for each step's saved data) this means every page load makes two requests: one on the server and one immediately on the client.

**Why it happens:**
Since all assessment and dashboard components are `"use client"` with no server prefetching, this specific double-fetch pattern is less likely. However, React Query's `refetchOnWindowFocus: true` default (separate from staleTime) will trigger a refetch whenever the user tabs back — which creates confusing UX during multi-tab assessment sessions.

**Consequences:**
- Extra backend requests on every window focus event
- If a user opens the assessment in two tabs and modifies data in one, the other tab refetches and overwrites local Zustand state
- Network waterfall visible in DevTools

**Prevention:**
Set sensible defaults in the `QueryClient` constructor:

```typescript
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false, // financial forms don't need this
    },
  },
})
```

**Phase:** Shared infrastructure (QueryClient configuration).

---

### Pitfall 10: Multi-Step Wizard State Resets on Full Route Navigation

**What goes wrong:**
If the 6-step wizard is implemented as separate `/assessment/step-1`, `/assessment/step-2` ... routes (instead of a single route with in-page step state), each navigation triggers a full page load. Any component-level state (`useState`) is lost. The only survivor is Zustand's persisted store. This works, but if any step stores temporary UI state (e.g., an unsaved form field) in `useState` while waiting for the user to click "Next," that state is lost on browser back/forward.

**Why it happens:**
React app used a single-page render with conditional rendering per step — no URL changes. Next.js encourages URL-per-route for shareability and back-button support, but this changes the state model.

**Consequences:**
- Users lose unsaved field input when pressing browser back
- UX regression compared to the original SPA

**Prevention:**
Keep the wizard on a single route `/assessment` with `currentStep` managed by Zustand (already the pattern in `useAssessmentStore`). Do not create separate routes per step. In-page navigation avoids full remounts. The URL stays `/assessment` throughout, consistent with the SPA behavior.

**Phase:** Assessment Step 1 (establish the routing pattern before building steps 2-6).

---

### Pitfall 11: Middleware Does Not Protect Enough (or Protects Too Much)

**What goes wrong:**
The existing middleware only checks for the presence of the `session` cookie. It does not validate the JWT signature or expiry. An expired but syntactically valid cookie passes the middleware check, and the user gets into the dashboard — where the API calls then fail with 401.

The opposite problem: the middleware `matcher` pattern `/dashboard/:path*` does not cover `/assessment/:path*`. As assessment routes are added, they are unprotected unless the matcher is updated.

**Why it happens:**
The middleware was implemented minimally for the existing landing page + blog. Assessment and dashboard are new surfaces with different protection needs.

**Consequences:**
- Expired session users reach the dashboard, see errors instead of a graceful redirect to login
- Assessment data is accessible without authentication if matcher is not updated

**Warning signs:**
- Backend returns 401 but user is on the dashboard (cookie present but expired)
- Assessment routes accessible without login

**Prevention:**
Update middleware in two ways:
1. Add JWT expiry check (already done in `getSession()` in `src/lib/auth.ts` — replicate that logic in middleware using edge-compatible code)
2. Add `/assessment/:path*` to the matcher alongside `/dashboard/:path*`

Keep middleware as the first line of defense (UX gate) and re-verify auth in each protected Server Component or API route (defense in depth, per CVE-2025-29927 guidance).

**Phase:** Shared infrastructure, before Assessment Step 1 is deployed.

---

## Minor Pitfalls

---

### Pitfall 12: Async Client Components

**What goes wrong:**
Only Server Components can be `async` in Next.js. A common copy-paste mistake during porting is adding `async` to a component that has `"use client"` at the top, often because the original React component used `async/await` inside `useEffect`. This causes a runtime error.

**Prevention:**
Never write `export default async function MyClientComponent()`. Use `useEffect` with async IIFE or React Query for async operations inside Client Components.

**Phase:** All migration phases. Enforce in code review.

---

### Pitfall 13: `redirect()` Inside try/catch Silently Fails

**What goes wrong:**
Next.js's `redirect()` function from `next/navigation` works by throwing a special error internally. If called inside a `try/catch` block, the catch block swallows the throw and the redirect never happens. The component continues rendering with no error message.

**Prevention:**
Call `redirect()` outside of try/catch blocks:

```typescript
// Wrong
try {
  const result = await fetch('/api/...');
  redirect('/dashboard');
} catch (e) {
  // redirect() throw is swallowed here
}

// Correct
const result = await fetch('/api/...');
if (!result.ok) handleError(result);
redirect('/dashboard');
```

**Phase:** Any Server Action or Route Handler that uses `redirect()`. Particularly relevant for post-login redirect.

---

### Pitfall 14: Missing `key` on Dynamically Rendered Steps Causes State Bleed

**What goes wrong:**
If the wizard renders all six steps conditionally with `{currentStep === N && <StepN />}` without a React `key` on each step, React may reuse the component instance when transitioning between steps. Form state from Step 1 can bleed into Step 2's DOM nodes.

**Prevention:**
Add an explicit `key` tied to the step number:

```tsx
{currentStep === 1 && <Step1PersonalProfile key="step-1" />}
{currentStep === 2 && <Step2IncomeExpenses key="step-2" />}
```

This forces React to fully unmount and remount the component on step change, guaranteeing clean state.

**Phase:** Assessment Step 1 (when the step-switching pattern is first established).

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|---|---|---|
| Shared infrastructure (stores, providers) | Pitfalls 1, 2, 5, 7 — hydration, dual auth, QueryClient placement, schema migration | Set up persist guard, eliminate Zustand auth, create Providers.tsx with useState |
| Assessment Step 1 (first step port) | Pitfalls 3, 8, 10, 14 — missing use client, react-router calls, routing model, key prop | Establish routing pattern and component conventions before steps 2-6 |
| Assessment Steps 2-6 | Pitfalls 3, 7, 8 — same as step 1, recurring per file | Apply checklist per step file |
| Dashboard (projection charts) | Pitfall 4 — Recharts SSR crash | Wrap all Recharts components with `dynamic({ ssr: false })` |
| Dashboard (data fetching) | Pitfall 9 — double fetch, refetchOnWindowFocus | Configure QueryClient defaults in infrastructure phase |
| Auth / middleware | Pitfalls 2, 11 — dual auth, insufficient middleware | Consolidate to cookie auth, update matcher, add expiry check |
| Any page with URL params | Pitfall 6 — useSearchParams Suspense boundary | Prefer Zustand step state over URL params; wrap any useSearchParams in Suspense |
| Any Server Action | Pitfall 13 — redirect inside try/catch | Code review checklist item |

---

## Sources

- [Common mistakes with the Next.js App Router — Vercel](https://vercel.com/blog/common-mistakes-with-the-next-js-app-router-and-how-to-fix-them) — HIGH confidence, official Vercel engineering post
- [Missing Suspense boundary with useSearchParams — Next.js docs](https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout) — HIGH confidence, official docs
- [Zustand persist + SSR hydration discussion — pmndrs/zustand #1382](https://github.com/pmndrs/zustand/discussions/1382) — HIGH confidence, maintainer-confirmed
- [Zustand server request leakage — pmndrs/zustand #2326](https://github.com/pmndrs/zustand/discussions/2326) — HIGH confidence, maintainer-confirmed
- [Advanced Server Rendering — TanStack Query docs](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr) — HIGH confidence, official docs
- [Next.js useRouter migration cheatsheet](https://osamaqarem.com/blog/userouter-from-the-pages-router-to-the-app-router) — MEDIUM confidence, verified against official docs
- [Recharts window is not defined fix — FlowQL](https://www.flowql.com/en/blog/guides/nextjs-window-is-not-defined-fix/) — MEDIUM confidence, matches official dynamic import pattern
- [CVE-2025-29927 middleware auth bypass — ProjectDiscovery](https://projectdiscovery.io/blog/nextjs-middleware-authorization-bypass) — HIGH confidence, CVE-verified, patched in Next.js 15.2.2+
