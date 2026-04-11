# Phase 1: Shared Infrastructure - Research

**Researched:** 2026-04-11
**Domain:** Next.js 15 App Router — providers, API proxy, Zustand, React Query, shared UI
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- API proxy catch-all route at `/api/proxy/[...path]/route.ts`
- JWT in httpOnly cookie named "session" — extract server-side, forward as Bearer header
- Zustand assessment store needs `_hasHydrated` guard to prevent SSR hydration mismatch
- Do NOT port `useAuthStore` — cookie-based auth already exists
- User profile is in `user_profile` cookie (readable, not httpOnly)
- Middleware must extend matcher to include `/assessment/:path*`
- React Query provider wraps protected routes only (no SSR prefetching needed)
- Recharts components need `next/dynamic({ ssr: false })` — but that is Phase 4
- Use inline styles matching project convention (no CSS modules)
- Dark theme: backgrounds `#0B0F1A`/`#0F172A`, text `#F1F5F9`/`#CBD5E1`, accent `#10B981`

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| INFRA-01 | API proxy route handler forwards requests to Spring Boot with JWT from httpOnly cookie | Catch-all route pattern, `cookies()` from next/headers, Bearer header injection |
| INFRA-02 | Assessment Zustand store persists wizard state to localStorage with SSR hydration guard | `persist` middleware + `_hasHydrated` + `onFinishHydration` callback pattern |
| INFRA-03 | React Query provider wraps protected routes with appropriate staleTime | `QueryClientProvider` in client component inside protected layout |
| INFRA-04 | Middleware protects `/assessment` and `/dashboard` routes | Extend existing `matcher` array; session cookie check already in place |
| INFRA-05 | API client utility handles auth headers, error responses, and 401 redirects | Thin `apiFetch` wrapper targeting `/api/proxy/...`; 401 → `router.replace('/')` |
| INFRA-06 | Shared layout for assessment (step sidebar + progress) and dashboard (tab sidebar) | `src/app/assessment/layout.tsx` as client component; port Layout.jsx → TSX with `usePathname` |
| UI-01 | Loading skeletons for assessment and dashboard pages | Port AssessmentSkeleton.jsx → TSX; convert Tailwind animate-pulse to inline keyframe |
| UI-02 | Session inactivity guard (auto-logout after 15 min) | Port InactivityGuard.jsx → TSX; swap `useNavigate` → `useRouter`; remove `useAuthStore` dependency |
| UI-03 | Toast notifications for save/error feedback | Install `react-hot-toast` 2.6.0; wrap via `<Toaster>` in assessment layout |
| UI-04 | Currency (INR), percentage, and date formatters | Port formatters.js + enums.js → `src/lib/formatters.ts` + `src/lib/enums.ts` |
</phase_requirements>

---

## Summary

Phase 1 installs and wires four new libraries (zustand, @tanstack/react-query, react-hot-toast, and no new ones for formatters/enums), creates the API proxy route, extends middleware, and ports five utility/UI files from the React source. Every piece is purely client-side plumbing: no SSR data-fetching, no new pages, no business logic. The work lays the foundation that every subsequent phase (assessment steps, dashboard) depends on.

The most nuanced pieces are (1) the Zustand hydration guard — without it, server-rendered HTML will not match client HTML and React will throw a hydration error in production, and (2) the proxy route's cookie extraction — `cookies()` is an async API in Next.js 15 and must be awaited. Everything else is a mechanical port from JSX to TSX with a few Next.js-specific substitutions (`useNavigate` → `useRouter`, `useLocation` → `usePathname`, `Outlet` → `{children}`).

**Primary recommendation:** Wire providers in `src/app/(protected)/layout.tsx` (a new route group), not the root layout, so the landing page and blog are never wrapped in assessment-specific state.

---

## Standard Stack

### Core (to install)
| Library | Version | Purpose | Source |
|---------|---------|---------|--------|
| `zustand` | 5.0.12 | Assessment wizard state, persisted to localStorage | [VERIFIED: npm registry] |
| `@tanstack/react-query` | 5.97.0 | Server state caching for assessment/dashboard API calls | [VERIFIED: npm registry] |
| `react-hot-toast` | 2.6.0 | Toast notifications for save/error feedback | [VERIFIED: npm registry] |

### Already in project (no install needed)
| Library | Version | Purpose |
|---------|---------|---------|
| `next` | 15.2.0 | App Router, catch-all route handlers, middleware |
| `lucide-react` | 0.475.0 | Icons (already used in Layout.jsx steps sidebar) |

### Not porting
| Library | Reason |
|---------|--------|
| `useAuthStore` (zustand) | Cookie-based auth already exists in Next.js project |
| `dexie` | Not used in assessment or dashboard flow |
| `react-router-dom` | Replaced by Next.js `useRouter` / `usePathname` / `Link` |
| `ThemeToggle` | Dark-only project; theme toggle is out of scope |

**Installation:**
```bash
npm install zustand@^5.0.12 @tanstack/react-query@^5.97.0 react-hot-toast@^2.6.0
```

---

## Architecture Patterns

### Recommended Project Structure for Phase 1

```
src/
├── app/
│   ├── (protected)/              # Route group — auth-guarded shell
│   │   ├── layout.tsx            # Server: auth check + QueryClientProvider + Toaster
│   │   ├── assessment/
│   │   │   ├── layout.tsx        # Client: step sidebar, progress bar, InactivityGuard
│   │   │   └── [step]/page.tsx   # (Phase 2+)
│   │   └── dashboard/
│   │       └── layout.tsx        # Client: tab sidebar (Phase 4)
│   ├── api/
│   │   └── proxy/
│   │       └── [...path]/
│   │           └── route.ts      # INFRA-01: catch-all proxy
│   └── layout.tsx                # Root layout — AuthProvider only, no Query/Zustand
├── lib/
│   ├── auth.ts                   # existing — getSession()
│   ├── api-client.ts             # INFRA-05: apiFetch wrapper
│   ├── formatters.ts             # UI-04: port of formatters.js
│   ├── enums.ts                  # UI-04: port of enums.js
│   └── query-client.ts           # singleton QueryClient factory
├── store/
│   └── useAssessmentStore.ts     # INFRA-02: port of useAssessmentStore.js
└── components/
    ├── providers/
    │   └── QueryProvider.tsx      # INFRA-03: QueryClientProvider wrapper
    ├── auth/
    │   └── InactivityGuard.tsx   # UI-02: port of InactivityGuard.jsx
    └── ui/
        └── AssessmentSkeleton.tsx # UI-01: port of AssessmentSkeleton.jsx
```

### Pattern 1: Catch-All API Proxy Route (INFRA-01)

**What:** A single Next.js route handler at `/api/proxy/[...path]` that reconstructs the target URL from path segments, extracts the JWT from the `session` httpOnly cookie, and forwards the request to the Spring Boot backend.

**Why this shape:** The React app calls `api.get('/assessment/step/1/{userId}')` against `/api/v1`. In Next.js we intercept at `/api/proxy/assessment/step/1/{userId}` and append that to `BACKEND_URL + /api/v1/`. One route covers all 20+ backend endpoints.

**Key Next.js 15 detail:** `cookies()` from `next/headers` is async and must be awaited. `params` in App Router route handlers is also a Promise in Next.js 15 and must be awaited. [VERIFIED: existing codebase — `src/app/api/auth/google/route.ts` uses `await cookies()`]

```typescript
// src/app/api/proxy/[...path]/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

async function proxyRequest(req: NextRequest, params: Promise<{ path: string[] }>) {
    const { path } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const targetPath = path.join("/");
    const search = req.nextUrl.search;
    const targetUrl = `${BACKEND_URL}/api/v1/${targetPath}${search}`;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    const body = req.method !== "GET" && req.method !== "HEAD"
        ? await req.text()
        : undefined;

    const res = await fetch(targetUrl, {
        method: req.method,
        headers,
        body,
    });

    const text = await res.text();
    return new NextResponse(text || null, {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    });
}

export const GET = (req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) =>
    proxyRequest(req, params);
export const POST = (req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) =>
    proxyRequest(req, params);
export const PUT = (req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) =>
    proxyRequest(req, params);
export const DELETE = (req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) =>
    proxyRequest(req, params);
```

[ASSUMED: `params` being a Promise in Next.js 15 — this is the pattern used across the codebase where dynamic segments exist. Should be confirmed by testing.]

### Pattern 2: Zustand Store with Hydration Guard (INFRA-02)

**What:** The assessment store uses `persist` middleware to write to localStorage. On the server, localStorage does not exist — Zustand's persist hydrates asynchronously on mount. Without a guard, the component renders twice: once with server defaults, once with localStorage values. This produces a React hydration mismatch error.

**Fix:** Track hydration state with `_hasHydrated` + `onFinishHydration` in `onRehydrateStorage`. Render a skeleton (or null) until `_hasHydrated` is true. [VERIFIED: codebase SUMMARY.md and CONTEXT.md both document this as a critical pitfall]

```typescript
// src/store/useAssessmentStore.ts
"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AssessmentState {
    // Hydration guard
    _hasHydrated: boolean;
    setHasHydrated: (val: boolean) => void;

    // Step 1: Personal Risk Profile
    age: number;
    setAge: (age: number) => void;
    state: string;
    setState: (state: string) => void;
    city: string;
    setCity: (city: string) => void;
    maritalStatus: string;
    setMaritalStatus: (v: string) => void;
    dependents: number;
    setDependents: (v: number) => void;
    childDependents: number;
    setChildDependents: (v: number) => void;
    employmentType: string;
    setEmploymentType: (v: string) => void;
    residencyStatus: string;
    setResidencyStatus: (v: string) => void;
    riskAnswers: Record<number, number>;
    setRiskAnswer: (qId: number, score: number) => void;
    riskTolerance: string;
    setRiskTolerance: (v: string) => void;
    toleranceScore: number | null;
    setToleranceScore: (v: number | null) => void;
    capacityScore: number | null;
    setCapacityScore: (v: number | null) => void;
    compositeScore: number | null;
    setCompositeScore: (v: number | null) => void;

    // Step 2: Income & Expenses
    incomes: IncomeItem[];
    addIncome: (v: IncomeItem) => void;
    removeIncome: (id: string) => void;
    updateIncome: (id: string, updates: Partial<IncomeItem>) => void;
    expenses: ExpenseItem[];
    addExpense: (v: ExpenseItem) => void;
    removeExpense: (id: string) => void;
    updateExpense: (id: string, updates: Partial<ExpenseItem>) => void;

    // Step 3: Assets & Liabilities
    assets: AssetItem[];
    addAsset: (v: AssetItem) => void;
    removeAsset: (id: string) => void;
    liabilities: LiabilityItem[];
    addLiability: (v: LiabilityItem) => void;
    removeLiability: (id: string) => void;

    // Step 4: Financial Goals
    goals: GoalItem[];
    addGoal: (v: GoalItem) => void;
    removeGoal: (id: string) => void;
    updateGoal: (id: string, updates: Partial<GoalItem>) => void;

    // Step 5: Insurance
    insurance: InsuranceState;
    updateInsurance: (updates: Partial<InsuranceState>) => void;
    addPersonalHealth: (policy: PolicyItem) => void;
    removePersonalHealth: (id: string) => void;
    addPersonalLife: (policy: PolicyItem) => void;
    removePersonalLife: (id: string) => void;
    toggleChecklist: (key: keyof InsuranceChecklist) => void;

    // Step 6: Tax
    taxRegime: "old" | "new";
    setTaxRegime: (v: "old" | "new") => void;
    investments80C: number;
    setInvestments80C: (amount: number) => void;

    // Navigation
    currentStep: number;
    setCurrentStep: (step: number) => void;
    isComplete: boolean;
    completeAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentState>()(
    persist(
        (set) => ({
            _hasHydrated: false,
            setHasHydrated: (val) => set({ _hasHydrated: val }),

            age: 30,
            setAge: (age) => set({ age }),
            // ... (all other fields follow same pattern as source)

            currentStep: 0,
            setCurrentStep: (step) => set({ currentStep: step }),
            isComplete: false,
            completeAssessment: () => set({ isComplete: true }),
        }),
        {
            name: "assessment-storage",
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
```

**Usage in components:**
```typescript
const _hasHydrated = useAssessmentStore((s) => s._hasHydrated);
if (!_hasHydrated) return <ProfileSkeleton />;
```

### Pattern 3: React Query Provider (INFRA-03)

**What:** `QueryClientProvider` must be in a Client Component because it holds the `QueryClient` instance on the client. The standard Next.js 15 pattern is a small wrapper component.

**Why separate file for QueryClient:** Next.js can re-render layout.tsx on navigation — placing `new QueryClient()` directly in the layout body creates a new client on every render, losing all cache. The singleton pattern (via `useState` or module-level for client components) prevents this. [ASSUMED: based on TanStack Query v5 documentation pattern — standard approach per community]

```typescript
// src/lib/query-client.ts  (module-level singleton)
import { QueryClient } from "@tanstack/react-query";

function makeQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1 minute — assessment/dashboard data
                retry: 1,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient(): QueryClient {
    if (typeof window === "undefined") {
        // Server: always make a new client
        return makeQueryClient();
    }
    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
}
```

```typescript
// src/components/providers/QueryProvider.tsx
"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
```

**Where to mount:** In the `(protected)` group layout, not root layout. Assessment and dashboard use React Query; the landing page and blog do not need it.

```typescript
// src/app/(protected)/layout.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { QueryProvider } from "@/components/providers/QueryProvider";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (!session) {
        redirect("/");
    }
    return <QueryProvider>{children}</QueryProvider>;
}
```

### Pattern 4: Assessment Layout with Step Sidebar (INFRA-06)

**What:** Port Layout.jsx from React (uses `useLocation`, `useNavigate`, `Outlet`) to Next.js (uses `usePathname`, `useRouter`, `{children}`). Must be `"use client"` because it uses hooks and reads path.

**Key substitutions:**
| React (source) | Next.js (target) |
|----------------|-----------------|
| `useLocation().pathname` | `usePathname()` |
| `useNavigate()` / `navigate(path)` | `useRouter()` / `router.push(path)` |
| `navigate(-1)` | `router.back()` |
| `<Outlet />` | `{children}` |
| `useAuthStore((s) => s.user)` | Read `user_profile` cookie via `document.cookie` or pass from parent |

**User data source:** The `user_profile` cookie is not httpOnly — it is readable in the browser via `document.cookie`. Parse it once on mount.

```typescript
// src/app/(protected)/assessment/layout.tsx  (simplified)
"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@/lib/auth";
import { InactivityGuard } from "@/components/auth/InactivityGuard";
import { Toaster } from "react-hot-toast";

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        try {
            const raw = document.cookie
                .split("; ")
                .find((c) => c.startsWith("user_profile="))
                ?.split("=")
                .slice(1)
                .join("=");
            if (raw) setUser(JSON.parse(decodeURIComponent(raw)));
        } catch {
            // cookie absent or malformed — auth guard already redirected
        }
    }, []);

    const getStepInfo = () => {
        if (pathname.includes("step-1")) return { step: 1, progress: 16, title: "Let's Understand Your Starting Point" };
        if (pathname.includes("step-2")) return { step: 2, progress: 33, title: "Your Cash Flow Reality Check" };
        if (pathname.includes("step-3")) return { step: 3, progress: 50, title: "Assets & Liabilities" };
        if (pathname.includes("step-4")) return { step: 4, progress: 66, title: "Financial Goals" };
        if (pathname.includes("step-5")) return { step: 5, progress: 83, title: "Insurance Gap" };
        if (pathname.includes("step-6")) return { step: 6, progress: 96, title: "Tax Planning" };
        if (pathname.includes("complete")) return { step: 7, progress: 100, title: "Complete" };
        return { step: 0, progress: 0, title: "" };
    };

    // ... rest of layout JSX ported from Layout.jsx
    return (
        <InactivityGuard>
            <Toaster position="top-right" />
            {/* header + sidebar + main content */}
            {children}
        </InactivityGuard>
    );
}
```

**Inline styles note:** The source Layout.jsx uses Tailwind classes (`bg-primary/10`, `border-white/5`, etc.). These must be converted to inline styles matching the project convention:

| Tailwind class | Inline equivalent |
|----------------|-------------------|
| `bg-background-dark` | `background: "#0B0F1A"` |
| `bg-primary/10` | `background: "rgba(16, 185, 129, 0.1)"` |
| `border-primary/20` | `borderColor: "rgba(16, 185, 129, 0.2)"` |
| `text-primary` | `color: "#10B981"` |
| `bg-surface-dark` | `background: "#0F172A"` |
| `border-white/5` | `borderColor: "rgba(255,255,255,0.05)"` |
| `text-slate-400` | `color: "#94A3B8"` |
| `text-slate-500` | `color: "#64748B"` |
| `animate-pulse` | CSS keyframe animation (see Skeleton section) |

### Pattern 5: API Client Utility (INFRA-05)

**What:** A thin fetch wrapper that targets `/api/proxy/...`, handles JSON parsing, and redirects on 401. Replaces `api.js` from the React source. No localStorage token extraction needed — the proxy handles auth transparently.

```typescript
// src/lib/api-client.ts
"use client";
import { toast } from "react-hot-toast";

const BASE = "/api/proxy";

async function apiFetch<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${BASE}${endpoint}`;
    const config: RequestInit = {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    };

    const res = await fetch(url, config);

    if (res.status === 401) {
        window.location.href = "/";
        return undefined as T;
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: `Error ${res.status}` }));
        throw new Error(err.message ?? `API error: ${res.status}`);
    }

    const text = await res.text();
    return text ? (JSON.parse(text) as T) : (null as T);
}

export const apiClient = {
    get: <T = unknown>(endpoint: string) =>
        apiFetch<T>(endpoint, { method: "GET" }),
    post: <T = unknown>(endpoint: string, data: unknown) =>
        apiFetch<T>(endpoint, { method: "POST", body: JSON.stringify(data) }),
    put: <T = unknown>(endpoint: string, data: unknown) =>
        apiFetch<T>(endpoint, { method: "PUT", body: JSON.stringify(data) }),
    delete: <T = unknown>(endpoint: string) =>
        apiFetch<T>(endpoint, { method: "DELETE" }),
};
```

**Note:** `"use client"` directive is needed because `window.location` is used on 401. In React Query hooks (which call `apiClient`), this is fine — all query hooks are client-side.

### Pattern 6: InactivityGuard Port (UI-02)

**Key changes from source:**
- Remove `import { useNavigate } from 'react-router-dom'` → `import { useRouter } from 'next/navigation'`
- Remove `import { useAuthStore }` → replace with a sign-out fetch call to `/api/auth/signout` (or clear cookies directly)
- `navigate('/login', { replace: true })` → `router.replace('/')`
- The INACTIVITY_LIMIT_MS in source is 20 minutes; CONTEXT.md says 15 minutes — use 15 minutes (CONTEXT takes precedence)
- Inline all Tailwind class styles

**Sign-out mechanism without useAuthStore:** The existing project handles sign-out by clearing the `session` cookie. Create a simple `signOut()` helper:

```typescript
// inside InactivityGuard.tsx
async function signOut(router: ReturnType<typeof useRouter>) {
    await fetch("/api/auth/signout", { method: "POST" }).catch(() => {});
    router.replace("/");
}
```

[ASSUMED: A `/api/auth/signout` route clears the session cookie. If one does not exist, create it as part of this phase. It should `cookies().delete('session')` and `cookies().delete('user_profile')`.]

### Pattern 7: Skeleton Components (UI-01)

**Source:** `AssessmentSkeleton.jsx` uses Tailwind's `animate-pulse` class and `bg-slate-500/15` on the `Shimmer` component. The target project uses inline styles only.

**Inline shimmer animation pattern:**

```typescript
// src/components/ui/AssessmentSkeleton.tsx
"use client";
import React from "react";

const shimmerStyle: React.CSSProperties = {
    borderRadius: 8,
    background: "rgba(100, 116, 139, 0.15)",
    animation: "shimmer-pulse 1.5s ease-in-out infinite",
};

// Add to a <style> tag in the component or global CSS
const shimmerKeyframes = `
@keyframes shimmer-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
}
`;
```

Place the `<style>` tag once in the skeleton component file using a `<style>` tag within the JSX (matches existing project pattern of component-scoped `<style>` tags).

### Pattern 8: Middleware Extension (INFRA-04)

**Current state:** Middleware only protects `/dashboard/:path*`. Add `/assessment/:path*`.

```typescript
// middleware.ts (updated)
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const session = req.cookies.get("session")?.value;
    if (!session) {
        return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/assessment/:path*"],
};
```

**Note:** The existing `(protected)` layout also does a server-side `getSession()` redirect — this is intentional defense-in-depth. Middleware is faster (edge); layout is more robust (handles expired tokens).

### Anti-Patterns to Avoid

- **`new QueryClient()` in layout body (without `useState`):** Recreates client on every render, destroying all cache. Use the singleton factory pattern above.
- **Reading `user_profile` cookie via `cookies()` in client component:** `cookies()` is server-only. Read via `document.cookie` in `useEffect` on the client.
- **Porting `useAuthStore`:** Cookie-based auth already exists. A second auth store creates conflicting state. The existing `AuthProvider` (GoogleOAuthProvider) + `session` cookie is the source of truth.
- **Wrapping root layout in QueryProvider:** Landing page and blog do not need React Query. Keep it scoped to the `(protected)` route group.
- **Skipping the hydration guard:** Zustand `persist` + localStorage + SSR = hydration mismatch. The `_hasHydrated` pattern is mandatory.
- **Using Tailwind class strings in ported components:** The project convention is inline styles only. Converting Tailwind → inline is required for all ported components.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Server state caching | Custom fetch cache with Map | `@tanstack/react-query` | Background refetch, stale-while-revalidate, deduplication, devtools |
| Wizard state persistence | `localStorage` + `useEffect` manually | `zustand/persist` middleware | Handles JSON serialization, storage events, SSR compat layer |
| Toast notifications | Custom state + portal + animation | `react-hot-toast` | Accessible, stacking, promise API, already in React source |
| Auth proxy | Per-route auth headers in each fetch | Single `/api/proxy/[...path]` route | Keeps JWT off client entirely, single point for auth failures |

---

## Common Pitfalls

### Pitfall 1: Zustand Hydration Mismatch
**What goes wrong:** Component renders with default store values on server, then re-renders with localStorage values on client. React throws hydration error in production (sometimes silent in dev).
**Why it happens:** `persist` middleware reads localStorage asynchronously after mount. Server render and initial client render both see default values, but then a second client render fires with hydrated values — if any component renders differently based on store values, the HTML trees diverge.
**How to avoid:** Always gate rendering on `_hasHydrated`. Render `<Skeleton />` until true. Set `_hasHydrated: true` in `onRehydrateStorage` callback.
**Warning signs:** Console warning "Prop `X` did not match. Server: `A` Client: `B`" in development.

### Pitfall 2: `cookies()` is Async in Next.js 15
**What goes wrong:** `cookies().get("session")` — without await — returns a Promise object, not the cookies store. Token is always `undefined`.
**Why it happens:** Next.js 15 made the `cookies()` API async (breaking change from Next.js 14).
**How to avoid:** Always `const cookieStore = await cookies();` then `cookieStore.get("session")`.
**Warning signs:** Proxy always returns 401 even when user is authenticated.
[VERIFIED: existing `src/app/api/auth/google/route.ts` in codebase uses `await cookies()` pattern]

### Pitfall 3: `params` is a Promise in Next.js 15 Route Handlers
**What goes wrong:** Destructuring `{ params }` synchronously from the route handler context gives a Promise, not the resolved object. `params.path` is `undefined`.
**Why it happens:** Next.js 15 deferred params resolution to enable parallel rendering.
**How to avoid:** `const { path } = await params;` inside the handler.
**Warning signs:** `path.join` throws "path.join is not a function" because `path` is undefined.
[ASSUMED: This is the documented Next.js 15 pattern change — verify by testing the proxy route]

### Pitfall 4: `"use client"` Missing on Store File
**What goes wrong:** Zustand store imported in a Server Component causes a build error.
**Why it happens:** `localStorage` is referenced at module level by the `persist` middleware — this crashes on the server.
**How to avoid:** The store file itself does not need `"use client"` — but every component that imports it must be a Client Component. Mark `src/store/useAssessmentStore.ts` with a comment that it must only be imported from `"use client"` components.

### Pitfall 5: Assessment Layout Conflicts with Root Layout
**What goes wrong:** Assessment pages get the root layout's `Navbar`, `Footer`, and `MobileStickyCTA` in addition to the assessment sidebar and header.
**Why it happens:** Next.js App Router nests layouts — `app/layout.tsx` wraps everything including `app/(protected)/assessment/layout.tsx`.
**How to avoid:** The assessment wizard has its own full-screen layout with its own header. The root layout's `<Navbar>` and `<Footer>` must be conditionally hidden or the assessment route must use a different approach.
**Options:**
1. Use a route group `(protected)` that inherits root layout — then conditionally hide Navbar in root layout based on pathname (requires root layout to become `"use client"`, bad for SEO).
2. Create a separate root-level layout override: place `assessment` outside the root layout by using a parallel route or intercepting route (complex).
3. **Recommended:** Keep the assessment layout as a nested layout and style the root layout's Navbar/Footer to not appear on assessment routes. Make the root layout's Navbar check pathname. This is acceptable since assessment is `"use client"` anyway.

**Simpler alternative:** Accept that the landing page Navbar will appear above the assessment wizard header and design accordingly — or hide specific elements by checking `pathname.startsWith('/assessment')` in the Navbar component (which already needs to be a client component for the profile dropdown).
[ASSUMED: Best approach depends on final visual design. Confirm with product before implementing.]

### Pitfall 6: `react-hot-toast` Toaster Placement
**What goes wrong:** Toast notifications don't appear because `<Toaster>` was never mounted in the component tree.
**Why it happens:** `react-hot-toast` requires the `<Toaster>` component to be rendered somewhere — it acts as the portal target.
**How to avoid:** Place `<Toaster position="top-right" />` inside the assessment layout (not the root layout, to avoid conflicts with existing blog/admin notification patterns). [ASSUMED: No existing toast setup in the Next.js project — verify by searching for Toaster usage]

---

## Code Examples

### Formatters Port (UI-04)

```typescript
// src/lib/formatters.ts
// Source: port of /home/t0266li/Documents/myFinance/src/utils/formatters.js

export function formatCurrency(amount: number | null | undefined, compact = false): string {
    if (amount == null || isNaN(amount)) return "₹0";

    if (compact) {
        if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(1)}Cr`;
        if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)}L`;
        if (amount >= 1_000) return `₹${(amount / 1_000).toFixed(1)}K`;
    }

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatPercentage(value: number | null | undefined, decimals = 1): string {
    if (value == null || isNaN(value)) return "0%";
    return `${Number(value).toFixed(decimals)}%`;
}

export function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}
```

```typescript
// src/lib/enums.ts
// Source: port of /home/t0266li/Documents/myFinance/src/constants/enums.js

export const CITY_TIERS = {
    METRO: "METRO",
    TIER_1: "TIER_1",
    TIER_2: "TIER_2",
    TIER_3: "TIER_3",
} as const;

export const MARITAL_STATUS = {
    SINGLE: "SINGLE",
    MARRIED: "MARRIED",
} as const;

export const RISK_TOLERANCE = {
    CONSERVATIVE: "CONSERVATIVE",
    MODERATE: "MODERATE",
    AGGRESSIVE: "AGGRESSIVE",
} as const;

export const FREQUENCY = {
    MONTHLY: "MONTHLY",
    YEARLY: "YEARLY",
    ONE_TIME: "ONE_TIME",
} as const;

export const INSURANCE_TYPE = {
    LIFE: "LIFE",
    HEALTH: "HEALTH",
} as const;

export const TAX_REGIME = {
    OLD: "OLD",
    NEW: "NEW",
} as const;

export const EMPLOYMENT_TYPE = {
    SALARIED: "SALARIED",
    SELF_EMPLOYED: "SELF_EMPLOYED",
    BUSINESS: "BUSINESS",
} as const;

export const RESIDENCY_STATUS = {
    RESIDENT: "RESIDENT",
    NRI: "NRI",
} as const;
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `cookies()` synchronous | `await cookies()` async | Next.js 15.0 | All route handlers must `await cookies()` |
| `params` synchronous in route handlers | `params` is a Promise | Next.js 15.0 | Must `await params` before accessing path segments |
| `QueryClient` in component body | `useState` or module singleton | TanStack Query v5 | Prevents cache invalidation on re-render |
| Zustand global `create()` | Context Provider pattern for App Router | Zustand 5.0 docs | Prevents global singleton shared across server requests |

**Note on Zustand Context Provider vs global `create()`:**
The SUMMARY.md recommends using Context Provider pattern. However, for assessment state, a global singleton is acceptable because: (1) all assessment pages are `"use client"`, (2) assessment state is per-user-session (persisted to localStorage), not per-request. The `_hasHydrated` guard is sufficient. Using a Context Provider adds complexity without benefit here. [ASSUMED: Global singleton is safe for purely client-side assessment wizard — confirm if multi-tab behavior is a concern]

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `params` must be awaited in Next.js 15 route handlers | Pattern 1 (Proxy Route) | Proxy returns 404/500 because `path` is undefined — easy to detect and fix |
| A2 | A `/api/auth/signout` route does not yet exist in the project | Pattern 6 (InactivityGuard) | InactivityGuard signout fails silently — would need to create this route |
| A3 | No `<Toaster>` exists in the current project | Pitfall 6 | Toasts silently swallowed — easy to detect (toasts don't appear) |
| A4 | Global Zustand singleton (not Context Provider) is acceptable for assessment store | State of the Art | Multi-tab inconsistency or SSR request bleed (unlikely given all-client architecture) |
| A5 | Assessment layout should accept root layout Navbar rather than replace it | Pitfall 5 | Visual layout conflict requires restructuring route groups |
| A6 | `INACTIVITY_LIMIT_MS` should be 15 min (CONTEXT.md) not 20 min (source) | Pattern 6 | Session auto-logout fires 5 min earlier than old app — user experience change |

---

## Open Questions

1. **Assessment layout vs root layout Navbar conflict**
   - What we know: Next.js nests layouts — assessment pages will get the landing page Navbar + assessment header
   - What's unclear: Is this acceptable (two headers) or must the root Navbar be hidden on assessment routes?
   - Recommendation: For Phase 1, accept nested layouts and hide root Navbar on assessment/dashboard routes by adding a `usePathname()` check in the Navbar component (it's already a client component for the profile dropdown)

2. **Signout route for InactivityGuard**
   - What we know: `useAuthStore.logout()` was the source. The Next.js project has no explicit signout route.
   - What's unclear: Should clearing the cookie happen in a server route (`/api/auth/signout`) or client-side?
   - Recommendation: Create `src/app/api/auth/signout/route.ts` that calls `cookies().delete('session')` and `cookies().delete('user_profile')` — consistent with how auth works in this project

3. **Inactivity timeout: 15 min or 20 min?**
   - What we know: CONTEXT.md says 15 min (UI-02 requirement text). Source code uses 20 min.
   - What's unclear: Which is the intended value?
   - Recommendation: Use 15 min per REQUIREMENTS.md (UI-02 specifies "15 min")

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js 20 | npm install, dev server | via nvm | 20.20.2 | Use `nvm use 20` before running commands |
| npm | Package installation | via nvm node 20 | 10.8.2 | — |
| zustand | INFRA-02 | Not installed yet | 5.0.12 (registry) | — |
| @tanstack/react-query | INFRA-03 | Not installed yet | 5.97.0 (registry) | — |
| react-hot-toast | UI-03 | Not installed yet | 2.6.0 (registry) | — |
| BACKEND_URL env var | INFRA-01 proxy | Present in .env.local | https://api-preprod.myfinancial.in | — |

**No blocking missing dependencies.** All three libraries install with a single `npm install` command.

---

## Validation Architecture

Validation is manual for Phase 1 (infrastructure plumbing — no automated tests in the project yet).

### Phase Gate Checklist (manual verification per ROADMAP success criteria)

| Criterion | How to Test | Pass Condition |
|-----------|-------------|----------------|
| INFRA-04: Unauthenticated redirect | Open incognito browser, visit `/assessment` and `/dashboard` | Redirected to `/` |
| INFRA-01: Proxy forwards with JWT | Sign in, open DevTools Network, visit `/api/proxy/assessment/step/1/{userId}` | Request reaches Spring Boot (200 or 404 from backend, not 401) |
| INFRA-02: State survives refresh | Enter data in wizard, press F5 | State restored from localStorage |
| UI-03: Toast fires | Trigger a save action | Green toast appears top-right |
| UI-04: Formatters | Import and call `formatCurrency(1500000, true)` in browser console | Returns `"₹15.0L"` |
| UI-02: Inactivity guard | Wait 15 min or manually set `lastActivityRef.current = Date.now() - 900001` | Warning modal appears |

### Wave 0 Gaps
- No test framework configured in project (no jest.config, no vitest.config, no `__tests__` directory)
- Phase 1 infrastructure is not easily unit-testable without integration setup
- Manual verification via browser DevTools is the appropriate gate for this phase

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | Yes | `session` httpOnly cookie — JWT extracted server-side only, never exposed to client JavaScript |
| V3 Session Management | Yes | `maxAge: 7 days`, `sameSite: lax`, `secure: true` in production — already implemented in auth route |
| V4 Access Control | Yes | Middleware + layout double-guard for `/assessment` and `/dashboard` |
| V5 Input Validation | Partial | Proxy forwards body verbatim — Spring Boot validates. Proxy should not inject malicious headers. |
| V6 Cryptography | No | JWT is verified by Spring Boot; Next.js only decodes (not verifies) for payload reading |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| JWT theft via XSS | Information Disclosure | `httpOnly: true` on session cookie — JS cannot read it |
| CSRF on proxy POST | Tampering | `sameSite: lax` cookie attribute — cross-site POST blocked |
| SSRF via proxy path | Elevation of Privilege | Proxy only allows calls to `BACKEND_URL` — no user-controlled host |
| Session fixation | Tampering | New JWT issued per login by Spring Boot — not reused |

**SSRF note:** The catch-all proxy appends the path to a hardcoded `BACKEND_URL`. An attacker cannot redirect the proxy to an arbitrary host because the host is server-side environment variable only. Path segments go through `.join("/")` which prevents `../` traversal. [VERIFIED: design constraint]

---

## Sources

### Primary (HIGH confidence)
- Existing codebase: `src/app/api/auth/google/route.ts` — confirmed `await cookies()` pattern for Next.js 15
- Existing codebase: `src/lib/auth.ts` — confirmed `getSession()` reads `session` cookie
- Existing codebase: `middleware.ts` — confirmed matcher syntax and session cookie check
- Existing codebase: `.planning/research/SUMMARY.md` — confirmed Zustand hydration pitfall, library versions
- Source React app: `src/features/assessment/store/useAssessmentStore.js` — full store structure verified by reading
- Source React app: `src/components/auth/InactivityGuard.jsx` — full logic verified by reading
- Source React app: `src/components/layout/Layout.jsx` — full layout structure verified by reading
- npm registry (via `npm view`): zustand@5.0.12, @tanstack/react-query@5.97.0, react-hot-toast@2.6.0

### Secondary (MEDIUM confidence)
- `.planning/phases/01-shared-infrastructure/01-CONTEXT.md` — implementation decisions
- `.planning/codebase/CONVENTIONS.md` — inline styles pattern, naming conventions

### Tertiary (LOW confidence — assumptions)
- A1-A6 in Assumptions Log above

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — npm versions verified against registry
- Architecture patterns: HIGH — based on existing codebase patterns and direct reading of source files
- Pitfalls: HIGH — most pitfalls verified against existing codebase (async cookies confirmed)
- Assumptions: LOW — flagged in Assumptions Log

**Research date:** 2026-04-11
**Valid until:** 2026-05-11 (stable libraries — zustand and react-query change slowly)
