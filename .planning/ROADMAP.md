# Roadmap: MyFinancial — React to Next.js Migration

## Overview

This roadmap migrates the MyFinancial React (Vite) SPA into the existing Next.js 15 project. Work flows in dependency order: shared infrastructure first, then the 6-step assessment wizard (Steps 1-3 before Steps 4-6), then the dashboard and user flows, then AI chat and admin. Each phase delivers a coherent, independently verifiable capability. The core flow — sign in → assessment wizard → personalized dashboard — must be end-to-end functional when Phase 4 completes.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Shared Infrastructure** - Providers, API proxy, Zustand stores, middleware, shared UI utilities
- [ ] **Phase 2: Assessment Steps 1-3** - Personal Risk Profile, Income & Expenses, Assets & Liabilities
- [ ] **Phase 3: Assessment Steps 4-6 + Complete** - Financial Goals, Insurance, Tax Optimization, celebration screen
- [ ] **Phase 4: Dashboard + User Flows** - All dashboard tabs, financial health score, user routing flows
- [ ] **Phase 5: AI Chat + Admin** - Kira chat widget, admin panel, polish

## Phase Details

### Phase 1: Shared Infrastructure
**Goal**: The foundational plumbing is in place — all protected routes are guarded, API calls reach the Spring Boot backend, wizard state survives refresh, and shared UI primitives are available for every downstream phase
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06, UI-01, UI-02, UI-03, UI-04
**Success Criteria** (what must be TRUE):
  1. An unauthenticated browser visiting `/assessment` or `/dashboard` is redirected to sign-in
  2. A fetch to `/api/proxy/assessment/step/1/{userId}` correctly forwards to `https://api-preprod.myfinancial.in` with the JWT from the httpOnly cookie
  3. Refreshing the browser mid-wizard does not lose previously entered wizard state
  4. Toast notifications fire on save and error events visible to the user
  5. INR currency amounts, percentages, and dates render consistently formatted across all pages
**Plans**: 2 plans
Plans:
- [ ] 01-01-PLAN.md — Core infrastructure (deps, proxy, API client, React Query provider, middleware, protected layout)
- [ ] 01-02-PLAN.md — Zustand store, formatters, enums, InactivityGuard, skeletons, assessment layout
**UI hint**: yes

### Phase 2: Assessment Steps 1-3
**Goal**: Users can complete the first half of the financial assessment wizard — entering their personal profile, income/expense sources, and asset/liability inventory — with data persisting to the backend and navigation working between steps
**Depends on**: Phase 1
**Requirements**: ASSESS-01, ASSESS-02, ASSESS-03, ASSESS-08, ASSESS-09, ASSESS-10
**Success Criteria** (what must be TRUE):
  1. User can fill out Step 1 (age, state, city, marital status, dependents, employment, risk questionnaire) and advance to Step 2
  2. User can add, edit, and delete multiple income sources and expense categories in Step 2, then advance to Step 3
  3. User can add and remove assets and liabilities in Step 3 and see a live net worth summary
  4. User can click Back on any step and return to the previous step without losing entered data
  5. Closing and reopening the browser restores the wizard at the same step with all previously entered data intact
**Plans**: 3 plans
Plans:
- [ ] 02-01-PLAN.md — Assessment API layer + Step 1 Personal Risk Profile
- [ ] 02-02-PLAN.md — Step 2 Income & Expenses (CRUD + cash flow summary)
- [ ] 02-03-PLAN.md — Step 3 Assets & Liabilities (net worth + portfolio mix)
**UI hint**: yes

### Phase 3: Assessment Steps 4-6 + Complete
**Goal**: Users can complete the second half of the wizard — setting financial goals with SIP projections, reviewing insurance coverage gaps, comparing tax regimes — and reach the celebration screen
**Depends on**: Phase 2
**Requirements**: ASSESS-04, ASSESS-05, ASSESS-06, ASSESS-07
**Success Criteria** (what must be TRUE):
  1. User can add financial goals in Step 4 and see inflation-adjusted projections and SIP amounts calculated live
  2. User can enter corporate and personal insurance policies in Step 5 and see a gap checklist reflecting coverage shortfalls
  3. User can view old vs new tax regime comparison in Step 6 with 80C investment entries affecting the calculation
  4. User sees a celebration screen with a "View Dashboard" CTA after submitting Step 6
**Plans**: TBD
**UI hint**: yes

### Phase 4: Dashboard + User Flows
**Goal**: Users can view their complete personalized financial dashboard — health score, red flags, action plan, insurance analysis, tax planning, projection charts, benchmarks, and the Time Machine — and the correct routing logic sends new users to assessment and returning users directly to the dashboard
**Depends on**: Phase 3
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, DASH-06, DASH-07, DASH-08, DASH-09, DASH-10, FLOW-01, FLOW-02, FLOW-03
**Success Criteria** (what must be TRUE):
  1. User sees their financial health score as animated SVG rings and pillar cards (Liquidity, Protection, Growth, Allocation, Tax) on the summary tab
  2. User sees tiered red flags (critical / warning / info) and a prioritized action plan with category badges and impact amounts
  3. User can switch between Insurance Analysis, Tax Planning, Projection Charts, Benchmark, and Time Machine tabs — each renders data without additional API calls
  4. A brand-new signed-in user is routed to Step 1 of the assessment; a returning user who completed the assessment is routed directly to the dashboard
  5. User can navigate between the assessment wizard and dashboard using the navbar dropdown
**Plans**: TBD
**UI hint**: yes

### Phase 5: AI Chat + Admin
**Goal**: The Kira AI chat widget is available on assessment and dashboard pages, the admin panel lists users and audit logs, and the application is clean of migration artifacts
**Depends on**: Phase 4
**Requirements**: CHAT-01, CHAT-02, CHAT-03, ADMIN-01, ADMIN-02, ADMIN-03
**Success Criteria** (what must be TRUE):
  1. A floating Kira chat button appears on assessment and dashboard pages and can be expanded and minimized
  2. Sending a message in the chat widget returns an AI response (routed through the backend to AWS Bedrock)
  3. An admin user can view a searchable/filterable user list and browse audit logs in the admin panel
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Shared Infrastructure | 0/2 | Not started | - |
| 2. Assessment Steps 1-3 | 0/TBD | Not started | - |
| 3. Assessment Steps 4-6 + Complete | 0/TBD | Not started | - |
| 4. Dashboard + User Flows | 0/TBD | Not started | - |
| 5. AI Chat + Admin | 0/TBD | Not started | - |

### Phase 6: Dark/Light theme toggle

**Goal:** Users can toggle between dark and light themes from the navbar; preference persists across sessions; landing, blog, assessment wizard, dashboard, and Kira chat widget all respond to the toggle; system preference is honored on first visit
**Requirements**: THEME-01, THEME-02, THEME-03, THEME-04, THEME-05
**Depends on:** Phase 5
**Plans:** 2/2 plans complete

Plans:
- [x] 06-01-PLAN.md — Theme infrastructure: install next-themes, ThemeProvider wrapper, useAppTheme hook, globals.css light variable block, navbar Sun/Moon toggle
- [x] 06-02-PLAN.md — Inline style refactor: assessment wizard (steps 1-6 + layout), dashboard (all tabs + layout), Kira chat widget, navbar color theming

### Phase 7: Public calculator pages (SIP, EMI, PPF, FD, HRA, etc.)

**Goal:** 10 interactive financial calculator pages are live at /calculators/[slug], each SEO-optimized with unique metadata and FAQPage schema, using Indian number formatting, Recharts visualization, and a CTA funneling users to the assessment wizard
**Requirements**: CALC-01, CALC-02, CALC-03, CALC-04, CALC-05, CALC-06, CALC-07, CALC-08, CALC-09, CALC-10, CALC-11, CALC-12, CALC-13, CALC-14
**Depends on:** Phase 6
**Plans:** 3 plans

Plans:
- [ ] 07-01-PLAN.md — Shared components (CalculatorLayout, SliderInput, ResultCard), calculator-utils formulas, /calculators index page, navbar link
- [ ] 07-02-PLAN.md — Core 5 calculators: SIP, Lumpsum, EMI, FD, PPF
- [ ] 07-03-PLAN.md — Additional 5 calculators: HRA, NPS, Retirement, SWP, Inflation

### Phase 8: PDF report generation (financial plan, tax summary)

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 7
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 8 to break down)

### Phase 9: Email notifications (SIP reminders, rebalancing alerts, goal deviations)

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 8
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 9 to break down)

### Phase 10: Goal progress dashboard (track goals over time)

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 9
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 10 to break down)

### Phase 11: Net worth trend chart (track over months)

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 10
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 11 to break down)

### Phase 12: Gamification (streaks, badges, milestones)

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 11
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 12 to break down)

### Phase 13: Capital gains statement download

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 12
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 13 to break down)

### Phase 14: Tax harvesting recommendations

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 13
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 14 to break down)

### Phase 15: Guided tooltips and coach marks on first use

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 14
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 15 to break down)

### Phase 16: Confetti and celebration on goal completion

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 15
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 16 to break down)

### Phase 17: Expense tracking with auto-categorization

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 16
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 17 to break down)
