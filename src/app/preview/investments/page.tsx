"use client";

import { useState } from "react";
import {
    Lock, ChevronDown, ChevronUp, Calendar, Award,
    Shield, Crown, AlertCircle, Sparkles, Wallet, Repeat,
} from "lucide-react";
import { useAppTheme } from "@/hooks/useAppTheme";

// ---------- MOCK USER DATA (from /risk-scoring + /dashboard/summary in prod) ----------
const MOCK_USER = {
    name: "Ramesh",
    riskProfile: "Aggressive",
    monthlySurplus: 15000,
    investableLumpsum: 250000,
};

// ---------- MOCK BUCKETS (from risk_to_allocation table in prod) ----------
type Fund = {
    schemeId: number;
    name: string;
    expertScore: number;
    rank: number;
    return3y: number;
    return5y: number;
    sharpe3y: number;
    maxDd: number;
    downsideCapture: number;
    pctPos3y: number;
    return1y: number;
    return10y: number;
    sipReturn5y: number;
    sortino3y: number;
    volatility3y: number;
    calmar3y: number;
    upsideCapture: number;
    alpha3y: number;
    beta3y: number;
    rSquared3y: number;
    historyYears: number;
    percentileRank: number;
};

type Bucket = {
    id: string;
    label: string;
    category: string;
    targetPct: number;
    blurb: string;
    funds: Fund[];
};

const BUCKETS: Bucket[] = [
    {
        id: "flexi",
        label: "Equity Diversified",
        category: "Flexi Cap",
        targetPct: 25,
        blurb: "Diversified equity across market caps. Best for long-term wealth.",
        funds: [
            { schemeId: 148404, name: "BANK OF INDIA Flexi Cap Fund Direct Plan", expertScore: 86.0, rank: 1, return3y: 23.37, return5y: 20.02, sharpe3y: 1.11, maxDd: -23.73, downsideCapture: 98.0, pctPos3y: 99.5, return1y: 12.4, return10y: 18.8, sipReturn5y: 15.6, sortino3y: 1.42, volatility3y: 14.2, calmar3y: 0.99, upsideCapture: 110.2, alpha3y: 4.2, beta3y: 0.95, rSquared3y: 0.91, historyYears: 4.8, percentileRank: 1.2 },
            { schemeId: 120843, name: "quant Flexi Cap Fund Direct Plan", expertScore: 80.8, rank: 2, return3y: 19.03, return5y: 19.91, sharpe3y: 0.89, maxDd: -41.28, downsideCapture: 99.7, pctPos3y: 96.4, return1y: 8.1, return10y: 19.5, sipReturn5y: 14.9, sortino3y: 1.18, volatility3y: 18.6, calmar3y: 0.46, upsideCapture: 118.4, alpha3y: 3.1, beta3y: 1.18, rSquared3y: 0.83, historyYears: 13.3, percentileRank: 2.8 },
            { schemeId: 120492, name: "JM Flexicap Fund Direct Plan", expertScore: 80.5, rank: 3, return3y: 19.81, return5y: 18.51, sharpe3y: 0.99, maxDd: -34.95, downsideCapture: 97.2, pctPos3y: 97.8, return1y: 9.6, return10y: 17.2, sipReturn5y: 14.3, sortino3y: 1.27, volatility3y: 16.4, calmar3y: 0.57, upsideCapture: 105.6, alpha3y: 2.8, beta3y: 1.04, rSquared3y: 0.88, historyYears: 13.3, percentileRank: 4.4 },
            { schemeId: 140353, name: "Edelweiss Flexi Cap Fund Direct Plan", expertScore: 78.6, rank: 4, return3y: 18.81, return5y: 16.94, sharpe3y: 0.98, maxDd: -36.10, downsideCapture: 98.4, pctPos3y: 96.1, return1y: 7.2, return10y: 15.8, sipReturn5y: 13.1, sortino3y: 1.23, volatility3y: 15.9, calmar3y: 0.52, upsideCapture: 102.1, alpha3y: 1.9, beta3y: 1.01, rSquared3y: 0.92, historyYears: 8.0, percentileRank: 5.6 },
            { schemeId: 118955, name: "HDFC Flexi Cap Fund Direct Plan", expertScore: 78.3, rank: 5, return3y: 19.40, return5y: 20.34, sharpe3y: 1.22, maxDd: -41.84, downsideCapture: 88.3, pctPos3y: 95.4, return1y: 11.1, return10y: 16.9, sipReturn5y: 14.8, sortino3y: 1.55, volatility3y: 13.8, calmar3y: 0.46, upsideCapture: 96.5, alpha3y: 2.4, beta3y: 0.91, rSquared3y: 0.94, historyYears: 13.3, percentileRank: 6.7 },
        ],
    },
    {
        id: "midcap",
        label: "Equity Growth",
        category: "Mid Cap",
        targetPct: 20,
        blurb: "Higher growth potential with higher volatility. 7+ year horizon.",
        funds: [
            { schemeId: 147704, name: "Motilal Oswal Large and Midcap Fund Direct Plan", expertScore: 87.8, rank: 1, return3y: 26.83, return5y: 22.55, sharpe3y: 1.25, maxDd: -37.44, downsideCapture: 96.8, pctPos3y: 99.0, return1y: 18.2, return10y: 21.4, sipReturn5y: 19.1, sortino3y: 1.61, volatility3y: 17.2, calmar3y: 0.72, upsideCapture: 121.5, alpha3y: 5.8, beta3y: 1.05, rSquared3y: 0.86, historyYears: 5.2, percentileRank: 1.0 },
            { schemeId: 120381, name: "ICICI Prudential MidCap Fund Direct Plan", expertScore: 87.5, rank: 2, return3y: 26.93, return5y: 21.63, sharpe3y: 1.34, maxDd: -44.04, downsideCapture: 98.1, pctPos3y: 98.2, return1y: 16.4, return10y: 22.1, sipReturn5y: 18.7, sortino3y: 1.72, volatility3y: 16.8, calmar3y: 0.61, upsideCapture: 119.2, alpha3y: 5.4, beta3y: 1.12, rSquared3y: 0.89, historyYears: 13.3, percentileRank: 2.2 },
            { schemeId: 120403, name: "Invesco India Midcap Fund Direct Plan", expertScore: 87.5, rank: 3, return3y: 26.96, return5y: 22.50, sharpe3y: 1.39, maxDd: -34.09, downsideCapture: 92.1, pctPos3y: 98.5, return1y: 17.8, return10y: 21.7, sipReturn5y: 19.0, sortino3y: 1.79, volatility3y: 16.5, calmar3y: 0.79, upsideCapture: 116.4, alpha3y: 5.7, beta3y: 1.09, rSquared3y: 0.91, historyYears: 13.3, percentileRank: 2.2 },
            { schemeId: 118665, name: "Nippon India Growth Mid Cap Fund Direct Plan", expertScore: 87.4, rank: 4, return3y: 26.20, return5y: 23.07, sharpe3y: 1.35, maxDd: -35.32, downsideCapture: 94.4, pctPos3y: 98.7, return1y: 17.1, return10y: 22.4, sipReturn5y: 19.3, sortino3y: 1.74, volatility3y: 16.6, calmar3y: 0.74, upsideCapture: 117.8, alpha3y: 5.5, beta3y: 1.08, rSquared3y: 0.90, historyYears: 13.3, percentileRank: 4.4 },
            { schemeId: 125354, name: "Kotak Emerging Equity Fund Direct Plan", expertScore: 86.2, rank: 5, return3y: 25.10, return5y: 21.80, sharpe3y: 1.28, maxDd: -36.50, downsideCapture: 95.2, pctPos3y: 97.9, return1y: 15.8, return10y: 20.9, sipReturn5y: 18.4, sortino3y: 1.66, volatility3y: 16.9, calmar3y: 0.69, upsideCapture: 115.0, alpha3y: 5.0, beta3y: 1.07, rSquared3y: 0.90, historyYears: 13.3, percentileRank: 5.5 },
        ],
    },
    {
        id: "elss",
        label: "Tax Saver",
        category: "ELSS",
        targetPct: 15,
        blurb: "Save up to ₹46,800 in tax under 80C. 3-year lock-in.",
        funds: [
            { schemeId: 133386, name: "Motilal Oswal ELSS Tax Saver Fund Direct Plan", expertScore: 86.0, rank: 1, return3y: 26.08, return5y: 20.81, sharpe3y: 1.21, maxDd: -37.72, downsideCapture: 96.9, pctPos3y: 98.4, return1y: 17.2, return10y: 19.8, sipReturn5y: 18.0, sortino3y: 1.57, volatility3y: 17.9, calmar3y: 0.69, upsideCapture: 119.8, alpha3y: 4.9, beta3y: 1.10, rSquared3y: 0.88, historyYears: 6.5, percentileRank: 1.4 },
            { schemeId: 120847, name: "quant ELSS Tax Saver Fund Direct Plan", expertScore: 80.2, rank: 2, return3y: 18.39, return5y: 18.61, sharpe3y: 0.85, maxDd: -36.12, downsideCapture: 100.4, pctPos3y: 95.8, return1y: 6.4, return10y: 18.9, sipReturn5y: 14.2, sortino3y: 1.13, volatility3y: 18.9, calmar3y: 0.51, upsideCapture: 121.6, alpha3y: 2.6, beta3y: 1.21, rSquared3y: 0.81, historyYears: 13.3, percentileRank: 2.7 },
            { schemeId: 119723, name: "SBI ELSS Tax Saver FUND Direct Plan", expertScore: 79.8, rank: 3, return3y: 21.28, return5y: 19.18, sharpe3y: 1.25, maxDd: -38.20, downsideCapture: 92.2, pctPos3y: 96.7, return1y: 13.4, return10y: 17.4, sipReturn5y: 15.5, sortino3y: 1.61, volatility3y: 14.6, calmar3y: 0.56, upsideCapture: 104.8, alpha3y: 3.2, beta3y: 0.99, rSquared3y: 0.93, historyYears: 13.3, percentileRank: 4.1 },
            { schemeId: 147541, name: "ITI ELSS Tax Saver Fund Direct Plan", expertScore: 79.7, rank: 4, return3y: 20.95, return5y: 15.28, sharpe3y: 0.99, maxDd: -38.49, downsideCapture: 100.0, pctPos3y: 96.0, return1y: 11.8, return10y: 16.2, sipReturn5y: 13.4, sortino3y: 1.27, volatility3y: 17.4, calmar3y: 0.54, upsideCapture: 110.5, alpha3y: 2.4, beta3y: 1.13, rSquared3y: 0.85, historyYears: 5.4, percentileRank: 5.5 },
            { schemeId: 120494, name: "JM ELSS Tax Saver Fund Direct Plan", expertScore: 78.3, rank: 5, return3y: 19.04, return5y: 16.58, sharpe3y: 0.92, maxDd: -37.39, downsideCapture: 97.9, pctPos3y: 95.6, return1y: 8.9, return10y: 15.8, sipReturn5y: 13.0, sortino3y: 1.18, volatility3y: 17.7, calmar3y: 0.51, upsideCapture: 106.4, alpha3y: 1.8, beta3y: 1.08, rSquared3y: 0.86, historyYears: 13.3, percentileRank: 6.8 },
        ],
    },
    {
        id: "hybrid",
        label: "Hybrid",
        category: "Aggressive Hybrid",
        targetPct: 25,
        blurb: "Equity + debt mix. Smoother ride than pure equity.",
        funds: [
            { schemeId: 120700, name: "ICICI Prudential Aggressive Hybrid Active FOF Direct Plan", expertScore: 74.3, rank: 1, return3y: 17.71, return5y: 17.19, sharpe3y: 1.27, maxDd: -35.74, downsideCapture: 78.7, pctPos3y: 96.5, return1y: 1.86, return10y: 15.93, sipReturn5y: 13.84, sortino3y: 1.70, volatility3y: 9.9, calmar3y: 0.50, upsideCapture: 63.7, alpha3y: 10.62, beta3y: 0.696, rSquared3y: 0.781, historyYears: 13.1, percentileRank: 3.3 },
            { schemeId: 147446, name: "Mahindra Manulife Aggressive Hybrid Fund Direct Plan", expertScore: 73.3, rank: 2, return3y: 16.47, return5y: 15.38, sharpe3y: 1.06, maxDd: -25.41, downsideCapture: 83.9, pctPos3y: 100.0, return1y: 2.64, return10y: 11.53, sipReturn5y: 12.54, sortino3y: 1.33, volatility3y: 10.45, calmar3y: 0.65, upsideCapture: 68.7, alpha3y: 7.91, beta3y: 0.769, rSquared3y: 0.905, historyYears: 6.8, percentileRank: 6.7 },
            { schemeId: 118624, name: "Edelweiss Aggressive Hybrid Fund Direct Plan", expertScore: 72.0, rank: 3, return3y: 16.90, return5y: 16.44, sharpe3y: 1.10, maxDd: -28.60, downsideCapture: 81.9, pctPos3y: 99.8, return1y: 5.32, return10y: 14.25, sipReturn5y: 13.78, sortino3y: 1.31, volatility3y: 10.42, calmar3y: 0.59, upsideCapture: 65.8, alpha3y: 8.44, beta3y: 0.759, rSquared3y: 0.884, historyYears: 13.3, percentileRank: 10.0 },
            { schemeId: 120484, name: "JM Aggressive Hybrid Fund Direct Plan", expertScore: 70.6, rank: 4, return3y: 17.94, return5y: 15.32, sharpe3y: 1.04, maxDd: -36.57, downsideCapture: 85.1, pctPos3y: 96.7, return1y: 0.64, return10y: 13.30, sipReturn5y: 12.75, sortino3y: 1.29, volatility3y: 12.34, calmar3y: 0.49, upsideCapture: 73.6, alpha3y: 8.97, beta3y: 0.816, rSquared3y: 0.730, historyYears: 13.3, percentileRank: 13.3 },
            { schemeId: 120819, name: "quant Aggressive Hybrid Fund Direct Plan", expertScore: 70.0, rank: 5, return3y: 15.18, return5y: 15.77, sharpe3y: 0.79, maxDd: -28.69, downsideCapture: 86.8, pctPos3y: 99.6, return1y: 11.32, return10y: 16.64, sipReturn5y: 12.72, sortino3y: 1.02, volatility3y: 12.71, calmar3y: 0.53, upsideCapture: 72.6, alpha3y: 6.37, beta3y: 0.819, rSquared3y: 0.694, historyYears: 13.3, percentileRank: 16.7 },
        ],
    },
    {
        id: "debt",
        label: "Debt",
        category: "Debt — Short Duration",
        targetPct: 15,
        blurb: "Stability + liquidity. Low risk, low return.",
        funds: [
            { schemeId: 120541, name: "Invesco India Ultra Short Duration Fund Direct Plan", expertScore: 69.2, rank: 1, return3y: 7.33, return5y: 6.33, sharpe3y: 3.50, maxDd: -2.69, downsideCapture: -9.4, pctPos3y: 100.0, return1y: 7.2, return10y: 6.8, sipReturn5y: 6.5, sortino3y: 4.21, volatility3y: 0.54, calmar3y: 2.72, upsideCapture: 22.4, alpha3y: 6.84, beta3y: 0.012, rSquared3y: 0.041, historyYears: 13.3, percentileRank: 6.7 },
            { schemeId: 120746, name: "UTI Ultra Short Duration Fund Direct Plan", expertScore: 63.5, rank: 2, return3y: 7.32, return5y: 6.92, sharpe3y: 3.48, maxDd: -3.61, downsideCapture: -9.4, pctPos3y: 100.0, return1y: 7.1, return10y: 7.0, sipReturn5y: 6.7, sortino3y: 4.18, volatility3y: 0.55, calmar3y: 2.03, upsideCapture: 23.1, alpha3y: 6.81, beta3y: 0.013, rSquared3y: 0.045, historyYears: 13.3, percentileRank: 13.3 },
            { schemeId: 143494, name: "Nippon India Ultra Short Duration Fund Direct Plan", expertScore: 63.1, rank: 3, return3y: 7.58, return5y: 7.52, sharpe3y: 4.13, maxDd: -5.24, downsideCapture: -9.7, pctPos3y: 100.0, return1y: 7.4, return10y: 7.3, sipReturn5y: 7.1, sortino3y: 4.94, volatility3y: 0.49, calmar3y: 1.45, upsideCapture: 24.0, alpha3y: 7.10, beta3y: 0.011, rSquared3y: 0.038, historyYears: 8.5, percentileRank: 20.0 },
            { schemeId: 119828, name: "SBI ULTRA SHORT DURATION FUND Direct Plan", expertScore: 62.8, rank: 4, return3y: 7.19, return5y: 6.20, sharpe3y: 2.81, maxDd: -0.95, downsideCapture: -9.4, pctPos3y: 100.0, return1y: 7.0, return10y: 6.7, sipReturn5y: 6.3, sortino3y: 3.44, volatility3y: 0.61, calmar3y: 7.57, upsideCapture: 21.8, alpha3y: 6.71, beta3y: 0.014, rSquared3y: 0.046, historyYears: 13.3, percentileRank: 26.7 },
            { schemeId: 119226, name: "HDFC Ultra Short Term Fund Direct Plan", expertScore: 61.9, rank: 5, return3y: 7.10, return5y: 6.10, sharpe3y: 2.74, maxDd: -1.20, downsideCapture: -9.5, pctPos3y: 100.0, return1y: 6.9, return10y: 6.6, sipReturn5y: 6.2, sortino3y: 3.31, volatility3y: 0.62, calmar3y: 5.92, upsideCapture: 21.2, alpha3y: 6.62, beta3y: 0.015, rSquared3y: 0.048, historyYears: 13.3, percentileRank: 33.3 },
        ],
    },
];

// ---------- HELPERS ----------
const formatINR = (v: number): string => {
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
    if (v >= 100000) return `₹${(v / 100000).toFixed(2)} L`;
    if (v >= 1000) return `₹${(v / 1000).toFixed(0)}k`;
    return `₹${Math.round(v).toLocaleString("en-IN")}`;
};

const scoreColor = (s: number, accent: string, warn: string, danger: string): string => {
    if (s >= 80) return accent;
    if (s >= 70) return warn;
    return danger;
};

// ---------- PAGE ----------
export default function InvestmentsPreviewPage() {
    const palette = useAppTheme();
    const [mode, setMode] = useState<"lumpsum" | "sip">("lumpsum");
    const [isPremium, setIsPremium] = useState(true);
    const [expandedFund, setExpandedFund] = useState<number | null>(null);

    const totalAmount = mode === "lumpsum" ? MOCK_USER.investableLumpsum : MOCK_USER.monthlySurplus;

    return (
        <div style={{ minHeight: "100vh", background: palette.bg, paddingBottom: 96 }}>
            {/* Preview banner — design-only switch */}
            <div style={{ background: "linear-gradient(90deg, rgba(245,158,11,0.12), rgba(234,88,12,0.06))", borderBottom: `1px solid ${palette.brd2}`, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "var(--font-display)", fontSize: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#FBBF24" }}>
                    <Sparkles size={14} />
                    <span style={{ fontWeight: 600 }}>Design Preview · /preview/investments</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: palette.mute }}>View as:</span>
                    <button onClick={() => setIsPremium(false)} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: !isPremium ? palette.s3 : "transparent", color: !isPremium ? palette.txt : palette.mute, border: `1px solid ${palette.brd}`, cursor: "pointer", fontFamily: "var(--font-display)" }}>Free user</button>
                    <button onClick={() => setIsPremium(true)} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: isPremium ? "rgba(245,158,11,0.15)" : "transparent", color: isPremium ? "#FBBF24" : palette.mute, border: `1px solid ${isPremium ? "rgba(245,158,11,0.3)" : palette.brd}`, cursor: "pointer", fontFamily: "var(--font-display)" }}>Premium</button>
                </div>
            </div>

            <div style={{ width: "100%", maxWidth: 1152, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 24 }}>

                {/* Header */}
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
                    <div>
                        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, color: palette.mute, margin: 0, fontFamily: "var(--font-display)" }}>Dashboard · Investments</p>
                        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.025em", color: palette.txt, margin: "4px 0 0", fontFamily: "var(--font-display)" }}>
                            Top funds for {MOCK_USER.name}
                        </h1>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.25)", color: palette.accent, fontSize: 12, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                                <Shield size={12} />
                                {MOCK_USER.riskProfile}
                            </span>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: palette.s2, border: `1px solid ${palette.brd2}`, color: palette.txt2, fontSize: 12, fontWeight: 600, fontFamily: "var(--font-display)" }}>
                                <Calendar size={12} />
                                Updated 30 Apr 2026 · Daily refresh
                            </span>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: palette.s2, border: `1px solid ${palette.brd2}`, color: palette.txt2, fontSize: 12, fontWeight: 600, fontFamily: "var(--font-display)" }}>
                                <Award size={12} />
                                Quality-filtered (10 gates)
                            </span>
                        </div>
                    </div>
                </div>

                {/* Disclaimer banner */}
                <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12, padding: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <AlertCircle size={18} style={{ color: "#FBBF24", flexShrink: 0, marginTop: 2 }} />
                    <div style={{ fontSize: 13, color: palette.txt2, fontFamily: "var(--font-display)", lineHeight: 1.55 }}>
                        <strong style={{ color: palette.txt }}>Educational, not financial advice.</strong>{" "}
                        These are top quality funds in your risk bucket. Past performance is not indicative of future returns.
                    </div>
                </div>

                {/* Wealth toggle */}
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

                    {/* Allocation bar */}
                    <div style={{ marginTop: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <span style={{ fontSize: 12, color: palette.mute, fontWeight: 600, fontFamily: "var(--font-display)" }}>Target allocation</span>
                            <span style={{ fontSize: 12, color: palette.mute, fontFamily: "var(--font-display)" }}>{BUCKETS.length} buckets</span>
                        </div>
                        <div style={{ display: "flex", height: 10, borderRadius: 999, overflow: "hidden", background: palette.s3 }}>
                            {BUCKETS.map((b, i) => {
                                const colors = ["#10B981", "#06B6D4", "#8B5CF6", "#F59E0B", "#94A3B8"];
                                return <div key={b.id} style={{ width: `${b.targetPct}%`, background: colors[i % colors.length] }} />;
                            })}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                            {BUCKETS.map((b, i) => {
                                const colors = ["#10B981", "#06B6D4", "#8B5CF6", "#F59E0B", "#94A3B8"];
                                return (
                                    <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <span style={{ width: 8, height: 8, borderRadius: 2, background: colors[i % colors.length] }} />
                                        <span style={{ fontSize: 12, color: palette.txt2, fontWeight: 600, fontFamily: "var(--font-display)" }}>{b.label}</span>
                                        <span style={{ fontSize: 12, color: palette.mute, fontFamily: "var(--font-display)" }}>{b.targetPct}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Buckets */}
                {BUCKETS.map((bucket) => {
                    const allocAmount = Math.round((bucket.targetPct / 100) * totalAmount);
                    return (
                        <section key={bucket.id} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 8 }}>
                                <div>
                                    <h2 style={{ fontSize: 20, fontWeight: 700, color: palette.txt, margin: 0, fontFamily: "var(--font-display)" }}>
                                        {bucket.label} <span style={{ color: palette.mute, fontWeight: 500, fontSize: 14 }}>· {bucket.category}</span>
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
                            </div>

                            {!isPremium && (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 16px", background: "rgba(245,158,11,0.06)", border: "1px dashed rgba(245,158,11,0.3)", borderRadius: 10, fontFamily: "var(--font-display)" }}>
                                    <span style={{ fontSize: 12, color: palette.txt2, display: "flex", alignItems: "center", gap: 8 }}>
                                        <Lock size={14} style={{ color: "#FBBF24" }} />
                                        4 more quality picks in this bucket — unlock with Premium
                                    </span>
                                    <button style={{ padding: "6px 14px", borderRadius: 8, background: "linear-gradient(135deg, #F59E0B, #EA580C)", color: "#000", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-display)" }}>Unlock</button>
                                </div>
                            )}
                        </section>
                    );
                })}

                {/* Premium upgrade card (free users only) */}
                {!isPremium && (
                    <div style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.10), rgba(234,88,12,0.05))", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 16, padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Crown size={22} style={{ color: "#FBBF24" }} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: palette.txt, margin: 0, fontFamily: "var(--font-display)" }}>Unlock all 25 quality picks</h3>
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
        </div>
    );
}

// ---------- FUND CARD ----------
function FundCard({ fund, isLocked, isOpen, onToggle, palette }: { fund: Fund; isLocked: boolean; isOpen: boolean; onToggle: () => void; palette: ReturnType<typeof useAppTheme> }) {
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
                        <span style={{ color: sColor, fontWeight: 700, fontFamily: "var(--font-display)" }}>{fund.expertScore.toFixed(0)}/100</span>
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
                            <span><strong style={{ color: palette.txt2 }}>3Y:</strong> {fund.return3y.toFixed(1)}%</span>
                            <span><strong style={{ color: palette.txt2 }}>5Y:</strong> {fund.return5y.toFixed(1)}%</span>
                            <span><strong style={{ color: palette.txt2 }}>Sharpe:</strong> {fund.sharpe3y.toFixed(2)}</span>
                            <span><strong style={{ color: palette.txt2 }}>Max DD:</strong> {fund.maxDd.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: sColor, fontVariantNumeric: "tabular-nums" }}>{fund.expertScore.toFixed(0)}</div>
                        <div style={{ fontSize: 9, color: palette.mute, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Score</div>
                    </div>
                    {isOpen ? <ChevronUp size={18} style={{ color: palette.mute }} /> : <ChevronDown size={18} style={{ color: palette.mute }} />}
                </div>
            </button>

            {isOpen && (
                <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${palette.brd}`, paddingTop: 16, marginTop: 0, background: palette.bg, fontFamily: "var(--font-display)" }}>
                    <MetricGrid title="Returns (CAGR)" rows={[
                        ["1Y", `${fund.return1y.toFixed(2)}%`],
                        ["3Y", `${fund.return3y.toFixed(2)}%`],
                        ["5Y", `${fund.return5y.toFixed(2)}%`],
                        ["10Y", `${fund.return10y.toFixed(2)}%`],
                        ["SIP 5Y XIRR", `${fund.sipReturn5y.toFixed(2)}%`],
                    ]} palette={palette} />

                    <MetricGrid title="Risk metrics (3Y)" rows={[
                        ["Sharpe", fund.sharpe3y.toFixed(2)],
                        ["Sortino", fund.sortino3y.toFixed(2)],
                        ["Volatility", `${fund.volatility3y.toFixed(2)}%`],
                        ["Max Drawdown", `${fund.maxDd.toFixed(2)}%`],
                        ["Calmar", fund.calmar3y.toFixed(2)],
                    ]} palette={palette} />

                    <MetricGrid title="Vs Nifty 50" rows={[
                        ["Upside Capture", `${fund.upsideCapture.toFixed(1)}%`],
                        ["Downside Capture", `${fund.downsideCapture.toFixed(1)}%`],
                        ["Alpha (3Y)", fund.alpha3y.toFixed(2)],
                        ["Beta (3Y)", fund.beta3y.toFixed(2)],
                        ["R²", fund.rSquared3y.toFixed(2)],
                    ]} palette={palette} />

                    <MetricGrid title="Consistency & rank" rows={[
                        ["% Positive 3Y rolling", `${fund.pctPos3y.toFixed(1)}%`],
                        ["Percentile rank", `Top ${fund.percentileRank.toFixed(1)}%`],
                        ["History", `${fund.historyYears.toFixed(1)} yrs`],
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
