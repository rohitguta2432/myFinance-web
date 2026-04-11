"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronDown,
    CheckCircle2,
    AlertTriangle,
    Loader2,
    Sparkles,
    TrendingUp,
    Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import { useTaxQuery, useTaxMutation } from "@/hooks/assessment/useTax";
import { useTaxCalculationQuery } from "@/hooks/assessment/useTaxCalculation";
import { StepNavigation } from "@/components/assessment/step-navigation";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number | undefined): string {
    return `₹${Math.round(n ?? 0).toLocaleString("en-IN")}`;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {
    page: { display: "flex", flexDirection: "column" as const, paddingBottom: 100 },
    tabBar: {
        display: "flex", gap: 8, marginBottom: 24,
        overflowX: "auto" as const, paddingBottom: 4,
    },
    tab: (active: boolean): React.CSSProperties => ({
        padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600,
        cursor: "pointer", border: "none", whiteSpace: "nowrap" as const,
        background: active ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.03)",
        color: active ? "#10B981" : "#94A3B8",
    }),
    card: {
        background: "#0F172A", borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)", overflow: "hidden",
    },
    row: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    label: { fontSize: 11, fontWeight: 600, color: "#94A3B8" },
    inputRight: {
        background: "#0F172A", textAlign: "right" as const, color: "#F1F5F9",
        padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)",
        fontSize: 13, outline: "none", width: 120, boxSizing: "border-box" as const,
    },
};

const STEP6_SECTIONS = [
    { id: "regime", label: "Regime" },
    { id: "comparison", label: "Comparison" },
    { id: "deductions", label: "Deductions" },
    { id: "hra", label: "HRA & Premium" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Step6TaxOptimization() {
    const router = useRouter();
    const { taxRegime, setTaxRegime, setInvestments80C } = useAssessmentStore();

    // API
    useTaxQuery(); // hydrates store on mount
    const { mutateAsync: saveTaxApi, isPending: isSaving } = useTaxMutation();

    // Manual deduction state
    const [ppfNps, setPpfNps] = useState(0);
    const [homeLoanPrincipal, setHomeLoanPrincipal] = useState(0);
    const [tuitionFees, setTuitionFees] = useState(0);
    const [nscFd, setNscFd] = useState(0);
    const [medSelfSpouse, setMedSelfSpouse] = useState(0);
    const [medParentsLt60, setMedParentsLt60] = useState(0);
    const [medParentsGt60, setMedParentsGt60] = useState(0);
    const [otherNps, setOtherNps] = useState(0);
    const [eduLoanInterest, setEduLoanInterest] = useState(0);
    const [homeLoanInterest, setHomeLoanInterest] = useState(0);
    const [donations, setDonations] = useState(0);

    const [debouncedParams, setDebouncedParams] = useState({ deductions80C: 0, deductions80D: 0, otherDeductions: 0 });
    const { data: calcData, isLoading: calcLoading } = useTaxCalculationQuery(debouncedParams);

    const autoEpf = calcData?.autoEpf ?? 0;
    const autoLifeIns = calcData?.autoLifeInsurance ?? 0;
    const total80CRaw = autoEpf + autoLifeIns + ppfNps + homeLoanPrincipal + tuitionFees + nscFd;
    const final80C = Math.min(total80CRaw, 150000);
    const unused80C = Math.max(0, 150000 - final80C);
    const final80D = Math.min(medSelfSpouse, 25000) + Math.min(medParentsLt60, 25000) + Math.min(medParentsGt60, 50000);
    const finalOtherDeductions = Math.min(otherNps, 50000) + eduLoanInterest + Math.min(homeLoanInterest, 200000) + donations;

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedParams({ deductions80C: final80C, deductions80D: final80D, otherDeductions: finalOtherDeductions });
        }, 300);
        return () => clearTimeout(timer);
    }, [final80C, final80D, finalOtherDeductions]);

    useEffect(() => { setInvestments80C(final80C); }, [final80C, setInvestments80C]);

    const grossTotalIncome = calcData?.grossTotalIncome ?? 0;
    const incomeCategories = calcData?.incomeCategories ?? {};
    const hraExemption = calcData?.hraExemption ?? 0;
    const actualHraReceived = calcData?.actualHraReceived ?? 0;
    const oldRegime = calcData?.oldRegime ?? {} as Record<string, number>;
    const newRegime = calcData?.newRegime ?? {} as Record<string, number>;
    const recommendedRegime = calcData?.recommendedRegime ?? "new";
    const savings = calcData?.savings ?? 0;

    useEffect(() => {
        if (!taxRegime && grossTotalIncome > 0) setTaxRegime(recommendedRegime as "old" | "new");
    }, [grossTotalIncome, recommendedRegime, taxRegime, setTaxRegime]);

    const [openAccordion, setOpenAccordion] = useState("");
    const [activeTab, setActiveTab] = useState("regime");

    const toggleAccordion = (id: string) => setOpenAccordion(openAccordion === id ? "" : id);

    const scrollTo = (id: string) => {
        setActiveTab(id);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const comparisonRows = [
        { label: "Gross Income", old: oldRegime.grossIncome, new: newRegime.grossIncome },
        { label: "Standard Deduction", old: oldRegime.standardDeduction, new: newRegime.standardDeduction },
        { label: "Section 80C", old: oldRegime.deductions80C, new: newRegime.deductions80C },
        { label: "Section 80D", old: oldRegime.deductions80D, new: newRegime.deductions80D },
        { label: "HRA Exemption", old: oldRegime.hraExemption, new: newRegime.hraExemption },
        { label: "Other Deductions", old: oldRegime.otherDeductions, new: newRegime.otherDeductions },
        { label: "Net Taxable Income", old: oldRegime.netTaxable, new: newRegime.netTaxable, bold: true },
        { label: "Tax Calculated", old: oldRegime.baseTax, new: newRegime.baseTax },
        { label: "Cess (4%)", old: oldRegime.cess, new: newRegime.cess },
        { label: "FINAL TAX", old: oldRegime.totalTax, new: newRegime.totalTax, final: true },
    ];

    const handleComplete = async () => {
        if (!taxRegime) {
            toast.error("Select your tax regime — Old or New — to complete", { id: "step6-guide" });
            return;
        }
        try {
            await saveTaxApi({ taxRegime, investments80C: final80C });
        } catch (err) {
            console.warn("Tax API save failed:", err);
        }
        router.push("/assessment/complete");
    };

    const accordionInput = (label: string, value: number, setter: (v: number) => void, sublabel?: string) => (
        <div key={label} style={{ ...S.row, fontSize: 13 }}>
            <span style={{ color: "#94A3B8" }}>{label}{sublabel && <><br /><span style={{ fontSize: 11 }}>{sublabel}</span></>}</span>
            <input
                type="number"
                value={value || ""}
                onChange={(e) => setter(parseFloat(e.target.value) || 0)}
                placeholder="Enter"
                style={S.inputRight}
            />
        </div>
    );

    return (
        <div style={S.page}>
            {/* Section nav tabs */}
            <div style={S.tabBar}>
                {STEP6_SECTIONS.map((s) => (
                    <button key={s.id} style={S.tab(activeTab === s.id)} onClick={() => scrollTo(s.id)}>
                        {s.label}
                    </button>
                ))}
            </div>

            {/* Header */}
            <div style={{ marginBottom: 16 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F1F5F9", marginBottom: 8 }}>
                    Tax Optimization <span style={{ color: "#94A3B8", fontSize: 16, fontWeight: 400 }}>(FY 2026-27)</span>
                </h1>
                <p style={{ fontSize: 13, color: "#94A3B8" }}>Most Indians overpay. Let&apos;s find the best regime for you and maximize deductions.</p>
            </div>

            {/* Recommendation Banner */}
            <div id="regime" style={{ borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.1)", marginBottom: 24 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                        <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, display: "flex", alignItems: "center", gap: 8, color: "#10B981" }}>
                            <Sparkles style={{ width: 20, height: 20 }} />
                            RECOMMENDATION: Choose <span style={{ color: "#F1F5F9", marginLeft: 4 }}>{recommendedRegime === "old" ? "OLD" : "NEW"} REGIME</span>
                        </h3>
                        <p style={{ color: "#F1F5F9", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
                            You SAVE {fmt(savings)}
                        </p>
                        <p style={{ color: "#94A3B8", fontSize: 13 }}>
                            You save {fmt(savings)} with the {recommendedRegime} regime.
                        </p>
                    </div>
                    {/* Regime toggle */}
                    <div style={{ display: "flex", alignItems: "center", background: "#0F172A", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", alignSelf: "flex-start" }}>
                        {(["old", "new"] as const).map((r) => (
                            <button
                                key={r}
                                onClick={() => { setTaxRegime(r); toast.success(`${r === "old" ? "Old" : "New"} Regime selected`, { id: "regime-select" }); }}
                                style={{
                                    padding: "10px 20px", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
                                    background: taxRegime === r ? (r === "new" ? "#10B981" : "#1E293B") : "transparent",
                                    color: taxRegime === r ? (r === "new" ? "#0B0F1A" : "#F1F5F9") : "#94A3B8",
                                    transition: "all 0.15s",
                                }}
                            >
                                {r === "old" ? "Old Regime" : "New Regime"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Comparison Table */}
            <div id="comparison" style={{ ...S.card, marginBottom: 24, overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                            <th style={{ textAlign: "left", padding: "16px 20px", fontSize: 13, color: "#94A3B8", fontWeight: 700, width: "40%" }}></th>
                            {(["old", "new"] as const).map((r) => (
                                <th
                                    key={r}
                                    onClick={() => { setTaxRegime(r); toast.success(`${r === "old" ? "Old" : "New"} Regime selected`, { id: "regime-select" }); }}
                                    style={{
                                        textAlign: "center", padding: "16px 20px", fontSize: 13, fontWeight: 700,
                                        textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer",
                                        width: "30%",
                                        color: taxRegime === r ? "#10B981" : "#94A3B8",
                                        background: taxRegime === r ? "rgba(16,185,129,0.05)" : "transparent",
                                        borderBottom: taxRegime === r ? "2px solid #10B981" : "2px solid transparent",
                                    }}
                                >
                                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                        {r === "old" ? "Old Regime" : "New Regime"}
                                        {taxRegime === r && <CheckCircle2 style={{ width: 16, height: 16 }} />}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {comparisonRows.map((row) => (
                            <tr
                                key={row.label}
                                style={{
                                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                                    background: row.final ? "#1E293B" : row.bold ? "rgba(255,255,255,0.02)" : "transparent",
                                }}
                            >
                                <td style={{ padding: "12px 20px", fontSize: row.final ? 15 : 13, fontWeight: row.final || row.bold ? 700 : 400, color: row.final || row.bold ? "#F1F5F9" : "#CBD5E1" }}>
                                    {row.label}
                                </td>
                                {(["old", "new"] as const).map((r) => (
                                    <td
                                        key={r}
                                        style={{
                                            textAlign: "center", padding: "12px 20px", fontFamily: "monospace",
                                            background: taxRegime === r ? "rgba(16,185,129,0.05)" : "transparent",
                                            fontSize: row.final ? 17 : row.bold ? 13 : 13,
                                            fontWeight: row.final || row.bold ? 700 : 400,
                                            color: row.final
                                                ? taxRegime === r ? (r === "new" ? "#10B981" : "#F1F5F9") : "#94A3B8"
                                                : row.bold ? "#F1F5F9" : "#CBD5E1",
                                        }}
                                    >
                                        {fmt(row[r])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {calcLoading && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 12, color: "#94A3B8", fontSize: 13, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                        <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> Recalculating...
                    </div>
                )}
            </div>

            {/* Two-column: Deductions | HRA */}
            <div id="deductions" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, paddingBottom: 16 }}>

                {/* Left: Income + Accordions */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Income Summary */}
                    <div style={S.card}>
                        <div style={{ background: "#1E293B", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", ...S.row }}>
                            <h3 style={{ fontWeight: 700, color: "#F1F5F9", fontSize: 13, letterSpacing: "0.05em" }}>Income Summary</h3>
                            <span style={{ background: "rgba(16,185,129,0.2)", color: "#10B981", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>Auto-Populated</span>
                        </div>
                        <div style={{ padding: 20, fontFamily: "monospace", fontSize: 13, display: "flex", flexDirection: "column", gap: 12 }}>
                            {Object.entries(incomeCategories).map(([source, amt]) => (
                                <div key={source} style={S.row}>
                                    <span style={{ color: "#CBD5E1" }}>{source}</span>
                                    <span>{fmt(amt)}</span>
                                </div>
                            ))}
                            {Object.keys(incomeCategories).length === 0 && (
                                <div style={{ color: "#64748B", textAlign: "center", padding: 8 }}>No income added in Step 2</div>
                            )}
                            <div style={{ borderTop: "1px dashed rgba(255,255,255,0.2)", paddingTop: 12, ...S.row }}>
                                <span style={{ color: "#F1F5F9", fontWeight: 700, letterSpacing: "0.1em" }}>GROSS TOTAL</span>
                                <span style={{ color: "#10B981", fontSize: 16, fontWeight: 700 }}>{fmt(grossTotalIncome)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Accordions */}
                    {[
                        {
                            id: "80c",
                            title: "80C",
                            subtitle: "(Max: ₹1,50,000)",
                            total: fmt(final80C),
                            content: (
                                <div style={{ padding: 20, borderTop: "1px solid rgba(255,255,255,0.05)", background: "#0B0F1A", display: "flex", flexDirection: "column", gap: 16 }}>
                                    {autoEpf > 0 && <div style={{ ...S.row, fontSize: 13 }}><span style={{ color: "#34D399", display: "flex", alignItems: "center", gap: 8 }}><CheckCircle2 style={{ width: 16, height: 16 }} /> EPF Contribution</span><span style={{ color: "#CBD5E1" }}>{fmt(autoEpf)} (Auto)</span></div>}
                                    {autoLifeIns > 0 && <div style={{ ...S.row, fontSize: 13 }}><span style={{ color: "#34D399", display: "flex", alignItems: "center", gap: 8 }}><CheckCircle2 style={{ width: 16, height: 16 }} /> Life Insurance</span><span style={{ color: "#CBD5E1" }}>{fmt(autoLifeIns)} (Auto)</span></div>}
                                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                                        {accordionInput("PPF/NPS (This Year):", ppfNps, setPpfNps)}
                                        {accordionInput("Home Loan Principal:", homeLoanPrincipal, setHomeLoanPrincipal)}
                                        {accordionInput("Tuition Fees:", tuitionFees, setTuitionFees)}
                                        {accordionInput("NSC/Tax-Saver FD:", nscFd, setNscFd)}
                                    </div>
                                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16 }}>
                                        <div style={{ ...S.row, fontSize: 13, fontWeight: 700 }}>
                                            <span style={{ color: "#F1F5F9" }}>TOTAL USED:</span>
                                            <span style={{ color: final80C >= 150000 ? "#10B981" : "#CBD5E1" }}>{fmt(final80C)} / ₹1,50,000</span>
                                        </div>
                                        {unused80C > 0 && (
                                            <div style={{ marginTop: 16, background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)", borderRadius: 8, padding: 12, display: "flex", gap: 12, alignItems: "flex-start" }}>
                                                <AlertTriangle style={{ width: 20, height: 20, color: "#EAB308", flexShrink: 0, marginTop: 2 }} />
                                                <div>
                                                    <span style={{ color: "#EAB308", fontWeight: 700, fontSize: 13, display: "block" }}>You have {fmt(unused80C)} unused!</span>
                                                    <p style={{ color: "rgba(234,179,8,0.8)", fontSize: 12, marginTop: 4 }}>Invest by March 31 to save up to {fmt(unused80C * 0.312)} in taxes.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ),
                        },
                        {
                            id: "80d",
                            title: "80D",
                            subtitle: "Medical Insurance",
                            total: fmt(final80D),
                            content: (
                                <div style={{ padding: 20, borderTop: "1px solid rgba(255,255,255,0.05)", background: "#0B0F1A", display: "flex", flexDirection: "column", gap: 12 }}>
                                    {accordionInput("Self + Spouse Premium", medSelfSpouse, setMedSelfSpouse, "(max ₹25,000)")}
                                    {accordionInput("Parents Premium (<60)", medParentsLt60, setMedParentsLt60, "(max ₹25,000)")}
                                    {accordionInput("Parents Premium (≥60)", medParentsGt60, setMedParentsGt60, "(max ₹50,000)")}
                                </div>
                            ),
                        },
                        {
                            id: "other",
                            title: "Others",
                            subtitle: "NPS, Loans, Donations",
                            total: fmt(finalOtherDeductions),
                            content: (
                                <div style={{ padding: 20, borderTop: "1px solid rgba(255,255,255,0.05)", background: "#0B0F1A", display: "flex", flexDirection: "column", gap: 12 }}>
                                    {accordionInput("Addt. NPS 80CCD(1B)", otherNps, setOtherNps, "(max ₹50,000)")}
                                    {accordionInput("Edu Loan Int. 80E", eduLoanInterest, setEduLoanInterest, "(no limit)")}
                                    {accordionInput("Home Loan Int. 24(b)", homeLoanInterest, setHomeLoanInterest, "(max ₹2,00,000)")}
                                    {accordionInput("Donations 80G", donations, setDonations, "(subject to limits)")}
                                </div>
                            ),
                        },
                    ].map((acc) => (
                        <div key={acc.id} style={S.card}>
                            <button
                                onClick={() => toggleAccordion(acc.id)}
                                style={{ width: "100%", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0F172A", border: "none", cursor: "pointer", textAlign: "left" }}
                            >
                                <div>
                                    <h4 style={{ fontWeight: 700, color: "#F1F5F9", fontSize: 14 }}>{acc.title}</h4>
                                    <p style={{ fontSize: 12, color: "#94A3B8" }}>{acc.subtitle}</p>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                    <span style={{ color: "#10B981", fontWeight: 700, fontFamily: "monospace" }}>{acc.total}</span>
                                    <ChevronDown style={{ width: 20, height: 20, color: "#94A3B8", transform: openAccordion === acc.id ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                                </div>
                            </button>
                            {openAccordion === acc.id && acc.content}
                        </div>
                    ))}
                </div>

                {/* Right: HRA + Premium cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* HRA */}
                    <div id="hra" style={S.card}>
                        <div style={{ background: "#1E293B", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", ...S.row }}>
                            <h3 style={{ fontWeight: 700, color: "#F1F5F9", fontSize: 13, letterSpacing: "0.05em" }}>HRA Exemption</h3>
                            <span style={{ background: "rgba(16,185,129,0.2)", color: "#10B981", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>Auto-calculated</span>
                        </div>
                        <div style={{ padding: 20, fontFamily: "monospace", fontSize: 13, display: "flex", flexDirection: "column", gap: 8 }}>
                            {[
                                ["Standard Exemption", fmt(actualHraReceived)],
                                ["Auto-calculated", fmt(hraExemption)],
                            ].map(([label, val]) => (
                                <div key={label} style={S.row}>
                                    <span style={{ color: "#CBD5E1" }}>{label}</span>
                                    <span>{val}</span>
                                </div>
                            ))}
                            <div style={{ borderTop: "1px dashed rgba(255,255,255,0.2)", paddingTop: 12, ...S.row }}>
                                <span style={{ color: "#F1F5F9", fontWeight: 700, letterSpacing: "0.1em" }}>EXEMPTION</span>
                                <span style={{ color: "#10B981", fontWeight: 700 }}>{fmt(hraExemption)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Premium upsell cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div style={{ borderRadius: 16, padding: 1, background: "linear-gradient(135deg, rgba(245,158,11,0.5), transparent)", overflow: "hidden", cursor: "pointer" }}>
                            <div style={{ background: "rgba(15,23,42,0.9)", borderRadius: 15, padding: 20, height: "100%" }}>
                                <div style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 9999, background: "linear-gradient(to right, #FBBF24, #F97316)", color: "#0B0F1A", display: "inline-block", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>Premium</div>
                                <h4 style={{ color: "#F1F5F9", fontWeight: 700, fontSize: 14, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                                    <TrendingUp style={{ width: 16, height: 16, color: "#FBBF24" }} /> Tax Harvesting
                                </h4>
                                <p style={{ fontSize: 12, color: "#94A3B8" }}>Compare your <span style={{ color: "#FBBF24", fontWeight: 700 }}>portfolio</span> harvest of tax harvesting.</p>
                            </div>
                        </div>
                        <div style={{ borderRadius: 16, padding: 1, background: "linear-gradient(135deg, rgba(168,85,247,0.5), transparent)", overflow: "hidden", cursor: "pointer" }}>
                            <div style={{ background: "rgba(15,23,42,0.9)", borderRadius: 15, padding: 20, height: "100%" }}>
                                <div style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 9999, background: "linear-gradient(to right, #A855F7, #EC4899)", color: "#fff", display: "inline-block", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>Premium</div>
                                <h4 style={{ color: "#F1F5F9", fontWeight: 700, fontSize: 14, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                                    <Users style={{ width: 16, height: 16, color: "#C084FC" }} /> Family Income
                                </h4>
                                <p style={{ fontSize: 12, color: "#94A3B8" }}>Compare your account on <span style={{ color: "#C084FC", fontWeight: 700 }}>Family Income</span> and bins.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <StepNavigation
                step={6}
                backPath="/assessment/step-5"
                onNext={handleComplete}
                isSaving={isSaving}
                isValid={!!taxRegime}
                validationMessage="Select your tax regime — Old or New — to complete"
            />

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
