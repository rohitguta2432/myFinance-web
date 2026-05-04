"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Lock, ChevronDown, ChevronUp, Calendar, Award,
    Shield, Crown, AlertCircle, Wallet, Repeat, Sparkles,
} from "lucide-react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useMFRecommendations, type MFFund, type MFBucket, type MFRecommendationResponse } from "@/hooks/dashboard/useMFRecommendations";
import { useDashboardSummary } from "@/hooks/dashboard/useDashboardSummary";

// Admins always see Premium content + use demo data smoothly during early rollout.
const ADMIN_EMAILS = ["rohitgupta2432@gmail.com", "myfinancial.cfp@gmail.com"];

// Bucket colors keyed by bucketId so the legend stays stable across renders.
const BUCKET_COLORS: Record<string, string> = {
    flexi: "#10B981",
    mid: "#06B6D4",
    elss: "#8B5CF6",
    hybrid: "#F59E0B",
    debt: "#94A3B8",
};
const FALLBACK_COLOR = "#64748B";

const FREE_LUMPSUM_DEFAULT = 250000;

// Demo dataset shown when the backend isn't deployed yet OR returns no data.
// Real fund names sourced from the daily MF ranker output.
const DEMO_DATA: MFRecommendationResponse = {
    riskProfile: "AGGRESSIVE",
    riskProfileLabel: "Aggressive",
    lumpsum: FREE_LUMPSUM_DEFAULT,
    monthlyAmount: 15000,
    lastRefreshedAt: "2026-04-30T18:30:00",
    qualityFundCount: 84,
    buckets: [
        {
            bucketId: "flexi", bucketLabel: "Equity Diversified", categoryLabel: "Flexi Cap",
            blurb: "Diversified equity across market caps. Best for long-term wealth.",
            targetPct: 25, lumpsumAmount: 62500, monthlyAmount: 3750,
            funds: [
                fund(148404, "BANK OF INDIA Flexi Cap Fund Direct Plan", "Flexi Cap", 1, 86.0, 23.37, 20.02, 1.11, -23.73, 99.5),
                fund(120843, "quant Flexi Cap Fund Direct Plan", "Flexi Cap", 2, 80.8, 19.03, 19.91, 0.89, -41.28, 96.4),
                fund(120492, "JM Flexicap Fund Direct Plan", "Flexi Cap", 3, 80.5, 19.81, 18.51, 0.99, -34.95, 97.8),
                fund(140353, "Edelweiss Flexi Cap Fund Direct Plan", "Flexi Cap", 4, 78.6, 18.81, 16.94, 0.98, -36.10, 96.1),
                fund(118955, "HDFC Flexi Cap Fund Direct Plan", "Flexi Cap", 5, 78.3, 19.40, 20.34, 1.22, -41.84, 95.4),
            ],
        },
        {
            bucketId: "mid", bucketLabel: "Equity Growth", categoryLabel: "Mid Cap",
            blurb: "Higher growth potential with higher volatility. 7+ year horizon.",
            targetPct: 20, lumpsumAmount: 50000, monthlyAmount: 3000,
            funds: [
                fund(147704, "Motilal Oswal Large and Midcap Fund Direct Plan", "Mid Cap", 1, 87.8, 26.83, 22.55, 1.25, -37.44, 99.0),
                fund(120381, "ICICI Prudential MidCap Fund Direct Plan", "Mid Cap", 2, 87.5, 26.93, 21.63, 1.34, -44.04, 98.2),
                fund(120403, "Invesco India Midcap Fund Direct Plan", "Mid Cap", 3, 87.5, 26.96, 22.50, 1.39, -34.09, 98.5),
                fund(118665, "Nippon India Growth Mid Cap Fund Direct Plan", "Mid Cap", 4, 87.4, 26.20, 23.07, 1.35, -35.32, 98.7),
                fund(125354, "Kotak Emerging Equity Fund Direct Plan", "Mid Cap", 5, 86.2, 25.10, 21.80, 1.28, -36.50, 97.9),
            ],
        },
        {
            bucketId: "elss", bucketLabel: "Tax Saver", categoryLabel: "ELSS",
            blurb: "Save up to ₹46,800 in tax under 80C. 3-year lock-in.",
            targetPct: 15, lumpsumAmount: 37500, monthlyAmount: 2250,
            funds: [
                fund(133386, "Motilal Oswal ELSS Tax Saver Fund Direct Plan", "ELSS", 1, 86.0, 26.08, 20.81, 1.21, -37.72, 98.4),
                fund(120847, "quant ELSS Tax Saver Fund Direct Plan", "ELSS", 2, 80.2, 18.39, 18.61, 0.85, -36.12, 95.8),
                fund(119723, "SBI ELSS Tax Saver Fund Direct Plan", "ELSS", 3, 79.8, 21.28, 19.18, 1.25, -38.20, 96.7),
                fund(147541, "ITI ELSS Tax Saver Fund Direct Plan", "ELSS", 4, 79.7, 20.95, 15.28, 0.99, -38.49, 96.0),
                fund(120494, "JM ELSS Tax Saver Fund Direct Plan", "ELSS", 5, 78.3, 19.04, 16.58, 0.92, -37.39, 95.6),
            ],
        },
        {
            bucketId: "hybrid", bucketLabel: "Hybrid", categoryLabel: "Aggressive Hybrid",
            blurb: "Equity + debt mix. Smoother ride than pure equity.",
            targetPct: 25, lumpsumAmount: 62500, monthlyAmount: 3750,
            funds: [
                fund(120700, "ICICI Prudential Aggressive Hybrid Active FOF Direct Plan", "Aggressive Hybrid", 1, 74.3, 17.71, 17.19, 1.27, -35.74, 96.5),
                fund(147446, "Mahindra Manulife Aggressive Hybrid Fund Direct Plan", "Aggressive Hybrid", 2, 73.3, 16.47, 15.38, 1.06, -25.41, 100.0),
                fund(118624, "Edelweiss Aggressive Hybrid Fund Direct Plan", "Aggressive Hybrid", 3, 72.0, 16.90, 16.44, 1.10, -28.60, 99.8),
                fund(120484, "JM Aggressive Hybrid Fund Direct Plan", "Aggressive Hybrid", 4, 70.6, 17.94, 15.32, 1.04, -36.57, 96.7),
                fund(120819, "quant Aggressive Hybrid Fund Direct Plan", "Aggressive Hybrid", 5, 70.0, 15.18, 15.77, 0.79, -28.69, 99.6),
            ],
        },
        {
            bucketId: "debt", bucketLabel: "Debt", categoryLabel: "Debt — Short Duration",
            blurb: "Stability + liquidity. Low risk, low return.",
            targetPct: 15, lumpsumAmount: 37500, monthlyAmount: 2250,
            funds: [
                fund(120541, "Invesco India Ultra Short Duration Fund Direct Plan", "Debt - Short Duration", 1, 69.2, 7.33, 6.33, 3.50, -2.69, 100.0),
                fund(120746, "UTI Ultra Short Duration Fund Direct Plan", "Debt - Short Duration", 2, 63.5, 7.32, 6.92, 3.48, -3.61, 100.0),
                fund(143494, "Nippon India Ultra Short Duration Fund Direct Plan", "Debt - Short Duration", 3, 63.1, 7.58, 7.52, 4.13, -5.24, 100.0),
                fund(119828, "SBI Ultra Short Duration Fund Direct Plan", "Debt - Short Duration", 4, 62.8, 7.19, 6.20, 2.81, -0.95, 100.0),
                fund(119226, "HDFC Ultra Short Term Fund Direct Plan", "Debt - Short Duration", 5, 61.9, 7.10, 6.10, 2.74, -1.20, 100.0),
            ],
        },
    ],
};

function fund(schemeId: number, name: string, category: string, rank: number, expertScore: number, return3y: number, return5y: number, sharpe3y: number, maxDrawdown: number, pctPos3y: number): MFFund {
    return {
        schemeId, name, category, rank, expertScore,
        return1y: null, return3y, return5y, return10y: null, returnInception: null,
        sipReturn1y: null, sipReturn3y: null, sipReturn5y: null,
        sharpe3y, sortino3y: null, volatility3y: null, maxDrawdown, calmar3y: null, var95: null,
        upsideCapture: null, downsideCapture: null,
        alpha3y: null, beta3y: null, rSquared3y: null, informationRatio: null,
        pctPos1y: null, pctPos3y,
        navLatest: null, navDate: "2026-04-30", inceptionDate: null, historyYears: null, percentileRank: null,
    };
}

function formatINR(v: number | null | undefined): string {
    if (v == null) return "₹—";
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
    if (v >= 100000) return `₹${(v / 100000).toFixed(2)} L`;
    if (v >= 1000) return `₹${(v / 1000).toFixed(0)}k`;
    return `₹${Math.round(v).toLocaleString("en-IN")}`;
}

function scoreColor(s: number | null | undefined, accent: string, warn: string, danger: string): string {
    if (s == null) return danger;
    if (s >= 80) return accent;
    if (s >= 70) return warn;
    return danger;
}

function formatDate(iso: string | null): string {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ────────────────────────────────────────────────────────
//  Page
// ────────────────────────────────────────────────────────

export default function InvestmentsPage() {
    const palette = useAppTheme();
    const [mode, setMode] = useState<"lumpsum" | "sip">("lumpsum");
    const [lumpsumInput, setLumpsumInput] = useState(FREE_LUMPSUM_DEFAULT);
    const [expandedFund, setExpandedFund] = useState<number | null>(null);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        fetch("/api/auth/me")
            .then((res) => (res.ok ? res.json() : null))
            .then((d) => { if (d?.user?.email) setUserEmail(d.user.email); })
            .catch(() => {});
    }, []);

    // Real data sources
    const dashSummary = useDashboardSummary();
    const monthlySurplusFromSummary = (() => {
        const raw = (dashSummary.data as Record<string, unknown> | undefined)
            ?.healthScore as Record<string, unknown> | undefined;
        const v = raw?.rawData as Record<string, unknown> | undefined;
        return Number(v?.monthlySurplus) || 0;
    })();

    const { data: apiData, isLoading, error } = useMFRecommendations({
        lumpsum: lumpsumInput,
        monthlyAmount: monthlySurplusFromSummary,
    });

    const isAdmin = ADMIN_EMAILS.includes(userEmail);
    const isPremiumStored = typeof window !== "undefined"
        ? localStorage.getItem("myfinancial_premium") === "true"
        : false;

    // ── Loading state ──
    if (isLoading) {
        return (
            <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center", fontFamily: "var(--font-display)" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", borderStyle: "solid", borderWidth: 3, borderTopColor: palette.accent, borderRightColor: "rgba(16,185,129,0.3)", borderBottomColor: "rgba(16,185,129,0.3)", borderLeftColor: "rgba(16,185,129,0.3)", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <p style={{ color: palette.mute }}>Loading recommendations...</p>
                </div>
            </div>
        );
    }

    // ── "No risk profile" hard block — always send to assessment ──
    const errMsg = String((error as Error | undefined)?.message ?? "");
    const noProfile = errMsg.includes("Risk profile missing");
    if (noProfile) {
        return (
            <div style={{ width: "100%", maxWidth: 720, margin: "0 auto", padding: 32, textAlign: "center", fontFamily: "var(--font-display)" }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(245,158,11,0.10)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <AlertCircle size={28} style={{ color: "#FBBF24" }} />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: palette.txt, margin: 0 }}>Complete your assessment first</h2>
                <p style={{ fontSize: 14, color: palette.mute, margin: "8px 0 24px" }}>
                    We need your risk profile before showing personalised fund picks.
                </p>
                <Link href="/assessment/profile" style={{ display: "inline-block", padding: "12px 24px", borderRadius: 12, background: palette.accent, color: "#000", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                    Take 5-minute assessment
                </Link>
            </div>
        );
    }

    // ── Demo fallback: backend not deployed yet OR returning empty data ──
    const apiHasData = !!apiData && (apiData.buckets?.length ?? 0) > 0
        && apiData.buckets.some(b => b.funds.length > 0);
    const isDemoMode = !apiHasData;
    const data: MFRecommendationResponse = apiHasData ? (apiData as MFRecommendationResponse) : DEMO_DATA;

    // Admins always see Premium content. In demo mode, default to Premium so the design isn't half-blurred.
    const isPremium = isAdmin || isPremiumStored || isDemoMode;

    const buckets: MFBucket[] = data.buckets ?? [];
    const totalAmount = mode === "lumpsum" ? data.lumpsum : data.monthlyAmount;
    const hasFunds = buckets.some(b => b.funds.length > 0);

    return (
        <div style={{ width: "100%", maxWidth: 1152, margin: "0 auto", padding: "32px 24px 96px", display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Header */}
            <div>
                <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, color: palette.mute, margin: 0, fontFamily: "var(--font-display)" }}>Dashboard · Investments</p>
                <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.025em", color: palette.txt, margin: "4px 0 0", fontFamily: "var(--font-display)" }}>
                    Top funds for you
                </h1>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                    {isDemoMode && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "rgba(139,92,246,0.10)", border: "1px solid rgba(139,92,246,0.25)", color: "#A78BFA", fontSize: 12, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                            <Sparkles size={12} />
                            Demo data — backend deploying
                        </span>
                    )}
                    {data.riskProfileLabel && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.25)", color: palette.accent, fontSize: 12, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                            <Shield size={12} />
                            {data.riskProfileLabel}
                        </span>
                    )}
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: palette.s2, border: `1px solid ${palette.brd2}`, color: palette.txt2, fontSize: 12, fontWeight: 600, fontFamily: "var(--font-display)" }}>
                        <Calendar size={12} />
                        Updated {formatDate(data.lastRefreshedAt)} · Daily refresh
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: palette.s2, border: `1px solid ${palette.brd2}`, color: palette.txt2, fontSize: 12, fontWeight: 600, fontFamily: "var(--font-display)" }}>
                        <Award size={12} />
                        {data.qualityFundCount} quality-passing funds in universe
                    </span>
                </div>
            </div>

            {/* Disclaimer */}
            <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12, padding: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <AlertCircle size={18} style={{ color: "#FBBF24", flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: 13, color: palette.txt2, fontFamily: "var(--font-display)", lineHeight: 1.55 }}>
                    <strong style={{ color: palette.txt }}>Educational, not financial advice.</strong>{" "}
                    These are top quality funds in your risk bucket. Past performance is not indicative of future returns.
                </div>
            </div>

            {/* Wealth toggle + allocation overview */}
            <div style={{ background: palette.s1, border: `1px solid ${palette.brd}`, borderRadius: 16, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                    <div>
                        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, color: palette.mute, margin: 0, fontFamily: "var(--font-display)" }}>How are you investing?</p>
                        <h3 style={{ fontSize: 20, fontWeight: 700, color: palette.txt, margin: "4px 0 0", fontFamily: "var(--font-display)" }}>
                            {mode === "lumpsum" ? formatINR(totalAmount) : `${formatINR(totalAmount)}/month`}
                            <span style={{ fontSize: 13, fontWeight: 500, color: palette.mute, marginLeft: 8 }}>
                                {mode === "lumpsum" ? "to deploy" : "from your monthly surplus"}
                            </span>
                        </h3>
                    </div>
                    <div style={{ display: "flex", background: palette.s2, borderRadius: 999, padding: 4, border: `1px solid ${palette.brd}` }}>
                        <button onClick={() => setMode("lumpsum")} style={{ padding: "8px 18px", borderRadius: 999, fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)", background: mode === "lumpsum" ? palette.accent : "transparent", color: mode === "lumpsum" ? "#000" : palette.txt2, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <Wallet size={14} /> Lumpsum
                        </button>
                        <button onClick={() => setMode("sip")} style={{ padding: "8px 18px", borderRadius: 999, fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)", background: mode === "sip" ? palette.accent : "transparent", color: mode === "sip" ? "#000" : palette.txt2, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <Repeat size={14} /> SIP
                        </button>
                    </div>
                </div>

                {/* Lumpsum slider only in lumpsum mode */}
                {mode === "lumpsum" && (
                    <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        <label style={{ fontSize: 12, color: palette.mute, fontWeight: 600, fontFamily: "var(--font-display)" }}>Adjust lumpsum:</label>
                        <input
                            type="range"
                            min={50000}
                            max={5000000}
                            step={10000}
                            value={lumpsumInput}
                            onChange={(e) => setLumpsumInput(Number(e.target.value))}
                            style={{ flex: 1, minWidth: 200, accentColor: palette.accent }}
                        />
                        <span style={{ fontSize: 14, fontWeight: 700, color: palette.txt, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-display)", minWidth: 100, textAlign: "right" }}>
                            {formatINR(lumpsumInput)}
                        </span>
                    </div>
                )}

                {/* Allocation bar */}
                {hasFunds && (
                    <div style={{ marginTop: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <span style={{ fontSize: 12, color: palette.mute, fontWeight: 600, fontFamily: "var(--font-display)" }}>Target allocation</span>
                            <span style={{ fontSize: 12, color: palette.mute, fontFamily: "var(--font-display)" }}>{buckets.length} buckets</span>
                        </div>
                        <div style={{ display: "flex", height: 10, borderRadius: 999, overflow: "hidden", background: palette.s3 }}>
                            {buckets.map((b) => (
                                <div key={b.bucketId} style={{ width: `${b.targetPct}%`, background: BUCKET_COLORS[b.bucketId] ?? FALLBACK_COLOR }} />
                            ))}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                            {buckets.map((b) => (
                                <div key={b.bucketId} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: 2, background: BUCKET_COLORS[b.bucketId] ?? FALLBACK_COLOR }} />
                                    <span style={{ fontSize: 12, color: palette.txt2, fontWeight: 600, fontFamily: "var(--font-display)" }}>{b.bucketLabel}</span>
                                    <span style={{ fontSize: 12, color: palette.mute, fontFamily: "var(--font-display)" }}>{b.targetPct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Empty-funds banner */}
            {!hasFunds && (
                <div style={{ padding: 24, background: palette.s1, border: `1px solid ${palette.brd}`, borderRadius: 12, textAlign: "center", fontFamily: "var(--font-display)" }}>
                    <p style={{ color: palette.txt, fontSize: 15, fontWeight: 600, margin: 0 }}>Recommendations are being prepared.</p>
                    <p style={{ color: palette.mute, fontSize: 13, margin: "6px 0 0" }}>Daily refresh hasn't completed yet — please check back soon.</p>
                </div>
            )}

            {/* Buckets */}
            {buckets.map((bucket) => {
                const allocAmount = mode === "lumpsum" ? bucket.lumpsumAmount : bucket.monthlyAmount;
                return (
                    <section key={bucket.bucketId} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 8 }}>
                            <div>
                                <h2 style={{ fontSize: 20, fontWeight: 700, color: palette.txt, margin: 0, fontFamily: "var(--font-display)" }}>
                                    {bucket.bucketLabel} <span style={{ color: palette.mute, fontWeight: 500, fontSize: 14 }}>· {bucket.categoryLabel}</span>
                                </h2>
                                <p style={{ fontSize: 13, color: palette.mute, margin: "4px 0 0", fontFamily: "var(--font-display)" }}>{bucket.blurb}</p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <p style={{ fontSize: 11, color: palette.mute, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, margin: 0, fontFamily: "var(--font-display)" }}>Allocate</p>
                                <p style={{ fontSize: 18, fontWeight: 700, color: palette.accent, margin: 0, fontFamily: "var(--font-display)", fontVariantNumeric: "tabular-nums" }}>
                                    {formatINR(allocAmount)}{mode === "sip" ? "/mo" : ""} <span style={{ fontSize: 12, color: palette.mute, fontWeight: 500 }}>· {bucket.targetPct}%</span>
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {bucket.funds.map((fund, idx) => {
                                const isLocked = !isPremium && idx > 0;
                                const isOpen = expandedFund === fund.schemeId;
                                return (
                                    <FundCard
                                        key={fund.schemeId}
                                        fund={fund}
                                        isLocked={isLocked}
                                        isOpen={isOpen}
                                        onToggle={() => setExpandedFund(isOpen ? null : fund.schemeId)}
                                        palette={palette}
                                    />
                                );
                            })}
                            {bucket.funds.length === 0 && (
                                <p style={{ fontSize: 13, color: palette.mute, fontStyle: "italic", padding: 12, fontFamily: "var(--font-display)" }}>No quality-passing funds in this bucket yet.</p>
                            )}
                        </div>

                        {!isPremium && bucket.funds.length > 1 && (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 16px", background: "rgba(245,158,11,0.06)", border: "1px dashed rgba(245,158,11,0.3)", borderRadius: 10, fontFamily: "var(--font-display)" }}>
                                <span style={{ fontSize: 12, color: palette.txt2, display: "flex", alignItems: "center", gap: 8 }}>
                                    <Lock size={14} style={{ color: "#FBBF24" }} />
                                    {bucket.funds.length - 1} more quality picks in this bucket — unlock with Premium
                                </span>
                                <button style={{ padding: "6px 14px", borderRadius: 8, background: "linear-gradient(135deg, #F59E0B, #EA580C)", color: "#000", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-display)" }}>Unlock</button>
                            </div>
                        )}
                    </section>
                );
            })}

            {/* Premium upgrade card */}
            {!isPremium && hasFunds && (
                <div style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.10), rgba(234,88,12,0.05))", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 16, padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Crown size={22} style={{ color: "#FBBF24" }} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: palette.txt, margin: 0, fontFamily: "var(--font-display)" }}>Unlock all quality picks</h3>
                            <p style={{ fontSize: 13, color: palette.mute, margin: "2px 0 0", fontFamily: "var(--font-display)" }}>+ monthly rebalance alerts, full 35-metric breakdown, downloadable PDF report</p>
                        </div>
                    </div>
                    <button style={{ padding: "12px 20px", borderRadius: 12, background: "linear-gradient(135deg, #F59E0B, #EA580C)", color: "#000", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-display)", whiteSpace: "nowrap" }}>
                        Premium · ₹999/yr
                    </button>
                </div>
            )}

            {/* Footer disclaimer */}
            <p style={{ textAlign: "center", fontSize: 11, color: palette.mute, fontFamily: "var(--font-display)", lineHeight: 1.6, marginTop: 8 }}>
                Mutual fund investments are subject to market risks. Read all scheme-related documents carefully.
                Past performance is not indicative of future returns. MyFinancial does not provide investment advice unless engaged in a paid advisory relationship.
            </p>
        </div>
    );
}

// ────────────────────────────────────────────────────────
//  Fund card
// ────────────────────────────────────────────────────────

function FundCard({
    fund, isLocked, isOpen, onToggle, palette,
}: {
    fund: MFFund;
    isLocked: boolean;
    isOpen: boolean;
    onToggle: () => void;
    palette: ReturnType<typeof useAppTheme>;
}) {
    const sColor = scoreColor(fund.expertScore, palette.accent, palette.warn, palette.danger);

    if (isLocked) {
        return (
            <div style={{ position: "relative", background: palette.s1, border: `1px solid ${palette.brd}`, borderRadius: 12, padding: 16, overflow: "hidden" }}>
                <div style={{ filter: "blur(4px)", opacity: 0.5, pointerEvents: "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                            <span style={{ width: 28, height: 28, borderRadius: 8, background: palette.s3, color: palette.mute, fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)" }}>#{fund.rank}</span>
                            <span style={{ color: palette.txt, fontSize: 14, fontWeight: 600, fontFamily: "var(--font-display)" }}>████████ ████ ███ Direct Plan</span>
                        </div>
                        <span style={{ color: sColor, fontWeight: 700, fontFamily: "var(--font-display)" }}>{fund.expertScore?.toFixed(0) ?? "—"}/100</span>
                    </div>
                </div>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "var(--font-display)" }}>
                    <Lock size={14} style={{ color: "#FBBF24" }} />
                    <span style={{ fontSize: 13, color: palette.txt2, fontWeight: 600 }}>#{fund.rank} pick · Premium only</span>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: palette.s1, border: `1px solid ${isOpen ? palette.accent : palette.brd}`, borderRadius: 12, transition: "border-color 0.15s", overflow: "hidden" }}>
            <button onClick={onToggle} style={{ width: "100%", background: "transparent", border: "none", cursor: "pointer", padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, fontFamily: "var(--font-display)", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
                    <span style={{ width: 28, height: 28, borderRadius: 8, background: fund.rank === 1 ? "rgba(16,185,129,0.15)" : palette.s3, color: fund.rank === 1 ? palette.accent : palette.txt2, fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>#{fund.rank}</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <span style={{ color: palette.txt, fontSize: 14, fontWeight: 700 }}>{fund.name}</span>
                            {fund.rank === 1 && (
                                <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: "rgba(16,185,129,0.15)", color: palette.accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>Top Pick</span>
                            )}
                        </div>
                        <div style={{ display: "flex", gap: 14, marginTop: 4, fontSize: 12, color: palette.mute, flexWrap: "wrap" }}>
                            <span><strong style={{ color: palette.txt2 }}>3Y:</strong> {fmt(fund.return3y, "%")}</span>
                            <span><strong style={{ color: palette.txt2 }}>5Y:</strong> {fmt(fund.return5y, "%")}</span>
                            <span><strong style={{ color: palette.txt2 }}>Sharpe:</strong> {fmt(fund.sharpe3y)}</span>
                            <span><strong style={{ color: palette.txt2 }}>Max DD:</strong> {fmt(fund.maxDrawdown, "%")}</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: sColor, fontVariantNumeric: "tabular-nums" }}>{fund.expertScore?.toFixed(0) ?? "—"}</div>
                        <div style={{ fontSize: 9, color: palette.mute, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Score</div>
                    </div>
                    {isOpen ? <ChevronUp size={18} style={{ color: palette.mute }} /> : <ChevronDown size={18} style={{ color: palette.mute }} />}
                </div>
            </button>

            {isOpen && (
                <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${palette.brd}`, paddingTop: 16, marginTop: 0, background: palette.bg, fontFamily: "var(--font-display)" }}>
                    <MetricGrid title="Returns (CAGR)" rows={[
                        ["1Y", fmt(fund.return1y, "%")],
                        ["3Y", fmt(fund.return3y, "%")],
                        ["5Y", fmt(fund.return5y, "%")],
                        ["10Y", fmt(fund.return10y, "%")],
                        ["SIP 5Y XIRR", fmt(fund.sipReturn5y, "%")],
                    ]} palette={palette} />

                    <MetricGrid title="Risk metrics (3Y)" rows={[
                        ["Sharpe", fmt(fund.sharpe3y)],
                        ["Sortino", fmt(fund.sortino3y)],
                        ["Volatility", fmt(fund.volatility3y, "%")],
                        ["Max Drawdown", fmt(fund.maxDrawdown, "%")],
                        ["Calmar", fmt(fund.calmar3y)],
                    ]} palette={palette} />

                    <MetricGrid title="Vs Nifty 50" rows={[
                        ["Upside Capture", fmt(fund.upsideCapture, "%")],
                        ["Downside Capture", fmt(fund.downsideCapture, "%")],
                        ["Alpha (3Y)", fmt(fund.alpha3y)],
                        ["Beta (3Y)", fmt(fund.beta3y)],
                        ["R²", fmt(fund.rSquared3y)],
                    ]} palette={palette} />

                    <MetricGrid title="Consistency & rank" rows={[
                        ["% Positive 3Y rolling", fmt(fund.pctPos3y, "%")],
                        ["Percentile rank", fund.percentileRank == null ? "—" : `Top ${fund.percentileRank.toFixed(1)}%`],
                        ["History", fund.historyYears == null ? "—" : `${fund.historyYears.toFixed(1)} yrs`],
                        ["Scheme ID", String(fund.schemeId)],
                    ]} palette={palette} />

                    <p style={{ fontSize: 11, color: palette.mute, marginTop: 12, lineHeight: 1.5, fontFamily: "var(--font-display)" }}>
                        Methodology: Expert score blends returns (35%), risk (30%), capture ratios (15%), alpha (10%), consistency (10%).
                        Quality filter: 10 gates incl. min 5Y CAGR, max drawdown floor, Sharpe ≥ 0.5, expense ratio ≤ 0.7%, manager tenure ≥ 7 yrs.
                    </p>
                </div>
            )}
        </div>
    );
}

function fmt(v: number | null | undefined, suffix = ""): string {
    if (v == null) return "—";
    return `${v.toFixed(2)}${suffix}`;
}

function MetricGrid({ title, rows, palette }: { title: string; rows: [string, string][]; palette: ReturnType<typeof useAppTheme> }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, color: palette.mute, margin: "0 0 6px", fontFamily: "var(--font-display)" }}>{title}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
                {rows.map(([k, v]) => (
                    <div key={k} style={{ background: palette.s1, border: `1px solid ${palette.brd}`, borderRadius: 8, padding: "8px 10px" }}>
                        <p style={{ fontSize: 11, color: palette.mute, margin: 0, fontFamily: "var(--font-display)" }}>{k}</p>
                        <p style={{ fontSize: 14, fontWeight: 700, color: palette.txt, margin: "2px 0 0", fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-display)" }}>{v}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
