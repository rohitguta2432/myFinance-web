"use client";

import { useState } from "react";
import {
    Lock, ChevronDown, ChevronUp, Calendar, Award,
    Shield, Crown, AlertCircle, Sparkles, Wallet, Repeat,
} from "lucide-react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useMFRecommendations, type MFFund, type MFBucket } from "@/hooks/dashboard/useMFRecommendations";

// Stable bucket → colour map. Keep in sync with /api/mf-recommendations bucket order.
const BUCKET_COLORS: Record<string, string> = {
    flexi: "#10B981",
    mid: "#06B6D4",
    elss: "#8B5CF6",
    hybrid: "#F59E0B",
    debt: "#94A3B8",
};
const FALLBACK_COLOR = "#64748B";

const PREVIEW_LUMPSUM_DEFAULT = 250000;
const PREVIEW_MONTHLY_DEFAULT = 15000;

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

function fmt(v: number | null | undefined, suffix = ""): string {
    if (v == null) return "—";
    return `${v.toFixed(2)}${suffix}`;
}

export default function InvestmentsPreviewPage() {
    const palette = useAppTheme();
    const [mode, setMode] = useState<"lumpsum" | "sip">("lumpsum");
    const [isPremium, setIsPremium] = useState(true);
    const [expandedFund, setExpandedFund] = useState<number | null>(null);

    const { data, isLoading, error } = useMFRecommendations({
        lumpsum: PREVIEW_LUMPSUM_DEFAULT,
        monthlyAmount: PREVIEW_MONTHLY_DEFAULT,
    });

    if (isLoading) {
        return (
            <div style={{ minHeight: "100vh", background: palette.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center", fontFamily: "var(--font-display)" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", borderStyle: "solid", borderWidth: 3, borderTopColor: palette.accent, borderRightColor: "rgba(16,185,129,0.3)", borderBottomColor: "rgba(16,185,129,0.3)", borderLeftColor: "rgba(16,185,129,0.3)", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <p style={{ color: palette.mute }}>Loading preview...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div style={{ minHeight: "100vh", background: palette.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
                <div style={{ textAlign: "center", maxWidth: 480, fontFamily: "var(--font-display)" }}>
                    <AlertCircle size={32} style={{ color: palette.danger, marginBottom: 12 }} />
                    <p style={{ color: palette.txt, fontWeight: 600 }}>Couldn&apos;t load preview data</p>
                    <p style={{ color: palette.mute, fontSize: 13, marginTop: 6 }}>
                        {String((error as Error | undefined)?.message ?? "Try again in a moment.")}
                    </p>
                </div>
            </div>
        );
    }

    const buckets: MFBucket[] = data.buckets ?? [];
    const totalAmount = mode === "lumpsum" ? data.lumpsum : data.monthlyAmount;

    return (
        <div style={{ minHeight: "100vh", background: palette.bg, paddingBottom: 96 }}>
            {/* Preview banner */}
            <div style={{ background: "linear-gradient(90deg, rgba(245,158,11,0.12), rgba(234,88,12,0.06))", borderBottom: `1px solid ${palette.brd2}`, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "var(--font-display)", fontSize: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#FBBF24" }}>
                    <Sparkles size={14} />
                    <span style={{ fontWeight: 600 }}>Public preview · /preview/investments</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: palette.mute }}>View as:</span>
                    <button onClick={() => setIsPremium(false)} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: !isPremium ? palette.s3 : "transparent", color: !isPremium ? palette.txt : palette.mute, border: `1px solid ${palette.brd}`, cursor: "pointer", fontFamily: "var(--font-display)" }}>Free user</button>
                    <button onClick={() => setIsPremium(true)} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: isPremium ? "rgba(245,158,11,0.15)" : "transparent", color: isPremium ? "#FBBF24" : palette.mute, border: `1px solid ${isPremium ? "rgba(245,158,11,0.3)" : palette.brd}`, cursor: "pointer", fontFamily: "var(--font-display)" }}>Premium</button>
                </div>
            </div>

            <div style={{ width: "100%", maxWidth: 1152, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 24 }}>
                {/* Header */}
                <div>
                    <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, color: palette.mute, margin: 0, fontFamily: "var(--font-display)" }}>Dashboard · Investments</p>
                    <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.025em", color: palette.txt, margin: "4px 0 0", fontFamily: "var(--font-display)" }}>
                        Top quality funds in your bucket
                    </h1>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
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

                {/* Wealth toggle + allocation */}
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
                </div>

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

                {!isPremium && (
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

                <p style={{ textAlign: "center", fontSize: 11, color: palette.mute, fontFamily: "var(--font-display)", lineHeight: 1.6, marginTop: 8 }}>
                    Mutual fund investments are subject to market risks. Read all scheme-related documents carefully.
                    Past performance is not indicative of future returns. MyFinancial does not provide investment advice unless engaged in a paid advisory relationship.
                </p>
            </div>
        </div>
    );
}

function FundCard({ fund, isLocked, isOpen, onToggle, palette }: { fund: MFFund; isLocked: boolean; isOpen: boolean; onToggle: () => void; palette: ReturnType<typeof useAppTheme> }) {
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
                <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${palette.brd}`, paddingTop: 16, background: palette.bg, fontFamily: "var(--font-display)" }}>
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
