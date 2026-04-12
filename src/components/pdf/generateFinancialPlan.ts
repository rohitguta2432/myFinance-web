// generateFinancialPlan.ts — Financial Plan Summary PDF generator.
// All jsPDF and jspdf-autotable imports are dynamic (inside function body)
// to prevent SSR crash ("window is not defined") in Next.js.

import {
    addBrandedHeader,
    addDisclaimerFooter,
    captureChartAsImage,
    checkPageBreak,
    formatForPdf,
    getDateString,
    getFormattedDate,
    PDF_CONTENT_W,
    PDF_MARGIN,
    PDF_PAGE_W,
} from "@/lib/pdf-utils";

// ─── Data Interface ───────────────────────────────────────────────────────────

export interface FinancialPlanData {
    userName: string;
    totalScore: number;
    scoreLabel: string;
    pillars: Array<{ name: string; score: number; maxScore: number }>;
    redFlags: Array<{ title: string; severity: string; explanation: string }>;
    goals: Array<{ title: string; targetAmount: number; sipAmount: number; timeline: string }>;
    actions: Array<{ title: string; description: string; impact: number }>;
    termLife: {
        requiredCoverFormatted: string;
        existingCoverFormatted: string;
        coverGapFormatted: string;
        isAdequate: boolean;
    } | null;
    healthInsurance: {
        cityBenchmarkFormatted: string;
        effectiveCoverFormatted: string;
        gapFormatted: string;
        isAdequate: boolean;
    } | null;
    assetAllocation: Array<{ category: string; amount: number; percentage: number }>;
    netWorth: number;
    monthlySurplus: number;
    hasProjectionChart: boolean; // whether to attempt html2canvas capture
}

// ─── Generator ────────────────────────────────────────────────────────────────

/**
 * Generates and downloads a Financial Plan Summary PDF.
 * Dynamic imports ensure no SSR crash. Uses jspdf-autotable v5 standalone
 * function pattern: autoTable(doc, {...}) — NOT doc.autoTable().
 */
export async function generateFinancialPlan(data: FinancialPlanData): Promise<void> {
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
    addBrandedHeader(doc, "Financial Plan Summary");

    y = 28;
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Prepared for: ${data.userName}`, PDF_MARGIN, y);
    doc.text(`Generated: ${formattedDate}`, PDF_PAGE_W - PDF_MARGIN, y, { align: "right" });
    y = 38;

    // ── Section 2: Health Score Overview ──────────────────────────────────────
    y = checkPageBreak(doc, y, 30);
    autoTable(doc, {
        startY: y,
        head: [["Financial Health Score", `${data.totalScore}/100 — ${data.scoreLabel}`]],
        body: data.pillars.map((p) => [p.name, `${p.score}/${p.maxScore}`]),
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
    });
    y = getTableY();

    // ── Section 3: Red Flags ──────────────────────────────────────────────────
    if (data.redFlags.length > 0) {
        y = checkPageBreak(doc, y, 30);
        y = sectionTitle("Red Flags & Alerts", y);
        autoTable(doc, {
            startY: y,
            head: [["Severity", "Issue", "Details"]],
            body: data.redFlags.map((flag) => [flag.severity, flag.title, flag.explanation]),
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
                0: { cellWidth: 25 },
                1: { cellWidth: 55 },
                2: { cellWidth: PDF_CONTENT_W - 80 },
            },
            margin: { left: PDF_MARGIN, right: PDF_MARGIN },
            // Color severity cells
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            didParseCell: (hookData: any) => {
                if (hookData.section === "body" && hookData.column.index === 0) {
                    const severity = hookData.row.raw[0];
                    if (severity === "CRITICAL") hookData.cell.styles.textColor = [220, 38, 38];
                    else if (severity === "WARNING") hookData.cell.styles.textColor = [217, 119, 6];
                    else if (severity === "INFO") hookData.cell.styles.textColor = [59, 130, 246];
                }
            },
        });
        y = getTableY();
    }

    // ── Section 4: Goal Projections ───────────────────────────────────────────
    if (data.goals.length > 0) {
        y = checkPageBreak(doc, y, 30);
        y = sectionTitle("Financial Goals & SIP Projections", y);
        autoTable(doc, {
            startY: y,
            head: [["Goal", "Target Amount", "Monthly SIP", "Timeline"]],
            body: data.goals.map((goal) => [
                goal.title,
                formatForPdf(goal.targetAmount),
                formatForPdf(goal.sipAmount),
                goal.timeline,
            ]),
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
                0: { cellWidth: 50 },
                1: { cellWidth: 45 },
                2: { cellWidth: 40 },
                3: { cellWidth: PDF_CONTENT_W - 135 },
            },
            margin: { left: PDF_MARGIN, right: PDF_MARGIN },
        });
        y = getTableY();
    }

    // ── Section 5: Asset Allocation (D-05) ────────────────────────────────────
    if (data.assetAllocation.length > 0) {
        y = checkPageBreak(doc, y, 40);
        y = sectionTitle("Asset Allocation", y);
        // jsPDF cannot draw pie charts natively; renders as a table instead
        autoTable(doc, {
            startY: y,
            head: [["Asset Category", "Value", "Allocation %"]],
            body: data.assetAllocation.map((item) => [
                item.category,
                formatForPdf(item.amount),
                `${item.percentage.toFixed(1)}%`,
            ]),
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
                0: { cellWidth: 70 },
                1: { cellWidth: 56 },
                2: { cellWidth: 56 },
            },
            margin: { left: PDF_MARGIN, right: PDF_MARGIN },
        });
        y = getTableY();
    }

    // ── Section 6: Action Plan Priorities ─────────────────────────────────────
    if (data.actions.length > 0) {
        y = checkPageBreak(doc, y, 30);
        y = sectionTitle("Priority Action Plan", y);
        const topActions = data.actions.slice(0, 5);
        autoTable(doc, {
            startY: y,
            head: [["#", "Action", "Details", "Impact"]],
            body: topActions.map((action, idx) => [
                String(idx + 1),
                action.title,
                action.description.length > 80
                    ? action.description.slice(0, 77) + "..."
                    : action.description,
                String(action.impact),
            ]),
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
                0: { cellWidth: 8 },
                1: { cellWidth: 45 },
                2: { cellWidth: PDF_CONTENT_W - 68 },
                3: { cellWidth: 15 },
            },
            margin: { left: PDF_MARGIN, right: PDF_MARGIN },
        });
        y = getTableY();
    }

    // ── Section 7: Insurance Gap Highlights ───────────────────────────────────
    if (data.termLife || data.healthInsurance) {
        y = checkPageBreak(doc, y, 30);
        y = sectionTitle("Insurance Coverage Summary", y);

        const insuranceRows: string[][] = [];
        if (data.termLife) {
            insuranceRows.push([
                "Term Life",
                data.termLife.requiredCoverFormatted,
                data.termLife.existingCoverFormatted,
                data.termLife.coverGapFormatted,
                data.termLife.isAdequate ? "Adequate" : "Gap",
            ]);
        }
        if (data.healthInsurance) {
            insuranceRows.push([
                "Health",
                data.healthInsurance.cityBenchmarkFormatted,
                data.healthInsurance.effectiveCoverFormatted,
                data.healthInsurance.gapFormatted,
                data.healthInsurance.isAdequate ? "Adequate" : "Gap",
            ]);
        }

        autoTable(doc, {
            startY: y,
            head: [["Type", "Required", "Current", "Gap", "Status"]],
            body: insuranceRows,
            theme: "grid",
            headStyles: {
                fillColor: [16, 185, 129],
                textColor: [255, 255, 255],
                fontStyle: "bold",
                fontSize: 9,
            },
            bodyStyles: { fontSize: 9, textColor: [15, 23, 42] },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            margin: { left: PDF_MARGIN, right: PDF_MARGIN },
        });
        y = getTableY();
    }

    // ── Section 8: Projection Chart ───────────────────────────────────────────
    if (data.hasProjectionChart) {
        y = checkPageBreak(doc, y, 80);
        y = sectionTitle("Wealth Projection", y);

        const imgData = await captureChartAsImage("pdf-projection-chart");
        if (imgData) {
            const imgH = PDF_CONTENT_W * imgData.aspectRatio;
            y = checkPageBreak(doc, y, imgH + 8);
            doc.addImage(imgData.dataUrl, "PNG", PDF_MARGIN, y, PDF_CONTENT_W, imgH);
            y += imgH + 8;
        }
    }

    // ── Section 9: Summary Metrics ────────────────────────────────────────────
    y = checkPageBreak(doc, y, 25);
    autoTable(doc, {
        startY: y,
        body: [
            ["Net Worth", formatForPdf(data.netWorth)],
            ["Monthly Surplus", formatForPdf(data.monthlySurplus)],
        ],
        theme: "grid",
        bodyStyles: { fontSize: 9, textColor: [15, 23, 42] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { left: PDF_MARGIN, right: PDF_MARGIN },
    });

    // ── Footer on all pages ───────────────────────────────────────────────────
    addDisclaimerFooter(doc);

    // ── Save ──────────────────────────────────────────────────────────────────
    doc.save(`MyFinancial_Plan_${getDateString()}.pdf`);
}
