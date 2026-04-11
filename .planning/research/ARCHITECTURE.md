# Architecture Patterns

**Domain:** React SPA → Next.js 15 App Router migration (personal finance wizard + analytics dashboard)
**Researched:** 2026-04-11
**Confidence:** HIGH — based on direct inspection of both source and target codebases

---

## Recommended Architecture

### Mental Model

The migration collapses a React SPA (client-side routing, localStorage auth, React Query over direct API calls) into a Next.js App Router project that already has cookies-based session auth and an API proxy pattern. The key insight: everything in the assessment and dashboard is `"use client"` — no RSC data fetching here. The server layer's only jobs are session validation (middleware/layout) and API proxying.

```
Browser
  └── Next.js Server (Amplify)
        ├── Server Components  ── layout guards, page shells (thin)
        ├── Client Components  ── all wizard steps, all dashboard tabs (heavy)
        └── Route Handlers     ── /api/auth/*, /api/proxy/[...path] → Spring Boot EC2
                                      ↑
                                 Session cookie (httpOnly JWT)
                                 passes Authorization: Bearer to backend
```

---

## Component Boundaries

### Layer 1 — App Router File Structure

```
src/app/
  layout.tsx                         ← root layout (Toaster, QueryClientProvider, GoogleOAuthProvider)
  page.tsx                           ← landing page (existing, untouched)
  blog/                              ← blog (existing, untouched)
  dashboard/
    layout.tsx                       ← SERVER: reads session cookie → redirects if unauthenticated
    page.tsx                         ← SERVER: reads user_profile cookie → passes user prop to client shell
    _components/
      DashboardShell.tsx             ← CLIENT: sidebar + tab bar + tab switcher (port of DashboardPage.jsx)
      FinancialDashboard.tsx         ← CLIENT: summary tab (port of FinancialDashboard.jsx)
      ActionPlanTab.tsx              ← CLIENT (port)
      InsuranceTab.tsx               ← CLIENT (port)
      TaxPlanningTab.tsx             ← CLIENT (port)
      ScoreRing.tsx                  ← CLIENT: animated SVG ring (extracted sub-component)
      ProjectionChart.tsx            ← CLIENT: recharts area chart (port)
      BenchmarkComparison.tsx        ← CLIENT (port)
      FinancialTimeMachine.tsx       ← CLIENT: year-slider scenario (port)
      PillarInterpretationCard.tsx   ← CLIENT (port)
      UpgradeModal.tsx               ← CLIENT (port)
  assessment/
    layout.tsx                       ← SERVER: same session guard as dashboard layout
    step-1/
      page.tsx                       ← SERVER shell (no data, just renders client component)
      _components/
        Step1PersonalRisk.tsx        ← CLIENT: full step form (port of Step1PersonalRisk.jsx)
    step-2/
      page.tsx
      _components/
        Step2IncomeExpenses.tsx      ← CLIENT (~595 lines → split into sub-components below)
        IncomeSection.tsx
        ExpenseSection.tsx
    step-3/
      page.tsx
      _components/
        Step3AssetsLiabilities.tsx   ← CLIENT (~878 lines → split)
        AssetSection.tsx
        LiabilitySection.tsx
        NetWorthSummary.tsx
    step-4/
      page.tsx
      _components/
        Step4FinancialGoals.tsx      ← CLIENT (~946 lines → split)
        GoalCard.tsx
        GoalForm.tsx
        ProjectionPreview.tsx
    step-5/
      page.tsx
      _components/
        Step5InsuranceGap.tsx        ← CLIENT (port)
    step-6/
      page.tsx
      _components/
        Step6TaxOptimization.tsx     ← CLIENT (port)
    complete/
      page.tsx
      _components/
        AssessmentComplete.tsx       ← CLIENT: celebration screen (port)
  api/
    auth/                            ← existing (google, logout, me)
    proxy/
      [...path]/
        route.ts                     ← NEW: generic proxy → Spring Boot with Bearer token injection
  admin/                             ← existing Next.js admin (untouched)

src/lib/
  auth.ts                            ← existing: getSession() reads httpOnly session cookie
  api-client.ts                      ← NEW: replaces services/api.js — calls /api/proxy/* instead of direct EC2
  dynamodb.ts                        ← existing (blog only)
  types.ts                           ← existing + NEW assessment/dashboard types

src/stores/
  useAuthStore.ts                    ← PORT: Zustand persist store (user, token, loginAt)
  useAssessmentStore.ts              ← PORT: Zustand persist store (all 6 steps + currentStep + isComplete)

src/providers/
  AppProviders.tsx                   ← CLIENT: QueryClientProvider + GoogleOAuthProvider + Toaster
                                       (mounted in root layout.tsx)

src/hooks/
  assessment/
    useProfile.ts                    ← PORT: React Query hooks for step 1
    useFinancials.ts                 ← PORT: step 2
    useBalanceSheet.ts               ← PORT: step 3
    useGoals.ts                      ← PORT: step 4
    useInsuranceGap.ts               ← PORT: step 5
    useTaxCalculation.ts             ← PORT: step 6
  dashboard/
    useDashboardSummary.ts           ← PORT: central query (GET /dashboard/summary)
    useFinancialHealthScore.ts       ← PORT: slice of summary
    useRedFlags.ts                   ← PORT: slice
    useActionPlan.ts                 ← PORT
    useInsuranceAnalysis.ts          ← PORT
    useTaxAnalysis.ts                ← PORT
    useProjection.ts                 ← PORT
    useTimeMachine.ts                ← PORT

src/components/
  ai/
    AiChatWidget.tsx                 ← PORT: floating chat (CLIENT)
  ui/
    AssessmentSkeleton.tsx           ← PORT
    DashboardSkeleton.tsx            ← PORT
```

### Layer 2 — Component Responsibility Table

| Component | Type | Responsibility | Communicates With |
|-----------|------|----------------|-------------------|
| `app/layout.tsx` | Server | Mount AppProviders, global font/meta | AppProviders |
| `AppProviders.tsx` | Client | QueryClientProvider, GoogleOAuthProvider, Toaster | All client subtree |
| `dashboard/layout.tsx` | Server | Auth guard via `getSession()`, redirect if no cookie | `src/lib/auth.ts` |
| `dashboard/page.tsx` | Server | Read `user_profile` cookie → pass user to DashboardShell | DashboardShell |
| `DashboardShell.tsx` | Client | Tab state, sidebar nav, UpgradeModal, premium gating | All dashboard tab components |
| `FinancialDashboard.tsx` | Client | Summary tab: score ring, red flags, projections, benchmarks | useDashboardSummary, useRedFlags, useProjection |
| `assessment/layout.tsx` | Server | Same auth guard | `src/lib/auth.ts` |
| `assessment/step-N/page.tsx` | Server | Thin shell — renders CLIENT step component | Step N client component |
| `StepNXxx.tsx` | Client | Form UI + hydrate Zustand from API on mount + save on Next | useAssessmentStore, step-specific React Query hooks, api-client |
| `useAssessmentStore.ts` | Client store | Wizard state across all 6 steps, persisted to localStorage | All step components |
| `useAuthStore.ts` | Client store | user, JWT token, loginAt — persisted to localStorage | api-client (token extraction) |
| `api-client.ts` | Utility | Fetch wrapper → `/api/proxy/*`, injects Bearer from useAuthStore | All React Query hooks |
| `api/proxy/[...path]/route.ts` | Route Handler | Forward requests to Spring Boot, inject Bearer token from session cookie | Spring Boot EC2 |
| `AiChatWidget.tsx` | Client | Floating chat UI — shown on all protected routes except /admin | AWS Bedrock via backend |

---

## Data Flow

### Authentication Flow (already implemented)

```
User clicks "Sign in with Google"
  → GoogleOAuthProvider triggers auth-code flow
  → POST /api/auth/google { code }
  → Next.js route handler exchanges code → id_token with Google
  → Forwards id_token to Spring Boot POST /api/v1/auth/google
  → Spring Boot returns { token: JWT, user: { id, email, name, pictureUrl } }
  → Next.js sets httpOnly "session" cookie (JWT) + readable "user_profile" cookie
  → Client receives { user } — no token ever touches browser JS
```

### API Proxy Flow (to be built)

```
Client component (e.g., useProfileQuery)
  → calls api-client.get('/assessment/step/1/userId')
  → api-client calls fetch('/api/proxy/assessment/step/1/userId')
  → Next.js /api/proxy/[...path]/route.ts reads "session" httpOnly cookie
  → Adds Authorization: Bearer <JWT> header
  → Forwards to https://api-preprod.myfinancial.in/api/v1/assessment/step/1/userId
  → Returns response JSON to client
```

WHY proxy instead of direct fetch from client: The JWT lives in an httpOnly cookie inaccessible to browser JS. The proxy extracts it server-side and forwards it. This replaces the React SPA's pattern of reading token from localStorage.

The current `useAuthStore` in the React SPA reads token from `auth-storage` localStorage key. In the Next.js version, **the token never lives in localStorage** — the proxy handles injection. `useAuthStore` becomes a lightweight client store holding only the user profile (for display), not the token.

### Assessment Wizard Data Flow

```
User lands on /assessment/step-1
  layout.tsx (Server)  →  getSession() → if no cookie: redirect('/')
  page.tsx (Server)    →  renders <Step1PersonalRisk /> (client component)

Step1PersonalRisk mounts:
  1. useProfileQuery fires → api-client.get('/assessment/step/1/{userId}')
  2. On success: hydrate useAssessmentStore with server values
  3. User edits form → writes to useAssessmentStore (local state)
  4. User clicks Next → useProfileMutation.mutateAsync(formData) → POST to backend
  5. On success: router.push('/assessment/step-2')

useAssessmentStore persists to localStorage (zustand/persist):
  - Survives page refresh within session
  - currentStep field drives progress indicator
  - isComplete flag drives post-wizard redirect
```

### Dashboard Data Flow

```
User lands on /dashboard
  layout.tsx (Server) → getSession() → redirect if unauthenticated
  page.tsx (Server)   → reads user_profile cookie → passes user prop to DashboardShell

DashboardShell mounts (CLIENT):
  - Reads isPremium from localStorage (temporary — will move to session later)
  - Renders sidebar + active tab content

FinancialDashboard (summary tab) mounts:
  - useDashboardSummary fires → GET /api/v1/dashboard/summary
    (single call — all 10 child hooks consume slices of this response)
  - useFinancialHealthScore(summary) → score + pillar breakdown
  - useRedFlags(summary) → critical/warn/info items
  - useProjection(summary) → recharts dataset
  - All render with skeleton loaders while loading

ProjectionChart renders:
  - Receives dataset from useProjection
  - Uses recharts AreaChart (CLIENT only — no SSR)
  - recharts must be imported inside "use client" components only
```

---

## Patterns to Follow

### Pattern 1: Thin Server Page Shell

Every `/assessment/step-N/page.tsx` and `/dashboard/page.tsx` is a minimal Server Component. It does at most: read cookies for initial user data, then hand off to a Client Component.

```typescript
// app/assessment/step-1/page.tsx
import Step1PersonalRisk from './_components/Step1PersonalRisk';

export default function Step1Page() {
    return <Step1PersonalRisk />;
}
```

Never put useState, useEffect, Zustand, or React Query inside page.tsx files. Those belong in `_components/`.

### Pattern 2: Collocated Client Components with `_components/`

Use the `_components/` underscore convention to colocate client components with their page without exposing them as routes. This keeps the route tree clean while grouping related files.

### Pattern 3: All Step Components Are "use client" at the Top

Every assessment step and dashboard tab starts with `"use client"`. No exceptions. These components use useState, useEffect, Zustand stores, React Query hooks, and browser APIs.

### Pattern 4: Zustand Store Split

The React SPA has one `useAuthStore` + one `useAssessmentStore`. Port both, but change `useAuthStore`:

- `useAuthStore` in Next.js: holds `user` object only (no token, no loginAt). Token lives in httpOnly cookie.
- `useAssessmentStore`: port exactly as-is — all 6 steps + currentStep + isComplete + zustand/persist.

### Pattern 5: React Query Provider at Root

Mount `QueryClientProvider` in `AppProviders.tsx` (a Client Component), which is rendered inside `app/layout.tsx`. This makes React Query available to all client subtrees without wrapping individual pages.

```typescript
// src/providers/AppProviders.tsx
"use client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
            <QueryClientProvider client={queryClient}>
                {children}
                <Toaster ... />
            </QueryClientProvider>
        </GoogleOAuthProvider>
    );
}
```

### Pattern 6: Recharts Only Inside "use client"

Recharts uses browser APIs and will crash during SSR. Always import recharts components inside files that have `"use client"` at the top. Never import recharts in Server Components or `page.tsx` files.

### Pattern 7: Navigation Replacement

Replace `useNavigate()` from react-router with `useRouter()` from `next/navigation`. Replace `<Link to="...">` with `<Link href="...">` from `next/link`. These are direct 1:1 replacements.

### Pattern 8: AI Chat Widget Conditional Rendering

The React SPA renders `<ConditionalChatWidget />` which checks `useLocation()` to hide on `/admin` and `/login`. In Next.js, mount `<AiChatWidget />` inside the shared protected layout (the layout wrapping `/dashboard` and `/assessment`), not the root layout. This naturally excludes landing page, blog, admin, and unauthenticated routes.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Importing Stores in Server Components

**What goes wrong:** Zustand stores use `useState` and `localStorage` internally. Importing them in a Server Component crashes with "useState is not a function" or hydration errors.

**Instead:** Pass user data as props from server to client. Only access stores inside `"use client"` components.

### Anti-Pattern 2: Monolithic Step Files

The React SPA has Step3 (878 lines), Step4 (946 lines) as single files. Porting them as single files creates unmaintainable components.

**Instead:** Each step gets a `_components/` folder with the main orchestrating component + sub-components per logical section (e.g., `AssetSection.tsx`, `LiabilitySection.tsx`, `NetWorthSummary.tsx`).

### Anti-Pattern 3: Direct EC2 Calls from the Browser

**What goes wrong:** The React SPA calls `/api/v1/*` via a Vite proxy config. In production, the browser would need to call the EC2 directly — exposing it and requiring CORS configuration.

**Instead:** All API calls go through `/api/proxy/[...path]` Next.js Route Handlers, which add the auth header server-side and forward to Spring Boot.

### Anti-Pattern 4: Token in localStorage

**What goes wrong:** The React SPA stores JWT in `auth-storage` localStorage. Browser storage is XSS-accessible.

**Instead:** Token lives only in the httpOnly session cookie. The proxy Route Handler reads it. Client components never see the raw token.

### Anti-Pattern 5: queryClient Created Inside a Component

**What goes wrong:** If `new QueryClient()` is called inside a component body, a new instance is created on every render, destroying the cache.

**Instead:** Create `queryClient` once, outside the component (module level), inside `AppProviders.tsx`.

---

## Scalability Considerations

| Concern | Current (~100 users) | Later (~10K users) |
|---------|---------------------|-------------------|
| Dashboard data | Single GET /dashboard/summary, 5-min staleTime | Same — backend handles load |
| Assessment state | Zustand localStorage persist | Same — wizard state is client-local |
| Auth | httpOnly cookie + session | Add refresh token rotation |
| Premium gating | localStorage flag | Move to session cookie / server-side user record |
| AI Chat | AWS Bedrock via backend | Already server-side, scales with Bedrock capacity |

---

## Build Order for Phases

Based on the component dependency graph:

**Phase 1 — Shared Infrastructure (prerequisite for everything)**
Build first: `AppProviders`, `api-client`, `/api/proxy/[...path]`, `useAuthStore` (slimmed), `useAssessmentStore`. Without this, no step component can fetch data or navigate.

**Phase 2 — Assessment Steps 1-3 (core wizard entry)**
Steps 1-3 are the critical path to completing the wizard. Step 1 (profile) is simplest and validates the whole stack end-to-end. Step 3 (878 lines) needs the most decomposition work.

**Phase 3 — Assessment Steps 4-6 + Complete Screen**
Steps 4-6 have more complex local computations (goal projections, insurance HLV, tax regime comparison) but depend on the same patterns established in Phase 2.

**Phase 4 — Dashboard (depends on wizard completion)**
`DashboardShell` + all tabs. `useDashboardSummary` is the single dependency for all 10 child hooks — build that query first, then layer in each tab.

**Phase 5 — AI Chat Widget**
`AiChatWidget` is self-contained. Can be deferred until wizard + dashboard are stable. Mount it in the shared protected layout.

---

## Sources

- Direct inspection of `/home/t0266li/Documents/myFinance/src/` (React SPA source)
- Direct inspection of `/home/t0266li/Documents/myFinance-web/src/` (Next.js target)
- Next.js 15 App Router conventions (HIGH confidence — current project already uses them)
- Zustand v5 persist middleware (HIGH confidence — already used in source codebase)
- React Query v5 (TanStack Query) patterns (HIGH confidence — already used in source codebase)
