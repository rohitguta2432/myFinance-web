"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
    Plus,
    X,
    Home,
    Car,
    GraduationCap,
    Heart,
    Briefcase,
    ShieldAlert,
    Building2,
    HelpCircle,
    Lock,
    Crown,
    Clock,
    CheckCircle2,
    AlertTriangle,
    ArrowUpRight,
    ChevronUp,
    ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import {
    useGoalsQuery,
    useAddGoalMutation,
    useUpdateGoalMutation,
    useDeleteGoalMutation,
} from "@/hooks/assessment/useGoals";
import { useGoalProjectionQuery } from "@/hooks/assessment/useGoalProjection";
import { useRetirementAutoFillQuery } from "@/hooks/assessment/useRetirementAutoFill";
import { useRetirementCorpus } from "@/hooks/assessment/useRetirementCorpus";
import { useProfileQuery, useProfileMutation } from "@/hooks/assessment/useProfile";
import { StepNavigation } from "@/components/assessment/step-navigation";
import type { GoalAPIItem, GoalProjection } from "@/lib/assessment-api";
import { useAppTheme } from "@/hooks/useAppTheme";

// ─── Constants ───────────────────────────────────────────────────────────────

const GOAL_TYPES = [
    { id: "home", label: "Home Purchase", icon: Home, defaultCost: 7500000, defaultHorizon: 15 },
    { id: "education", label: "Child Education", icon: GraduationCap, defaultCost: 2500000, defaultHorizon: 10 },
    { id: "marriage", label: "Child Marriage", icon: Heart, defaultCost: 2000000, defaultHorizon: 15 },
    { id: "retirement", label: "Retirement", icon: Briefcase, defaultCost: 50000000, defaultHorizon: 25 },
    { id: "emergency", label: "Emergency", icon: ShieldAlert, defaultCost: 500000, defaultHorizon: 1 },
    { id: "business", label: "Business", icon: Building2, defaultCost: 1000000, defaultHorizon: 5 },
    { id: "car", label: "Vehicle", icon: Car, defaultCost: 1500000, defaultHorizon: 5 },
    { id: "custom", label: "Custom", icon: HelpCircle, defaultCost: 1000000, defaultHorizon: 5 },
];

const SINGLETON_GOAL_TYPES = ["retirement", "emergency"];

const IMPORTANCE_LEVELS = [
    { id: "Critical", label: "Critical" },
    { id: "High", label: "High" },
    { id: "Medium", label: "Medium" },
    { id: "Low", label: "Low" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatToCrLakh(value: number): string {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
    return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function calculateSIP(gap: number, years: number, annualRate = 0.12): number {
    if (gap <= 0 || years <= 0) return 0;
    const months = years * 12;
    const monthlyRate = annualRate / 12;
    if (monthlyRate === 0) return gap / months;
    return (gap * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Step4FinancialGoals() {
    const palette = useAppTheme();

    const S = {
        page: {
            display: "flex",
            flexDirection: "column" as const,
            padding: "24px 24px 180px",
            maxWidth: 960,
            margin: "0 auto",
            width: "100%",
        },
        header: { marginBottom: 24 },
        h1: {
            fontSize: 22,
            fontWeight: 700,
            color: palette.txt,
            borderBottom: "1px solid rgba(16,185,129,0.2)",
            paddingBottom: 8,
            display: "inline-block",
            marginBottom: 8,
        },
        subtitle: { fontSize: 13, color: palette.mute },
        carousel: {
            overflowX: "auto" as const,
            paddingBottom: 16,
            marginLeft: -16,
            marginRight: -16,
            paddingLeft: 16,
            paddingRight: 16,
        },
        carouselTrack: {
            display: "flex",
            gap: 16,
            width: "max-content",
        },
        goalTypeBtn: {
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            gap: 8,
            minWidth: 80,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
        },
        goalTypeIcon: {
            width: 64,
            height: 64,
            borderRadius: 16,
            background: palette.s1,
            border: `1px solid ${palette.brd}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        goalTypeLabel: { fontSize: 11, fontWeight: 600, color: palette.mute, whiteSpace: "nowrap" as const },
        card: {
            background: palette.s1,
            borderRadius: 16,
            border: `1px solid ${palette.brd}`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            overflow: "hidden",
        },
        overlay: {
            position: "fixed" as const,
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
        },
        overlayBackdrop: {
            position: "absolute" as const,
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(4px)",
        },
        modal: {
            position: "relative" as const,
            background: palette.s1,
            width: "100%",
            maxWidth: 560,
            borderRadius: 24,
            border: `1px solid ${palette.brd2}`,
            overflow: "hidden",
            maxHeight: "90vh",
            overflowY: "auto" as const,
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        },
        modalHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px 28px",
            borderBottom: `1px solid ${palette.brd}`,
            background: palette.s1,
            position: "sticky" as const,
            top: 0,
            zIndex: 10,
        },
        modalTitle: { fontWeight: 700, color: palette.txt, fontSize: 18 },
        modalBody: { padding: 28, display: "flex", flexDirection: "column" as const, gap: 20 },
        label: { fontSize: 13, fontWeight: 600, color: palette.mute, display: "block", marginBottom: 6 },
        input: {
            width: "100%",
            background: palette.bg,
            border: `1px solid ${palette.brd2}`,
            borderRadius: 12,
            padding: "12px 14px",
            color: palette.txt,
            fontSize: 14,
            boxSizing: "border-box" as const,
            outline: "none",
        },
        select: {
            width: "100%",
            background: palette.bg,
            border: `1px solid ${palette.brd2}`,
            borderRadius: 12,
            padding: "12px 14px",
            color: palette.txt,
            fontSize: 14,
            boxSizing: "border-box" as const,
        },
        btnPrimary: {
            background: palette.accent,
            color: palette.bg,
            border: "none",
            borderRadius: 12,
            padding: "14px 24px",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "0 0 15px rgba(16,185,129,0.3)",
            width: "100%",
        },
        btnSecondary: {
            background: palette.s1,
            color: palette.txt,
            border: `1px solid ${palette.brd2}`,
            borderRadius: 12,
            padding: "12px 20px",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
        },
        projBox: {
            background: palette.brd,
            borderRadius: 12,
            border: `1px solid ${palette.brd}`,
            padding: "12px 16px",
        },
        projLabel: { fontSize: 11, color: palette.mute, marginBottom: 2 },
        projValue: { fontSize: 18, fontWeight: 700, color: palette.txt },
        row: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    };
    const router = useRouter();
    const { goals, addGoal, removeGoal, updateGoal } = useAssessmentStore();

    const hasSingletonGoal = (goalType: string) =>
        SINGLETON_GOAL_TYPES.includes(goalType) && goals.some((g) => g.type === goalType);

    // API hooks
    const { data: goalsData } = useGoalsQuery();
    const { mutateAsync: addGoalApi } = useAddGoalMutation();
    const { mutateAsync: updateGoalApi } = useUpdateGoalMutation();
    const { mutateAsync: deleteGoalApi, isPending: isDeletingGoal } = useDeleteGoalMutation();
    const { data: projection } = useGoalProjectionQuery();

    // Retirement
    const [showRetirementPanel, setShowRetirementPanel] = useState(false);
    const { data: retirementData, isLoading: isRetirementLoading } = useRetirementAutoFillQuery();
    const isPremium = true;

    // Phase 9.1: Editable retirement age + corpus SWP
    const { data: profileData } = useProfileQuery();
    const { mutateAsync: updateProfile } = useProfileMutation();
    const corpus = useRetirementCorpus();
    const [editableRetirementAge, setEditableRetirementAge] = useState<number | null>(null);

    useEffect(() => {
        if (retirementData && editableRetirementAge === null) {
            setEditableRetirementAge(retirementData.retirementAge);
        }
    }, [retirementData, editableRetirementAge]);

    const currentAge = retirementData?.currentAge ?? 0;
    const retireAge = editableRetirementAge ?? retirementData?.retirementAge ?? 60;
    const isRetired = currentAge > 0 && currentAge >= retireAge;
    const yearsLeft = Math.max(0, retireAge - currentAge);

    const handleRetirementAgeChange = async (newAge: number) => {
        const clamped = Math.max(50, Math.min(75, newAge));
        setEditableRetirementAge(clamped);
        if (profileData) {
            try {
                await updateProfile({ ...profileData, retirementAge: clamped } as Parameters<typeof updateProfile>[0]);
            } catch {
                // Local state still reflects change
            }
        }
    };

    // Sync API goals to store on load
    useEffect(() => {
        if (goalsData && goalsData.length > 0) {
            useAssessmentStore.setState({ goals: goalsData });
        }
    }, [goalsData]);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form state
    const [type, setType] = useState(GOAL_TYPES[0].id);
    const [name, setName] = useState("");
    const [cost, setCost] = useState("");
    const [horizon, setHorizon] = useState("");
    const [currentSavings, setCurrentSavings] = useState("");
    const [inflation, setInflation] = useState("6");
    const [importance, setImportance] = useState("High");

    const openModal = (goalType: string | null = null, goalToEdit: GoalAPIItem | null = null) => {
        if (!goalToEdit && goals.length >= 2) {
            setIsLimitModalOpen(true);
            return;
        }
        if (!goalToEdit && goalType && hasSingletonGoal(goalType)) {
            const label = GOAL_TYPES.find((t) => t.id === goalType)?.label || goalType;
            toast.error(`You already have a ${label} goal. Edit or delete it instead.`);
            return;
        }
        if (goalToEdit) {
            setEditingId(goalToEdit.id);
            setType(goalToEdit.type);
            setName(goalToEdit.name);
            setCost(String(goalToEdit.cost));
            setHorizon(String(goalToEdit.horizon));
            setCurrentSavings(String(goalToEdit.currentSavings || ""));
            setInflation(String(goalToEdit.inflation || "6"));
            setImportance(goalToEdit.importance || "High");
        } else {
            setEditingId(null);
            const template = GOAL_TYPES.find((t) => t.id === goalType) || GOAL_TYPES[0];
            setType(template.id);
            setName(template.label);
            setCost(String(template.defaultCost));
            setHorizon(String(template.defaultHorizon));
            setCurrentSavings("");
            setInflation("6");
            setImportance("High");
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        const goalData = {
            type,
            name: name || GOAL_TYPES.find((t) => t.id === type)?.label || "",
            cost: parseFloat(cost) || 0,
            horizon: parseInt(horizon) || 5,
            currentSavings: parseFloat(currentSavings) || 0,
            inflation: parseFloat(inflation) || 6,
            importance,
        };

        if (editingId) {
            updateGoal(editingId, goalData);
            try {
                await updateGoalApi({ id: editingId, ...goalData });
            } catch (e) {
                console.warn("Goal update API failed:", (e as Error).message);
            }
        } else {
            const tempId = String(Date.now());
            const newGoal = { ...goalData, id: tempId };
            addGoal(newGoal);
            try {
                const saved = await addGoalApi(newGoal);
                if (saved?.id) updateGoal(tempId, { id: saved.id });
            } catch (e) {
                removeGoal(tempId);
                toast.error((e as Error).message || "Could not save goal — check your connection and try again");
            }
        }
        setIsModalOpen(false);
    };

    // Modal preview calculations
    const numCost = parseFloat(cost) || 0;
    const numHorizon = parseInt(horizon) || 0;
    const numSavings = parseFloat(currentSavings) || 0;
    const numInflation = parseFloat(inflation) / 100 || 0;
    const futureCost = numCost * Math.pow(1 + numInflation, numHorizon);
    const bufferedCost = futureCost * 1.2;
    const savingsGrowth = numSavings * Math.pow(1.12, numHorizon);
    const gapToFill = Math.max(0, bufferedCost - savingsGrowth);
    const requiredSip = calculateSIP(gapToFill, numHorizon);
    const requiredLumpSum = numHorizon > 0 ? gapToFill / Math.pow(1.12, numHorizon) : 0;

    // Projection data
    const totalGoals = projection?.totalGoals ?? goals.length;
    const totalAdjustedTarget = projection?.totalAdjustedTarget ?? 0;
    const totalCurrentSavingsAll = projection?.totalCurrentSavings ?? 0;
    const totalSIPRequiredAll = projection?.totalSipRequired ?? 0;
    const monthlySurplus = projection?.monthlySurplus ?? 0;
    const isAchievable = projection?.isAchievable ?? true;
    const feasibilityRemainingBuffer = projection?.remainingBuffer ?? 0;
    const feasibilityShortfall = projection?.shortfall ?? 0;

    const goalProjectionMap: Record<string, GoalProjection["goals"][number]> = {};
    (projection?.goals || []).forEach((g) => {
        goalProjectionMap[g.id] = g;
    });

    // Emergency fund
    const efMonthlyExpenses = projection?.monthlyExpenses ?? 0;
    const efTargetMonths = projection?.emergencyTargetMonths ?? 6;
    const efTarget = projection?.emergencyFundTarget ?? 0;
    const efCurrent = projection?.emergencyFundCurrent ?? 0;
    const efGap = projection?.emergencyFundGap ?? 0;
    const efCoverage = projection?.emergencyCoverageMonths ?? 0;
    const efAggressive = projection?.emergencyAggressiveMonths ?? 0;
    const efConservative = projection?.emergencyConservativeMonths ?? 0;
    const efProgressPercent = efTarget > 0 ? Math.min(100, (efCurrent / efTarget) * 100) : 0;
    const efFullyCovered = efGap <= 0;

    return (
        <div style={S.page}>
            {/* Header */}
            <div style={S.header}>
                <h1 style={S.h1}>Step 4: Your Dreams, Quantified</h1>
                <p style={S.subtitle}>
                    Financial freedom isn&apos;t just about saving—it&apos;s about purposeful saving.
                </p>
            </div>

            {/* Goal Type Carousel */}
            <div style={S.carousel}>
                <div style={S.carouselTrack}>
                    {GOAL_TYPES.map((t) => {
                        const disabled = hasSingletonGoal(t.id);
                        const Icon = t.icon;
                        return (
                            <button
                                key={t.id}
                                onClick={() => {
                                    if (t.id === "retirement") {
                                        setShowRetirementPanel((prev) => !prev);
                                        return;
                                    }
                                    openModal(t.id);
                                }}
                                style={{
                                    ...S.goalTypeBtn,
                                    opacity: disabled ? 0.4 : 1,
                                    cursor: disabled ? "not-allowed" : "pointer",
                                }}
                            >
                                <div style={S.goalTypeIcon}>
                                    <Icon style={{ width: 32, height: 32, color: palette.mute }} />
                                </div>
                                <span style={S.goalTypeLabel}>
                                    {disabled ? `${t.label} (Added)` : t.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Retirement Panel */}
            {showRetirementPanel && (
                <div style={{ marginBottom: 24, marginTop: 16 }}>
                    {!isPremium ? (
                        <div style={{ ...S.card, position: "relative", padding: 24 }}>
                            <div style={{ filter: "blur(6px)", userSelect: "none", pointerEvents: "none" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    {[["Corpus Required", "₹11.7 Cr"], ["Monthly SIP", "₹75,000"], ["Gap", "₹11.4 Cr"], ["On Track", "1.5%"]].map(([label, val]) => (
                                        <div key={label} style={{ background: palette.brd, borderRadius: 12, padding: 16 }}>
                                            <p style={{ color: palette.mute, fontSize: 13 }}>{label}</p>
                                            <p style={{ fontSize: 22, fontWeight: 700, color: palette.txt }}>{val}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(11,15,26,0.6)", backdropFilter: "blur(4px)", borderRadius: 16 }}>
                                <div style={{ width: 56, height: 56, background: "rgba(245,158,11,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(245,158,11,0.2)", marginBottom: 12 }}>
                                    <Lock style={{ width: 28, height: 28, color: "#F59E0B" }} />
                                </div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: palette.txt, marginBottom: 4 }}>Unlock Your Retirement Plan</h3>
                                <p style={{ fontSize: 13, color: palette.mute, marginBottom: 16 }}>See exact SIP & gap based on your real data</p>
                                <button style={{ padding: "10px 24px", background: "linear-gradient(to right, #F59E0B, #F97316)", color: palette.bg, fontWeight: 700, borderRadius: 12, border: "none", cursor: "pointer", fontSize: 13 }}>
                                    <Crown style={{ width: 16, height: 16, display: "inline", marginRight: 6, marginTop: -2, verticalAlign: "middle" }} />
                                    Upgrade to Premium
                                </button>
                            </div>
                        </div>
                    ) : isRetirementLoading ? (
                        <div style={{ ...S.card, padding: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                            <div style={{ width: 24, height: 24, border: "2px solid #10B981", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                            <span style={{ color: palette.mute }}>Calculating your retirement plan...</span>
                        </div>
                    ) : retirementData ? (
                        <div style={S.card}>
                            {/* Header */}
                            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${palette.brd}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ width: 36, height: 36, background: "rgba(16,185,129,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Briefcase style={{ width: 20, height: 20, color: palette.accent }} />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 700, color: palette.txt, fontSize: 13, letterSpacing: "0.05em" }}>RETIREMENT PLANNER</p>
                                        <p style={{ fontSize: 11, color: palette.mute }}>Auto-calculated from your data</p>
                                    </div>
                                </div>
                                <span style={{
                                    padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                                    ...(retirementData.status === "CRITICAL"
                                        ? { background: "rgba(239,68,68,0.1)", color: palette.danger, border: "1px solid rgba(239,68,68,0.2)" }
                                        : retirementData.status === "MODERATE"
                                        ? { background: "rgba(245,158,11,0.1)", color: "#FBBF24", border: "1px solid rgba(245,158,11,0.2)" }
                                        : { background: "rgba(16,185,129,0.1)", color: "#34D399", border: "1px solid rgba(16,185,129,0.2)" }),
                                }}>
                                    {retirementData.status === "CRITICAL" ? "Critical" : retirementData.status === "MODERATE" ? "Moderate" : "On Track"}
                                </span>
                            </div>

                            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                                {/* Age strip — editable retirement age (D-01, D-02, D-15) */}
                                <div style={{ ...S.row, background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: "10px 16px", border: `1px solid ${palette.brd}` }}>
                                    <div style={{ display: "flex", gap: 24, fontSize: 13, alignItems: "center" }}>
                                        <span style={{ color: palette.mute }}>Age <strong style={{ color: palette.txt, marginLeft: 4 }}>{retirementData.currentAge}</strong></span>
                                        <span style={{ color: palette.mute, display: "flex", alignItems: "center", gap: 6 }}>Retire at
                                            <span style={{ display: "inline-flex", alignItems: "center", background: palette.brd, borderRadius: 8, overflow: "hidden" }}>
                                                <input
                                                    type="number"
                                                    value={retireAge}
                                                    min={50}
                                                    max={75}
                                                    onChange={(e) => handleRetirementAgeChange(parseInt(e.target.value) || 60)}
                                                    style={{ width: 48, padding: "4px 6px", background: "transparent", border: "none", color: palette.txt, fontWeight: 700, fontSize: 13, textAlign: "center", outline: "none", fontFamily: "var(--font-display)" }}
                                                />
                                                <span style={{ display: "flex", flexDirection: "column", borderLeft: `1px solid ${palette.brd2}` }}>
                                                    <button onClick={() => handleRetirementAgeChange(retireAge + 1)} style={{ padding: "0 4px", background: "transparent", border: "none", cursor: "pointer", color: palette.mute, lineHeight: 1, display: "flex" }}><ChevronUp style={{ width: 12, height: 12 }} /></button>
                                                    <button onClick={() => handleRetirementAgeChange(retireAge - 1)} style={{ padding: "0 4px", background: "transparent", border: "none", cursor: "pointer", color: palette.mute, lineHeight: 1, display: "flex" }}><ChevronDown style={{ width: 12, height: 12 }} /></button>
                                                </span>
                                            </span>
                                        </span>
                                    </div>
                                    {isRetired ? (
                                        <span style={{ padding: "4px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: "rgba(16,185,129,0.15)", color: "#34D399", border: "1px solid rgba(16,185,129,0.3)" }}>Retired</span>
                                    ) : (
                                        <span style={{ fontSize: 13, fontWeight: 700, color: palette.accent }}>{yearsLeft} years left</span>
                                    )}
                                </div>

                                {/* Retired state — corpus breakdown + SWP income (D-05, D-08, D-11, D-12) */}
                                {isRetired ? (
                                    <>
                                        {/* Corpus Breakdown Table */}
                                        <div style={{ background: palette.brd, borderRadius: 12, padding: 16 }}>
                                            <p style={{ fontSize: 10, color: palette.mute, letterSpacing: "0.1em", fontWeight: 600, textTransform: "uppercase", marginBottom: 12 }}>Retirement Corpus Breakdown</p>
                                            {[
                                                { label: "EPF (Provident Fund)", value: corpus.epfTotal },
                                                { label: "PPF (Public Provident Fund)", value: corpus.ppfTotal },
                                                { label: "NPS (National Pension)", value: corpus.npsTotal },
                                                { label: "Other Retirement Instruments", value: corpus.otherRetirementTotal },
                                            ].map((row) => (
                                                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${palette.brd2}` }}>
                                                    <span style={{ fontSize: 13, color: palette.mute }}>{row.label}</span>
                                                    <span style={{ fontSize: 13, fontWeight: 600, color: palette.txt }}>{formatToCrLakh(row.value)}</span>
                                                </div>
                                            ))}
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, marginTop: 4 }}>
                                                <span style={{ fontSize: 14, fontWeight: 700, color: palette.txt }}>Total Corpus</span>
                                                <span style={{ fontSize: 18, fontWeight: 700, color: palette.accent }}>{formatToCrLakh(corpus.totalCorpus)}</span>
                                            </div>
                                        </div>

                                        {/* SWP Income Highlight */}
                                        <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: 20, textAlign: "center" }}>
                                            <p style={{ fontSize: 11, color: palette.mute, letterSpacing: "0.1em", fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Your Monthly Retirement Income via SWP</p>
                                            <p style={{ fontSize: 28, fontWeight: 700, color: palette.accent, fontFamily: "var(--font-display)" }}>{formatToCrLakh(corpus.monthlySWP)}</p>
                                            <p style={{ fontSize: 12, color: palette.mute, marginTop: 6 }}>Based on 3% annual withdrawal from your retirement corpus</p>
                                        </div>

                                        {/* Add Retirement Goal button for retired users */}
                                        {!hasSingletonGoal("retirement") && (
                                            <button
                                                onClick={async () => {
                                                    const retGoal = {
                                                        type: "retirement",
                                                        name: "Retirement",
                                                        cost: Math.round(corpus.totalCorpus),
                                                        horizon: 0,
                                                        currentSavings: Math.round(corpus.totalCorpus),
                                                        inflation: 6,
                                                        importance: "Critical",
                                                    };
                                                    try {
                                                        const saved = await addGoalApi(retGoal);
                                                        addGoal(saved);
                                                        toast.success("Retirement goal saved!");
                                                        setShowRetirementPanel(false);
                                                    } catch {
                                                        toast.error("Could not add retirement goal — check your connection and try again");
                                                    }
                                                }}
                                                style={{ ...S.btnPrimary, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                                            >
                                                <ArrowUpRight style={{ width: 16, height: 16 }} />
                                                Save Retirement Goal
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <>
                                {/* Pre-retirement: What You Need vs Have (unchanged per D-17) */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                    <div style={{ ...S.projBox, display: "flex", flexDirection: "column", gap: 12 }}>
                                        <p style={{ fontSize: 10, color: palette.mute, letterSpacing: "0.1em", fontWeight: 600, textTransform: "uppercase" }}>What You Need</p>
                                        <div>
                                            <p style={S.projLabel}>Future Monthly Expense</p>
                                            <p style={{ ...S.projValue, fontSize: 16 }}>{formatToCrLakh(retirementData.futureMonthlyExpense)}<span style={{ fontSize: 11, color: palette.mute, fontWeight: 400 }}>/mo</span></p>
                                        </div>
                                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 12 }}>
                                            <p style={S.projLabel}>Retirement Corpus</p>
                                            <p style={{ ...S.projValue, fontSize: 22 }}>{formatToCrLakh(retirementData.corpusRequired)}</p>
                                        </div>
                                    </div>
                                    <div style={{ ...S.projBox, display: "flex", flexDirection: "column", gap: 12 }}>
                                        <p style={{ fontSize: 10, color: palette.mute, letterSpacing: "0.1em", fontWeight: 600, textTransform: "uppercase" }}>What You Have</p>
                                        <div>
                                            <p style={S.projLabel}>Current Retirement Corpus</p>
                                            <p style={{ ...S.projValue, fontSize: 16 }}>{formatToCrLakh(retirementData.currentRetirementAssets)}</p>
                                        </div>
                                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 12 }}>
                                            <p style={S.projLabel}>Projected Value @ 8%</p>
                                            <p style={{ ...S.projValue, fontSize: 22, color: palette.accent }}>{formatToCrLakh(retirementData.projectedAssets)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Gap */}
                                <div style={{
                                    borderRadius: 12, padding: 16, border: "1px solid",
                                    ...(retirementData.status === "CRITICAL"
                                        ? { background: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.15)" }
                                        : retirementData.status === "MODERATE"
                                        ? { background: "rgba(245,158,11,0.05)", borderColor: "rgba(245,158,11,0.15)" }
                                        : { background: "rgba(16,185,129,0.05)", borderColor: "rgba(16,185,129,0.15)" }),
                                }}>
                                    <div style={{ ...S.row, marginBottom: 8 }}>
                                        <p style={{ fontSize: 11, color: palette.mute, letterSpacing: "0.1em", fontWeight: 600, textTransform: "uppercase" }}>Gap Analysis</p>
                                        <span style={{ fontSize: 11, color: palette.mute }}>{retirementData.onTrackPercent.toFixed(1)}% on track</span>
                                    </div>
                                    <p style={{
                                        fontSize: 20, fontWeight: 700,
                                        color: retirementData.status === "CRITICAL" ? palette.danger : retirementData.status === "MODERATE" ? "#FBBF24" : "#34D399",
                                    }}>
                                        {retirementData.gap > 0 ? `Short by ${formatToCrLakh(retirementData.gap)}` : "Fully Covered!"}
                                    </p>
                                    <div style={{ marginTop: 10, height: 6, background: palette.brd2, borderRadius: 9999, overflow: "hidden" }}>
                                        <div style={{
                                            height: "100%", borderRadius: 9999, transition: "width 0.5s",
                                            width: `${Math.min(100, retirementData.onTrackPercent)}%`,
                                            background: retirementData.onTrackPercent >= 80 ? palette.accent : retirementData.onTrackPercent >= 20 ? "#F59E0B" : palette.danger,
                                        }} />
                                    </div>
                                </div>

                                {/* SIP options */}
                                {retirementData.gap > 0 && (
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                        <div style={S.projBox}>
                                            <p style={{ fontSize: 10, color: palette.mute, letterSpacing: "0.1em", fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Flat SIP</p>
                                            <p style={{ fontSize: 20, fontWeight: 700, color: palette.txt }}>{formatToCrLakh(retirementData.sipFlat)}<span style={{ fontSize: 11, color: palette.mute }}>/mo</span></p>
                                        </div>
                                        <div style={{ ...S.projBox, background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                                                <p style={{ fontSize: 10, color: palette.accent, letterSpacing: "0.1em", fontWeight: 700, textTransform: "uppercase" }}>Step-Up SIP</p>
                                                <span style={{ fontSize: 9, background: "rgba(16,185,129,0.2)", color: palette.accent, padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>REC</span>
                                            </div>
                                            <p style={{ fontSize: 20, fontWeight: 700, color: palette.txt }}>{formatToCrLakh(retirementData.sipStepUpStart)}<span style={{ fontSize: 11, color: palette.mute }}>/mo</span></p>
                                            <p style={{ fontSize: 11, color: palette.mute }}>+{retirementData.stepUpRate}% yearly</p>
                                        </div>
                                    </div>
                                )}

                                {/* Delay impact */}
                                {retirementData.sipIfDelayed > 0 && retirementData.sipFlat > 0 && (
                                    <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 8, padding: "12px 16px" }}>
                                        <Clock style={{ width: 16, height: 16, color: palette.danger, flexShrink: 0 }} />
                                        <p style={{ fontSize: 12, color: palette.mute }}>
                                            Delay by <strong style={{ color: palette.danger }}>{retirementData.delayYears}y</strong> → SIP becomes <strong style={{ color: palette.danger }}>{formatToCrLakh(retirementData.sipIfDelayed)}/mo</strong>
                                            <span style={{ color: palette.mute, marginLeft: 4 }}>(+{formatToCrLakh(retirementData.sipIfDelayed - retirementData.sipFlat)}/mo)</span>
                                        </p>
                                    </div>
                                )}

                                {/* Add Retirement Goal button */}
                                {!hasSingletonGoal("retirement") && (
                                    <button
                                        onClick={async () => {
                                            const retGoal = {
                                                type: "retirement",
                                                name: "Retirement",
                                                cost: Math.round(retirementData.corpusRequired / Math.pow(1.06, yearsLeft)),
                                                horizon: yearsLeft,
                                                currentSavings: retirementData.currentRetirementAssets,
                                                inflation: 6,
                                                importance: "Critical",
                                            };
                                            try {
                                                const saved = await addGoalApi(retGoal);
                                                addGoal(saved);
                                                toast.success("Retirement goal added!");
                                                setShowRetirementPanel(false);
                                            } catch {
                                                toast.error("Could not add retirement goal — check your connection and try again");
                                            }
                                        }}
                                        style={{ ...S.btnPrimary, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                                    >
                                        <ArrowUpRight style={{ width: 16, height: 16 }} />
                                        Add Retirement Goal
                                    </button>
                                )}
                                    </>
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
            )}

            {/* Emergency Fund Card */}
            {efMonthlyExpenses > 0 && (() => {
                const statusColor = efFullyCovered ? "emerald" : efProgressPercent >= 50 ? "amber" : "red";
                const statusLabel = efFullyCovered ? "Fully Covered" : efProgressPercent >= 50 ? "Partially Covered" : "Needs Attention";
                const formatMonths = (m: number) => {
                    const r = Math.ceil(m);
                    return `${r} ${r === 1 ? "month" : "months"}`;
                };
                const statusBadgeStyle: Record<string, React.CSSProperties> = {
                    emerald: { background: "rgba(16,185,129,0.15)", color: "#34D399", border: "1px solid rgba(16,185,129,0.3)" },
                    amber: { background: "rgba(245,158,11,0.15)", color: "#FBBF24", border: "1px solid rgba(245,158,11,0.3)" },
                    red: { background: "rgba(239,68,68,0.15)", color: palette.danger, border: "1px solid rgba(239,68,68,0.3)" },
                };

                return (
                    <div style={{ ...S.card, marginBottom: 24 }}>
                        <div style={{ padding: 20, background: "linear-gradient(to right, rgba(16,185,129,0.1), rgba(20,184,166,0.1))" }}>
                            <div style={S.row}>
                                <div>
                                    <h3 style={{ fontWeight: 700, color: palette.txt, display: "flex", alignItems: "center", gap: 8, fontSize: 15 }}>
                                        <ShieldAlert style={{ width: 20, height: 20, color: "#34D399" }} />
                                        Emergency Fund Status
                                    </h3>
                                    <p style={{ fontSize: 13, color: palette.mute, marginTop: 4 }}>
                                        You need <strong style={{ color: palette.txt }}>{efTargetMonths} months</strong> of expenses
                                        <span style={{ color: palette.mute, marginLeft: 4 }}>
                                            ({efTargetMonths === 9 ? "Business / Self-Employed" : "Salaried / Retired"})
                                        </span>
                                    </p>
                                </div>
                                <div style={{ ...statusBadgeStyle[statusColor], padding: "6px 12px", borderRadius: 9999, fontSize: 11, fontWeight: 700 }}>
                                    {statusLabel}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: `1px solid ${palette.brd}` }}>
                            {[
                                ["Monthly Expenses", `₹${Math.round(efMonthlyExpenses).toLocaleString("en-IN")}`, "from your cash flow", palette.txt],
                                ["Target Corpus", formatToCrLakh(efTarget), `${efTargetMonths} × monthly`, palette.txt],
                                ["Liquid Assets", formatToCrLakh(efCurrent), "FDs, Savings, Debt MFs", efCurrent > 0 ? "#34D399" : palette.danger],
                            ].map(([label, val, sub, color]) => (
                                <div key={label} style={{ padding: 16, textAlign: "center" }}>
                                    <p style={{ fontSize: 11, color: palette.mute, marginBottom: 4 }}>{label}</p>
                                    <p style={{ fontWeight: 700, fontSize: 15, color }}>{val}</p>
                                    <p style={{ fontSize: 11, color: palette.mute, marginTop: 2 }}>{sub}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ padding: 20 }}>
                            <div style={{ ...S.row, marginBottom: 8 }}>
                                <span style={{ fontSize: 13, color: palette.mute }}>Coverage</span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: palette.txt }}>{efCoverage.toFixed(1)} / {efTargetMonths} months</span>
                            </div>
                            <div style={{ height: 12, background: palette.bg, borderRadius: 9999, overflow: "hidden" }}>
                                <div style={{
                                    height: "100%", borderRadius: 9999, transition: "width 1s",
                                    width: `${efProgressPercent}%`,
                                    background: efFullyCovered ? palette.accent : "linear-gradient(to right, #10B981, #06B6D4)",
                                }} />
                            </div>
                            {!efFullyCovered && efGap > 0 && (
                                <p style={{ fontSize: 12, color: "#FBBF24", marginTop: 8, fontWeight: 500 }}>
                                    You need {formatToCrLakh(efGap)} more to reach your target
                                </p>
                            )}
                        </div>

                        {efFullyCovered ? (
                            <div style={{ margin: "0 20px 20px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: 16 }}>
                                <p style={{ color: "#34D399", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                                    <CheckCircle2 style={{ width: 20, height: 20 }} />
                                    Emergency fund fully covered!
                                </p>
                                <p style={{ fontSize: 13, color: "rgba(52,211,153,0.8)", marginTop: 6, marginLeft: 28 }}>
                                    Your liquid assets cover {efCoverage.toFixed(1)} months — exceeding the {efTargetMonths}-month target.
                                </p>
                            </div>
                        ) : (
                            <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                                <p style={{ fontSize: 11, letterSpacing: "0.1em", fontWeight: 700, color: palette.mute, textTransform: "uppercase" }}>How to build it</p>
                                {monthlySurplus > 0 ? (
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                        <div style={{ background: "rgba(16,185,129,0.05)", borderRadius: 12, padding: 16, border: "1px solid rgba(16,185,129,0.15)" }}>
                                            <p style={{ fontSize: 13, fontWeight: 700, color: palette.txt }}>Aggressive — 100%</p>
                                            <p style={{ fontSize: 12, color: palette.mute, marginTop: 4 }}>₹{Math.round(monthlySurplus).toLocaleString("en-IN")}/month</p>
                                            <p style={{ fontSize: 12, color: "#34D399", fontWeight: 700, marginTop: 4 }}>→ ready in {formatMonths(efAggressive)}</p>
                                        </div>
                                        <div style={{ background: "rgba(59,130,246,0.05)", borderRadius: 12, padding: 16, border: "1px solid rgba(59,130,246,0.15)" }}>
                                            <p style={{ fontSize: 13, fontWeight: 700, color: palette.txt }}>Conservative — 50%</p>
                                            <p style={{ fontSize: 12, color: palette.mute, marginTop: 4 }}>₹{Math.round(monthlySurplus * 0.5).toLocaleString("en-IN")}/month</p>
                                            <p style={{ fontSize: 12, color: "#60A5FA", fontWeight: 700, marginTop: 4 }}>→ ready in {formatMonths(efConservative)}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: 16 }}>
                                        <p style={{ fontSize: 13, color: palette.danger, display: "flex", alignItems: "flex-start", gap: 8 }}>
                                            <AlertTriangle style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
                                            <span>Your monthly surplus is ₹0. Go back to <strong style={{ color: palette.txt }}>Step 2</strong> to increase income or reduce expenses.</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })()}

            {/* Goals List */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, paddingBottom: 16 }}>
                {goals.length === 0 && (
                    <div style={{ textAlign: "center", padding: "40px 0", color: palette.mute }}>
                        <p>No goals added yet.</p>
                        <p style={{ fontSize: 13 }}>Select a goal above to get started.</p>
                    </div>
                )}

                {goals.map((goal) => {
                    const proj = goalProjectionMap[goal.id];
                    const gBufferedCost = proj?.bufferedCost ?? 0;
                    const gSavings = proj?.currentSavings ?? (goal.currentSavings || 0);
                    const sip = proj?.requiredSip ?? 0;
                    const progressPercent = proj?.progressPercent ?? 0;
                    const Icon = GOAL_TYPES.find((t) => t.id === goal.type)?.icon || Home;

                    return (
                        <div key={goal.id} style={{ ...S.card, padding: 20 }}>
                            <div style={{ ...S.row, marginBottom: 16 }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                        <Icon style={{ width: 20, height: 20, color: palette.mute }} />
                                        <h3 style={{ fontWeight: 700, color: palette.txt, fontSize: 13, letterSpacing: "0.05em", textTransform: "uppercase" }}>{goal.name}</h3>
                                        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: palette.brd, color: palette.mute }}>[{goal.importance || "High"} Priority]</span>
                                    </div>
                                    <p style={{ fontSize: 12, color: palette.mute }}>Target: {formatToCrLakh(gBufferedCost)} ({new Date().getFullYear() + goal.horizon})</p>
                                    <p style={{ fontSize: 12, color: palette.mute }}>Current: {formatToCrLakh(goal.currentSavings || 0)}</p>
                                </div>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button
                                        onClick={() => openModal(null, goal)}
                                        style={{ fontSize: 12, fontWeight: 600, color: palette.accent, background: "rgba(16,185,129,0.1)", border: "none", borderRadius: 9999, padding: "4px 12px", cursor: "pointer" }}
                                    >
                                        Edit
                                    </button>
                                    {goal.type !== "retirement" && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await deleteGoalApi(goal.id);
                                                    removeGoal(goal.id);
                                                    toast.success("Goal deleted");
                                                } catch {
                                                    toast.error("Could not delete goal — check your connection");
                                                }
                                            }}
                                            disabled={isDeletingGoal}
                                            style={{ fontSize: 12, fontWeight: 600, color: "rgba(248,113,113,0.6)", background: "rgba(239,68,68,0.1)", border: "none", borderRadius: 9999, padding: "4px 12px", cursor: isDeletingGoal ? "not-allowed" : "pointer", opacity: isDeletingGoal ? 0.5 : 1 }}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <div style={{ height: 8, background: palette.bg, borderRadius: 9999, overflow: "hidden" }}>
                                    <div style={{ height: "100%", background: palette.accent, borderRadius: 9999, width: `${Math.min(100, progressPercent)}%` }} />
                                </div>
                                <div style={{ ...S.row, marginTop: 4 }}>
                                    <span style={{ fontSize: 11, color: palette.mute }}>Progress: {progressPercent.toFixed(1)}% complete</span>
                                    <span style={{ fontSize: 11, color: palette.txt2 }}>{formatToCrLakh(gBufferedCost - gSavings)} to go</span>
                                </div>
                            </div>

                            <div style={{ ...S.projBox }}>
                                <p style={S.projLabel}>Required Monthly SIP</p>
                                <p style={{ fontWeight: 700, color: palette.txt, fontSize: 20 }}>₹ {Math.round(sip).toLocaleString("en-IN")}</p>
                                <div style={{ marginTop: 8 }}>
                                    <p style={{ fontSize: 11, color: palette.mute }}>Currently Saved: {formatToCrLakh(goal.currentSavings || 0)}</p>
                                    {sip > 0 && (
                                        <p style={{ fontSize: 11, color: "#FBBF24", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                                            <AlertTriangle style={{ width: 12, height: 12 }} />
                                            Shortfall: ₹{Math.round(sip).toLocaleString("en-IN")}/month
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* All Goals Summary */}
                {goals.length >= 2 && (
                    <div style={{ ...S.card, border: "2px solid rgba(16,185,129,0.2)" }}>
                        <div style={{ background: "rgba(16,185,129,0.1)", padding: 12, borderBottom: "1px solid rgba(16,185,129,0.1)" }}>
                            <h3 style={{ fontWeight: 700, color: palette.accent, textAlign: "center", letterSpacing: "0.1em", fontSize: 13 }}>ALL GOALS SUMMARY</h3>
                        </div>
                        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
                                {[
                                    ["Total Goals", String(totalGoals)],
                                    ["Total Target (Adjusted)", formatToCrLakh(totalAdjustedTarget)],
                                    ["Current Savings", formatToCrLakh(totalCurrentSavingsAll)],
                                    ["Total SIP Required", `₹ ${Math.round(totalSIPRequiredAll).toLocaleString("en-IN")}`],
                                ].map(([label, val], i) => (
                                    <div key={i} style={{ display: "contents" }}>
                                        <div style={{ color: palette.mute }}>{label}</div>
                                        <div style={{ textAlign: "right", fontWeight: 700, color: i === 3 ? palette.accent : palette.txt }}>{val}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ borderTop: `1px solid ${palette.brd2}`, paddingTop: 16 }}>
                                <h4 style={{ fontWeight: 700, color: palette.txt, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>FEASIBILITY CHECK</h4>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, marginBottom: 16 }}>
                                    {[
                                        ["Your Monthly Surplus", `₹ ${Math.round(monthlySurplus).toLocaleString("en-IN")}`, palette.txt],
                                        ["Total SIP Needed", `₹ ${Math.round(totalSIPRequiredAll).toLocaleString("en-IN")}`, palette.txt],
                                    ].map(([label, val, color]) => (
                                        <div key={label} style={S.row}>
                                            <span style={{ color: palette.mute }}>{label}</span>
                                            <span style={{ fontWeight: 700, color }}>{val}</span>
                                        </div>
                                    ))}
                                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 8, ...S.row }}>
                                        <span style={{ color: palette.mute }}>Remaining Buffer</span>
                                        <span style={{ fontWeight: 700, color: feasibilityRemainingBuffer >= 0 ? palette.accent : palette.danger }}>
                                            {feasibilityRemainingBuffer >= 0
                                                ? `₹ ${Math.round(feasibilityRemainingBuffer).toLocaleString("en-IN")}`
                                                : `-₹ ${Math.round(Math.abs(feasibilityRemainingBuffer)).toLocaleString("en-IN")}`}
                                        </span>
                                    </div>
                                </div>

                                {isAchievable ? (
                                    <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, padding: 12 }}>
                                        <p style={{ fontWeight: 700, color: palette.accent, display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13 }}>
                                            <CheckCircle2 style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
                                            Your goals are achievable!
                                        </p>
                                    </div>
                                ) : (
                                    <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: 12 }}>
                                        <p style={{ fontWeight: 700, color: palette.danger, display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13 }}>
                                            <AlertTriangle style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
                                            YOUR GOALS EXCEED CURRENT CAPACITY
                                        </p>
                                        <div style={{ fontSize: 12, color: "rgba(248,113,113,0.8)", marginTop: 8, marginLeft: 24 }}>
                                            <p>Shortfall: <strong>₹{Math.round(feasibilityShortfall).toLocaleString("en-IN")}/month</strong></p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Goal Modal */}
            {isModalOpen && createPortal(
                <div style={S.overlay}>
                    <div style={S.overlayBackdrop} onClick={() => setIsModalOpen(false)} />
                    <div style={S.modal}>
                        <div style={S.modalHeader}>
                            <h3 style={S.modalTitle}>{editingId ? "Edit Goal" : "Add Goal"}</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: palette.mute }}>
                                <X style={{ width: 20, height: 20 }} />
                            </button>
                        </div>
                        <div style={S.modalBody}>
                            <div>
                                <label style={S.label}>Goal Type</label>
                                <select value={type} onChange={(e) => {
                                    const t = GOAL_TYPES.find(gt => gt.id === e.target.value);
                                    setType(e.target.value);
                                    if (t && !editingId) { setName(t.label); setCost(String(t.defaultCost)); setHorizon(String(t.defaultHorizon)); }
                                }} style={S.select}>
                                    {GOAL_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={S.label}>Goal Name</label>
                                <input style={S.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Buy a home in Mumbai" />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div>
                                    <label style={S.label}>Target Cost (₹)</label>
                                    <input style={S.input} type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="5000000" />
                                </div>
                                <div>
                                    <label style={S.label}>Time Horizon (years)</label>
                                    <input style={S.input} type="number" value={horizon} onChange={(e) => setHorizon(e.target.value)} placeholder="10" />
                                </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div>
                                    <label style={S.label}>Current Savings (₹)</label>
                                    <input style={S.input} type="number" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} placeholder="100000" />
                                </div>
                                <div>
                                    <label style={S.label}>Inflation Rate (%)</label>
                                    <input style={S.input} type="number" value={inflation} onChange={(e) => setInflation(e.target.value)} placeholder="6" />
                                </div>
                            </div>
                            <div>
                                <label style={S.label}>Importance</label>
                                <div style={{ display: "flex", gap: 8 }}>
                                    {IMPORTANCE_LEVELS.map((level) => (
                                        <button
                                            key={level.id}
                                            onClick={() => setImportance(level.id)}
                                            style={{
                                                flex: 1, padding: "8px 4px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid",
                                                background: importance === level.id ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.03)",
                                                color: importance === level.id ? palette.accent : palette.mute,
                                                borderColor: importance === level.id ? "rgba(16,185,129,0.4)" : palette.brd,
                                            }}
                                        >{level.label}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Projection Preview */}
                            {numCost > 0 && numHorizon > 0 && (
                                <div style={{ background: "rgba(16,185,129,0.05)", borderRadius: 12, border: "1px solid rgba(16,185,129,0.15)", padding: 16 }}>
                                    <p style={{ fontSize: 11, color: palette.accent, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Projection Preview</p>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                                        {[
                                            ["Inflation-Adj Target", formatToCrLakh(bufferedCost)],
                                            ["Monthly SIP", `₹${Math.round(requiredSip).toLocaleString("en-IN")}`],
                                            ["Lump Sum", formatToCrLakh(requiredLumpSum)],
                                        ].map(([label, val]) => (
                                            <div key={label} style={{ textAlign: "center" }}>
                                                <p style={{ fontSize: 10, color: palette.mute, marginBottom: 4 }}>{label}</p>
                                                <p style={{ fontWeight: 700, color: palette.txt, fontSize: 14 }}>{val}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                        <div style={{ padding: "16px 28px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", background: palette.s1, position: "sticky" as const, bottom: 0 }}>
                            <button onClick={handleSave} style={S.btnPrimary}>
                                {editingId ? "Update Goal" : "Save Goal"}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Limit Modal */}
            {isLimitModalOpen && createPortal(
                <div style={{ ...S.overlay, alignItems: "center", padding: 16 }}>
                    <div style={S.overlayBackdrop} onClick={() => setIsLimitModalOpen(false)} />
                    <div style={{ position: "relative", background: palette.s1, width: "100%", maxWidth: 360, borderRadius: 24, padding: 24, border: `1px solid ${palette.brd2}`, textAlign: "center" }}>
                        <div style={{ width: 64, height: 64, background: "rgba(245,158,11,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", border: "1px solid rgba(245,158,11,0.2)" }}>
                            <Lock style={{ width: 32, height: 32, color: "#F59E0B" }} />
                        </div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: palette.txt, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Free Plan Limit Reached</h3>
                        <p style={{ fontSize: 13, color: palette.mute, marginBottom: 24 }}>
                            You&apos;ve added {goals.length} goals (free plan maximum).<br />Want to add more goals?
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <button style={{ padding: "12px 16px", background: "linear-gradient(to right, #F59E0B, #F97316)", color: palette.bg, fontWeight: 700, borderRadius: 12, border: "none", cursor: "pointer", fontSize: 13 }}>
                                Upgrade to Premium
                                <span style={{ display: "block", fontSize: 11, fontWeight: 500, opacity: 0.8 }}>(₹ 999 /year for unlimited goals)</span>
                            </button>
                            <button onClick={() => setIsLimitModalOpen(false)} style={S.btnSecondary}>
                                Continue with {goals.length} Goals
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <StepNavigation
                step={4}
                backPath="/assessment/step-3"
                onNext={() => {
                    if (goals.length === 0) {
                        toast.error("Add at least one financial goal — home, retirement, education, etc.", { id: "step4-guide" });
                        return;
                    }
                    router.push("/assessment/step-5");
                }}
                isValid={goals.length > 0}
                validationMessage="Add at least one financial goal to continue"
            />

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
