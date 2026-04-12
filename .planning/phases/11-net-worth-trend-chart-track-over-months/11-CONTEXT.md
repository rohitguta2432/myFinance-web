# Phase 11: Net Worth Trend Chart — Context

**Gathered:** 2026-04-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Add a net worth trend visualization to the dashboard showing how the user's net worth changes over time. Since the backend only provides current-snapshot data (no historical endpoint), use client-side projection to generate a forward-looking trajectory chart from the current net worth data.

</domain>

<decisions>
## Implementation Decisions

### Dashboard Integration
- **D-01:** New "Net Worth" tab in the dashboard SectionNav alongside Summary, Action Plan, Insurance, Tax, Goals
- **D-02:** Route at `/dashboard/net-worth` within the protected dashboard layout
- **D-03:** Uses existing `useBalanceSheetQuery` (assets/liabilities) and `useDashboardSummary` hooks — no new backend endpoints

### Net Worth Display
- **D-04:** Current net worth summary card at top: total assets, total liabilities, net worth (assets - liabilities), with color coding (green if positive, red if negative)
- **D-05:** Asset vs liability breakdown as horizontal stacked bar or donut chart
- **D-06:** Category-wise asset breakdown table (Savings & Investments, Real Assets, Other)

### Trend Projection Chart
- **D-07:** Recharts line/area chart showing projected net worth over next 12 months
- **D-08:** Projection assumes: assets grow at 8% p.a. (conservative equity return), liabilities decrease by EMI payments (from liability data)
- **D-09:** Chart shows: current net worth point + 12-month projection line
- **D-10:** Tooltip shows month name + projected net worth value in INR format
- **D-11:** Note on chart: "Projected based on current portfolio and EMI schedule"

### Responsive Layout
- **D-12:** Summary card spans full width
- **D-13:** Chart and breakdown table stack vertically on mobile, side-by-side on desktop
- **D-14:** All amounts formatted with Indian numbering (Cr/L)

### Claude's Discretion
- Exact projection formula details
- Chart styling and colors
- Animation effects on the chart
- Sort order of asset categories

</decisions>

<canonical_refs>
## Canonical References

No external specs — requirements fully captured in decisions above.

### Data Sources
- `src/hooks/assessment/useBalanceSheet.ts` — Balance sheet query (assets + liabilities)
- `src/lib/assessment-api.ts:100` — BalanceSheetData, PortfolioAnalysis, AssetItem, LiabilityItem interfaces
- `src/hooks/dashboard/useDashboardSummary.ts` — Central dashboard data

### UI Patterns
- `src/app/(protected)/dashboard/layout.tsx` — Dashboard layout with sidebar tabs
- `src/app/(protected)/dashboard/goals/page.tsx` — Recently created Goals tab (pattern reference)
- `src/hooks/useAppTheme.ts` — Theme hook

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useBalanceSheetQuery`: Fetches assets + liabilities with CRUD hooks
- `useDashboardSummary`: Returns aggregated financial data
- Recharts: Already installed and used across calculator pages and dashboard
- `formatToCrLakh`: Indian currency formatting
- Goals page pattern: Recent expandable card + chart template to follow

### Integration Points
- Dashboard layout sidebar — add "Net Worth" tab with Wallet/TrendingUp icon
- New `/dashboard/net-worth/page.tsx`

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches for net worth visualization.

</specifics>

<deferred>
## Deferred Ideas

- Historical net worth tracking (requires backend `/networth/history` endpoint — future phase)
- Monthly snapshot persistence in localStorage or backend

</deferred>

---

*Phase: 11-net-worth-trend-chart-track-over-months*
*Context gathered: 2026-04-12*
