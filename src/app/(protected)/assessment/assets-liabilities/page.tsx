"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Plus,
    X,
    Pencil,
    TrendingUp,
    CreditCard,
    CheckCircle2,
    AlertTriangle,
    Info,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import {
    useBalanceSheetQuery,
    useAddAssetMutation,
    useAddLiabilityMutation,
    useUpdateAssetMutation,
    useUpdateLiabilityMutation,
    useDeleteAssetMutation,
    useDeleteLiabilityMutation,
} from "@/hooks/assessment/useBalanceSheet";
import { usePortfolioAnalysisQuery } from "@/hooks/assessment/usePortfolioAnalysis";
import { useRiskScoringQuery } from "@/hooks/assessment/useRiskScoring";
import { StepNavigation } from "@/components/assessment/step-navigation";
import type { AssetItem, LiabilityItem } from "@/lib/assessment-api";
import { useAppTheme } from "@/hooks/useAppTheme";

// ─── Category Data ─────────────────────────────────────────────────────────────

const ASSET_CATEGORIES: Record<string, string[]> = {
    "Savings & Investments": [
        "🏦 Bank/Savings Account",
        "📊 Fixed Deposit (FD)",
        "💰 Recurring Deposit (RD)",
        "🏢 EPF (Provident Fund)",
        "📈 PPF (Public Provident Fund)",
        "🎯 NPS (National Pension System)",
        "📊 Mutual Funds — Equity",
        "📉 Mutual Funds — Debt",
        "📊 Mutual Funds — Hybrid",
        "📈 Stocks/Shares",
        "📄 Bonds/Debentures",
        "🏢 REITs/InvITs",
    ],
    "Real Assets": [
        "🪙 Gold (Physical jewelry/bars)",
        "💎 Gold/ Silver (Digital/Sovereign Gold Bonds)",
        "⚪ Silver",
        "🏠 Real Estate (Residential)",
        "🏢 Real Estate (Commercial)",
        "🚗 Vehicle",
    ],
    "Alternative Investments": [
        "₿ Cryptocurrency",
        "💼 Business Equity",
        "📜 ESOPs (Employee Stock Options)",
        "🤝 P2P Lending",
        "🚀 Startup/Angel Investments",
        "➕ Other",
    ],
};

const LIABILITY_CATEGORIES = [
    "🏠 Home Loan",
    "💰 Personal Loan",
    "💼 Business Loan",
    "💳 Credit Card Debt",
    "🚗 Vehicle Loan",
    "🪙 Gold Loan",
    "🎓 Education Loan",
    "🏢 Loan Against Property",
    "➕ Other",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatNetWorth(amount: number, dangerColor = "#F87171", txtColor = "#F0F4F8"): { text: string; color: string } {
    const abs = Math.abs(amount);
    let formatted: string;
    let label = "";

    if (abs >= 10_000_000) {
        formatted = (abs / 10_000_000).toFixed(2);
        label = " Crores";
    } else if (abs >= 100_000) {
        formatted = (abs / 100_000).toFixed(2);
        label = " Lakhs";
    } else {
        formatted = abs.toLocaleString("en-IN");
    }

    const sign = amount < 0 ? "-" : "";
    const color = amount < 0 ? dangerColor : txtColor;
    return { text: `${sign}₹ ${formatted}${label}`.trim(), color };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Step3Page() {
    const palette = useAppTheme();

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "12px",
        background: palette.bg,
        border: `1px solid ${palette.brd2}`,
        borderRadius: 8,
        color: palette.txt,
        fontSize: 14,
        outline: "none",
        boxSizing: "border-box",
    };

    const selectStyle: React.CSSProperties = {
        width: "100%",
        padding: "12px",
        background: palette.bg,
        border: `1px solid ${palette.brd2}`,
        borderRadius: 8,
        color: palette.txt,
        fontSize: 14,
        outline: "none",
        boxSizing: "border-box",
    };

    const labelStyle: React.CSSProperties = {
        display: "block",
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: palette.mute,
        marginBottom: 8,
    };
    const router = useRouter();
    const {
        assets,
        addAsset: storeAddAsset,
        removeAsset,
        liabilities,
        addLiability: storeAddLiability,
        removeLiability,
    } = useAssessmentStore();

    // API queries
    const { data: balanceData, isLoading: isFetchingBalance } = useBalanceSheetQuery();
    const { data: portfolio } = usePortfolioAnalysisQuery();
    const { data: riskData, isError: isRiskError, isLoading: isRiskLoading } = useRiskScoringQuery();

    // Mutations
    const { mutateAsync: addAssetApi } = useAddAssetMutation();
    const { mutateAsync: addLiabilityApi } = useAddLiabilityMutation();
    const { mutateAsync: updateAssetApi } = useUpdateAssetMutation();
    const { mutateAsync: updateLiabilityApi } = useUpdateLiabilityMutation();
    const { mutateAsync: deleteAssetApi, isPending: isDeletingAsset } = useDeleteAssetMutation();
    const { mutateAsync: deleteLiabilityApi, isPending: isDeletingLiability } = useDeleteLiabilityMutation();

    // Hydrate store from API
    useEffect(() => {
        if (balanceData) {
            if (balanceData.assets) useAssessmentStore.setState({ assets: balanceData.assets });
            if (balanceData.liabilities) useAssessmentStore.setState({ liabilities: balanceData.liabilities });
        }
    }, [balanceData]);

    // Tab + modal state
    const [activeTab, setActiveTab] = useState<"assets" | "liabilities">("assets");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<(AssetItem | LiabilityItem) | null>(null);

    // Form state
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [purchaseValue, setPurchaseValue] = useState("");
    const [timeHorizon, setTimeHorizon] = useState("Short (0-2 years)");
    const [liquidity, setLiquidity] = useState("Immediate (instant access like savings account)");
    const [emi, setEmi] = useState("");
    const [interestRate, setInterestRate] = useState("");
    const [monthsLeft, setMonthsLeft] = useState("");
    const [moratoriumMonths, setMoratoriumMonths] = useState("");

    // Auto-update subCategory when category changes
    useEffect(() => {
        if (activeTab === "assets" && ASSET_CATEGORIES[category]) {
            setSubCategory(ASSET_CATEGORIES[category][0]);
        }
    }, [category, activeTab]);

    const clearValueFields = () => {
        setName("");
        setAmount("");
        setPurchaseValue("");
        setEmi("");
        setInterestRate("");
        setMonthsLeft("");
        setMoratoriumMonths("");
    };

    const openModal = () => {
        setEditingItem(null);
        if (activeTab === "assets") {
            setCategory("Savings & Investments");
            setSubCategory(ASSET_CATEGORIES["Savings & Investments"][0]);
        } else {
            setCategory(LIABILITY_CATEGORIES[0]);
            setSubCategory("");
        }
        setName("");
        setAmount("");
        setPurchaseValue("");
        setTimeHorizon("Short (0-2 years)");
        setLiquidity("Immediate (instant access like savings account)");
        setEmi("");
        setInterestRate("");
        setMonthsLeft("");
        setMoratoriumMonths("");
        setIsModalOpen(true);
    };

    const openEditModal = (item: AssetItem | LiabilityItem) => {
        setEditingItem(item);
        if (activeTab === "assets") {
            const a = item as AssetItem;
            const matchedCat = Object.entries(ASSET_CATEGORIES).find(([, subs]) =>
                subs.includes(a.subCategory || a.category)
            );
            setCategory(matchedCat ? matchedCat[0] : "Savings & Investments");
            setSubCategory(a.subCategory || a.category || "");
            setPurchaseValue(String(a.purchaseValue ?? ""));
            setTimeHorizon(a.timeHorizon || "Short (0-2 years)");
            setLiquidity(a.liquidity || "Immediate (instant access like savings account)");
        } else {
            const l = item as LiabilityItem;
            setCategory(l.category || LIABILITY_CATEGORIES[0]);
            setEmi(String(l.emi ?? ""));
            setInterestRate(String(l.interestRate ?? ""));
            setMonthsLeft(String(l.monthsLeft ?? ""));
            setMoratoriumMonths(String(l.moratoriumMonths ?? ""));
        }
        setName(item.name || "");
        setAmount(String(item.amount ?? ""));
        setIsModalOpen(true);
    };

    const handleSave = async (keepOpen = false) => {
        if (editingItem) {
            // Edit mode
            setIsModalOpen(false);
            try {
                if (activeTab === "assets") {
                    const updated: AssetItem = {
                        id: editingItem.id,
                        category,
                        subCategory,
                        name: name || subCategory,
                        amount: parseFloat(amount) || 0,
                        purchaseValue: parseFloat(purchaseValue) || 0,
                        timeHorizon,
                        liquidity,
                    };
                    await updateAssetApi(updated);
                } else {
                    const updated: LiabilityItem = {
                        id: editingItem.id,
                        category,
                        name: name || category,
                        amount: parseFloat(amount) || 0,
                        emi: parseFloat(emi) || 0,
                        interestRate: parseFloat(interestRate) || 0,
                        monthsLeft: parseInt(monthsLeft, 10) || undefined,
                        moratoriumMonths: category === "🎓 Education Loan"
                            ? (parseInt(moratoriumMonths, 10) || undefined)
                            : undefined,
                    };
                    await updateLiabilityApi(updated);
                }
                toast.success(`${activeTab === "assets" ? "Asset" : "Liability"} updated successfully`);
            } catch {
                toast.error(`Could not update ${activeTab === "assets" ? "asset" : "liability"} — check your connection`);
            }
            setEditingItem(null);
            return;
        }

        // Add mode
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

        if (activeTab === "assets") {
            const newItem: AssetItem = {
                id: tempId,
                category,
                subCategory,
                name: name || subCategory,
                amount: parseFloat(amount) || 0,
                purchaseValue: parseFloat(purchaseValue) || 0,
                timeHorizon,
                liquidity,
            };
            storeAddAsset(newItem);
            if (!keepOpen) setIsModalOpen(false);
            try {
                await addAssetApi(newItem);
                toast.success("Asset saved successfully");
            } catch {
                removeAsset(tempId);
                toast.error("Could not save asset — check your connection and try again");
            }
        } else {
            const newItem: LiabilityItem = {
                id: tempId,
                category,
                name: name || category,
                amount: parseFloat(amount) || 0,
                emi: parseFloat(emi) || 0,
                interestRate: parseFloat(interestRate) || 0,
                monthsLeft: parseInt(monthsLeft, 10) || undefined,
                moratoriumMonths: category === "🎓 Education Loan"
                    ? (parseInt(moratoriumMonths, 10) || undefined)
                    : undefined,
            };
            storeAddLiability(newItem);
            if (!keepOpen) setIsModalOpen(false);
            try {
                await addLiabilityApi(newItem);
                toast.success("Liability saved successfully");
            } catch {
                removeLiability(tempId);
                toast.error("Could not save liability — check your connection and try again");
            }
        }

        if (keepOpen) clearValueFields();
    };

    // Portfolio data from backend
    const totalAssets = portfolio?.totalAssets ?? 0;
    const totalLiabilities = portfolio?.totalLiabilities ?? 0;
    const netWorth = portfolio?.netWorth ?? 0;
    const monthlyEmiTotal = portfolio?.monthlyEmiTotal ?? 0;
    const avgInterestRate = portfolio?.avgInterestRate ?? 0;
    const dtiRatio = portfolio?.dtiRatio ?? 0;
    const totalMonthlyIncome = portfolio?.monthlyIncome ?? 0;
    const cashFlowEMI = portfolio?.cashFlowEMI ?? 0;
    const emiMismatch = portfolio?.emiMismatch ?? false;

    const equityPct = portfolio?.equityPct ?? 0;
    const debtPct = portfolio?.debtPct ?? 0;
    const realEstatePct = portfolio?.realEstatePct ?? 0;
    const goldPct = portfolio?.goldPct ?? 0;
    const otherPct = portfolio?.otherPct ?? 0;
    const equityTotal = portfolio?.equityTotal ?? 0;
    const debtTotal = portfolio?.debtTotal ?? 0;
    const realEstateTotal = portfolio?.realEstateTotal ?? 0;
    const goldTotal = portfolio?.goldTotal ?? 0;
    const otherTotal = portfolio?.otherTotal ?? 0;

    const targetEquity = riskData?.targetEquity ?? 50;
    const targetDebt = riskData?.targetDebt ?? 30;
    const targetGold = riskData?.targetGold ?? 5;
    const targetRealEstate = riskData?.targetRealEstate ?? 15;
    const profileLabel = riskData?.profileLabel ?? "Moderate";
    const hasRiskData = !!riskData && !isRiskError && riskData.profileLabel != null;

    const conicGradient =
        totalAssets > 0
            ? `conic-gradient(
                #3b82f6 0% ${equityPct}%,
                #10b981 ${equityPct}% ${equityPct + debtPct}%,
                #8b5cf6 ${equityPct + debtPct}% ${equityPct + debtPct + realEstatePct}%,
                #f59e0b ${equityPct + debtPct + realEstatePct}% ${equityPct + debtPct + realEstatePct + goldPct}%,
                #64748b ${equityPct + debtPct + realEstatePct + goldPct}% 100%
              )`
            : `conic-gradient(${palette.txt2} 0% 100%)`;

    function getMismatchAlert() {
        if (totalAssets === 0) return null;
        if (realEstatePct > targetRealEstate + 20) {
            return {
                title: `⚠️ Your Real Estate exposure is ${(realEstatePct - targetRealEstate).toFixed(0)}% above target.`,
                msg: `This concentrates risk. Consider gradually shifting ₹${((realEstatePct - targetRealEstate) / 100 * totalAssets / 100000).toFixed(1)} lakhs to equity over 2-3 years.`,
            };
        }
        if (equityPct < targetEquity - 20) {
            return {
                title: `⚠️ Your Equity exposure is ${(targetEquity - equityPct).toFixed(0)}% below target.`,
                msg: "Consider gradually increasing your investments in mutual funds and stocks.",
            };
        }
        return null;
    }
    const allocationAlert = getMismatchAlert();

    const netWorthFormat = formatNetWorth(netWorth, palette.danger, palette.txt);

    if (isFetchingBalance) {
        return (
            <div style={{ padding: "24px 24px 180px", maxWidth: 900, margin: "0 auto" }}>
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        style={{
                            backgroundImage: `linear-gradient(90deg, ${palette.s1} 25%, ${palette.s3} 50%, ${palette.s1} 75%)`,
                            backgroundSize: "200% 100%",
                            animation: "shimmer 1.5s infinite",
                            borderRadius: 16,
                            height: i === 1 ? 160 : 80,
                            marginBottom: 16,
                        }}
                    />
                ))}
                <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ padding: "24px 24px 180px", maxWidth: 900, margin: "0 auto" }}>

            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: palette.txt, margin: "0 0 8px" }}>
                    Your Current Wealth Position
                </h1>
                <p style={{ fontSize: 14, color: palette.mute, margin: 0 }}>
                    Let&apos;s map what you own and what you owe.
                </p>
            </div>

            {/* ── Premium Net Worth Card ─────────────────────────────────────── */}
            <div style={{
                position: "relative", overflow: "hidden",
                borderRadius: 28, padding: 1, marginBottom: 32,
                background: `linear-gradient(135deg, ${palette.brd2}, ${palette.brd})`,
                boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
            }}>
                <div style={{
                    position: "relative", zIndex: 1,
                    background: `${palette.s1}99`,
                    backdropFilter: "blur(32px)",
                    borderRadius: 27,
                    border: `1px solid ${palette.brd2}`,
                    padding: 32,
                    overflow: "hidden",
                }}>
                    {/* Top line */}
                    <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: 1,
                        background: `linear-gradient(90deg, transparent, ${palette.brd2}, transparent)`,
                    }} />

                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                                <div style={{
                                    width: 8, height: 8, borderRadius: "50%", background: palette.accent,
                                    boxShadow: "0 0 10px #10B981",
                                }} />
                                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: palette.mute, textTransform: "uppercase", margin: 0 }}>
                                    Total Net Worth
                                </p>
                            </div>
                            <h2 style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-0.02em", color: netWorthFormat.color, margin: 0, lineHeight: 1 }}>
                                {netWorthFormat.text}
                            </h2>
                        </div>

                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                            {/* Assets pill */}
                            <div style={{
                                display: "flex", alignItems: "center", gap: 12,
                                background: palette.brd, border: `1px solid ${palette.brd}`,
                                borderRadius: 16, padding: "16px 20px",
                            }}>
                                <div style={{ padding: 10, background: "rgba(16,185,129,0.2)", borderRadius: 12 }}>
                                    <TrendingUp style={{ width: 18, height: 18, color: palette.accent }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: palette.mute, margin: "0 0 2px" }}>Assets</p>
                                    <p style={{ fontSize: 15, fontWeight: 700, color: palette.txt, margin: 0 }}>
                                        {formatNetWorth(totalAssets).text}
                                    </p>
                                </div>
                            </div>

                            {/* Liabilities pill */}
                            <div style={{
                                display: "flex", alignItems: "center", gap: 12,
                                background: palette.brd, border: `1px solid ${palette.brd}`,
                                borderRadius: 16, padding: "16px 20px",
                            }}>
                                <div style={{ padding: 10, background: "rgba(239,68,68,0.2)", borderRadius: 12 }}>
                                    <TrendingUp style={{ width: 18, height: 18, color: palette.danger, transform: "rotate(180deg)" }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: palette.mute, margin: "0 0 2px" }}>Liabilities</p>
                                    <p style={{ fontSize: 15, fontWeight: 700, color: palette.txt, margin: 0 }}>
                                        {formatNetWorth(totalLiabilities).text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Asset Allocation Chart ─────────────────────────────────────── */}
            {totalAssets > 0 && activeTab === "assets" && (
                <div style={{
                    background: palette.s1, border: `1px solid ${palette.brd}`,
                    borderRadius: 16, padding: 24, marginBottom: 24,
                }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: palette.txt, margin: "0 0 16px" }}>
                        Your Portfolio Mix
                    </h3>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 32, marginBottom: 24 }}>
                        {/* Donut */}
                        <div style={{ position: "relative", width: 128, height: 128, borderRadius: "50%", background: conicGradient, flexShrink: 0 }}>
                            <div style={{ position: "absolute", inset: 8, background: palette.s1, borderRadius: "50%" }} />
                        </div>
                        {/* Legend */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, minWidth: 200 }}>
                            {[
                                { label: "Equity", color: "#3b82f6", pct: equityPct, total: equityTotal },
                                { label: "Debt", color: "#10b981", pct: debtPct, total: debtTotal },
                                { label: "Real Estate", color: "#8b5cf6", pct: realEstatePct, total: realEstateTotal },
                                { label: "Gold", color: "#f59e0b", pct: goldPct, total: goldTotal },
                                ...(otherTotal > 0 ? [{ label: "Other", color: "#64748b", pct: otherPct, total: otherTotal }] : []),
                            ].map((row) => (
                                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: row.color, flexShrink: 0 }} />
                                        <span style={{ color: palette.txt2 }}>{row.label}</span>
                                    </div>
                                    <span style={{ fontWeight: 600, color: palette.txt }}>
                                        {row.pct.toFixed(1)}%
                                        <span style={{ color: palette.mute, fontWeight: 400, marginLeft: 6 }}>
                                            (₹{row.total.toLocaleString("en-IN")})
                                        </span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {hasRiskData ? (
                        <>
                            <h4 style={{ fontSize: 14, fontWeight: 700, color: palette.txt, margin: "0 0 12px" }}>
                                Your Current vs Target ({profileLabel}):
                            </h4>
                            <div style={{
                                background: palette.bg, borderRadius: 12, padding: 16,
                                border: `1px solid ${palette.brd}`, marginBottom: 16,
                            }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", fontSize: 11, fontWeight: 600, color: palette.mute, marginBottom: 8 }}>
                                    <span>Asset</span>
                                    <span style={{ textAlign: "center" }}>You</span>
                                    <span style={{ textAlign: "center" }}>Target</span>
                                    <span style={{ textAlign: "right" }}>Status</span>
                                </div>
                                {[
                                    { label: "Equity", current: equityPct, target: targetEquity },
                                    { label: "Debt", current: debtPct, target: targetDebt },
                                    { label: "Real Estate", current: realEstatePct, target: targetRealEstate },
                                    { label: "Gold", current: goldPct, target: targetGold },
                                ].map((row) => {
                                    const diff = Math.round(row.current) - row.target;
                                    const threshold = row.target * 0.4;
                                    let statusText: string;
                                    let statusColor: string;
                                    if (diff > threshold) {
                                        statusText = `⚠️ ${Math.abs(diff)}% above`;
                                        statusColor = "#F59E0B";
                                    } else if (diff < -threshold) {
                                        statusText = `⚠️ ${Math.abs(diff)}% below`;
                                        statusColor = "#F59E0B";
                                    } else {
                                        statusText = "✓ On track";
                                        statusColor = palette.accent;
                                    }
                                    return (
                                        <div key={row.label} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", fontSize: 14, alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${palette.brd}` }}>
                                            <span style={{ color: palette.txt2 }}>{row.label}</span>
                                            <span style={{ textAlign: "center", fontWeight: 700, color: palette.txt }}>{row.current.toFixed(0)}%</span>
                                            <span style={{ textAlign: "center", color: palette.mute }}>{row.target}%</span>
                                            <span style={{ textAlign: "right", fontSize: 12, color: statusColor }}>{statusText}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {allocationAlert && (
                                <div style={{
                                    background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
                                    borderRadius: 12, padding: 16,
                                }}>
                                    <h5 style={{ color: "#F59E0B", fontWeight: 700, fontSize: 14, margin: "0 0 6px" }}>
                                        {allocationAlert.title}
                                    </h5>
                                    <p style={{ color: "rgba(245,158,11,0.8)", fontSize: 12, margin: 0 }}>
                                        {allocationAlert.msg}
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{
                            background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                            borderRadius: 12, padding: 16, display: "flex", alignItems: "flex-start", gap: 12,
                        }}>
                            <Info style={{ width: 18, height: 18, color: "#3B82F6", flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <h5 style={{ color: "#3B82F6", fontWeight: 700, fontSize: 14, margin: "0 0 4px" }}>
                                    {isRiskLoading ? "Loading your risk profile…" : "Target allocation unavailable"}
                                </h5>
                                <p style={{ color: palette.mute, fontSize: 12, margin: 0 }}>
                                    {isRiskLoading
                                        ? "We're calculating your personalized target based on your profile."
                                        : "Complete your profile and risk questionnaire (Step 1) so we can suggest a personalized target allocation."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Liabilities Summary Card ───────────────────────────────────── */}
            {totalLiabilities > 0 && activeTab === "liabilities" && (
                <div style={{
                    background: palette.s1, border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: 16, padding: 24, marginBottom: 24, position: "relative", overflow: "hidden",
                    boxShadow: "0 0 15px rgba(239,68,68,0.05)",
                }}>
                    <div style={{
                        position: "absolute", bottom: -40, left: -40, width: 128, height: 128,
                        borderRadius: "50%", background: "rgba(239,68,68,0.1)", filter: "blur(48px)",
                    }} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                        <h3 style={{
                            textAlign: "center", fontFamily: "monospace", fontWeight: 700, fontSize: 13,
                            letterSpacing: "0.2em", color: palette.txt2, textTransform: "uppercase",
                            margin: "0 0 20px", paddingBottom: 16, borderBottom: "1px solid rgba(239,68,68,0.2)",
                        }}>
                            <span style={{ color: palette.mute, marginRight: 8 }}>══</span>
                            LIABILITIES SUMMARY
                            <span style={{ color: palette.mute, marginLeft: 8 }}>══</span>
                        </h3>

                        <div style={{ display: "flex", flexDirection: "column", gap: 12, fontFamily: "monospace", fontSize: 14 }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: palette.txt2 }}>Total Outstanding</span>
                                <span style={{ fontWeight: 700, color: palette.danger }}>₹ {totalLiabilities.toLocaleString("en-IN")}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: palette.txt2 }}>Monthly EMI Total</span>
                                <span style={{ fontWeight: 700, color: palette.txt }}>₹ {monthlyEmiTotal.toLocaleString("en-IN")}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: palette.txt2 }}>Avg Interest Rate</span>
                                <span style={{ fontWeight: 700, color: palette.txt }}>{avgInterestRate.toFixed(1)}%</span>
                            </div>
                        </div>

                        {/* EMI Mismatch Warning */}
                        {emiMismatch && (
                            <div style={{
                                marginTop: 20, background: "rgba(239,68,68,0.1)",
                                border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12,
                                padding: 16, display: "flex", alignItems: "flex-start", gap: 12,
                            }}>
                                <AlertTriangle style={{ width: 18, height: 18, color: palette.danger, flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <h5 style={{ color: palette.danger, fontWeight: 700, fontSize: 14, margin: "0 0 6px" }}>
                                        ⚠️ EMI Mismatch Detected
                                    </h5>
                                    <p style={{ fontSize: 12, color: palette.txt2, lineHeight: 1.6, margin: "0 0 8px" }}>
                                        Your <span style={{ fontWeight: 700, color: palette.txt }}>Cash Flow</span> shows EMI expenses of{" "}
                                        <span style={{ fontWeight: 700, color: "#F59E0B" }}>₹{cashFlowEMI.toLocaleString()}/mo</span>,
                                        but your <span style={{ fontWeight: 700, color: palette.txt }}>Liabilities</span> add up to{" "}
                                        <span style={{ fontWeight: 700, color: "#F59E0B" }}>₹{monthlyEmiTotal.toLocaleString()}/mo</span>.
                                    </p>
                                    <p style={{ fontSize: 12, color: palette.mute, margin: 0 }}>
                                        Please update the EMI amount in{" "}
                                        <button
                                            onClick={() => router.push("/assessment/cash-flow")}
                                            style={{ background: "none", border: "none", color: palette.accent, fontWeight: 600, cursor: "pointer", textDecoration: "underline", fontSize: 12 }}
                                        >
                                            Cash Flow (Step 2)
                                        </button>{" "}
                                        or correct the EMI values in your liabilities above so both match.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* DTI Gauge */}
                        {totalMonthlyIncome > 0 && (
                            <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${palette.brd2}` }}>
                                <h4 style={{ textAlign: "center", fontSize: 14, fontWeight: 600, color: palette.txt2, margin: "0 0 24px" }}>
                                    Debt-to-Income Ratio
                                </h4>

                                <div style={{ position: "relative", height: 8, borderRadius: 99, margin: "0 16px 32px", background: "linear-gradient(90deg, #10b981, #f59e0b, #ef4444)" }}>
                                    {/* Marker */}
                                    <div style={{
                                        position: "absolute", top: "50%", transform: "translate(-50%, -50%)",
                                        left: `${Math.min(Math.max(dtiRatio * 2, 0), 100)}%`,
                                        width: 16, height: 16, borderRadius: "50%", background: "#fff",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                                        border: `2px solid ${palette.s1}`,
                                        transition: "left 1s ease-out",
                                    }} />
                                    {/* Label */}
                                    <div style={{
                                        position: "absolute", bottom: "calc(100% + 8px)",
                                        left: `${Math.min(Math.max(dtiRatio * 2, 0), 100)}%`,
                                        transform: "translateX(-50%)",
                                        background: palette.s3, padding: "2px 8px", borderRadius: 6,
                                        fontSize: 12, fontWeight: 700, color: palette.txt,
                                        transition: "left 1s ease-out",
                                    }}>
                                        {dtiRatio.toFixed(1)}%
                                    </div>
                                    <span style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, fontSize: 11, color: palette.mute }}>0%</span>
                                    <span style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, fontSize: 11, color: palette.mute }}>50%+</span>
                                </div>

                                <div style={{
                                    background: palette.bg, borderRadius: 12, padding: 16,
                                    border: `1px solid ${palette.brd}`,
                                }}>
                                    {dtiRatio < 30 ? (
                                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                            <CheckCircle2 style={{ width: 18, height: 18, color: palette.accent, flexShrink: 0, marginTop: 2 }} />
                                            <div>
                                                <h5 style={{ color: palette.accent, fontWeight: 700, fontSize: 14, margin: "0 0 4px" }}>
                                                    Healthy (Below 30% threshold)
                                                </h5>
                                                <p style={{ color: palette.mute, fontSize: 12, margin: 0 }}>
                                                    Your debt burden is manageable and leaves room for savings and investments.
                                                </p>
                                            </div>
                                        </div>
                                    ) : dtiRatio <= 40 ? (
                                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                            <AlertTriangle style={{ width: 18, height: 18, color: "#F59E0B", flexShrink: 0, marginTop: 2 }} />
                                            <div>
                                                <h5 style={{ color: "#F59E0B", fontWeight: 700, fontSize: 14, margin: "0 0 4px" }}>
                                                    Monitor: Your EMIs are {dtiRatio.toFixed(0)}% of income.
                                                </h5>
                                                <p style={{ color: palette.mute, fontSize: 12, margin: 0 }}>
                                                    Avoid taking more loans until this improves or your income increases.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                            <span style={{ fontSize: 18, flexShrink: 0 }}>🚨</span>
                                            <div>
                                                <h5 style={{ color: palette.danger, fontWeight: 700, fontSize: 14, margin: "0 0 4px" }}>
                                                    Risky: Your EMIs are {dtiRatio.toFixed(0)}% of income.
                                                </h5>
                                                <p style={{ color: palette.txt2, fontSize: 12, fontWeight: 600, margin: "0 0 4px" }}>
                                                    Consider:
                                                </p>
                                                <ul style={{ color: palette.mute, fontSize: 12, margin: 0, paddingLeft: 16 }}>
                                                    <li>Debt consolidation at lower rates</li>
                                                    <li>Extending loan tenure to reduce EMI</li>
                                                    <li>Increasing income or reducing expenses</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Tabs ──────────────────────────────────────────────────────── */}
            <div style={{
                display: "flex", background: palette.s3, borderRadius: 12, padding: 4, marginBottom: 24,
            }}>
                {(["assets", "liabilities"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            flex: 1, padding: "10px", borderRadius: 8, fontSize: 14, fontWeight: 700,
                            border: "none", cursor: "pointer", transition: "all 0.15s",
                            background: activeTab === tab ? palette.bg : "transparent",
                            color: activeTab === tab ? palette.accent : palette.mute,
                            boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.3)" : "none",
                        }}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* ── List ──────────────────────────────────────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {(activeTab === "assets" ? assets : liabilities).map((item) => (
                    <div
                        key={item.id}
                        style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            background: palette.s1, border: `1px solid ${palette.brd}`,
                            borderRadius: 12, padding: 16,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{
                                padding: 8, borderRadius: 8,
                                background: activeTab === "assets" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                            }}>
                                {activeTab === "assets" ? (
                                    <TrendingUp style={{ width: 18, height: 18, color: palette.accent }} />
                                ) : (
                                    <CreditCard style={{ width: 18, height: 18, color: palette.danger }} />
                                )}
                            </div>
                            <div>
                                <p style={{ fontSize: 14, fontWeight: 700, color: palette.txt, margin: 0 }}>
                                    {item.name}
                                </p>
                                <p style={{ fontSize: 12, color: palette.mute, margin: "2px 0 0" }}>
                                    {item.category}
                                    {(item as AssetItem).subCategory && ` • ${(item as AssetItem).subCategory}`}
                                </p>
                                {activeTab === "liabilities" && (
                                    <p style={{ fontSize: 11, color: "rgba(239,68,68,0.8)", margin: "2px 0 0" }}>
                                        ₹{(item as LiabilityItem).emi?.toLocaleString()}/mo @ {(item as LiabilityItem).interestRate}%
                                        {(item as LiabilityItem).monthsLeft ? ` • ${(item as LiabilityItem).monthsLeft} mo left` : ""}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontWeight: 700, color: palette.txt, fontSize: 14 }}>
                                ₹ {item.amount.toLocaleString("en-IN")}
                            </span>
                            <button
                                onClick={() => openEditModal(item)}
                                style={{ background: "none", border: "none", color: palette.mute, cursor: "pointer", padding: 4 }}
                                title="Edit"
                            >
                                <Pencil style={{ width: 14, height: 14 }} />
                            </button>
                            <button
                                onClick={async () => {
                                    if (activeTab === "assets") {
                                        removeAsset(item.id);
                                        try { await deleteAssetApi(item.id); } catch { /* already removed locally */ }
                                    } else {
                                        removeLiability(item.id);
                                        try { await deleteLiabilityApi(item.id); } catch { /* already removed locally */ }
                                    }
                                    toast.success(`${activeTab === "assets" ? "Asset" : "Liability"} deleted`);
                                }}
                                disabled={isDeletingAsset || isDeletingLiability}
                                style={{ background: "none", border: "none", color: palette.mute, cursor: "pointer", padding: 4, opacity: (isDeletingAsset || isDeletingLiability) ? 0.5 : 1 }}
                            >
                                <X style={{ width: 14, height: 14 }} />
                            </button>
                        </div>
                    </div>
                ))}

                <button
                    onClick={openModal}
                    style={{
                        width: "100%", padding: "16px",
                        border: `1px dashed ${palette.brd2}`, borderRadius: 12,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        background: "transparent", color: palette.mute, fontSize: 14, fontWeight: 500,
                        cursor: "pointer", transition: "border-color 0.15s, color 0.15s",
                        boxSizing: "border-box",
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(16,185,129,0.3)";
                        (e.currentTarget as HTMLButtonElement).style.color = palette.accent;
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = palette.brd2;
                        (e.currentTarget as HTMLButtonElement).style.color = palette.mute;
                    }}
                >
                    <Plus style={{ width: 18, height: 18 }} />
                    Add {activeTab === "assets" ? "Asset" : "Liability"}
                </button>
            </div>

            {/* Bottom Navigation */}
            <StepNavigation
                step={3}
                backPath="/assessment/cash-flow"
                onNext={() => {
                    const storeHasData = assets.length > 0 || liabilities.length > 0;
                    if (totalAssets === 0 && totalLiabilities === 0 && !storeHasData) {
                        toast.error("Add your assets or liabilities — savings, FDs, loans, etc.", { id: "step3-guide" });
                        return;
                    }
                    router.push("/assessment/goals");
                }}
                isValid={true}
            />

            {/* ── Modal ──────────────────────────────────────────────────────── */}
            {isModalOpen && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 50,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: 16,
                }}>
                    {/* Backdrop */}
                    <div
                        onClick={() => setIsModalOpen(false)}
                        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
                    />

                    {/* Modal */}
                    <div style={{
                        position: "relative", background: palette.s1, width: "100%", maxWidth: 480,
                        borderRadius: 24, padding: 24,
                        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
                        border: `1px solid ${palette.brd2}`,
                        maxHeight: "85vh", overflowY: "auto",
                    }}>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <h3 style={{ fontSize: 20, fontWeight: 700, color: palette.txt, margin: 0 }}>
                                {editingItem ? "Edit" : "Add"} {activeTab === "assets" ? "Asset" : "Liability"}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                style={{ background: "none", border: "none", color: palette.mute, cursor: "pointer" }}
                            >
                                <X style={{ width: 22, height: 22 }} />
                            </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {activeTab === "assets" ? (
                                <>
                                    <div>
                                        <label style={labelStyle}>Category</label>
                                        <select value={category} onChange={(e) => setCategory(e.target.value)} style={selectStyle}>
                                            {Object.keys(ASSET_CATEGORIES).map((cat) => (
                                                <option key={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Sub Category</label>
                                        <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} style={selectStyle}>
                                            {(ASSET_CATEGORIES[category] || []).map((sub) => (
                                                <option key={sub}>{sub}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Name / Label (optional)</label>
                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="e.g. HDFC Balanced Advantage" />
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                        <div>
                                            <label style={labelStyle}>Purchase Value (₹)</label>
                                            <input
                                                type="text" inputMode="numeric" value={purchaseValue}
                                                onChange={(e) => setPurchaseValue(e.target.value.replace(/\D/g, ""))}
                                                style={inputStyle} placeholder="0"
                                            />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Current Value (₹)</label>
                                            <input
                                                type="text" inputMode="numeric" value={amount}
                                                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                                                style={inputStyle} placeholder="0"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Time Horizon</label>
                                        <select value={timeHorizon} onChange={(e) => setTimeHorizon(e.target.value)} style={selectStyle}>
                                            <option>Short (0-2 years)</option>
                                            <option>Medium (2-7 years)</option>
                                            <option>Long (7+ years)</option>
                                            <option>Retirement</option>
                                            <option>Never</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Liquidity</label>
                                        <select value={liquidity} onChange={(e) => setLiquidity(e.target.value)} style={selectStyle}>
                                            <option>Immediate (instant access like savings account)</option>
                                            <option>High (1-2 days like stocks, mutual funds)</option>
                                            <option>Medium (few days to weeks like FD)</option>
                                            <option>Low (months like real estate, gold)</option>
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label style={labelStyle}>Category</label>
                                        <select value={category} onChange={(e) => setCategory(e.target.value)} style={selectStyle}>
                                            {LIABILITY_CATEGORIES.map((cat) => (
                                                <option key={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Description / Name</label>
                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="e.g. HDFC Home Loan" />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>How much is still pending? (₹)</label>
                                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ ...inputStyle, fontSize: 18, fontWeight: 700 }} placeholder="e.g. 2000000" />
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                        <div>
                                            <label style={labelStyle}>Monthly EMI (₹)</label>
                                            <input type="number" value={emi} onChange={(e) => setEmi(e.target.value)} style={inputStyle} placeholder="e.g. 25363" />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Interest Rate (%)</label>
                                            <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} style={inputStyle} placeholder="e.g. 9" step="0.1" />
                                        </div>
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                        <div>
                                            <label style={labelStyle}>Months Left</label>
                                            <input type="number" value={monthsLeft} onChange={(e) => setMonthsLeft(e.target.value)} style={inputStyle} placeholder="e.g. 120" />
                                        </div>
                                        {category === "🎓 Education Loan" && (
                                            <div>
                                                <label style={labelStyle}>Moratorium Months?</label>
                                                <input type="number" value={moratoriumMonths} onChange={(e) => setMoratoriumMonths(e.target.value)} style={inputStyle} placeholder="e.g. 6" />
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Save buttons */}
                            <div style={{ display: editingItem ? "block" : "flex", gap: 12, marginTop: 8 }}>
                                <button
                                    onClick={() => handleSave(false)}
                                    style={{
                                        flex: 1, width: editingItem ? "100%" : undefined,
                                        padding: "16px", background: palette.accent, border: "none", borderRadius: 12,
                                        color: palette.bg, fontWeight: 700, fontSize: 15, cursor: "pointer",
                                        boxShadow: "0 0 15px rgba(16,185,129,0.3)",
                                    }}
                                >
                                    {editingItem ? "Update" : "Save"} {activeTab === "assets" ? "Asset" : "Liability"}
                                </button>
                                {!editingItem && (
                                    <button
                                        onClick={() => handleSave(true)}
                                        style={{
                                            flex: 1, padding: "16px",
                                            background: palette.s3, border: `1px solid ${palette.brd2}`,
                                            borderRadius: 12, color: palette.txt, fontWeight: 700, fontSize: 15, cursor: "pointer",
                                        }}
                                    >
                                        Save & Add Another
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
