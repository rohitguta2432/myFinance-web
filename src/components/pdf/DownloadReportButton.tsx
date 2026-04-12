"use client";

import { useState, useRef, useEffect } from "react";
import { Download, ChevronDown, Loader2 } from "lucide-react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useFinancialHealthScore } from "@/hooks/dashboard/useFinancialHealthScore";
import { useRedFlags } from "@/hooks/dashboard/useRedFlags";
import { usePriorityActions } from "@/hooks/dashboard/usePriorityActions";
import { useInsuranceAnalysis } from "@/hooks/dashboard/useInsuranceAnalysis";
import { useProjection } from "@/hooks/dashboard/useProjection";
import { useTaxAnalysis } from "@/hooks/dashboard/useTaxAnalysis";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import { useGoalProjectionQuery } from "@/hooks/assessment/useGoalProjection";
import { formatForPdf } from "@/lib/pdf-utils";
import type { AssetItem, LiabilityItem, IncomeItem, ExpenseItem } from "@/store/useAssessmentStore";
import type { DeductionsData, RegimeComparison } from "@/hooks/dashboard/useTaxAnalysis";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeAssetAllocation(assets: AssetItem[]): Array<{ category: string; amount: number; percentage: number }> {
    const grouped: Record<string, number> = {};
    for (const asset of assets) {
        grouped[asset.category] = (grouped[asset.category] ?? 0) + asset.amount;
    }
    const totalAssets = Object.values(grouped).reduce((sum, v) => sum + v, 0);
    if (totalAssets === 0) return [];
    return Object.entries(grouped)
        .map(([category, amount]) => ({ category, amount, percentage: (amount / totalAssets) * 100 }))
        .sort((a, b) => b.amount - a.amount);
}

function computeNetWorth(assets: AssetItem[], liabilities: LiabilityItem[]): number {
    const totalAssets = assets.reduce((sum, a) => sum + a.amount, 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + l.amount, 0);
    return totalAssets - totalLiabilities;
}

function annualizeAmount(amount: number, frequency: string): number {
    if (frequency === "monthly") return amount * 12;
    if (frequency === "yearly") return amount;
    if (frequency === "quarterly") return amount * 4;
    if (frequency === "weekly") return amount * 52;
    return amount * 12; // default to monthly
}

function computeMonthlySurplus(incomes: IncomeItem[], expenses: ExpenseItem[]): number {
    const totalMonthlyIncome = incomes.reduce((sum, i) => sum + annualizeAmount(i.amount, i.frequency) / 12, 0);
    const totalMonthlyExpenses = expenses.reduce((sum, e) => sum + annualizeAmount(e.amount, e.frequency) / 12, 0);
    return totalMonthlyIncome - totalMonthlyExpenses;
}

function buildOptimizationSuggestions(deductions: DeductionsData, regimeComparison: RegimeComparison | null): string[] {
    const suggestions: string[] = [];
    for (const item of deductions.items) {
        if (item.status === "unused") {
            suggestions.push(
                `Consider utilizing ${item.label} deduction under ${item.sublabel} — up to ${formatForPdf(item.max)} available`
            );
        } else if (item.status === "partial") {
            suggestions.push(
                `You can save more by maximizing ${item.label} — Rs. ${item.gap.toLocaleString("en-IN")} remaining under the limit`
            );
        }
    }
    if (regimeComparison) {
        if (regimeComparison.recommended === "new") {
            suggestions.push("The New Tax Regime saves you more — consider switching if not already");
        } else {
            suggestions.push("The Old Tax Regime is better for you — maximize 80C/80D deductions");
        }
    }
    return suggestions;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface DownloadReportButtonProps {
    userName?: string;
}

export function DownloadReportButton({ userName = "User" }: DownloadReportButtonProps) {
    const palette = useAppTheme();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState<"plan" | "tax" | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Dashboard hooks — called unconditionally
    const { totalScore, scoreLabel, sortedPillars } = useFinancialHealthScore();
    const { allFlags } = useRedFlags();
    const { allActions } = usePriorityActions();
    const { termLife, healthInsurance } = useInsuranceAnalysis();
    const projection = useProjection();
    const { regimeComparison, deductions, grossTotalIncome } = useTaxAnalysis();

    // Assessment store — synchronous Zustand read
    const { goals, assets, liabilities, incomes, expenses } = useAssessmentStore();

    // Goal projection query — SIP amounts from backend
    const goalProjectionQuery = useGoalProjectionQuery();

    // Outside-click dismiss
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    // Suppress unused projection warning — projection data is available for future use
    void projection;

    const handleDownload = async (type: "plan" | "tax") => {
        setLoading(type);
        setOpen(false);

        try {
            if (type === "plan") {
                const goalProjection = goalProjectionQuery.data;
                const goalsForPdf = goals.map((g) => {
                    const proj = goalProjection?.goals?.find((p) => p.id === g.id);
                    return {
                        title: g.name,
                        targetAmount: proj?.bufferedCost ?? g.cost,
                        sipAmount: proj?.requiredSip ?? 0,
                        timeline: `${g.horizon} years`,
                    };
                });

                const planData = {
                    userName,
                    totalScore,
                    scoreLabel: scoreLabel.label,
                    pillars: sortedPillars.map((p) => ({ name: p.name, score: p.score, maxScore: p.maxScore })),
                    redFlags: allFlags.map((f) => ({ title: f.title, severity: f.severity, explanation: f.explanation })),
                    goals: goalsForPdf,
                    actions: allActions.map((a) => ({ title: a.title, description: a.description, impact: a.impact })),
                    termLife: termLife
                        ? {
                              requiredCoverFormatted: termLife.requiredCoverFormatted,
                              existingCoverFormatted: termLife.existingCoverFormatted,
                              coverGapFormatted: termLife.coverGapFormatted,
                              isAdequate: termLife.isAdequate,
                          }
                        : null,
                    healthInsurance: healthInsurance
                        ? {
                              cityBenchmarkFormatted: healthInsurance.cityBenchmarkFormatted,
                              effectiveCoverFormatted: healthInsurance.effectiveCoverFormatted,
                              gapFormatted: healthInsurance.gapFormatted,
                              isAdequate: healthInsurance.isAdequate,
                          }
                        : null,
                    assetAllocation: computeAssetAllocation(assets),
                    netWorth: computeNetWorth(assets, liabilities),
                    monthlySurplus:
                        goalProjection?.monthlySurplus ?? computeMonthlySurplus(incomes, expenses),
                    hasProjectionChart: !!document.getElementById("pdf-projection-chart"),
                };

                const { generateFinancialPlan } = await import("@/components/pdf/generateFinancialPlan");
                await generateFinancialPlan(planData);
            } else {
                const taxData = {
                    userName,
                    grossIncome: grossTotalIncome,
                    incomeBreakdown: [{ source: "Total Income", amount: grossTotalIncome }],
                    regimeComparison: regimeComparison
                        ? {
                              old: regimeComparison.old,
                              new: regimeComparison.new,
                              recommended: regimeComparison.recommended,
                              savings: regimeComparison.savings,
                          }
                        : {
                              old: {
                                  grossIncome: 0,
                                  stdDeduction: 0,
                                  totalDeductions: 0,
                                  taxableIncome: 0,
                                  baseTax: 0,
                                  cess: 0,
                                  totalTax: 0,
                                  effectiveRate: 0,
                              },
                              new: {
                                  grossIncome: 0,
                                  stdDeduction: 0,
                                  totalDeductions: 0,
                                  taxableIncome: 0,
                                  baseTax: 0,
                                  cess: 0,
                                  totalTax: 0,
                                  effectiveRate: 0,
                              },
                              recommended: "new" as const,
                              savings: 0,
                          },
                    deductions: deductions.items.map((d) => ({
                        label: d.label,
                        sublabel: d.sublabel,
                        amount: d.amount,
                        max: d.max,
                        gap: d.gap,
                        potentialSaving: d.potentialSaving,
                        status: d.status,
                    })),
                    totalDeductions: deductions.totalDeductions,
                    optimizationSuggestions: buildOptimizationSuggestions(deductions, regimeComparison),
                };

                const { generateTaxSummary } = await import("@/components/pdf/generateTaxSummary");
                await generateTaxSummary(taxData);
            }
        } catch (err) {
            console.error("PDF generation error:", err);
        }

        setLoading(null);
    };

    return (
        <div ref={dropdownRef} style={{ position: "relative" }}>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            <button
                onClick={() => !loading && setOpen(!open)}
                disabled={loading !== null}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 16px",
                    borderRadius: 10,
                    border: `1px solid ${palette.brd}`,
                    background: loading ? "rgba(16,185,129,0.05)" : "rgba(16,185,129,0.1)",
                    color: "#10B981",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                    fontFamily: "var(--font-display)",
                    opacity: loading ? 0.7 : 1,
                    width: "100%",
                    justifyContent: "center",
                }}
            >
                {loading ? (
                    <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                ) : (
                    <Download size={16} />
                )}
                {loading ? "Generating..." : "Download Report"}
                {!loading && <ChevronDown size={14} />}
            </button>

            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        right: 0,
                        minWidth: 200,
                        background: palette.s1,
                        border: `1px solid ${palette.brd}`,
                        borderRadius: 10,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                        zIndex: 50,
                        overflow: "hidden",
                    }}
                >
                    <button
                        onClick={() => handleDownload("plan")}
                        style={{
                            width: "100%",
                            padding: "10px 16px",
                            textAlign: "left",
                            border: "none",
                            background: "transparent",
                            color: palette.txt,
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: "pointer",
                            fontFamily: "var(--font-display)",
                        }}
                    >
                        Financial Plan
                    </button>
                    <div style={{ height: 1, background: palette.brd }} />
                    <button
                        onClick={() => handleDownload("tax")}
                        style={{
                            width: "100%",
                            padding: "10px 16px",
                            textAlign: "left",
                            border: "none",
                            background: "transparent",
                            color: palette.txt,
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: "pointer",
                            fontFamily: "var(--font-display)",
                        }}
                    >
                        Tax Summary
                    </button>
                </div>
            )}
        </div>
    );
}
