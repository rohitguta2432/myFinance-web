# Phase 4: Dashboard + User Flows - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning
**Mode:** Auto-generated (autonomous mode)

<domain>
## Phase Boundary

Users can view their complete personalized financial dashboard — health score, red flags, action plan, insurance analysis, tax planning, projection charts, benchmarks, and the Time Machine — and the correct routing logic sends new users to assessment and returning users directly to the dashboard.

Requirements: DASH-01 through DASH-10, FLOW-01 through FLOW-03

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices at Claude's discretion. Key constraints:

- Recharts components MUST use `next/dynamic({ ssr: false })` to prevent SSR crashes
- All dashboard data comes from single endpoint: GET /api/v1/dashboard/summary/{userId}
- Dashboard tabs: Summary, Action Plan, Insurance, Tax Planning
- The existing dashboard at src/app/dashboard/ needs to be migrated into src/app/(protected)/dashboard/
- User flow routing: check if assessment is complete (Zustand store or backend) to decide new vs returning user

### Critical Pitfall
Recharts touches `window` at import time. Every chart component must be wrapped in `next/dynamic({ ssr: false })`. This is the #1 SSR crash risk in this phase.

</decisions>

<code_context>
## Existing Code Insights

### Source Files to Port
- /home/t0266li/Documents/myFinance/src/features/dashboard/pages/Home.jsx (212 lines)
- /home/t0266li/Documents/myFinance/src/features/dashboard/pages/DashboardPage.jsx (220 lines)
- /home/t0266li/Documents/myFinance/src/features/dashboard/pages/FinancialDashboard.jsx (509 lines)
- /home/t0266li/Documents/myFinance/src/features/dashboard/pages/ActionPlanTab.jsx (232 lines)
- /home/t0266li/Documents/myFinance/src/features/dashboard/pages/InsuranceTab.jsx (423 lines)
- /home/t0266li/Documents/myFinance/src/features/dashboard/pages/TaxPlanningTab.jsx (408 lines)
- /home/t0266li/Documents/myFinance/src/features/dashboard/components/ProjectionChart.jsx (229 lines)
- /home/t0266li/Documents/myFinance/src/features/dashboard/components/PillarInterpretationCard.jsx (188 lines)
- /home/t0266li/Documents/myFinance/src/features/dashboard/components/BenchmarkComparison.jsx (136 lines)
- /home/t0266li/Documents/myFinance/src/features/dashboard/components/FinancialTimeMachine.jsx (146 lines)
- /home/t0266li/Documents/myFinance/src/features/dashboard/components/ExcessReallocationCard.jsx (122 lines)
- /home/t0266li/Documents/myFinance/src/features/dashboard/components/LockedPremiumInsights.jsx (60 lines)
- /home/t0266li/Documents/myFinance/src/features/dashboard/components/SectionNav.jsx (85 lines)
- /home/t0266li/Documents/myFinance/src/features/dashboard/components/DashboardTabs.jsx (30 lines)
- /home/t0266li/Documents/myFinance/src/hooks/useDashboardSummary.js (22 lines)
- /home/t0266li/Documents/myFinance/src/hooks/useFinancialHealthScore.js
- /home/t0266li/Documents/myFinance/src/hooks/useActionPlan.js
- /home/t0266li/Documents/myFinance/src/hooks/useProjection.js
- /home/t0266li/Documents/myFinance/src/hooks/useTaxAnalysis.js
- /home/t0266li/Documents/myFinance/src/hooks/useInsuranceAnalysis.js
- /home/t0266li/Documents/myFinance/src/hooks/useRedFlags.js
- /home/t0266li/Documents/myFinance/src/hooks/usePriorityActions.js
- /home/t0266li/Documents/myFinance/src/hooks/usePersonalisedBenchmarks.js
- /home/t0266li/Documents/myFinance/src/hooks/useTimeMachine.js
- /home/t0266li/Documents/myFinance/src/hooks/useLockedInsights.js
- /home/t0266li/Documents/myFinance/src/utils/benchmarkTables.js (347 lines)

### Existing Dashboard (needs migration)
- src/app/dashboard/page.tsx — placeholder "Welcome, Rohit" (from auth phase)
- src/app/dashboard/layout.tsx — auth guard
- src/app/dashboard/dashboard-content.tsx — placeholder content
These need to be replaced/moved into src/app/(protected)/dashboard/

</code_context>

<specifics>
## Specific Ideas

- FLOW-01: After Google sign-in, check if user has completed assessment. If not → /assessment/step-1. If yes → /dashboard.
- FLOW-02: The check can be done by calling the backend profile endpoint or reading Zustand store isComplete flag.
- User profile cookie has user ID for API calls.

</specifics>

<deferred>
## Deferred Ideas

None.

</deferred>
