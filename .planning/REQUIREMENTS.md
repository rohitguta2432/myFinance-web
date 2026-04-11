# Requirements: MyFinancial — React to Next.js Migration

**Defined:** 2026-04-11
**Core Value:** Users complete the financial assessment wizard and see their personalized dashboard — this flow must work end-to-end after migration without regressions.

## v1 Requirements

### Infrastructure

- [ ] **INFRA-01**: API proxy route handler forwards requests to Spring Boot backend with JWT extracted from httpOnly cookie
- [ ] **INFRA-02**: Assessment Zustand store persists wizard state to localStorage with SSR hydration guard
- [ ] **INFRA-03**: React Query provider wraps protected routes with appropriate staleTime configuration
- [ ] **INFRA-04**: Middleware protects both `/assessment` and `/dashboard` routes (redirects unauthenticated users)
- [ ] **INFRA-05**: API client utility handles auth headers, error responses, and 401 redirects
- [ ] **INFRA-06**: Shared layout for assessment (step sidebar + progress) and dashboard (tab sidebar)

### Assessment Wizard

- [ ] **ASSESS-01**: User can fill Step 1 — Personal Risk Profile (age, state, city, marital status, dependents, employment, residency, risk tolerance questionnaire)
- [ ] **ASSESS-02**: User can fill Step 2 — Income & Expenses (add/edit/delete income sources and expense categories with frequency selection)
- [ ] **ASSESS-03**: User can fill Step 3 — Assets & Liabilities (add/remove assets and liabilities with net worth summary)
- [ ] **ASSESS-04**: User can fill Step 4 — Financial Goals (add/edit/delete goals with projections, inflation rate, SIP calculations)
- [ ] **ASSESS-05**: User can fill Step 5 — Insurance Gap Analysis (corporate + personal health/life policies, gap checklist)
- [ ] **ASSESS-06**: User can fill Step 6 — Tax Optimization (old vs new regime comparison, 80C investments)
- [ ] **ASSESS-07**: User sees celebration screen after completing all 6 steps with "View Dashboard" CTA
- [ ] **ASSESS-08**: User can navigate between steps using back/next buttons and step sidebar
- [ ] **ASSESS-09**: Wizard state persists across page refresh (Zustand localStorage)
- [ ] **ASSESS-10**: Each step saves data to backend API on "Next" click

### Dashboard

- [ ] **DASH-01**: User sees financial health score with animated SVG rings on summary tab
- [ ] **DASH-02**: User sees red flags section with critical/warning/info tiered alerts
- [ ] **DASH-03**: User sees pillar interpretation cards (Liquidity, Protection, Growth, Allocation, Tax)
- [ ] **DASH-04**: User sees action plan tab with prioritized items, category badges, and impact amounts
- [ ] **DASH-05**: User sees insurance analysis tab with HLV method and coverage gap breakdown
- [ ] **DASH-06**: User sees tax planning tab with old vs new regime comparison and recommendations
- [ ] **DASH-07**: User sees projection charts (Recharts line graphs) for wealth/goal projections
- [ ] **DASH-08**: User sees benchmark comparison tables (user vs age-group norms)
- [ ] **DASH-09**: User can use Financial Time Machine slider for scenario projections
- [ ] **DASH-10**: Dashboard loads data from single `/api/v1/dashboard/summary/{userId}` endpoint

### User Flow

- [ ] **FLOW-01**: New user signs in → redirected to assessment Step 1 (not dashboard)
- [ ] **FLOW-02**: Returning user (assessment complete) signs in → redirected to dashboard
- [ ] **FLOW-03**: User can navigate between assessment and dashboard via navbar dropdown

### AI Chat

- [ ] **CHAT-01**: Floating AI chat widget (Kira) appears on assessment and dashboard pages
- [ ] **CHAT-02**: Chat sends messages to backend which calls AWS Bedrock (Amazon Nova)
- [ ] **CHAT-03**: Chat widget can be minimized/expanded

### Admin

- [ ] **ADMIN-01**: Admin can view user list with search/filter
- [ ] **ADMIN-02**: Admin can view audit logs
- [ ] **ADMIN-03**: Admin panel protected by admin authentication (existing)

### Shared UI

- [ ] **UI-01**: Loading skeletons for assessment and dashboard pages
- [ ] **UI-02**: Session inactivity guard (auto-logout after 15 min)
- [ ] **UI-03**: Toast notifications for save/error feedback
- [ ] **UI-04**: Currency (INR), percentage, and date formatters

## v2 Requirements

### Enhancements

- **ENH-01**: Google One Tap sign-in alongside popup flow
- **ENH-02**: Dark/light theme toggle
- **ENH-03**: PWA support (offline, installable)
- **ENH-04**: Premium billing/payment integration
- **ENH-05**: Multi-provider auth (GitHub, Apple)

## Out of Scope

| Feature | Reason |
|---------|--------|
| UI/UX redesign | Migration only — port + improve, not redesign |
| New features not in React app | Scope is migration parity, not new work |
| Spring Boot backend changes | Backend stays as-is, all endpoints unchanged |
| Mobile app (React Native) | Web only |
| UPI/bank account linking | Not in current React app |
| CIBIL/credit score integration | Not in current React app |
| SSR for assessment/dashboard | All components are "use client" — purely interactive |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 | Pending |
| INFRA-02 | Phase 1 | Pending |
| INFRA-03 | Phase 1 | Pending |
| INFRA-04 | Phase 1 | Pending |
| INFRA-05 | Phase 1 | Pending |
| INFRA-06 | Phase 1 | Pending |
| UI-01 | Phase 1 | Pending |
| UI-02 | Phase 1 | Pending |
| UI-03 | Phase 1 | Pending |
| UI-04 | Phase 1 | Pending |
| ASSESS-01 | Phase 2 | Pending |
| ASSESS-02 | Phase 2 | Pending |
| ASSESS-03 | Phase 2 | Pending |
| ASSESS-08 | Phase 2 | Pending |
| ASSESS-09 | Phase 2 | Pending |
| ASSESS-10 | Phase 2 | Pending |
| ASSESS-04 | Phase 3 | Pending |
| ASSESS-05 | Phase 3 | Pending |
| ASSESS-06 | Phase 3 | Pending |
| ASSESS-07 | Phase 3 | Pending |
| DASH-01 | Phase 4 | Pending |
| DASH-02 | Phase 4 | Pending |
| DASH-03 | Phase 4 | Pending |
| DASH-04 | Phase 4 | Pending |
| DASH-05 | Phase 4 | Pending |
| DASH-06 | Phase 4 | Pending |
| DASH-07 | Phase 4 | Pending |
| DASH-08 | Phase 4 | Pending |
| DASH-09 | Phase 4 | Pending |
| DASH-10 | Phase 4 | Pending |
| FLOW-01 | Phase 4 | Pending |
| FLOW-02 | Phase 4 | Pending |
| FLOW-03 | Phase 4 | Pending |
| CHAT-01 | Phase 5 | Pending |
| CHAT-02 | Phase 5 | Pending |
| CHAT-03 | Phase 5 | Pending |
| ADMIN-01 | Phase 5 | Pending |
| ADMIN-02 | Phase 5 | Pending |
| ADMIN-03 | Phase 5 | Pending |

---
*Defined: 2026-04-11*
