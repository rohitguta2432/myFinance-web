# Phase 10: Goal Progress Dashboard — Context

**Gathered:** 2026-04-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Add a goal progress tracking view to the dashboard where users can see how each financial goal is progressing over time — current savings vs target, SIP progress, feasibility trends. Uses existing goal and projection data from the backend.

</domain>

<decisions>
## Implementation Decisions

### Dashboard Integration
- **D-01:** New "Goals" tab in the existing dashboard SectionNav — sits alongside Summary, Action Plan, Insurance, Tax
- **D-02:** Route at `/dashboard/goals` within the protected dashboard layout
- **D-03:** Uses existing `useGoalsQuery` and `useGoalProjectionQuery` hooks — no new backend endpoints

### Goal Progress Visualization
- **D-04:** Each goal shown as a progress card with: name, type badge, progress bar (current savings / inflation-adjusted target), SIP required, time remaining
- **D-05:** Progress bar color: green (on track, >80% feasibility), yellow (at risk, 50-80%), red (behind, <50%)
- **D-06:** Recharts area chart showing projected growth trajectory per goal (current savings → target over horizon)
- **D-07:** Summary stats at top: total goals, on-track count, at-risk count, total monthly SIP required

### Goal Cards Layout
- **D-08:** Grid layout: 2 columns on desktop, 1 column on mobile
- **D-09:** Each card is expandable — collapsed shows progress bar + key stats, expanded shows the Recharts projection chart
- **D-10:** Goal type icons from Lucide (Target for general, Home for house, GraduationCap for education, Plane for travel, etc.)

### Empty & Edge States
- **D-11:** Empty state when no goals: illustration + "Set your first financial goal" CTA linking to Step 4
- **D-12:** If projection data unavailable: show goals with progress bars but hide projection charts gracefully

### Claude's Discretion
- Exact card styling and spacing
- Chart animation and transition effects
- Sort order of goals (by importance, deadline, or feasibility)
- Responsive breakpoint for grid switch

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above.

### Data Sources
- `src/hooks/assessment/useGoals.ts` — Goal CRUD hooks (useGoalsQuery)
- `src/hooks/assessment/useGoalProjection.ts` — Goal projection data (useGoalProjectionQuery)
- `src/lib/assessment-api.ts` — GoalAPIItem and GoalProjection interfaces
- `src/store/useAssessmentStore.ts` — GoalItem interface in Zustand store

### UI Patterns
- `src/app/(protected)/dashboard/layout.tsx` — Dashboard layout with SectionNav tabs
- `src/components/dashboard/SectionNav.tsx` — Tab navigation component
- `src/app/(protected)/dashboard/page.tsx` — Existing dashboard tab for reference
- `src/hooks/useAppTheme.ts` — Theme hook for palette

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useGoalsQuery` hook: Fetches all goals from backend
- `useGoalProjectionQuery` hook: Fetches projection data (total SIP, feasibility)
- `SectionNav` component: Dashboard tab navigation — just add a new tab entry
- Recharts: Already installed and used in calculator pages and dashboard
- `formatINR()` from calculator-utils: Indian currency formatting
- Dashboard layout: Protected route with sidebar nav

### Established Patterns
- Dashboard tabs: each is a separate page under `/dashboard/[tab]`
- "use client" for all interactive components
- Inline styles with useAppTheme palette
- TanStack Query for data fetching with staleTime caching

### Integration Points
- Dashboard SectionNav — add "Goals" tab entry
- Dashboard layout route group — new `/dashboard/goals/page.tsx`
- Existing goal hooks — no new API calls needed

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches for goal progress visualization.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 10-goal-progress-dashboard-track-goals-over-time*
*Context gathered: 2026-04-12*
