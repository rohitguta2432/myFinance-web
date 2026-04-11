# Phase 2: Assessment Steps 1-3 - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning
**Mode:** Auto-generated (autonomous mode)

<domain>
## Phase Boundary

Users can complete the first half of the financial assessment wizard — entering their personal profile, income/expense sources, and asset/liability inventory — with data persisting to the backend and navigation working between steps.

Requirements: ASSESS-01, ASSESS-02, ASSESS-03, ASSESS-08, ASSESS-09, ASSESS-10

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion. Port the React components to Next.js with these constraints:
- Convert JSX to TSX with TypeScript types
- Break large step files (600-900 lines) into smaller sub-components
- Use inline styles (project convention)
- Add "use client" to all interactive components
- Use the assessment layout from Phase 1 (step sidebar already built)
- Use the Zustand assessment store from Phase 1
- Use the API client from Phase 1 for backend calls
- Use react-hot-toast for save/error notifications
- Port React Query hooks for data fetching

### Key Pattern
Each assessment step page should:
1. Be a thin `page.tsx` that composes sub-components
2. Use the Zustand store for local state
3. Use React Query hooks for API calls
4. Save to backend on "Next" click
5. Navigate using Next.js `useRouter`

</decisions>

<code_context>
## Existing Code Insights

### Source Files to Port (React)
- `/home/t0266li/Documents/myFinance/src/features/assessment/pages/Step1PersonalRisk.jsx` (635 lines)
- `/home/t0266li/Documents/myFinance/src/features/assessment/pages/Step2IncomeExpenses.jsx` (595 lines)
- `/home/t0266li/Documents/myFinance/src/features/assessment/pages/Step3AssetsLiabilities.jsx` (878 lines)
- `/home/t0266li/Documents/myFinance/src/features/assessment/hooks/useProfile.js`
- `/home/t0266li/Documents/myFinance/src/features/assessment/hooks/useFinancials.js`
- `/home/t0266li/Documents/myFinance/src/features/assessment/hooks/useBalanceSheet.js`
- `/home/t0266li/Documents/myFinance/src/features/assessment/hooks/useRiskScoring.js`
- `/home/t0266li/Documents/myFinance/src/features/assessment/services/assessmentApi.js`

### Phase 1 Assets Available
- `src/store/useAssessmentStore.ts` — Zustand store with all step state
- `src/lib/api-client.ts` — `apiFetch` / `api` helpers
- `src/lib/formatters.ts` — INR currency, dates, percentages
- `src/lib/enums.ts` — DB enum mappings
- `src/app/(protected)/assessment/layout.tsx` — Step sidebar layout
- `src/components/ui/assessment-skeleton.tsx` — Loading skeletons

</code_context>

<specifics>
## Specific Ideas

No specific requirements — autonomous mode. Port React components faithfully with TypeScript improvements.

</specifics>

<deferred>
## Deferred Ideas

None.

</deferred>
