# Phase 8: PDF Report Generation — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-12
**Phase:** 08-pdf-report-generation-financial-plan-tax-summary
**Areas discussed:** PDF Generation Approach, Report Types & Content, Report Styling, Download Trigger UX
**Mode:** --auto (all decisions auto-selected)

---

## PDF Generation Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Client-side (jsPDF + html2canvas) | No server infra needed, captures Recharts visuals, works on Amplify | [auto] |
| Server-side (API route + puppeteer) | Better fidelity but requires headless browser on server | |
| Backend API (Spring Boot generates PDF) | Offloads to backend but requires backend changes | |

**User's choice:** [auto] Client-side (jsPDF + html2canvas) — recommended default
**Notes:** No server infrastructure changes needed. html2canvas captures existing Recharts chart components as images.

---

## Report Types & Content

| Option | Description | Selected |
|--------|-------------|----------|
| Two reports: Financial Plan + Tax Summary | Matches phase goal exactly, covers core user needs | [auto] |
| Single comprehensive report | One large PDF with everything | |
| Three reports (add Insurance Analysis) | More granular but more UI complexity | |

**User's choice:** [auto] Two reports — recommended default matching phase name
**Notes:** Financial Plan Summary covers health score, goals, projections, actions. Tax Summary covers regime comparison, deductions, recommendations.

---

## Report Styling

| Option | Description | Selected |
|--------|-------------|----------|
| Branded with logo, charts, clean tables | Professional look, consistent with app branding | [auto] |
| Minimal text-only tables | Simpler to implement but less polished | |
| Full dashboard screenshot | Easiest but poor print quality | |

**User's choice:** [auto] Branded with logo and charts — recommended default
**Notes:** White background for print readability (not dark theme). A4 portrait. Accent green #10B981.

---

## Download Trigger UX

| Option | Description | Selected |
|--------|-------------|----------|
| Dashboard header button with dropdown | Centralized, discoverable, clean | [auto] |
| Per-tab download buttons | Contextual but scattered | |
| Dedicated "Reports" page | Full page for report options | |

**User's choice:** [auto] Dashboard header button with dropdown — recommended default
**Notes:** Loading spinner during generation. Descriptive file names with date.

---

## Claude's Discretion

- jsPDF table styling details
- Page break logic
- jspdf-autotable plugin vs manual tables
- Chart dimensions in PDF

## Deferred Ideas

None.
