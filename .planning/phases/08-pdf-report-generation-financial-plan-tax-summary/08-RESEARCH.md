# Phase 8: PDF Report Generation — Research

**Researched:** 2026-04-12
**Domain:** Client-side PDF generation with jsPDF + html2canvas in Next.js 15
**Confidence:** HIGH (core stack verified via npm registry; API patterns cited from official docs and GitHub)

---

## Summary

Phase 8 adds downloadable PDF reports to the dashboard. Two report types — Financial Plan Summary and Tax Summary — are generated entirely client-side using jsPDF 4.2.1 and jspdf-autotable 5.0.7. No server involvement; all data comes from existing hooks (`useDashboardSummary`, `useTaxAnalysis`, `useAssessmentStore`).

The key architectural decision is generating PDFs using jsPDF's imperative drawing API (text, tables via autoTable, images via addImage) rather than capturing a full page with html2canvas. html2canvas is used only for capturing the Recharts projection chart as a raster image to embed. This avoids the dark-background SVG rendering pitfalls of html2canvas on the full dashboard DOM.

A critical pitfall: jsPDF's built-in fonts (Helvetica, Times, Courier) do not support the Indian rupee symbol (₹ — U+20B9). All currency values in PDF output must use "Rs." as the prefix instead of "₹", or a custom Unicode font (Noto Sans) must be embedded as a base64 TTF. Given the complexity of font embedding, the recommended approach is to use "Rs." in PDF content only, with a note that the app's formatINR() output must be post-processed for PDF.

**Primary recommendation:** Use jsPDF 4.2.1 + jspdf-autotable 5.0.7 with imperative drawing API. Capture the projection chart with html2canvas as a one-off image. Use `import()` dynamic imports inside the button handler (not at module level) to avoid SSR issues. Replace all ₹ symbols with "Rs." in PDF strings.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: Client-side generation using jsPDF + html2canvas — no server-side rendering needed
- D-02: html2canvas captures Recharts chart visuals as images for embedding in PDFs
- D-03: No puppeteer or headless browser — keeps deployment simple on AWS Amplify
- D-04: Two reports: (1) Financial Plan Summary, (2) Tax Summary
- D-05: Financial Plan Summary includes: user profile header, financial health score with pillar breakdown, red flags, goal projections with SIP amounts, action plan priorities, insurance gap highlights, asset allocation pie chart
- D-06: Tax Summary includes: income breakdown, old vs new regime comparison table, 80C/80D deductions itemized, recommended regime with savings amount, tax optimization suggestions
- D-07: Both reports include: MyFinancial branding header, generation date, user name, disclaimer footer
- D-08: Branded header with MyFinancial logo and accent green (#10B981)
- D-09: Clean table layouts for data sections — no complex CSS, direct jsPDF table drawing
- D-10: Charts rendered via html2canvas from existing dashboard Recharts components, embedded as images
- D-11: Use consistent dark text on white background for print readability (not dark theme)
- D-12: A4 page size, portrait orientation
- D-13: Single "Download Report" button in the dashboard header/action area
- D-14: Clicking shows a dropdown with "Financial Plan" and "Tax Summary" options
- D-15: Loading spinner on the button while PDF generates (html2canvas can take 1-2 seconds)
- D-16: File names: `MyFinancial_Plan_{date}.pdf` and `MyFinancial_Tax_{date}.pdf`

### Claude's Discretion
- jsPDF table styling details (column widths, cell padding, fonts)
- Page break logic for long reports
- Whether to use jspdf-autotable plugin or manual table drawing
- Exact chart dimensions in the PDF

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| jspdf | 4.2.1 | PDF creation — text, images, drawing | De facto standard client-side PDF; A4 support, TypeScript types built-in |
| jspdf-autotable | 5.0.7 | Table rendering plugin for jsPDF | Handles column widths, page breaks, cell styling automatically |
| html2canvas | 1.4.1 | Rasterize DOM node (Recharts chart) to PNG | Only option for capturing SVG-based charts as embeddable images |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| html2canvas-pro | 2.0.2 | Actively maintained html2canvas fork | If original html2canvas fails on chart capture (SVG CSS issues) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| jsPDF imperative API | html2canvas full page capture | Full-page capture includes dark theme, requires theme switching, worse quality |
| jspdf-autotable | Manual `doc.text()` grid | autotable handles page breaks and col widths automatically — don't hand-roll |
| html2canvas chart capture | Skip charts in PDF | Charts add value; capture is 1 html2canvas call, not whole page |

**Installation:**
```bash
npm install jspdf jspdf-autotable html2canvas
```

**Version verification:** [VERIFIED: npm registry 2026-04-12]
- `jspdf@4.2.1` — published 2026-03-17
- `jspdf-autotable@5.0.7` — published 2026-01-04
- `html2canvas@1.4.1` — published 2022-01-22 (stable, not actively maintained but widely used)
- `html2canvas-pro@2.0.2` — published 2026-02-26 (fallback if original fails)

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── lib/
│   └── pdf-utils.ts          # formatForPdf() currency helper, page constants
├── components/
│   └── pdf/
│       ├── DownloadReportButton.tsx   # Dropdown trigger + loading state
│       ├── generateFinancialPlan.ts   # Financial Plan PDF generator function
│       └── generateTaxSummary.ts      # Tax Summary PDF generator function
```

### Pattern 1: Dynamic Import in Button Handler
**What:** Import jsPDF and html2canvas inside the async onClick handler using `await import()`. Never at module top-level.
**When to use:** Always — jsPDF references `window` at import time and will crash during Next.js SSR even with `"use client"`.
**Example:**
```typescript
// Source: github.com/parallax/jsPDF/issues/1959 + Next.js dynamic import pattern
async function handleDownload(type: "plan" | "tax") {
  setIsGenerating(true);
  try {
    const { jsPDF } = await import("jspdf");
    const { autoTable } = await import("jspdf-autotable");
    // ... generate PDF
    doc.save(`MyFinancial_Plan_${date}.pdf`);
  } finally {
    setIsGenerating(false);
  }
}
```

### Pattern 2: Programmatic PDF Content (Not Full-Page Capture)
**What:** Use jsPDF's drawing API to construct report content section by section, not by capturing the dashboard DOM.
**When to use:** For structured data (tables, scores, text blocks). Use html2canvas only for the chart image.
**Example:**
```typescript
// Source: jsPDF official docs + jspdf-autotable README
const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

// A4 dimensions: 210mm wide × 297mm tall
const PAGE_W = 210;
const MARGIN = 14;
const CONTENT_W = PAGE_W - MARGIN * 2;

// Header bar
doc.setFillColor("#10B981");
doc.rect(0, 0, PAGE_W, 20, "F");
doc.setTextColor("#FFFFFF");
doc.setFontSize(14);
doc.setFont("helvetica", "bold");
doc.text("MyFinancial — Financial Plan Summary", MARGIN, 13);

// Body text
doc.setTextColor("#0F172A");
doc.setFontSize(10);
doc.setFont("helvetica", "normal");
doc.text(`Generated: ${new Date().toLocaleDateString("en-IN")}`, MARGIN, 28);

// Table via autoTable
autoTable(doc, {
  startY: currentY,
  head: [["Metric", "Value"]],
  body: [
    ["Financial Health Score", `${score}/100`],
    ["Net Worth", formatForPdf(netWorth)],
    ["Monthly Surplus", formatForPdf(surplus)],
  ],
  theme: "grid",
  headStyles: { fillColor: "#10B981", textColor: "#FFFFFF", fontStyle: "bold", fontSize: 9 },
  bodyStyles: { fontSize: 9, textColor: "#0F172A" },
  columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: CONTENT_W - 80 } },
  margin: { left: MARGIN, right: MARGIN },
});

// Track Y position after table
currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
```

### Pattern 3: html2canvas Chart Capture
**What:** Capture the Recharts chart DOM node as PNG, embed via addImage.
**When to use:** For the projection chart section in the Financial Plan report.
**Example:**
```typescript
// Source: html2canvas docs + github.com/niklasvh/html2canvas/issues/1860
const chartEl = document.getElementById("pdf-projection-chart");
if (chartEl) {
  const canvas = await html2canvas(chartEl, {
    backgroundColor: "#ffffff",   // Force white — prevents SVG black background bug
    scale: 2,                      // 2x for print quality
    useCORS: true,
    logging: false,
  });
  const imgData = canvas.toDataURL("image/png");
  const imgH = (canvas.height / canvas.width) * CONTENT_W;
  doc.addImage(imgData, "PNG", MARGIN, currentY, CONTENT_W, imgH);
  currentY += imgH + 8;
}
```

**Chart element setup:** Render an offscreen or hidden Recharts chart with white background and `id="pdf-projection-chart"` specifically for capture. Do not capture the live dark-themed dashboard chart.

### Pattern 4: Multi-Page Handling with finalY
**What:** Track `doc.lastAutoTable.finalY` after each section; add new page when remaining space is insufficient.
**When to use:** After every table render, before adding next section.
**Example:**
```typescript
// Source: jspdf-autotable docs (doc.lastAutoTable.finalY)
const FOOTER_RESERVE = 20; // mm for disclaimer footer
const PAGE_H = 297;

function checkPageBreak(doc: jsPDF, currentY: number, neededHeight: number): number {
  if (currentY + neededHeight > PAGE_H - FOOTER_RESERVE) {
    doc.addPage();
    return 20; // top margin on new page
  }
  return currentY;
}
```

### Pattern 5: Currency Formatting for PDF
**What:** Replace ₹ symbol with "Rs." since jsPDF built-in fonts lack the U+20B9 glyph.
**When to use:** All currency values written via jsPDF text/table calls.
**Example:**
```typescript
// Source: jsPDF issue #1351 + #2676 — rupee symbol outputs as superscript-1 with built-in fonts
export function formatForPdf(value: number): string {
  if (Math.abs(value) >= 1e7) return `Rs. ${(value / 1e7).toFixed(2)} Cr`;
  if (Math.abs(value) >= 1e5) return `Rs. ${(value / 1e5).toFixed(2)} L`;
  return `Rs. ${Math.round(value).toLocaleString("en-IN")}`;
}
```

### Pattern 6: Dropdown Button Component
**What:** Download Report button with dropdown, loading state, and outside-click dismiss.
**When to use:** In the dashboard header/action area (dashboard layout.tsx).
**Example:**
```typescript
"use client";
// Inline styles per project convention; useState for open/loading state
function DownloadReportButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<"plan" | "tax" | null>(null);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        disabled={loading !== null}
        style={{ /* green accent button per D-08 */ }}
      >
        {loading ? <Spinner /> : "Download Report"}
        <ChevronDown size={16} />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "100%", right: 0, zIndex: 50, /* dropdown styles */ }}>
          <button onClick={() => handleDownload("plan")}>Financial Plan</button>
          <button onClick={() => handleDownload("tax")}>Tax Summary</button>
        </div>
      )}
    </div>
  );
}
```

### Anti-Patterns to Avoid
- **Top-level jsPDF import:** `import { jsPDF } from "jspdf"` at module level crashes Next.js SSR. Use `await import("jspdf")` inside the handler.
- **Capturing the live dashboard with html2canvas:** The dark theme (#0B0F1A) leaks into the PDF. Create isolated white-background DOM nodes for capture.
- **Using ₹ symbol directly in jsPDF text:** Renders as incorrect glyph with built-in fonts. Use "Rs." prefix.
- **Calling `doc.autoTable()` method:** jspdf-autotable v5 removed auto-plugin — use `autoTable(doc, {...})` function import instead. [VERIFIED: jspdf-autotable GitHub v5 release notes]

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Table layout in PDF | Manual `doc.text()` grid with x/y math | `autoTable(doc, {...})` from jspdf-autotable | Column widths, page breaks, cell padding, header repetition all handled |
| Multi-page tracking | Custom Y-position arithmetic across pages | `doc.lastAutoTable.finalY` + `doc.addPage()` | autoTable manages page breaks internally; finalY gives correct Y after render |
| Chart-to-image | Canvas drawing API for bar/line charts | html2canvas on a hidden Recharts component | Recharts SVG is already pixel-perfect; re-drawing is error-prone |
| Font size / line height calculation | Manual line wrapping math | `doc.splitTextToSize(text, maxWidth)` | Handles word wrap; returns array of lines for `doc.text()` |

**Key insight:** jsPDF's imperative API is mature — the only custom logic needed is "what content goes where". Never rebuild features that autoTable and jsPDF's built-in text utilities already provide.

---

## Common Pitfalls

### Pitfall 1: SSR Crash — "window is not defined"
**What goes wrong:** Importing jsPDF or html2canvas at the top of a `"use client"` component still triggers SSR execution (Next.js pre-renders client components to HTML). The import runs on the server where `window` is undefined, throwing a ReferenceError.
**Why it happens:** `"use client"` marks the component boundary but doesn't disable server rendering. Next.js still renders client components server-side for the initial HTML frame.
**How to avoid:** Always use `const { jsPDF } = await import("jspdf")` inside the async button handler. Never at module level.
**Warning signs:** Build error or runtime crash with `ReferenceError: window is not defined`. [VERIFIED: github.com/parallax/jsPDF/issues/1959, github.com/parallax/jsPDF/issues/2408]

### Pitfall 2: Black Background on SVG/Chart Capture
**What goes wrong:** html2canvas captures transparent SVG backgrounds as black, making chart images unusable in the white-background PDF.
**Why it happens:** html2canvas doesn't handle transparent backgrounds on SVG foreignObject elements correctly; defaults to black fill.
**How to avoid:** Pass `backgroundColor: "#ffffff"` in html2canvas options. Also, render the capturable chart in a dedicated DOM node that has an explicit `background: "#ffffff"` CSS property.
**Warning signs:** Downloaded PDF shows chart with solid black background. [CITED: github.com/niklasvh/html2canvas/issues/1860]

### Pitfall 3: Rupee Symbol Renders as Garbage Characters
**What goes wrong:** `doc.text("₹12,34,567", x, y)` outputs a superscript-1 or garbage glyph in the PDF.
**Why it happens:** jsPDF's 14 built-in standard fonts (Helvetica, Times, Courier) only cover ASCII/Latin-1. The rupee symbol U+20B9 is not in their character set.
**How to avoid:** Replace all ₹ occurrences with "Rs." in PDF-bound strings using `formatForPdf()`. Alternatively, embed a Unicode font (Noto Sans) as base64 TTF — complex but allows ₹ symbol.
**Warning signs:** Testing generated PDF shows wrong glyph where currency values appear. [CITED: github.com/parallax/jsPDF/issues/1351, github.com/parallax/jsPDF/issues/2676]

### Pitfall 4: jspdf-autotable v5 API Changed
**What goes wrong:** `doc.autoTable({...})` throws "doc.autoTable is not a function" with jspdf-autotable v5.
**Why it happens:** v5 removed automatic plugin injection into jsPDF instances. The old pattern of calling `doc.autoTable()` no longer works.
**How to avoid:** Always use `import { autoTable } from "jspdf-autotable"` and call `autoTable(doc, {...})` as a standalone function.
**Warning signs:** TypeScript error or runtime error on `doc.autoTable`. [VERIFIED: jspdf-autotable GitHub issue #997, v5 release]

### Pitfall 5: html2canvas 1.4.1 is Unmaintained — Some CSS Fails
**What goes wrong:** Complex CSS (clip-path, some gradients, CSS variables) does not render in html2canvas. Chart captures may be partial or blank.
**Why it happens:** html2canvas 1.4.1 was released in January 2022 and has not been updated since. CSS support is frozen at that point.
**How to avoid:** Keep the capturable chart node simple — no CSS variables (`var(--foo)`), no clip-path. Use inline hex colors directly. If capture fails, switch to `html2canvas-pro@2.0.2` (drop-in replacement, published 2026-02-26).
**Warning signs:** Partial or blank chart capture. Import path stays the same for html2canvas-pro if swapping.

### Pitfall 6: Content Cut Off at Page Boundary
**What goes wrong:** A table row or text block is split mid-element by a page break, leaving content half on one page and half on the next.
**Why it happens:** Not using `startY` to position content, or placing content past the printable area.
**How to avoid:** Track `currentY` throughout the generator function. Call `checkPageBreak(doc, currentY, estimatedHeight)` before each section. Use autoTable's built-in page break handling (it handles row-level breaks automatically).
**Warning signs:** PDF content appears clipped; footer overlaps body on some pages.

### Pitfall 7: Long Generation Blocks UI Thread
**What goes wrong:** html2canvas + jsPDF generation (especially with `scale: 2`) takes 2-4 seconds and freezes the browser tab if run synchronously.
**Why it happens:** Canvas operations and PDF generation are CPU-intensive.
**How to avoid:** The async/await pattern with `setIsGenerating(true)` allows React to re-render the spinner before generation starts. Don't add `await new Promise(resolve => setTimeout(resolve, 0))` — the async imports already yield execution.
**Warning signs:** Spinner never appears because state update is blocked by synchronous work.

---

## Code Examples

### Complete Generator Skeleton
```typescript
// Source: Synthesized from jsPDF docs, jspdf-autotable docs, project conventions
// src/components/pdf/generateFinancialPlan.ts

export async function generateFinancialPlan(data: FinancialPlanData): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const { autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN = 14;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  let y = 0;

  // --- Header ---
  doc.setFillColor(16, 185, 129); // #10B981
  doc.rect(0, 0, PAGE_W, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("MyFinancial — Financial Plan Summary", MARGIN, 14);

  y = 28;
  doc.setTextColor(15, 23, 42); // #0F172A
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Prepared for: ${data.userName}`, MARGIN, y);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`, PAGE_W - MARGIN, y, { align: "right" });
  y += 10;

  // --- Health Score Table ---
  autoTable(doc, {
    startY: y,
    head: [["Financial Health Score", `${data.totalScore}/100 — ${data.scoreLabel}`]],
    body: data.pillars.map(p => [p.name, `${p.score}/${p.maxScore}`]),
    theme: "grid",
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [15, 23, 42] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: { 0: { cellWidth: 100 }, 1: { cellWidth: CONTENT_W - 100 } },
    margin: { left: MARGIN, right: MARGIN },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  // --- ... more sections ---

  // --- Disclaimer Footer (last page) ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(MARGIN, PAGE_H - 14, PAGE_W - MARGIN, PAGE_H - 14);
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(
      "This report is for informational purposes only and does not constitute financial advice. Past performance is not indicative of future results.",
      MARGIN, PAGE_H - 8,
      { maxWidth: CONTENT_W }
    );
    doc.text(`Page ${i} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 8, { align: "right" });
  }

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  doc.save(`MyFinancial_Plan_${dateStr}.pdf`);
}
```

### Chart Capture Helper
```typescript
// Source: html2canvas docs + github.com/niklasvh/html2canvas/issues/1860
export async function captureChartAsImage(elementId: string): Promise<{ dataUrl: string; aspectRatio: number } | null> {
  const el = document.getElementById(elementId);
  if (!el) return null;

  const html2canvas = (await import("html2canvas")).default;
  const canvas = await html2canvas(el, {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true,
    logging: false,
    removeContainer: true,
  });
  return {
    dataUrl: canvas.toDataURL("image/png"),
    aspectRatio: canvas.height / canvas.width,
  };
}
```

### DownloadReportButton Integration Point
```typescript
// Placement: src/app/(protected)/dashboard/layout.tsx
// Add to the sidebar nav section — button triggers dropdown
// Data sourced from useDashboardSummary() and useTaxAnalysis() hooks
// called inside the generator functions (not passed as props)
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `doc.autoTable({...})` method on instance | `autoTable(doc, {...})` standalone function | jspdf-autotable v5 (2026-01-04) | Old API throws at runtime; must use new import pattern |
| Top-level `import { jsPDF }` in components | `await import("jspdf")` in async handler | Next.js App Router (2023+) | SSR crashes prevented |
| html2canvas (last release 2022) | html2canvas-pro 2.0.2 (2026-02-26) | 2024 fork | Drop-in replacement with active maintenance if needed |

**Deprecated/outdated:**
- `doc.autoTableSetDefaults()`: Removed in jspdf-autotable v5. Use `autoTable(doc, {...})` with per-call options.
- `doc.autoTableAddPage()`: Removed in v5. Use `doc.addPage()` instead.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Logo from `/public/myfinancial-logo.svg` can be converted to a PNG data URL at runtime using an Image element and Canvas for `doc.addImage()` | Architecture Patterns | If SVG-to-canvas fails in the browser, logo won't appear; fallback: skip logo or use text branding |
| A2 | The `useDashboardSummary()` data is already cached in TanStack Query when the download button is clicked (user is on the dashboard) | Architecture | If cache is stale, generator must await a fresh fetch before building PDF |
| A3 | `doc.getNumberOfPages()` is available in jsPDF 4.2.1 for adding footer to all pages | Code Examples | Alternative: track page count manually in willDrawPage hook |

---

## Open Questions

1. **Logo in PDF header (D-08)**
   - What we know: `/public/myfinancial-logo.svg` exists; jsPDF's `addImage()` accepts PNG/JPEG dataURL
   - What's unclear: SVG cannot be passed directly to `addImage()`. Need to rasterize SVG → Canvas → PNG first, or use `/public/myfinancial-logo.jpeg` (also present) directly via fetch + base64.
   - Recommendation: Use the JPEG version — fetch it as base64 in the generator, avoids SVG conversion complexity.

2. **Hidden chart DOM node for html2canvas capture**
   - What we know: D-10 says capture existing dashboard Recharts components
   - What's unclear: The live ProjectionChart uses dark CSS variables and a dark background. Capturing as-is will have dark background in PDF (pitfall 2).
   - Recommendation: Render a dedicated `<div id="pdf-projection-chart" style="background:#fff; position:absolute; left:-9999px">` with a white-background Recharts chart, capture that. Remove after generation.

3. **autoTable TypeScript type for `lastAutoTable.finalY`**
   - What we know: jspdf-autotable v5 improved TypeScript support but `doc.lastAutoTable` is not typed on the jsPDF type
   - Recommendation: Use `(doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY` cast as shown in examples.

---

## Environment Availability

Step 2.6: SKIPPED (no external tool dependencies — purely npm package + browser API)

---

## Validation Architecture

Phase 8 adds UI-only PDF download functionality. No business logic rules to unit-test. Validation is manual smoke testing.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None configured (no test runner in repo) |
| Config file | None |
| Quick run | Manual: click "Download Report" → verify PDF opens |
| Full suite | N/A |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Command | File Exists? |
|--------|----------|-----------|---------|-------------|
| N/A | Financial Plan PDF downloads without error | manual smoke | Click button | N/A |
| N/A | Tax Summary PDF downloads without error | manual smoke | Click button | N/A |
| N/A | Loading spinner appears during generation | visual | Observe UI | N/A |
| N/A | Currency values display as "Rs." not broken glyphs | visual | Inspect PDF | N/A |
| N/A | No SSR crash during page load | smoke | `npm run build` | N/A |

### Wave 0 Gaps
None — no automated test infrastructure required for this phase.

---

## Security Domain

PDF generation is purely client-side. No new API routes, no new authentication surfaces, no user data sent to servers.

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | — |
| V3 Session Management | no | — |
| V4 Access Control | no | Download button only shown on protected dashboard (existing auth) |
| V5 Input Validation | no | Data comes from already-validated backend API responses |
| V6 Cryptography | no | — |

### Known Threat Patterns
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Data exfiltration via PDF | Information Disclosure | PDF generated in user's browser, no server-side copy — inherently safe |
| Injection via user data in PDF | Tampering | jsPDF's text API does not evaluate content; no injection surface |

---

## Sources

### Primary (HIGH confidence)
- [VERIFIED: npm registry 2026-04-12] — jspdf@4.2.1, jspdf-autotable@5.0.7, html2canvas@1.4.1, html2canvas-pro@2.0.2 version and publish dates
- [CITED: github.com/simonbengtsson/jsPDF-AutoTable/issues/997] — v5 breaking change: `autoTable(doc, {...})` function import required; `doc.autoTable()` removed
- [CITED: github.com/parallax/jsPDF/issues/1351] — Rupee symbol U+20B9 not supported by built-in fonts; must use "Rs." or custom font
- [CITED: github.com/parallax/jsPDF/issues/1959] — jsPDF requires browser `window`; must use dynamic import in Next.js
- [CITED: github.com/niklasvh/html2canvas/issues/1860] — SVG captures default to black background; `backgroundColor: "#ffffff"` option required

### Secondary (MEDIUM confidence)
- [github.com/parallax/jsPDF/issues/2676] — Rupee symbol confirmed not rendering in exported PDFs (2020, still applies)
- [github.com/parallax/jsPDF/issues/2408] — SSR `window is not defined` bug report confirmed for Next.js
- [jspdf-autotable jsDocs.io/5.0.7] — autoTable standalone function API, `lastAutoTable.finalY` usage

### Tertiary (LOW confidence — training knowledge)
- jsPDF A4 dimensions (210×297mm), `doc.rect()`, `doc.text()`, `doc.setFillColor()` method names — [ASSUMED] consistent with jsPDF docs but not individually verified via tool this session

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified against npm registry 2026-04-12
- Architecture: HIGH — SSR pitfall and rupee symbol pitfall verified against official GitHub issues
- jspdf-autotable v5 API change: HIGH — verified against GitHub issue #997
- html2canvas SVG black background: HIGH — cited from html2canvas issue #1860
- jsPDF drawing API (rect, text, addImage signatures): MEDIUM — consistent with official docs; not re-verified via tool this session

**Research date:** 2026-04-12
**Valid until:** 2026-07-12 (stable libraries; jsPDF 4.x API unlikely to change)
