# Feature Landscape

**Domain:** Personal finance assessment platform — Indian market, assessment wizard + dashboard
**Researched:** 2026-04-11
**Source:** Direct inspection of React source at `/home/t0266li/Documents/myFinance/src/` + fintech UX research

---

## Table Stakes

Features users expect from any serious personal finance assessment tool. Missing or broken = product feels incomplete or untrustworthy.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Multi-step wizard with progress indicator | Users need to know where they are in a long data-collection flow | Low | Exists: 6 steps, section nav within each step |
| Save-and-resume progress | Data entry sessions are interrupted; losing work destroys trust | Medium | Exists: every step auto-saves to backend on Next |
| Net worth snapshot (assets − liabilities) | Foundational personal finance metric; Step 3 produces this | Low | Exists: balance sheet summary in Step 3 + Step 2 cashflow |
| Income / expense tracking (CRUD) | Core financial data input; any platform without this is a toy | Medium | Exists: Step 2 with add/edit/delete, emoji categories |
| Financial health score | Single number summary of financial position; users expect a "grade" | High | Exists: totalScore from backend, animated SVG score ring |
| Actionable red flags with severity tiers | Tell users what's wrong and how bad; not just a score | Medium | Exists: critical/warn/info tiers with current vs benchmark |
| Prioritized action plan | Users need to know what to do next; a score alone is useless | Medium | Exists: usePriorityActions → ActionPlanTab |
| Goal setting with projections | Retirement, home, education — all standard in India | High | Exists: Step 4 with 8 goal types, SIP projections, inflation |
| Insurance gap analysis | Critical for Indian market; under-insurance is common | High | Exists: Step 5, HLV method, corporate + personal policies |
| Old vs New tax regime comparison | Indian-specific table stakes since 2023 FY; every user asks this | High | Exists: Step 6, debounced live calc, 80C/80D deductions |
| Returning user fast path | Completed-assessment users should land on dashboard, not wizard | Low | Exists: route logic checks assessmentCompleted flag |
| Loading skeletons | Financial data loads slowly; blank screens kill perceived quality | Low | Exists: per-step skeleton components (AssessmentSkeleton, DashboardSkeleton) |
| Toast notifications for save success/error | User must know if their data was saved | Low | Exists: react-hot-toast throughout |
| Responsive dark-theme UI | Fintech convention; glanceable at night | Low | Exists: dark palette #0B0F1A / #0F172A throughout |

---

## Differentiators

Features that set this platform apart. Not universally expected, but meaningfully valued when present.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Financial Time Machine | Shows the daily rupee cost of financial inaction with animated counter — creates urgency without shame | High | Exists: `FinancialTimeMachine.jsx`, driven by `useTimeMachine`, streak + delay cost |
| Personalised benchmark comparison | Compares user metrics against age-appropriate Indian benchmarks with traffic-light bars | High | Exists: `BenchmarkComparison.jsx`, `usePersonalisedBenchmarks`, green/amber/red |
| Excess reallocation recommendation | Automatically calculates how to deploy surplus cash across equity/debt by risk profile, with STP suggestion | High | Exists: `ExcessReallocationCard.jsx`, `excessReallocation` slice of dashboard summary |
| AI advisory chat (Kira) | Context-aware financial Q&A using the user's actual financial data as context | High | Exists: `AiChatWidget.jsx`, AWS Bedrock Nova, financial context injected per message |
| Locked premium insights teaser | Shows the dollar impact of hidden insights to drive upgrade intent without forcing paywall | Medium | Exists: `LockedPremiumInsights.jsx`, shows impactLabel, locks behind "Unlock Full Analysis" |
| In-wizard section navigation | Each long wizard step has an in-page jump nav (Profile / Investor Style, Income / Expenses / Cashflow, etc.) | Low | Exists: `SectionNav` component reused across steps |
| Retirement auto-fill | Pre-populates retirement goal with backend-calculated corpus target based on age/income | Medium | Exists: `useRetirementAutoFillQuery`, `showRetirementPanel` in Step 4 |
| Pillar interpretation cards | Explains each health score pillar (savings, insurance, tax) in plain language with improvement tips | Medium | Exists: `PillarInterpretationCard.jsx` |
| Projection chart with recharts | Visual wealth trajectory over time on dashboard | Medium | Exists: `ProjectionChart.jsx` + `useProjection` |
| Celebration / gamification on completion | Trophy + confetti-blur animation; emotional payoff after ~20min of data entry | Low | Exists: `AssessmentComplete.jsx`, staggered reveal, checklist |
| Hook / tagline text driven by score | Personalised opening hook sentence on dashboard based on score band | Low | Exists: `useHookText` hook |
| India-specific income/expense categories | Salary, agriculture income, freelancing, HRA, NPS, EPF — not generic Western categories | Low | Exists: INCOME_EMOJI + EXPENSE_EMOJI maps in Step 2 |
| Location-aware (Indian state/city) | Risk profile and benchmarks can factor in geography | Low | Exists: Step 1 state/city dropdowns from backend |

---

## Anti-Features

Features to explicitly NOT build during this migration.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| UPI / bank account linking | SEBI/RBI regulated, massive compliance overhead, not in scope | Manual income/expense entry is the deliberate model |
| Credit score monitoring | Requires bureau integration (CIBIL/Experian), separate product surface | Out of scope per PROJECT.md |
| Stock / mutual fund recommendations | SEBI RACP compliance risk; Kira's FAQ explicitly disclaims this | Kira says "consult a SEBI-registered advisor" |
| Redesigned UI | Changes assessment UX mid-migration risks regressions and scope creep | Port + improve: TSX types, component decomposition, no visual redesign |
| New wizard steps or goal types | Scope of migration is what's in the React app, nothing new | Post-migration feature, not migration task |
| Mobile app (React Native) | Different codebase, different deployment, different team concern | Web only |
| Multi-provider auth | Google-only for launch; adds surface area without user demand | Google One Tap can be added post-launch |
| Payment / subscription billing | "Unlock Full Analysis" CTA exists but billing backend not in scope | Premium feature deferred; show locked state, no payment flow |
| SSR for assessment / dashboard | These pages are deeply interactive, user-specific, not SEO targets | All assessment + dashboard pages are `"use client"`, no SSR needed |

---

## Feature Dependencies

```
Google OAuth sign-in
  └── Assessment Wizard (requires userId from auth token)
        ├── Step 1: Personal Risk Profile
        │     └── Step 2: Income & Expenses (depends on employmentType from Step 1)
        │           └── Step 3: Assets & Liabilities
        │                 └── Step 4: Financial Goals
        │                       └── Step 5: Insurance Gap (uses income from Step 2, age from Step 1)
        │                             └── Step 6: Tax Optimization (uses income from Step 2)
        │                                   └── Assessment Complete screen
        └── Dashboard (requires assessmentCompleted = true in store)
              ├── Financial Health Score (backend: /dashboard/summary)
              ├── Red Flags (from dashboard summary slice)
              ├── Action Plan (from dashboard summary slice)
              ├── Benchmark Comparison (from dashboard summary slice)
              ├── Financial Time Machine (from dashboard summary slice)
              ├── Excess Reallocation Card (from dashboard summary slice)
              ├── Projection Chart (from useProjection hook → separate endpoint)
              ├── Insurance Tab (from useInsuranceAnalysis hook)
              ├── Tax Planning Tab (from useTaxAnalysis hook)
              └── AI Chat Widget (requires financial context → from dashboard summary)
```

All dashboard data originates from a single backend call: `GET /api/v1/dashboard/summary/{userId}`.
Assessment data is persisted per-step: `GET/POST /api/v1/assessment/{step}/{userId}`.

---

## Wizard Step Detail

Each step has internal structure relevant to component decomposition:

| Step | Internal Sections | Key Data Collected | Special Behaviour |
|------|------------------|--------------------|-------------------|
| Step 1: Personal Risk | Profile, Investor Style | Age, state, city, marital status, dependents, employment type, residency, risk quiz (scored) | Location dropdowns from backend, risk quiz auto-calculates tolerance |
| Step 2: Income & Expenses | Income, Expenses, Cash Flow | Multiple income sources (add/edit/delete), expense categories, balance sheet summary | Real-time cash flow surplus/deficit calculation, EMI category special-cased |
| Step 3: Assets & Liabilities | (flat list) | Asset types + values, liability types + values | Net worth summary computed client-side |
| Step 4: Financial Goals | Goals list, Goal modal | Goal type, target cost, horizon, importance level | Singleton goals (retirement, emergency), retirement auto-fill panel, goal projection per-goal |
| Step 5: Insurance Gap | Corporate, Health & Life, Checklist, Summary | Corporate health/life covers, personal health/life policies, insurance checklist items | Backend-recommended covers via `useInsuranceGapQuery`, HLV method |
| Step 6: Tax Optimization | Regime, Comparison, Deductions, HRA & Premium | Tax regime choice, 80C/80D/other deductions, HRA, NPS | Debounced live tax calculation from backend, auto-EPF + auto-life-insurance from profile |

---

## Dashboard Section Detail

| Section | Data Source | Visual Pattern |
|---------|------------|----------------|
| Snapshot | `data.snapshot` from summary | Key metrics cards (net worth, savings rate, etc.) |
| Health Score | `data.healthScore` — totalScore, sortedPillars, mostCritical | Animated SVG score ring (radius 80, stroke 10), pillar breakdown |
| Projections | `useProjection()` hook — separate endpoint | Recharts LineChart, wealth trajectory |
| Red Flags | `useRedFlags()` — from summary | Severity cards: critical (red) / warn (amber) / info (blue), current vs benchmark |
| Actions | `usePriorityActions()` — from summary | Ordered action items in ActionPlanTab |
| Benchmarks | `usePersonalisedBenchmarks()` — from summary | Traffic-light bar chart: green/amber/red vs Indian age-group benchmarks |
| Premium (locked) | `useLockedInsights()` — from summary | Locked cards showing impact figures, "Unlock Full Analysis" CTA |
| Time Machine | `useTimeMachine()` — from summary | Animated daily-cost counter, delay cost, streak, top action |
| Excess Reallocation | `data.excessReallocation` from summary | Conditional card: equity/debt allocation recommendation |
| Hook Text | `useHookText()` — from summary | Personalised opening sentence on dashboard header |

Tabs (separate views within dashboard):
- Insurance Tab: `useInsuranceAnalysis()` — HLV coverage analysis
- Tax Planning Tab: `useTaxAnalysis()` — regime recommendation, deduction opportunities

---

## MVP Recommendation

For the migration, "MVP" = parity with the existing React app. Priority order:

1. **Shared infrastructure** — API client, Zustand stores (auth + assessment), React Query provider. Everything else depends on this.
2. **Assessment Steps 1–6 + Complete screen** — Core user journey. A broken wizard means zero users reach the dashboard.
3. **Dashboard: Health Score + Red Flags + Action Plan** — The primary value delivery. Users who complete assessment expect immediate insight.
4. **Dashboard: Benchmarks + Time Machine + Excess Reallocation** — Differentiators that justify the data-collection effort.
5. **AI Chat Widget (Kira)** — High value, but can be stubbed initially (returns friendly message) while backend wiring is confirmed.
6. **Dashboard tabs: Insurance + Tax Planning** — Secondary views; users navigate here after absorbing the main dashboard.
7. **Locked premium insights** — Already wired to backend data; just needs UI ported.
8. **Admin panel** — Internal tool; non-blocking for user-facing launch.

Defer: New features not in the React app (e.g., UPI linking, billing flow). Migration only.

---

## Sources

- Direct source inspection: `/home/t0266li/Documents/myFinance/src/features/` and `/home/t0266li/Documents/myFinance/src/components/`
- Project requirements: `/home/t0266li/Documents/myFinance-web/.planning/PROJECT.md`
- Fintech UX patterns (MEDIUM confidence, WebSearch): [Eleken Fintech UX Best Practices 2026](https://www.eleken.co/blog-posts/fintech-ux-best-practices), [Ramotion Fintech UX Design](https://www.ramotion.com/blog/fintech-ux-design/)
- Indian personal finance app landscape (LOW confidence, WebSearch): [Techjockey Best Personal Finance Software India 2026](https://www.techjockey.com/blog/best-personal-finance-software), [Zartek Personal Finance Apps India 2025](https://www.zartek.in/top-apps-for-personal-finance-management/)
