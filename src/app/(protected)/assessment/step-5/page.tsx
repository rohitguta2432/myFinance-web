"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Shield,
    HeartPulse,
    AlertTriangle,
    CheckCircle,
    CheckCircle2,
    Plus,
    X,
    Building2,
    Briefcase,
    FileText,
} from "lucide-react";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import { useInsuranceMutation } from "@/hooks/assessment/useInsurance";
import { useInsuranceGapQuery } from "@/hooks/assessment/useInsuranceGap";
import { StepNavigation } from "@/components/assessment/step-navigation";
import type { InsuranceChecklist } from "@/store/useAssessmentStore";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {
    page: { display: "flex", flexDirection: "column" as const, paddingBottom: 100 },
    header: { marginBottom: 24 },
    h1: {
        fontSize: 22, fontWeight: 700, color: "#F1F5F9",
        borderBottom: "1px solid rgba(16,185,129,0.2)",
        paddingBottom: 8, display: "inline-block", marginBottom: 8,
    },
    subtitle: { fontSize: 13, color: "#94A3B8" },
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
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        overflow: "hidden", marginBottom: 24,
    },
    cardBody: { padding: 20 },
    cardHeader: {
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.05)",
    },
    cardHeaderLeft: { display: "flex", alignItems: "center", gap: 12 },
    iconBox: (color: string): React.CSSProperties => ({
        padding: 8, borderRadius: 12, background: `${color}1a`,
        display: "flex", alignItems: "center", justifyContent: "center",
    }),
    label: { fontSize: 11, fontWeight: 600, color: "#94A3B8", display: "block", marginBottom: 4 },
    input: {
        width: "100%", background: "#0B0F1A",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
        padding: "12px 14px", color: "#F1F5F9", fontSize: 14,
        boxSizing: "border-box" as const, outline: "none",
    },
    select: {
        width: "100%", background: "#0B0F1A",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
        padding: "12px 14px", color: "#F1F5F9", fontSize: 14,
        boxSizing: "border-box" as const,
    },
    row: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    btnAdd: (color: string): React.CSSProperties => ({
        fontSize: 12, display: "flex", alignItems: "center", gap: 4,
        background: `${color}1a`, color, padding: "6px 12px", borderRadius: 9999,
        fontWeight: 700, border: "none", cursor: "pointer",
    }),
    btnPrimary: {
        background: "#10B981", color: "#0B0F1A", border: "none", borderRadius: 12,
        padding: "14px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer",
        boxShadow: "0 0 15px rgba(16,185,129,0.3)", width: "100%",
    },
    overlay: {
        position: "fixed" as const, inset: 0, zIndex: 50,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
    },
    overlayBackdrop: {
        position: "absolute" as const, inset: 0,
        background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)",
    },
    modal: {
        position: "relative" as const, background: "#0F172A",
        width: "100%", maxWidth: 440,
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        border: "1px solid rgba(255,255,255,0.1)",
        overflow: "hidden", maxHeight: "90vh", overflowY: "auto" as const,
    },
    modalHeader: {
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "#0F172A", position: "sticky" as const, top: 0, zIndex: 10,
    },
    modalBody: { padding: 24, display: "flex", flexDirection: "column" as const, gap: 16 },
    policyItem: {
        background: "#0B0F1A", padding: 12, borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.1)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
    },
    emptyState: {
        textAlign: "center" as const, padding: "24px 16px",
        background: "#0B0F1A", borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.05)", borderStyle: "dashed" as const,
    },
    analysisSection: {
        padding: 20,
        background: "linear-gradient(to bottom, #0F172A, #0B0F1A)",
    },
};

const STEP5_SECTIONS = [
    { id: "corporate", label: "Corporate" },
    { id: "personal", label: "Health & Life" },
    { id: "checklist", label: "Checklist" },
    { id: "summary", label: "Summary" },
];

const CHECKLIST_ITEMS: { id: keyof InsuranceChecklist; label: string }[] = [
    { id: "criticalIllness", label: "Critical Illness Cover" },
    { id: "personalAccident", label: "Personal Accident Cover" },
    { id: "disability", label: "Disability Insurance" },
    { id: "maternity", label: "Maternity Cover" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Step5InsuranceGap() {
    const router = useRouter();
    const {
        age,
        employmentType,
        insurance,
        updateInsurance,
        addPersonalHealth,
        removePersonalHealth,
        addPersonalLife,
        removePersonalLife,
        toggleChecklist,
    } = useAssessmentStore();

    const { mutateAsync: saveInsuranceApi, isPending: isSaving } = useInsuranceMutation();
    const { data: gapData } = useInsuranceGapQuery();

    const [activeTab, setActiveTab] = useState("corporate");

    // Recommended covers from backend
    const recommendedLifeCover = gapData?.recommendedLifeCover ?? 0;
    const recommendedHealthCover = gapData?.recommendedHealthCover ?? 0;

    // Actual covers
    const actualCorpHealth = parseFloat(insurance?.corporateHealth) || 0;
    const actualCorpLife = parseFloat(insurance?.corporateLife) || 0;
    const actualPersonalHealth = (insurance?.personalHealth || []).reduce((s, p) => s + (parseFloat(String(p.sumInsured)) || 0), 0);
    const actualPersonalLife = (insurance?.personalLife || []).reduce((s, p) => s + (parseFloat(String(p.sumAssured)) || 0), 0);
    const totalHealthCover = actualCorpHealth + actualPersonalHealth;
    const totalLifeCover = actualCorpLife + actualPersonalLife;
    const lifeGap = Math.max(0, recommendedLifeCover - totalLifeCover);
    const healthGap = Math.max(0, recommendedHealthCover - totalHealthCover);
    const lifeGapPercent = recommendedLifeCover > 0 ? (totalLifeCover / recommendedLifeCover) * 100 : 100;

    // Health modal
    const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
    const [hType, setHType] = useState("Family Floater");
    const [hSum, setHSum] = useState("");
    const [hPremium, setHPremium] = useState("");
    const [hCopay, setHCopay] = useState("");

    // Life modal
    const [isLifeModalOpen, setIsLifeModalOpen] = useState(false);
    const [lType, setLType] = useState("Term Life");
    const [lSum, setLSum] = useState("");
    const [lPremium, setLPremium] = useState("");
    const [lSpouseAge, setLSpouseAge] = useState("");

    const handleSaveHealth = () => {
        if (!hSum) return;
        addPersonalHealth({
            id: String(Date.now()),
            type: hType,
            sumInsured: parseFloat(hSum),
            premium: parseFloat(hPremium) || 0,
            copay: parseFloat(hCopay) || 0,
        });
        setIsHealthModalOpen(false);
        setHType("Family Floater"); setHSum(""); setHPremium(""); setHCopay("");
    };

    const handleSaveLife = () => {
        if (!lSum) return;
        addPersonalLife({
            id: String(Date.now()),
            type: lType,
            sumAssured: parseFloat(lSum),
            premium: parseFloat(lPremium) || 0,
            spouseAge: parseInt(lSpouseAge) || age,
        });
        setIsLifeModalOpen(false);
        setLType("Term Life"); setLSum(""); setLPremium(""); setLSpouseAge("");
    };

    const handleNext = async () => {
        try {
            await saveInsuranceApi({ life: totalLifeCover, health: totalHealthCover });
        } catch (e) {
            console.warn("Insurance API fail ignored", e);
        }
        router.push("/assessment/step-6");
    };

    const scrollTo = (id: string) => {
        setActiveTab(id);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div style={S.page}>
            {/* Header */}
            <div style={S.header}>
                <h1 style={S.h1}>Protecting What You&apos;ve Built</h1>
                <p style={S.subtitle}>
                    Wealth without protection is a house of cards. One medical emergency can wipe out years of savings.
                </p>
            </div>

            {/* Section tab nav */}
            <div style={S.tabBar}>
                {STEP5_SECTIONS.map((s) => (
                    <button key={s.id} style={S.tab(activeTab === s.id)} onClick={() => scrollTo(s.id)}>
                        {s.label}
                    </button>
                ))}
            </div>

            {/* SECTION A: Corporate */}
            <div id="corporate">
                {employmentType === "Salaried" && (
                    <div style={S.card}>
                        <div style={S.cardBody}>
                            <div style={S.cardHeader}>
                                <div style={S.cardHeaderLeft}>
                                    <div style={S.iconBox("#3B82F6")}>
                                        <Building2 style={{ width: 20, height: 20, color: "#60A5FA" }} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontWeight: 700, color: "#F1F5F9", fontSize: 17 }}>Corporate Insurance</h3>
                                        <p style={{ fontSize: 12, color: "#94A3B8" }}>Do you have employer-provided insurance?</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                {[
                                    ["Corporate Health Insurance coverage (₹)?", "corporateHealth", "500000"],
                                    ["How many family members covered?", "corporateHealthMembers", "4"],
                                    ["Corporate Term Life Insurance coverage (₹)?", "corporateLife", "1000000"],
                                ].map(([labelText, field, placeholder]) => (
                                    <div key={field}>
                                        <label style={S.label}>{labelText}</label>
                                        <input
                                            type="number"
                                            placeholder={placeholder}
                                            value={insurance?.[field as keyof typeof insurance] as string || ""}
                                            onChange={(e) => updateInsurance({ [field]: e.target.value })}
                                            style={S.input}
                                        />
                                    </div>
                                ))}
                            </div>

                            {(actualCorpHealth > 0 || actualCorpLife > 0) && (
                                <div style={{ marginTop: 20, border: "1px solid rgba(59,130,246,0.2)", background: "rgba(59,130,246,0.05)", borderRadius: 12, padding: 16 }}>
                                    <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#60A5FA", textTransform: "uppercase", marginBottom: 12 }}>Corporate Coverage Summary</h4>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13, marginBottom: 12 }}>
                                        {[["Health", formatCurrency(actualCorpHealth)], ["Life", formatCurrency(actualCorpLife)]].map(([label, val]) => (
                                            <div key={label} style={S.row}>
                                                <span style={{ color: "#94A3B8" }}>{label}:</span>
                                                <span style={{ color: "#F1F5F9", fontWeight: 600 }}>{val}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "rgba(254,243,199,0.8)", background: "rgba(245,158,11,0.1)", padding: 8, borderRadius: 8 }}>
                                        <AlertTriangle style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
                                        <p>Corporate coverage ends if you change jobs. Personal policies recommended.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* SECTION B & C: Personal Health + Life */}
            <div id="personal" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
                {/* Personal Health */}
                <div style={{ ...S.card, marginBottom: 0 }}>
                    <div style={{ padding: 20, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={S.cardHeader}>
                            <div style={S.cardHeaderLeft}>
                                <div style={S.iconBox("#14B8A6")}>
                                    <HeartPulse style={{ width: 20, height: 20, color: "#2DD4BF" }} />
                                </div>
                                <h3 style={{ fontWeight: 700, color: "#F1F5F9", fontSize: 17 }}>Personal Health</h3>
                            </div>
                            <button onClick={() => setIsHealthModalOpen(true)} style={S.btnAdd("#2DD4BF")}>
                                <Plus style={{ width: 12, height: 12 }} /> Add Policy
                            </button>
                        </div>

                        {!(insurance?.personalHealth && insurance.personalHealth.length > 0) ? (
                            <div style={S.emptyState}>
                                <HeartPulse style={{ width: 32, height: 32, color: "#334155", margin: "0 auto 8px", opacity: 0.5 }} />
                                <p style={{ fontSize: 13, color: "#64748B" }}>No personal health insurance added</p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {insurance.personalHealth.map((p) => (
                                    <div key={p.id} style={S.policyItem}>
                                        <div>
                                            <p style={{ fontWeight: 700, fontSize: 13, color: "#F1F5F9" }}>{p.type}</p>
                                            <p style={{ fontSize: 12, color: "#94A3B8" }}>Sum: {formatCurrency(p.sumInsured)}{p.premium ? ` • Prem: ${formatCurrency(p.premium)}/yr` : ""}</p>
                                        </div>
                                        <button onClick={() => removePersonalHealth(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", padding: 8 }}>
                                            <X style={{ width: 16, height: 16 }} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={S.analysisSection}>
                        <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#2DD4BF", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                            <HeartPulse style={{ width: 16, height: 16 }} /> Health Coverage Analysis
                        </h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
                            {[
                                ["RECOMMENDED FOR YOU", formatCurrency(recommendedHealthCover), "Based on family size & city"],
                                ["YOUR CURRENT COVERAGE", formatCurrency(totalHealthCover), `Corporate: ${formatCurrency(actualCorpHealth)} | Personal: ${formatCurrency(actualPersonalHealth)}`],
                            ].map(([heading, val, sub]) => (
                                <div key={heading} style={{ ...S.row, borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 12 }}>
                                    <div>
                                        <p style={{ color: "#94A3B8", fontWeight: 600, marginBottom: 2 }}>{heading}</p>
                                        <p style={{ fontSize: 11, color: "#64748B" }}>{sub}</p>
                                    </div>
                                    <span style={{ fontWeight: 700, fontSize: 16, color: "#F1F5F9" }}>{val}</span>
                                </div>
                            ))}
                            {healthGap > 0 ? (
                                <div style={{ ...S.row, background: "rgba(245,158,11,0.1)", padding: 12, borderRadius: 12, border: "1px solid rgba(245,158,11,0.2)" }}>
                                    <span style={{ fontWeight: 700, color: "#FBBF24", display: "flex", alignItems: "center", gap: 8 }}>
                                        <AlertTriangle style={{ width: 16, height: 16 }} /> COVERAGE GAP
                                    </span>
                                    <span style={{ fontWeight: 700, fontSize: 16, color: "#FBBF24" }}>{formatCurrency(healthGap)}</span>
                                </div>
                            ) : (
                                <div style={{ background: "rgba(16,185,129,0.1)", padding: 12, borderRadius: 12, border: "1px solid rgba(16,185,129,0.2)" }}>
                                    <span style={{ fontWeight: 700, color: "#10B981", display: "flex", alignItems: "center", gap: 8 }}>
                                        <CheckCircle2 style={{ width: 16, height: 16 }} /> FULLY COVERED
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Personal Life */}
                <div style={{ ...S.card, marginBottom: 0 }}>
                    <div style={{ padding: 20, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={S.cardHeader}>
                            <div style={S.cardHeaderLeft}>
                                <div style={S.iconBox("#3B82F6")}>
                                    <Shield style={{ width: 20, height: 20, color: "#60A5FA" }} />
                                </div>
                                <h3 style={{ fontWeight: 700, color: "#F1F5F9", fontSize: 17 }}>Personal Life</h3>
                            </div>
                            <button onClick={() => setIsLifeModalOpen(true)} style={S.btnAdd("#60A5FA")}>
                                <Plus style={{ width: 12, height: 12 }} /> Add Policy
                            </button>
                        </div>

                        {!(insurance?.personalLife && insurance.personalLife.length > 0) ? (
                            <div style={S.emptyState}>
                                <Shield style={{ width: 32, height: 32, color: "#334155", margin: "0 auto 8px", opacity: 0.5 }} />
                                <p style={{ fontSize: 13, color: "#64748B" }}>No personal life insurance added</p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {insurance.personalLife.map((p) => (
                                    <div key={p.id} style={S.policyItem}>
                                        <div>
                                            <p style={{ fontWeight: 700, fontSize: 13, color: "#F1F5F9" }}>{p.type}</p>
                                            <p style={{ fontSize: 12, color: "#94A3B8" }}>Sum: {formatCurrency(p.sumAssured)}{p.premium ? ` • Prem: ${formatCurrency(p.premium)}/yr` : ""}</p>
                                        </div>
                                        <button onClick={() => removePersonalLife(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", padding: 8 }}>
                                            <X style={{ width: 16, height: 16 }} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={S.analysisSection}>
                        <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#60A5FA", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                            <Briefcase style={{ width: 16, height: 16 }} /> Life Coverage Analysis
                        </h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
                            {[
                                ["RECOMMENDED FOR YOU", formatCurrency(recommendedLifeCover), "Based on Income, Goals & Liabilities"],
                                ["YOUR CURRENT COVERAGE", formatCurrency(totalLifeCover), `Corporate: ${formatCurrency(actualCorpLife)} | Personal: ${formatCurrency(actualPersonalLife)}`],
                            ].map(([heading, val, sub]) => (
                                <div key={heading} style={{ ...S.row, borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 12 }}>
                                    <div>
                                        <p style={{ color: "#94A3B8", fontWeight: 600, marginBottom: 2 }}>{heading}</p>
                                        <p style={{ fontSize: 11, color: "#64748B" }}>{sub}</p>
                                    </div>
                                    <span style={{ fontWeight: 700, fontSize: 16, color: "#F1F5F9" }}>{val}</span>
                                </div>
                            ))}
                            {lifeGap > 0 ? (
                                <div style={{ background: "rgba(239,68,68,0.1)", padding: 16, borderRadius: 12, border: "1px solid rgba(239,68,68,0.2)" }}>
                                    <div style={{ ...S.row, marginBottom: 8 }}>
                                        <span style={{ fontWeight: 700, color: "#F87171", display: "flex", alignItems: "center", gap: 8 }}>
                                            <X style={{ width: 16, height: 16 }} /> COVERAGE GAP
                                        </span>
                                        <span style={{ fontWeight: 700, fontSize: 16, color: "#F87171" }}>{formatCurrency(lifeGap)}</span>
                                    </div>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(248,113,113,0.8)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                                        (You&apos;re only {Math.round(lifeGapPercent)}% covered!)
                                    </p>
                                    <div style={{ borderTop: "1px solid rgba(239,68,68,0.1)", paddingTop: 12 }}>
                                        <p style={{ fontSize: 12, color: "rgba(254,202,202,0.7)" }}>Estimated premium to close gap:</p>
                                        <p style={{ fontWeight: 700, color: "#F1F5F9", fontSize: 13 }}>₹{Math.round(lifeGap / 100000 * 20)}/month <span style={{ fontSize: 12, fontWeight: 400, color: "#94A3B8" }}>({formatCurrency(lifeGap)} term plan)</span></p>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ background: "rgba(16,185,129,0.1)", padding: 12, borderRadius: 12, border: "1px solid rgba(16,185,129,0.2)" }}>
                                    <span style={{ fontWeight: 700, color: "#10B981", display: "flex", alignItems: "center", gap: 8 }}>
                                        <CheckCircle2 style={{ width: 16, height: 16 }} /> FULLY COVERED
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION D: Checklist */}
            <div id="checklist" style={S.card}>
                <div style={S.cardBody}>
                    <h3 style={{ fontWeight: 700, color: "#F1F5F9", fontSize: 17, marginBottom: 4 }}>Quick Checklist</h3>
                    <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>Do you have these secondary protections? (Optional)</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {CHECKLIST_ITEMS.map((item) => {
                            const checked = insurance?.checklist?.[item.id] ?? false;
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => toggleChecklist(item.id)}
                                    style={{
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                        padding: 12, background: "#0B0F1A",
                                        border: "1px solid rgba(255,255,255,0.05)",
                                        borderRadius: 12, cursor: "pointer",
                                    }}
                                >
                                    <span style={{ fontSize: 13, fontWeight: 500, color: "#CBD5E1" }}>{item.label}</span>
                                    {/* Toggle pill */}
                                    <div style={{
                                        width: 40, height: 24, borderRadius: 12, padding: 4,
                                        background: checked ? "#10B981" : "rgba(255,255,255,0.1)",
                                        transition: "background 0.2s",
                                        display: "flex", alignItems: "center",
                                    }}>
                                        <div style={{
                                            width: 16, height: 16, borderRadius: "50%", background: "#fff",
                                            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                                            transform: checked ? "translateX(16px)" : "translateX(0)",
                                            transition: "transform 0.2s",
                                        }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* SECTION E: Action Summary */}
            <div id="summary" style={{ ...S.card, border: "2px solid rgba(16,185,129,0.2)", position: "relative", marginTop: 16 }}>
                <div style={{
                    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    background: "#10B981", color: "#0B0F1A", fontWeight: 700, fontSize: 11,
                    textTransform: "uppercase", letterSpacing: "0.1em", padding: "4px 16px",
                    borderRadius: 9999, boxShadow: "0 2px 8px rgba(16,185,129,0.3)",
                }}>
                    Action Summary
                </div>
                <div style={S.cardBody}>
                    <h3 style={{ fontWeight: 700, color: "#F1F5F9", textAlign: "center", marginBottom: 24, marginTop: 8, letterSpacing: "0.05em", fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <FileText style={{ width: 20, height: 20, color: "#10B981" }} /> RECOMMENDED ACTIONS
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {lifeGap > 0 && (
                            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(59,130,246,0.2)", color: "#60A5FA", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid rgba(59,130,246,0.2)", fontSize: 13 }}>1</div>
                                <div>
                                    <p style={{ fontWeight: 700, color: "#F1F5F9", marginBottom: 4 }}>Buy {formatCurrency(lifeGap)} Term Life Plan</p>
                                    <p style={{ fontSize: 12, color: "#94A3B8" }}>Impact: Full family protection to cover liabilities and future goals.</p>
                                </div>
                            </div>
                        )}

                        {healthGap > 0 && (
                            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(20,184,166,0.2)", color: "#2DD4BF", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid rgba(20,184,166,0.2)", fontSize: 13 }}>
                                    {lifeGap > 0 ? "2" : "1"}
                                </div>
                                <div>
                                    <p style={{ fontWeight: 700, color: "#F1F5F9", marginBottom: 4 }}>Add {formatCurrency(healthGap)} Health Top-up</p>
                                    <p style={{ fontSize: 12, color: "#94A3B8" }}>Impact: Cover major medical emergencies beyond corporate limits.</p>
                                </div>
                            </div>
                        )}

                        {lifeGap === 0 && healthGap === 0 && (
                            <div style={{ textAlign: "center", padding: 16 }}>
                                <div style={{ width: 48, height: 48, background: "rgba(16,185,129,0.2)", color: "#10B981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                                    <CheckCircle style={{ width: 24, height: 24 }} />
                                </div>
                                <p style={{ fontWeight: 700, color: "#10B981" }}>Excellent job!</p>
                                <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>Your insurance covers all projected needs.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Health Modal */}
            {isHealthModalOpen && (
                <div style={S.overlay}>
                    <div style={S.overlayBackdrop} onClick={() => setIsHealthModalOpen(false)} />
                    <div style={S.modal}>
                        <div style={S.modalHeader}>
                            <h3 style={{ fontWeight: 700, color: "#F1F5F9", fontSize: 16 }}>Add Health Policy</h3>
                            <button onClick={() => setIsHealthModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}>
                                <X style={{ width: 20, height: 20 }} />
                            </button>
                        </div>
                        <div style={S.modalBody}>
                            <div>
                                <label style={S.label}>Policy Type</label>
                                <select value={hType} onChange={(e) => setHType(e.target.value)} style={S.select}>
                                    {["Individual", "Family Floater", "Super Top-up", "Critical Illness"].map((o) => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={S.label}>Sum Insured (₹)</label>
                                <input type="number" value={hSum} onChange={(e) => setHSum(e.target.value)} placeholder="1000000" style={S.input} />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div>
                                    <label style={S.label}>Premium/yr (opt)</label>
                                    <input type="number" value={hPremium} onChange={(e) => setHPremium(e.target.value)} placeholder="15000" style={S.input} />
                                </div>
                                <div>
                                    <label style={S.label}>Co-pay % (opt)</label>
                                    <input type="number" value={hCopay} onChange={(e) => setHCopay(e.target.value)} placeholder="20" style={S.input} />
                                </div>
                            </div>
                            <button onClick={handleSaveHealth} style={S.btnPrimary}>Save Policy</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Life Modal */}
            {isLifeModalOpen && (
                <div style={S.overlay}>
                    <div style={S.overlayBackdrop} onClick={() => setIsLifeModalOpen(false)} />
                    <div style={S.modal}>
                        <div style={S.modalHeader}>
                            <h3 style={{ fontWeight: 700, color: "#F1F5F9", fontSize: 16 }}>Add Life Policy</h3>
                            <button onClick={() => setIsLifeModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}>
                                <X style={{ width: 20, height: 20 }} />
                            </button>
                        </div>
                        <div style={S.modalBody}>
                            <div>
                                <label style={S.label}>Policy Type</label>
                                <select value={lType} onChange={(e) => setLType(e.target.value)} style={S.select}>
                                    {[["Term Life", "Term Life (recommended)"], ["Whole Life", "Whole Life"], ["ULIP", "ULIP"], ["Endowment Plan", "Endowment Plan"]].map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={S.label}>Sum Assured (₹)</label>
                                <input type="number" value={lSum} onChange={(e) => setLSum(e.target.value)} placeholder="50000000" style={S.input} />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div>
                                    <label style={S.label}>Premium/yr</label>
                                    <input type="number" value={lPremium} onChange={(e) => setLPremium(e.target.value)} placeholder="12000" style={S.input} />
                                </div>
                                <div>
                                    <label style={S.label}>Spouse Age</label>
                                    <input type="number" value={lSpouseAge} onChange={(e) => setLSpouseAge(e.target.value)} placeholder="30" style={S.input} />
                                </div>
                            </div>
                            <button onClick={handleSaveLife} style={S.btnPrimary}>Save Policy</button>
                        </div>
                    </div>
                </div>
            )}

            <StepNavigation
                step={5}
                backPath="/assessment/step-4"
                onNext={handleNext}
                isSaving={isSaving}
            />
        </div>
    );
}
