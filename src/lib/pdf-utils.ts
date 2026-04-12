// pdf-utils.ts — Shared utilities and constants for PDF report generation.
// No top-level imports of jsPDF or html2canvas — all browser-dependent code
// uses dynamic imports or accepts doc instances as parameters.

// ─── Page Constants ───────────────────────────────────────────────────────────

export const PDF_PAGE_W = 210;                             // A4 width in mm
export const PDF_PAGE_H = 297;                             // A4 height in mm
export const PDF_MARGIN = 14;                              // left/right margin in mm
export const PDF_CONTENT_W = PDF_PAGE_W - PDF_MARGIN * 2; // 182mm usable width
export const FOOTER_RESERVE = 20;                          // mm reserved for disclaimer footer

// ─── Currency Formatting ──────────────────────────────────────────────────────

/**
 * Converts a number to Indian compact currency with "Rs." prefix.
 * Avoids the rupee symbol (₹) which is not supported by jsPDF built-in fonts.
 *   >= 1 Crore  → "Rs. X.XX Cr"
 *   >= 1 Lakh   → "Rs. X.XX L"
 *   else        → "Rs. X,XX,XXX" (Indian grouping)
 */
export function formatForPdf(value: number): string {
    if (value === null || value === undefined || isNaN(value)) return "Rs. 0";
    const abs = Math.abs(value);
    if (abs >= 1e7) return `Rs. ${(value / 1e7).toFixed(2)} Cr`;
    if (abs >= 1e5) return `Rs. ${(value / 1e5).toFixed(2)} L`;
    return `Rs. ${Math.round(value).toLocaleString("en-IN")}`;
}

// ─── Page Break Helper ────────────────────────────────────────────────────────

/**
 * Checks if adding neededHeight at currentY would overflow the printable area.
 * If so, adds a new page and returns the top margin (20mm).
 * Otherwise returns currentY unchanged.
 *
 * The doc parameter is typed minimally to avoid importing jsPDF at module level.
 */
export function checkPageBreak(
    doc: { addPage: () => void },
    currentY: number,
    neededHeight: number
): number {
    if (currentY + neededHeight > PDF_PAGE_H - FOOTER_RESERVE) {
        doc.addPage();
        return 20;
    }
    return currentY;
}

// ─── Chart Capture ───────────────────────────────────────────────────────────

/**
 * Captures a DOM element as a PNG image for embedding in PDF.
 * Uses dynamic import to avoid SSR crash ("window is not defined").
 * Returns null if the element is not found.
 */
export async function captureChartAsImage(
    elementId: string
): Promise<{ dataUrl: string; aspectRatio: number } | null> {
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

// ─── Branded Header ───────────────────────────────────────────────────────────

/**
 * Draws the MyFinancial green header bar on the current page.
 * Accepts doc as `any` since jsPDF is dynamically imported.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addBrandedHeader(doc: any, title: string): void {
    doc.setFillColor(16, 185, 129); // #10B981
    doc.rect(0, 0, PDF_PAGE_W, 22, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(`MyFinancial — ${title}`, PDF_MARGIN, 14);
}

// ─── Disclaimer Footer ────────────────────────────────────────────────────────

/**
 * Iterates all pages and adds a disclaimer footer with page number.
 * Must be called after all content is written so page count is final.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addDisclaimerFooter(doc: any): void {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        // Separator line
        doc.setDrawColor(226, 232, 240); // light gray
        doc.line(PDF_MARGIN, PDF_PAGE_H - 14, PDF_PAGE_W - PDF_MARGIN, PDF_PAGE_H - 14);
        // Disclaimer text
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139); // #64748B
        doc.text(
            "This report is for informational purposes only and does not constitute financial advice. Past performance is not indicative of future results.",
            PDF_MARGIN,
            PDF_PAGE_H - 8,
            { maxWidth: PDF_CONTENT_W - 20 }
        );
        // Page number right-aligned
        doc.text(
            `Page ${i} of ${totalPages}`,
            PDF_PAGE_W - PDF_MARGIN,
            PDF_PAGE_H - 8,
            { align: "right" }
        );
    }
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

/** Returns YYYYMMDD string for use in file names. */
export function getDateString(): string {
    return new Date().toISOString().slice(0, 10).replace(/-/g, "");
}

/** Returns human-readable date formatted for Indian locale. */
export function getFormattedDate(): string {
    return new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}
