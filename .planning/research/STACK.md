# Technology Stack: React SPA → Next.js 15 Migration

**Project:** MyFinancial — myFinance-web
**Researched:** 2026-04-11
**Scope:** Migrating React 19 + Vite 7 SPA (Zustand 5 + TanStack Query 5 + Recharts 3.8) into existing Next.js 15 App Router project

---

## Already In Place (Do Not Change)

These are installed and working in the target repo. Do not reinstall or reconfigure.

| Technology | Version (package.json) | Purpose |
|------------|----------------------|---------|
| Next.js | ^15.2.0 (Turbopack) | Framework, routing, SSR |
| React | ^19.0.0 | UI runtime |
| TypeScript | ^5.7.3 | Type safety |
| Tailwind CSS | ^4.0.0 | Utility styles |
| `@react-oauth/google` | ^0.13.5 | Google OAuth auth-code flow |
| `lucide-react` | ^0.475.0 | Icons |
| AWS SDK (Bedrock, DynamoDB) | ^3.x | Blog + AI (server-side only) |

---

## Libraries to Add

### 1. State Management — Zustand 5.0

**Install:** `npm install zustand@^5.0.11`

**Pattern to use — Context Provider wrapping vanilla store:**

```typescript
// src/lib/stores/assessmentStore.ts
import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';

export const createAssessmentStore = (initState = defaultState) =>
  createStore<AssessmentStore>()(
    persist((set) => ({ ...initState, ... }), {
      name: 'assessment-storage',
      storage: createJSONStorage(() => localStorage),
    })
  );
```

```typescript
// src/components/providers/AssessmentStoreProvider.tsx
'use client';
import { useRef } from 'react';
import { AssessmentStoreContext } from '@/lib/stores/assessmentStore';

export function AssessmentStoreProvider({ children }) {
  const storeRef = useRef(createAssessmentStore());
  return (
    <AssessmentStoreContext.Provider value={storeRef.current}>
      {children}
    </AssessmentStoreContext.Provider>
  );
}
```

**Why this pattern:**
- Official Zustand recommendation for Next.js App Router (zustand.docs.pmnd.rs/learn/guides/nextjs)
- Avoids state leakage between server requests (global `create()` is dangerous in SSR)
- `persist` middleware with `localStorage` works because assessment/auth are always `'use client'` — no SSR for these pages
- The existing source stores use `create()` with `persist` — the migration wraps them in this pattern with minimal rewrite

**What NOT to do:** Do not use `create()` at module scope in server-rendered routes. The source app's `useAuthStore.js` and `useAssessmentStore.js` can be ported almost verbatim as long as they live inside `'use client'` components or providers.

**Confidence:** HIGH — official docs + community consensus.

---

### 2. Server State / API Caching — TanStack Query 5.90

**Install:** `npm install @tanstack/react-query@^5.90.21`

**Optional devtools:** `npm install -D @tanstack/react-query-devtools`

**Pattern to use — single client-side provider, no SSR prefetching:**

```typescript
// src/components/providers/QueryProvider.tsx
'use client';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 60s — prevents double-fetch on navigation
          retry: 1,
        },
      },
    })
  );
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

**Why this pattern:**
- Assessment and dashboard are 100% `'use client'` — no SSR prefetching needed
- Creating QueryClient inside `useState` ensures one instance per browser session, not per render
- `staleTime: 60000` is the official recommendation to prevent refetch on client hydration
- The `HydrationBoundary` / `dehydrate` pattern is for server-prefetched pages — not applicable here since all protected routes are client-only

**Wrap in `src/app/layout.tsx`:** Add `<QueryProvider>` wrapping `{children}` alongside `AssessmentStoreProvider` and `AuthStoreProvider`.

**What NOT to do:** Do not create `QueryClient` at module scope (outside `useState`). It causes shared cache between users in server-side contexts and causes hydration mismatches.

**Confidence:** HIGH — TanStack Query v5 official docs confirm this pattern.

---

### 3. Charts — Recharts 3.8

**Install:** `npm install recharts@^3.8.0`

**Pattern to use:**

Every file containing a Recharts component must have `'use client'` at the top. Recharts uses D3 internally which requires DOM access.

```typescript
// src/components/dashboard/ProjectionChart.tsx
'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
```

**Why Recharts (not Tremor, not Chart.js):**
- Already used in the source app — zero migration risk, identical API
- Recharts 3.x is the most actively maintained React charting library in 2025 (3.8.0 released 2025)
- No SSR issues as long as `'use client'` is declared — confirmed by Next.js community

**What NOT to do:** Do not wrap Recharts components in `next/dynamic` with `ssr: false` unless you see a hydration mismatch in practice. `'use client'` alone is sufficient for Next.js 15.

**Confidence:** HIGH — official Next.js + Recharts integration docs, community practice.

---

### 4. Notifications — react-hot-toast 2.6

**Install:** `npm install react-hot-toast@^2.6.0`

**Pattern:**
```typescript
// In root layout or providers
import { Toaster } from 'react-hot-toast';
// Add <Toaster position="top-right" /> inside 'use client' provider wrapper
```

**Why keep react-hot-toast over migrating to Sonner:**
- Already in the source app — direct port, zero API changes
- Sonner is the modern choice (adopted by shadcn/ui), but migration adds churn for no benefit during porting
- Both work identically in Next.js 15 App Router with `'use client'`
- **Revisit after migration is complete** — switching to Sonner is a 1-hour task and worth doing in a polish phase

**Confidence:** HIGH — both libraries confirmed working in Next.js 15 App Router.

---

### 5. API Proxy — next.config.ts rewrites

**No additional library needed.**

Configure rewrites in `next.config.ts` to proxy `/api/backend/*` to the Spring Boot EC2 instance:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'https://api-preprod.myfinancial.in/api/:path*',
      },
    ];
  },
  // ... existing headers config
};
```

**Why rewrites over Route Handlers as proxy:**
- Next.js rewrites proxy from the server — CORS is handled automatically (browser never sees the cross-origin request)
- Zero additional code to maintain
- Route Handlers (`/api/route.ts`) that call Spring Boot are viable but add a request hop and boilerplate for every endpoint
- The source app calls `https://api-preprod.myfinancial.in` directly with JWT headers — rewrites let you change the base URL on the client without modifying every `fetch()` call

**What NOT to do:** Do not use `http-proxy-middleware` in a custom server — it breaks Amplify's serverless deployment model. `next.config.ts` rewrites work in Amplify serverless (confirmed).

**Confidence:** MEDIUM — rewrites pattern is official and well-documented; Amplify compatibility confirmed by community. Route Handler proxying is a safe fallback if rewrites cause issues.

---

### 6. Dexie.js — Evaluate, Likely Remove

The source app (`dexie: ^4.3.0`) uses Dexie for IndexedDB, but the PROJECT.md does not list any offline-first feature in the active requirements. No assessment step appears to require offline persistence beyond what Zustand's `localStorage` persist middleware already provides.

**Recommendation:** Do not port Dexie unless a specific feature audit of the source app shows it is used in a load-bearing way. Check:

```bash
grep -r "dexie\|Dexie\|useLiveQuery" /home/t0266li/Documents/myFinance/src/
```

If Dexie is used for draft-save during the wizard, replace with Zustand's `persist` middleware (already planned). If Dexie is used for something else, it works with `'use client'` and needs no special Next.js handling.

**Confidence:** MEDIUM — Dexie is browser-only, works with `'use client'`, but unclear if it's needed.

---

## Complete Recommended package.json Additions

```bash
# State management + server state + charts + notifications
npm install zustand@^5.0.11 @tanstack/react-query@^5.90.21 recharts@^3.8.0 react-hot-toast@^2.6.0

# Dev tools (optional but recommended)
npm install -D @tanstack/react-query-devtools
```

No other new dependencies are needed. Everything else (`lucide-react`, `@react-oauth/google`, TypeScript, Tailwind) is already present in the target repo.

---

## Alternatives Considered and Rejected

| Category | Recommended | Rejected | Why Rejected |
|----------|-------------|----------|--------------|
| State management | Zustand 5 | Jotai, Redux Toolkit | Zustand already in source — zero migration cost |
| State management | Zustand 5 | React Context + useReducer | Context is fine for simple auth, but assessment store has 30+ fields with complex actions — Zustand is materially simpler |
| Charts | Recharts 3.8 | Tremor, Victory, Visx | Recharts already in source; Tremor is deprecated (absorbed into shadcn/ui charts); Visx is too low-level for this use case |
| Notifications | react-hot-toast | Sonner | Sonner is the modern choice but switching mid-migration adds churn; defer to polish phase |
| API proxy | next.config rewrites | http-proxy-middleware, custom server | Custom server breaks Amplify serverless; `http-proxy-middleware` has known Next.js App Router issues |
| Offline storage | Zustand persist | Dexie | Dexie adds complexity for a use case Zustand already covers; audit source app before deciding |

---

## Provider Composition in layout.tsx

The root `src/app/layout.tsx` should wrap children in this order (outermost to innermost):

```typescript
// src/app/layout.tsx
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AuthStoreProvider } from '@/components/providers/AuthStoreProvider';
import { AssessmentStoreProvider } from '@/components/providers/AssessmentStoreProvider';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthStoreProvider>
            <AssessmentStoreProvider>
              {children}
              <Toaster position="top-right" />
            </AssessmentStoreProvider>
          </AuthStoreProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
```

`AssessmentStoreProvider` can be scoped to `src/app/assessment/layout.tsx` instead of root if you want to avoid initializing it for landing/blog visitors.

---

## Sources

- Zustand Next.js guide: https://zustand.docs.pmnd.rs/learn/guides/nextjs
- TanStack Query v5 SSR guide: https://tanstack.com/query/v5/docs/framework/react/guides/ssr
- TanStack Query Next.js example: https://tanstack.com/query/v5/docs/framework/react/examples/nextjs
- Next.js rewrites docs: https://nextjs.org/docs/app/api-reference/file-conventions/proxy
- Recharts + Next.js: https://app-generator.dev/docs/technologies/nextjs/integrate-recharts.html
- Toast library comparison 2025: https://blog.logrocket.com/react-toast-libraries-compared-2025/
