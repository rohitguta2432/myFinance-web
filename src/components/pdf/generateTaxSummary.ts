// generateTaxSummary.ts — Tax Summary PDF generator.
// All jsPDF and jspdf-autotable imports are dynamic (inside function body)
// to prevent SSR crash ("window is not defined") in Next.js.

import {
    addBrandedHeader,
    addDisclaimerFooter,
    checkPageBreak,
    formatForPdf,
    getDateString,
    getFormattedDate,
    PDF_CONTENT_W,
    PDF_MARGIN,
    PDF_PAGE_W,
} from "@/lib/pdf-utils";

// ─── Data Interface ───────────────────────────────────────────────────────────

export interface TaxSummaryData {
    userName: string;
    grossIncome: number;
    incomeBreakdown: Array<{ source: string; amount: number }>;
    regimeComparison: {
        old: {
            grossIncome: number;
            stdDeduction: number;
            totalDeductions: number;
            taxableIncome: number;
            baseTax: number;
            cess: number;
            totalTax: number;
            effectiveRate: number;
        };
        new: {
            grossIncome: number;
            stdDeduction: number;
            totalDeductions: number;
            taxableIncome: number;
            baseTax: number;
            cess: number;
            totalTax: number;
            effectiveRate: number;
        };
        recommended: "old" | "new";
        savings: number;
    };
    deductions: Array<{
        label: string;
        sublabel: string;
        amount: number;
        max: number;
        gap: number;
        potentialSaving: number;
        status: "full" | "partial" | "unused";
    }>;
    totalDeductions: number;
    optimizationSuggestions: string[];
}

// ─── Generator ────────────────────────────────────────────────────────────────

/**
 * Generates and downloads a Tax Summary PDF.
 * Dynamic imports ensure no SSR crash. Uses jspdf-autotable v5 standalone
 * function pattern: autoTable(doc, {...}) — NOT doc.autoTable().
 */
export async function generateTaxSummary(data: TaxSummaryData): Promise<void> {
    // Dynamic imports — must stay inside function body
    const { jsPDF } = await import("jspdf");
    const { autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const docAny = doc as any;

    let y = 0;
    const formattedDate = getFormattedDate();

    // Helper: get finalY after an autoTable call
    const getTableY = (): number => (docAny.lastAutoTable?.finalY ?? y) + 8;

    // Helper: draw a section heading
    const sectionTitle = (title: string, yPos: number): number => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42); // #0F172A
        doc.text(title, PDF_MARGIN, yPos);
        return yPos + 6;
    };

    // ── Section 1: Header ─────────────────────────────────────────────────────
    addBrandedHeader(doc, "Tax Summary");

    y = 28;
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Prepared for: ${data.userName}`, PDF_MARGIN, y);
    doc.text(`Generated: ${formattedDate}`, PDF_PAGE_W - PDF_MARGIN, y, { align: "right" });
    y = 38;

    // ── Section 2: Income Breakdown ───────────────────────────────────────────
    y = checkPageBreak(doc, y, 30);
    y = sectionTitle("Income Breakdown", y);
    autoTable(doc, {
        startY: y,
        head: [["Income Source", "Annual Amount"]],
        body: [
            ...data.incomeBreakdown.map((item) => [item.source, formatForPdf(item.amount)]),
            ["Total Gross Income", formatForPdf(data.grossIncome)],
        ],
        theme: "grid",
        headStyles: {
            fillColor: [16, 185, 129],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
        },
        bodyStyles: { fontSize: 9, textColor: [15, 23, 42] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
            0: { cellWidth: 100 },
            1: { cellWidth: PDF_CONTENT_W - 100 },
        },
        margin: { left: PDF_MARGIN, right: PDF_MARGIN },
        // Bold the total row (last row)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        didParseCell: (hookData: any) => {
            if (
                hookData.section === "body" &&
                hookData.row.index === data.incomeBreakdown.length
            ) {
                hookData.cell.styles.fontStyle = "bold";
            }
        },
    });
    y = getTableY();

    // ── Section 3: Old vs New Regime Comparison ───────────────────────────────
    y = checkPageBreak(doc, y, 60);
    y = sectionTitle("Tax Regime Comparison", y);
    const { old: oldRegime, new: newRegime } = data.regimeComparison;
    const totalTaxRowIndex = 6; // 0-based index of "Total Tax" row
    autoTable(doc, {
        startY: y,
        head: [["", "Old Regime", "New Regime"]],
        body: [
            ["Gross Income", formatForPdf(oldRegime.grossIncome), formatForPdf(newRegime.grossIncome)],
            ["Standard Deduction", formatForPdf(oldRegime.stdDeduction), formatForPdf(newRegime.stdDeduction)],
            ["Total Deductions", formatForPdf(oldRegime.totalDeductions), formatForPdf(newRegime.totalDeductions)],
            ["Taxable Income", formatForPdf(oldRegime.taxableIncome), formatForPdf(newRegime.taxableIncome)],
            ["Base Tax", formatForPdf(oldRegime.baseTax), formatForPdf(newRegime.baseTax)],
            ["Cess (4%)", formatForPdf(oldRegime.cess), formatForPdf(newRegime.cess)],
            ["Total Tax", formatForPdf(oldRegime.totalTax), formatForPdf(newRegime.totalTax)],
            ["Effective Rate", `${oldRegime.effectiveRate.toFixed(1)}%`, `${newRegime.effectiveRate.toFixed(1)}%`],
        ],
        theme: "grid",
        headStyles: {
            fillColor: [16, 185, 129],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
        },
        bodyStyles: { fontSize: 9, textColor: [15, 23, 42] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: (PDF_CONTENT_W - 60) / 2 },
            2: { cellWidth: (PDF_CONTENT_W - 60) / 2 },
        },
        margin: { left: PDF_MARGIN, right: PDF_MARGIN },
        // Bold the "Total Tax" row
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        didParseCell: (hookData: any) => {
            if (hookData.section === "body" && hookData.row.index === totalTaxRowIndex) {
                hookData.cell.styles.fontStyle = "bold";
            }
        },
    });
    y = getTableY();

    // ── Section 4: Recommended Regime ─────────────────────────────────────────
    y = checkPageBreak(doc, y, 20);
    const recommended = data.regimeComparison.recommended === "old" ? "Old" : "New";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`Recommended: ${recommended} Regime`, PDF_MARGIN, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
        `You save ${formatForPdf(data.regimeComparison.savings)} annually by choosing the ${recommended} Regime.`,
        PDF_MARGIN,
        y,
        { maxWidth: PDF_CONTENT_W }
    );
    y += 10;

    // ── Section 5: Deductions Breakdown ───────────────────────────────────────
    if (data.deductions.length > 0) {
        y = checkPageBreak(doc, y, 40);
        y = sectionTitle("Deductions Breakdown (Section 80C/80D)", y);
        autoTable(doc, {
            startY: y,
            head: [["Deduction", "Section", "Amount", "Limit", "Unutilized", "Status"]],
            body: [
                ...data.deductions.map((item) => [
                    item.label,
                    item.sublabel,
                    formatForPdf(item.amount),
                    formatForPdf(item.max),
                    formatForPdf(item.gap),
                    item.status.toUpperCase(),
                ]),
                ["Total", "", formatForPdf(data.totalDeductions), "", "", ""],
            ],
            theme: "grid",
            headStyles: {
                fillColor: [16, 185, 129],
                textColor: [255, 255, 255],
                fontStyle: "bold",
                fontSize: 9,
            },
            bodyStyles: { fontSize: 9, textColor: [15, 23, 42] },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            columnStyles: {
                0: { cellWidth: 40 },
                1: { cellWidth: 25 },
                2: { cellWidth: 30 },
                3: { cellWidth: 30 },
                4: { cellWidth: 30 },
                5: { cellWidth: PDF_CONTENT_W - 155 },
            },
            margin: { left: PDF_MARGIN, right: PDF_MARGIN },
            // Color-code status and bold total row
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            didParseCell: (hookData: any) => {
                if (hookData.section === "body" && hookData.column.index === 5) {
                    const status = hookData.row.raw[5];
                    if (status === "FULL") hookData.cell.styles.textColor = [5, 150, 105];     // #059669 green
                    else if (status === "PARTIAL") hookData.cell.styles.textColor = [217, 119, 6]; // #D97706 amber
                    else if (status === "UNUSED") hookData.cell.styles.textColor = [220, 38, 38];  // #DC2626 red
                }
                // Bold the total row (last row)
                if (
                    hookData.section === "body" &&
                    hookData.row.index === data.deductions.length
                ) {
                    hookData.cell.styles.fontStyle = "bold";
                }
            },
        });
        y = getTableY();
    }

    // ── Section 6: Tax Optimization Suggestions ───────────────────────────────
    if (data.optimizationSuggestions.length > 0) {
        y = checkPageBreak(doc, y, 30);
        y = sectionTitle("Tax Optimization Suggestions", y);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);

        for (const suggestion of data.optimizationSuggestions) {
            y = checkPageBreak(doc, y, 10);
            const lines = doc.splitTextToSize(`• ${suggestion}`, PDF_CONTENT_W - 4);
            doc.text(lines, PDF_MARGIN + 2, y);
            y += lines.length * 5;
        }
    }

    // ── Footer on all pages ───────────────────────────────────────────────────
    addDisclaimerFooter(doc);

    // ── Save ──────────────────────────────────────────────────────────────────
    doc.save(`MyFinancial_Tax_${getDateString()}.pdf`);
}
