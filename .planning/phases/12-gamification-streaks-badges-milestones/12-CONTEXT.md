# Phase 12: Gamification — Context

**Gathered:** 2026-04-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Add gamification elements to the financial assessment and dashboard experience: login streaks, achievement badges for completing milestones, and visual progress indicators. All client-side using existing data — no backend changes needed.

</domain>

<decisions>
## Implementation Decisions

### Streaks
- **D-01:** Track consecutive login days using localStorage (key: `myfinancial_streak`)
- **D-02:** Streak display in the dashboard header: flame icon + day count (e.g., "5-day streak")
- **D-03:** Streak resets after 48 hours of inactivity (grace period of 1 extra day)
- **D-04:** Streak milestones: 7 days, 30 days, 100 days — each triggers a toast notification

### Badges
- **D-05:** Achievement badges earned by completing milestones in the financial journey
- **D-06:** Badge types:
  - "First Steps" — Complete Step 1 of assessment
  - "Money Map" — Complete all 6 assessment steps
  - "Goal Setter" — Add first financial goal
  - "Diversified" — Have assets in 3+ categories
  - "Debt Free" — Zero liabilities
  - "Protected" — Have both life and health insurance
  - "Tax Smart" — Complete tax optimization step
  - "Streak Master" — Maintain 30-day login streak
- **D-07:** Badges stored in localStorage (key: `myfinancial_badges`) as JSON array of earned badge IDs
- **D-08:** Badge check runs on dashboard load — compares current state against badge criteria

### Badge Display
- **D-09:** Badges section in the dashboard summary tab — horizontal scrollable row of badge icons
- **D-10:** Earned badges: full color with checkmark. Unearned: greyed out with lock icon
- **D-11:** Clicking a badge shows a tooltip with the badge name, description, and how to earn it
- **D-12:** When a new badge is earned: celebratory toast notification with confetti-style animation

### Milestones Progress
- **D-13:** Progress indicators on the dashboard: "X of 8 badges earned" progress bar
- **D-14:** Each assessment step shows a small checkmark badge when completed (in the step navigation)

### Claude's Discretion
- Badge icon designs (use Lucide icons)
- Exact toast notification styling
- Animation effects for badge earning
- localStorage schema details

</decisions>

<canonical_refs>
## Canonical References

No external specs — requirements fully captured in decisions above.

### Data Sources
- `src/store/useAssessmentStore.ts` — Assessment state (steps completed, goals, assets, insurance)
- `src/hooks/dashboard/useDashboardSummary.ts` — Dashboard data for badge criteria checks
- `src/components/assessment/step-navigation.tsx` — Step nav (add checkmark badges)

### UI Patterns
- `src/app/(protected)/dashboard/page.tsx` — Dashboard summary tab (add badges section)
- `src/app/(protected)/dashboard/layout.tsx` — Dashboard layout (add streak display in header)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useAssessmentStore`: Has all step completion data, goals, assets, insurance
- `react-hot-toast`: Already installed for notifications
- Lucide icons: Already used throughout the app
- Dashboard summary tab: Landing spot for badges display

### Integration Points
- Dashboard layout header — streak display
- Dashboard summary tab — badges section
- Step navigation — checkmark indicators
- localStorage — streak and badge persistence

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches.

</specifics>

<deferred>
## Deferred Ideas

- Backend-persisted streaks/badges (requires new API endpoints — future phase)
- Leaderboard / social comparison features
- Custom badge creation

</deferred>

---

*Phase: 12-gamification-streaks-badges-milestones*
*Context gathered: 2026-04-12*
