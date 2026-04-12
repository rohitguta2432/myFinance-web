# Phase 8: PDF Report Generation — Context

**Gathered:** 2026-04-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Generate downloadable PDF reports from the user's financial data. Two report types: Financial Plan Summary and Tax Summary. Client-side generation using existing dashboard/assessment data. No new backend endpoints needed.

</domain>

<decisions>
## Implementation Decisions

### PDF Generation Approach
- **D-01:** Client-side generation using jsPDF + html2canvas — no server-side rendering needed
- **D-02:** html2canvas captures Recharts chart visuals as images for embedding in PDFs
- **D-03:** No puppeteer or headless browser — keeps deployment simple on AWS Amplify

### Report Types & Content
- **D-04:** Two reports: (1) Financial Plan Summary, (2) Tax Summary
- **D-05:** Financial Plan Summary includes: user profile header, financial health score with pillar breakdown, red flags, goal projections with SIP amounts, action plan priorities, insurance gap highlights, asset allocation pie chart
- **D-06:** Tax Summary includes: income breakdown, old vs new regime comparison table, 80C/80D deductions itemized, recommended regime with savings amount, tax optimization suggestions
- **D-07:** Both reports include: MyFinancial branding header, generation date, user name, disclaimer footer

### Report Styling
- **D-08:** Branded header with MyFinancial logo and accent green (#10B981)
- **D-09:** Clean table layouts for data sections — no complex CSS, direct jsPDF table drawing
- **D-10:** Charts rendered via html2canvas from existing dashboard Recharts components, embedded as images
- **D-11:** Use consistent dark text on white background for print readability (not dark theme)
- **D-12:** A4 page size, portrait orientation

### Download Trigger UX
- **D-13:** Single "Download Report" button in the dashboard header/action area
- **D-14:** Clicking shows a dropdown with "Financial Plan" and "Tax Summary" options
- **D-15:** Loading spinner on the button while PDF generates (html2canvas can take 1-2 seconds)
- **D-16:** File names: `MyFinancial_Plan_{date}.pdf` and `MyFinancial_Tax_{date}.pdf`

### Claude's Discretion
- jsPDF table styling details (column widths, cell padding, fonts)
- Page break logic for long reports
- Whether to use jspdf-autotable plugin or manual table drawing
- Exact chart dimensions in the PDF

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above.

### Data Sources
- `src/hooks/dashboard/useDashboardSummary.ts` — Central dashboard data hook (health score, red flags, actions)
- `src/hooks/assessment/useTaxCalculation.ts` — Tax regime comparison data
- `src/hooks/assessment/useGoalProjection.ts` — Goal feasibility projections
- `src/store/useAssessmentStore.ts` — All assessment data (profile, income, expenses, assets, liabilities, goals, insurance)
- `src/lib/assessment-api.ts` — API helper functions for assessment endpoints

### Existing Patterns
- `src/hooks/useAppTheme.ts` — Theme hook (PDF uses light/print theme regardless of user preference)
- `src/lib/calculator-utils.ts` — INR formatting utilities (`formatINR`, `formatPercent`)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useDashboardSummary` hook: Single API call provides health score, red flags, action plan, insurance analysis, tax planning data
- `useTaxCalculationQuery` hook: Fetches old vs new regime comparison with deduction params
- `useAssessmentStore`: All user financial data persisted in Zustand — accessible without API calls
- `formatINR()` / `formatPercent()` in calculator-utils: Indian number formatting for PDF content
- Recharts chart components in dashboard tabs: Can be captured with html2canvas for PDF embedding

### Established Patterns
- Client-side data fetching via TanStack Query with caching
- "use client" directive for all interactive components
- Inline styles (CSSProperties objects) — no CSS modules
- Component-scoped style tags for responsive layouts

### Integration Points
- Dashboard layout (`src/app/(protected)/dashboard/`) — Download button goes in the header area
- Navbar or dashboard section nav — link to download functionality
- Existing Recharts chart components — captured as images for PDF

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches for jsPDF + html2canvas PDF generation.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 08-pdf-report-generation-financial-plan-tax-summary*
*Context gathered: 2026-04-12*
