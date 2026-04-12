# Phase 7: Public Calculator Pages — Context

**Gathered:** 2026-04-12
**Status:** Ready for planning
**Mode:** Auto-generated (autonomous mode)

<domain>
## Phase Boundary

Create public calculator pages accessible without login. These serve as SEO landing pages and user acquisition tools. Each calculator is a standalone page under `/calculators/`.

Calculators to build:
1. SIP Calculator — monthly investment → future value
2. Lumpsum Calculator — one-time investment → future value
3. EMI Calculator — loan amount → monthly payment
4. PPF Calculator — yearly deposit → maturity value (15yr lock-in)
5. FD Calculator — deposit → maturity with compounding
6. HRA Calculator — rent paid → tax exemption amount
7. NPS Calculator — monthly contribution → retirement corpus
8. Retirement Calculator — current age/expenses → required corpus
9. SWP Calculator — corpus → monthly withdrawal sustainability
10. Inflation Calculator — current cost → future cost

</domain>

<decisions>
## Implementation Decisions

### URL Structure
- `/calculators` — index page listing all calculators with cards
- `/calculators/sip` — individual calculator pages
- All public (no auth required), server-rendered for SEO

### UI Pattern
- Each calculator: input form on left, result visualization on right (desktop)
- Stacked on mobile (inputs top, results bottom)
- Use the same dark/light theme support from Phase 6
- Indian number formatting (₹, Lakhs, Crores)
- Interactive sliders + number inputs for key values
- Recharts for visualization (already installed)

### SEO
- Each page has unique meta title, description, and OG tags
- Schema.org `FAQPage` markup on each calculator
- Internal links between related calculators
- Add "Calculators" link to main navbar

### Shared Components
- Create a reusable `CalculatorLayout` component
- Create a reusable `ResultCard` component
- Create a reusable `SliderInput` component with formatted value display

### Claude's Discretion
- Exact formula implementations (standard financial formulas)
- Chart type per calculator (line, bar, pie as appropriate)
- FAQ content for each calculator
- Number of input fields per calculator

</decisions>

<code_context>
## Existing Code Insights

- Recharts 3.8.1 already installed
- Theme system (useAppTheme) available from Phase 6
- Indian number formatting exists in assessment pages
- globals.css has design tokens for both themes
- No existing calculator pages in the codebase

</code_context>

<specifics>
## Specific Ideas

- Start with 5 most popular: SIP, EMI, FD, PPF, HRA
- Add remaining 5 in same phase if time permits
- Each calculator page should have a CTA: "Get Your Full Financial Diagnosis →"
- Show comparison charts (e.g., SIP vs Lumpsum, Old vs New tax regime for HRA)

</specifics>

<deferred>
## Deferred Ideas

- Calculator result sharing (social media cards)
- Save calculator results to user profile
- Calculator history

</deferred>
