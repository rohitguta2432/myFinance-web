"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useBalanceSheetQuery } from "@/hooks/assessment/useBalanceSheet";
import { formatCurrency } from "@/lib/formatters";
import type { AssetItem, LiabilityItem } from "@/lib/assessment-api";

// Recharts must be loaded client-side only — crashes on SSR
const AreaChart = dynamic(() => import("recharts").then((m) => m.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then((m) => m.Area), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import("recharts").then((m) => m.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then((m) => m.Pie), { ssr: false });
const Cell = dynamic(() => import("recharts").then((m) => m.Cell), { ssr: false });

// Build 13-point (month 0-12) projection data
function buildProjectionData(
    totalAssets: number,
    totalLiabilities: number,
    totalMonthlyEMI: number
): Array<{ month: string; netWorth: number; assets: number; liabilities: number }> {
    const now = new Date();
    const points = [];
    for (let i = 0; i <= 12; i++) {
        // Assets grow at 8% p.a. compounded monthly
        const projectedAssets = totalAssets * Math.pow(1 + 0.08 / 12, i);
        // Liabilities decrease by EMI payments, floored at 0
        const projectedLiabilities = Math.max(0, totalLiabilities - totalMonthlyEMI * i);
        const projectedNetWorth = projectedAssets - projectedLiabilities;
        const monthDate = new Date(now.getFullYear(), now.getMonth() + i);
        const monthName = monthDate.toLocaleString("default", { month: "short" });
        const year = monthDate.getFullYear().toString().slice(2);
        points.push({
            month: i === 0 ? "Now" : `${monthName} '${year}`,
            netWorth: Math.round(projectedNetWorth),
            assets: Math.round(projectedAssets),
            liabilities: Math.round(projectedLiabilities),
        });
    }
    return points;
}

// Group items by category and sum amounts (works for both assets and liabilities)
function groupByCategory(
    items: Array<{ category: string; amount: number }>
): Array<{ category: string; amount: number; pct: number }> {
    const total = items.reduce((s, i) => s + i.amount, 0);
    const map: Record<string, number> = {};
    for (const item of items) {
        const cat = item.category || "Other";
        map[cat] = (map[cat] ?? 0) + item.amount;
    }
    return Object.entries(map)
        .map(([category, amount]) => ({
            category,
            amount,
            pct: total > 0 ? Math.round((amount / total) * 100) : 0,
        }))
        .sort((a, b) => b.amount - a.amount);
}

interface BreakdownTableProps {
    title: string;
    rows: Array<{ category: string; amount: number; pct: number }>;
    emptyText: string;
    pctColor: string;
    palette: ReturnType<typeof useAppTheme>;
}

function BreakdownTable({ title, rows, emptyText, pctColor, palette }: BreakdownTableProps) {
    return (
        <div style={{
            background: palette.s1,
            border: `1px solid ${palette.brd}`,
            borderRadius: 16,
            padding: "20px 24px",
            overflow: "hidden",
        }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: palette.txt, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {title}
            </h3>
            {rows.length === 0 ? (
                <p style={{ fontSize: 13, color: palette.mute, textAlign: "center", padding: "16px 0" }}>
                    {emptyText}
                </p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto auto",
                        gap: 12,
                        padding: "6px 10px",
                        borderBottom: `1px solid ${palette.brd}`,
                        marginBottom: 4,
                    }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: palette.mute, textTransform: "uppercase", letterSpacing: "0.07em" }}>Category</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: palette.mute, textTransform: "uppercase", letterSpacing: "0.07em", textAlign: "right" }}>Amount</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: palette.mute, textTransform: "uppercase", letterSpacing: "0.07em", textAlign: "right", minWidth: 36 }}>%</span>
                    </div>
                    {rows.map((row, i) => (
                        <div key={row.category} style={{
                            display: "grid",
                            gridTemplateColumns: "1fr auto auto",
                            gap: 12,
                            padding: "8px 10px",
                            borderRadius: 8,
                            background: i % 2 === 0 ? "transparent" : palette.s2,
                        }}>
                            <span style={{ fontSize: 13, color: palette.txt, fontWeight: 500, textTransform: "capitalize" }}>
                                {row.category.replace(/_/g, " ")}
                            </span>
                            <span style={{ fontSize: 13, color: palette.txt2, fontWeight: 600, textAlign: "right" }}>
                                {formatCurrency(row.amount, true)}
                            </span>
                            <span style={{ fontSize: 13, color: pctColor, fontWeight: 700, textAlign: "right", minWidth: 36 }}>
                                {row.pct}%
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function NetWorthPage() {
    const palette = useAppTheme();
    const { data: balanceSheet, isLoading } = useBalanceSheetQuery();

    // --- Loading state ---
    if (isLoading) {
        return (
            <div style={{ padding: "32px 24px", fontFamily: "var(--font-display)" }}>
                <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
                <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 960, margin: "0 auto" }}>
                    {[120, 200, 300].map((h, i) => (
                        <div key={i} style={{
                            height: h, borderRadius: 16,
                            backgroundImage: `linear-gradient(90deg, ${palette.s1} 25%, ${palette.s2} 50%, ${palette.s1} 75%)`,
                            backgroundSize: "200% 100%",
                            animation: "shimmer 1.4s ease infinite",
                            animationDelay: `${i * 0.1}s`,
                        }} />
                    ))}
                </div>
            </div>
        );
    }

    const assets: AssetItem[] = balanceSheet?.assets ?? [];
    const liabilities: LiabilityItem[] = balanceSheet?.liabilities ?? [];

    // --- Empty state ---
    if (assets.length === 0 && liabilities.length === 0) {
        return (
            <div style={{
                padding: "64px 24px",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                textAlign: "center", fontFamily: "var(--font-display)",
                minHeight: "60vh",
            }}>
                <div style={{ opacity: 0.4, marginBottom: 20 }}>
                    <Wallet size={64} style={{ color: palette.mute }} />
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: palette.txt, marginBottom: 10 }}>
                    No assets or liabilities recorded
                </h2>
                <p style={{ fontSize: 15, color: palette.mute, marginBottom: 28, maxWidth: 340, lineHeight: 1.6 }}>
                    Complete your financial assessment to see net worth analysis.
                </p>
                <Link href="/assessment/assets-liabilities" style={{
                    display: "inline-block",
                    background: "#10B981",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 15,
                    padding: "12px 24px",
                    borderRadius: 12,
                    textDecoration: "none",
                    fontFamily: "var(--font-display)",
                    transition: "opacity 0.15s",
                }}>
                    Add Assets
                </Link>
            </div>
        );
    }

    // Compute summary values
    const totalAssets = assets.reduce((s, a) => s + a.amount, 0);
    const totalLiabilities = liabilities.reduce((s, l) => s + l.amount, 0);
    const netWorth = totalAssets - totalLiabilities;
    const totalMonthlyEMI = liabilities.reduce((s, l) => s + (l.emi ?? 0), 0);

    const isPositive = netWorth >= 0;

    // Donut chart data
    const donutData = [
        { name: "Assets", value: totalAssets },
        { name: "Liabilities", value: totalLiabilities },
    ];
    const DONUT_COLORS = ["#10B981", "#F87171"];

    // Category breakdown
    const assetCategoryRows = groupByCategory(assets);
    const liabilityCategoryRows = groupByCategory(liabilities);

    // Projection chart data
    const projectionData = buildProjectionData(totalAssets, totalLiabilities, totalMonthlyEMI);

    return (
        <div style={{ padding: "32px 24px", fontFamily: "var(--font-display)", maxWidth: 960, margin: "0 auto" }}>
            <style>{`
                @media (max-width: 767px) {
                    .nw-grid { grid-template-columns: 1fr !important; }
                    .nw-stats { grid-template-columns: 1fr !important; }
                }
                @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
            `}</style>

            {/* Page heading */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: palette.txt, marginBottom: 4 }}>
                    Net Worth
                </h1>
                <p style={{ fontSize: 14, color: palette.mute }}>
                    Your current financial position and 12-month trajectory.
                </p>
            </div>

            {/* Summary card */}
            <div style={{
                background: palette.s1,
                border: `1px solid ${palette.brd}`,
                borderRadius: 16,
                padding: "24px 28px",
                marginBottom: 24,
            }}>
                <div className="nw-stats" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 20,
                }}>
                    {/* Total Assets */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                            <ArrowUpRight size={16} style={{ color: "#10B981" }} />
                            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: palette.mute }}>
                                Total Assets
                            </span>
                        </div>
                        <div style={{ fontSize: 26, fontWeight: 800, color: "#10B981", lineHeight: 1 }}>
                            {formatCurrency(totalAssets, true)}
                        </div>
                        <div style={{ fontSize: 12, color: palette.mute, marginTop: 4 }}>
                            {assets.length} item{assets.length !== 1 ? "s" : ""}
                        </div>
                    </div>

                    {/* Total Liabilities */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                            <ArrowDownRight size={16} style={{ color: "#F87171" }} />
                            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: palette.mute }}>
                                Total Liabilities
                            </span>
                        </div>
                        <div style={{ fontSize: 26, fontWeight: 800, color: "#F87171", lineHeight: 1 }}>
                            {formatCurrency(totalLiabilities, true)}
                        </div>
                        <div style={{ fontSize: 12, color: palette.mute, marginTop: 4 }}>
                            {liabilities.length} item{liabilities.length !== 1 ? "s" : ""}
                        </div>
                    </div>

                    {/* Net Worth */}
                    <div style={{
                        padding: "16px 20px",
                        borderRadius: 12,
                        background: isPositive ? "rgba(16,185,129,0.08)" : "rgba(248,113,113,0.08)",
                        border: `1px solid ${isPositive ? "rgba(16,185,129,0.2)" : "rgba(248,113,113,0.2)"}`,
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                            <TrendingUp size={16} style={{ color: isPositive ? "#10B981" : "#F87171" }} />
                            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: palette.mute }}>
                                Net Worth
                            </span>
                        </div>
                        <div style={{ fontSize: 26, fontWeight: 800, color: isPositive ? "#10B981" : "#F87171", lineHeight: 1 }}>
                            {isPositive ? "" : "-"}{formatCurrency(Math.abs(netWorth), true)}
                        </div>
                        <div style={{ fontSize: 12, color: palette.mute, marginTop: 4 }}>
                            Assets − Liabilities
                        </div>
                    </div>
                </div>
            </div>

            {/* Two-column grid: left = donut + table, right = projection chart */}
            <div className="nw-grid" style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.4fr",
                gap: 20,
                alignItems: "start",
            }}>
                {/* Left column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Asset vs Liability donut */}
                    <div style={{
                        background: palette.s1,
                        border: `1px solid ${palette.brd}`,
                        borderRadius: 16,
                        padding: "20px 24px",
                    }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: palette.txt, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            Asset vs Liability
                        </h3>
                        <div style={{ height: 200, position: "relative" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={donutData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={80}
                                        paddingAngle={3}
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={-270}
                                    >
                                        {donutData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={DONUT_COLORS[index]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: palette.s1,
                                            border: `1px solid ${palette.brd2}`,
                                            borderRadius: 8,
                                            fontFamily: "var(--font-display)",
                                            fontSize: 12,
                                        }}
                                        formatter={(value: unknown) => [formatCurrency(Number(value), true), ""]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center label */}
                            <div style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                textAlign: "center",
                                pointerEvents: "none",
                            }}>
                                <div style={{ fontSize: 13, fontWeight: 800, color: isPositive ? "#10B981" : "#F87171", lineHeight: 1 }}>
                                    {formatCurrency(Math.abs(netWorth), true)}
                                </div>
                                <div style={{ fontSize: 10, color: palette.mute, marginTop: 3 }}>net worth</div>
                            </div>
                        </div>
                        {/* Legend */}
                        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 8 }}>
                            {donutData.map((d, i) => (
                                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <div style={{ width: 10, height: 10, borderRadius: 2, background: DONUT_COLORS[i] }} />
                                    <span style={{ fontSize: 11, color: palette.mute }}>{d.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Asset breakdown table */}
                    <BreakdownTable
                        title="Asset Breakdown"
                        rows={assetCategoryRows}
                        emptyText="No assets recorded"
                        pctColor="#10B981"
                        palette={palette}
                    />

                    {/* Liability breakdown table */}
                    <BreakdownTable
                        title="Liabilities Breakdown"
                        rows={liabilityCategoryRows}
                        emptyText="No liabilities recorded"
                        pctColor="#F87171"
                        palette={palette}
                    />
                </div>

                {/* Right column: 12-month projection chart */}
                <div style={{
                    background: palette.s1,
                    border: `1px solid ${palette.brd}`,
                    borderRadius: 16,
                    padding: "20px 24px",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                        <TrendingUp size={16} style={{ color: palette.accent }} />
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: palette.txt, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            12-Month Projection
                        </h3>
                    </div>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={projectionData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="nw-grad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 10, fill: palette.mute, fontFamily: "var(--font-display)" }}
                                    axisLine={false}
                                    tickLine={false}
                                    interval={2}
                                />
                                <YAxis
                                    tickFormatter={(v) => formatCurrency(Number(v), true)}
                                    tick={{ fontSize: 10, fill: palette.mute, fontFamily: "var(--font-display)" }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={60}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: palette.s1,
                                        border: `1px solid ${palette.brd2}`,
                                        borderRadius: 8,
                                        fontFamily: "var(--font-display)",
                                        fontSize: 12,
                                    }}
                                    labelStyle={{ color: palette.mute, marginBottom: 4 }}
                                    formatter={(value: unknown) => [formatCurrency(Number(value), true), ""]}
                                    labelFormatter={(label) => String(label)}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="netWorth"
                                    name="Net Worth"
                                    stroke="#10B981"
                                    strokeWidth={2.5}
                                    fill="url(#nw-grad)"
                                    dot={false}
                                    activeDot={{ r: 5, fill: "#10B981" }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <p style={{ fontSize: 11, color: palette.mute, marginTop: 12, fontStyle: "italic", lineHeight: 1.5 }}>
                        Projected based on current portfolio and EMI schedule. Assets grow at 8% p.a.;
                        liabilities reduce by monthly EMI payments.
                    </p>
                </div>
            </div>
        </div>
    );
}
