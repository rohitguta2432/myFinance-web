"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
    Target, Home, GraduationCap, Plane, Shield, Heart, Baby, Briefcase,
    ChevronDown, ChevronUp, TrendingUp,
} from "lucide-react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useGoalsQuery } from "@/hooks/assessment/useGoals";
import { useGoalProjectionQuery } from "@/hooks/assessment/useGoalProjection";
import { formatCurrency } from "@/lib/formatters";
import type { GoalAPIItem, GoalProjection } from "@/lib/assessment-api";

// Recharts must be loaded client-side only — crashes on SSR
const AreaChart = dynamic(() => import("recharts").then((m) => m.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then((m) => m.Area), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), { ssr: false });

// Goal type → Lucide icon
const GOAL_ICON_MAP: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
    house: Home,
    property: Home,
    education: GraduationCap,
    travel: Plane,
    emergency: Shield,
    wedding: Heart,
    child: Baby,
    retirement: Briefcase,
};

function getGoalIcon(type: string) {
    const normalized = type.toLowerCase();
    for (const [key, Icon] of Object.entries(GOAL_ICON_MAP)) {
        if (normalized.includes(key)) return Icon;
    }
    return Target;
}

// Feasibility color based on progressPercent
function feasibilityColor(pct: number | null): string {
    if (pct == null) return "#64748B"; // gray — no projection data
    if (pct > 80) return "#10B981";   // green — on track
    if (pct >= 50) return "#FBBF24";  // yellow — at risk
    return "#F87171";                  // red — behind
}

// Importance sort order
const IMPORTANCE_ORDER: Record<string, number> = { High: 0, Medium: 1, Low: 2 };

interface GoalProjectionItem {
    id: string;
    bufferedCost: number;
    currentSavings: number;
    requiredSip: number;
    progressPercent: number;
}

// Generate chart data points from year 0 to horizon (max 50 per T-10-02 DoS mitigation)
function buildChartData(
    currentSavings: number,
    requiredSip: number,
    bufferedCost: number,
    horizon: number
): Array<{ year: number; projected: number; target: number }> {
    const years = Math.min(horizon, 50);
    const ANNUAL_RETURN = 0.12;
    const points: Array<{ year: number; projected: number; target: number }> = [];
    let value = currentSavings;
    for (let y = 0; y <= years; y++) {
        points.push({ year: y, projected: Math.round(value), target: Math.round(bufferedCost) });
        if (y < years) {
            // Compound savings + monthly SIP over the year
            value = value * (1 + ANNUAL_RETURN) + requiredSip * 12;
        }
    }
    return points;
}

interface GoalCardProps {
    goal: GoalAPIItem;
    projItem: GoalProjectionItem | null;
}

function GoalCard({ goal, projItem }: GoalCardProps) {
    const palette = useAppTheme();
    const [expanded, setExpanded] = useState(false);

    const Icon = getGoalIcon(goal.type);
    const progressPct = projItem ? projItem.progressPercent : null;
    const barColor = feasibilityColor(progressPct);

    // Use projection data if available, fall back to raw fields
    const currentSavings = projItem?.currentSavings ?? goal.currentSavings;
    const bufferedCost = projItem?.bufferedCost ?? goal.cost;
    const requiredSip = projItem?.requiredSip ?? 0;

    // Fallback progress width when no projection
    const barWidthPct = projItem != null
        ? Math.min(100, projItem.progressPercent)
        : Math.min(100, bufferedCost > 0 ? (currentSavings / bufferedCost) * 100 : 0);

    const importanceColors: Record<string, string> = {
        High: "#F87171",
        Medium: "#FBBF24",
        Low: palette.mute,
    };
    const importanceColor = importanceColors[goal.importance] ?? palette.mute;

    const chartData = projItem
        ? buildChartData(currentSavings, requiredSip, bufferedCost, goal.horizon)
        : [];

    return (
        <div
            style={{
                background: palette.s1,
                border: `1px solid ${palette.brd2}`,
                borderRadius: 16,
                padding: 20,
                cursor: "pointer",
                transition: "border-color 0.15s",
            }}
            onClick={() => setExpanded((p) => !p)}
        >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: `${barColor}22`,
                    border: `1px solid ${barColor}44`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                    <Icon size={20} style={{ color: barColor }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{
                            fontSize: 15, fontWeight: 700, color: palette.txt,
                            fontFamily: "var(--font-display)", lineHeight: 1.2,
                        }}>
                            {goal.name}
                        </span>
                        <span style={{
                            fontSize: 11, fontWeight: 700, padding: "2px 8px",
                            borderRadius: 20, background: `${importanceColor}22`,
                            color: importanceColor, textTransform: "capitalize",
                            fontFamily: "var(--font-display)", letterSpacing: "0.03em",
                        }}>
                            {goal.importance}
                        </span>
                    </div>
                    <span style={{
                        fontSize: 12, color: palette.mute,
                        fontFamily: "var(--font-display)", textTransform: "capitalize",
                    }}>
                        {goal.type}
                    </span>
                </div>
                {expanded
                    ? <ChevronUp size={18} style={{ color: palette.mute, flexShrink: 0 }} />
                    : <ChevronDown size={18} style={{ color: palette.mute, flexShrink: 0 }} />
                }
            </div>

            {/* Progress bar */}
            <div style={{
                width: "100%", height: 8, borderRadius: 4,
                background: palette.brd2, marginBottom: 12, overflow: "hidden",
            }}>
                <div style={{
                    height: "100%", borderRadius: 4,
                    width: `${barWidthPct}%`,
                    background: barColor,
                    transition: "width 0.4s ease",
                }} />
            </div>

            {/* Stats row */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 8,
            }}>
                {[
                    { label: "Saved", value: formatCurrency(currentSavings, true) },
                    { label: "Target", value: formatCurrency(bufferedCost, true) },
                    { label: "SIP/mo", value: formatCurrency(requiredSip, true) },
                    { label: "Time", value: `${goal.horizon} yr${goal.horizon !== 1 ? "s" : ""}` },
                ].map((stat) => (
                    <div key={stat.label} style={{ textAlign: "center" }}>
                        <div style={{
                            fontSize: 13, fontWeight: 700, color: palette.txt,
                            fontFamily: "var(--font-display)",
                        }}>
                            {stat.value}
                        </div>
                        <div style={{
                            fontSize: 10, color: palette.mute,
                            fontFamily: "var(--font-display)", textTransform: "uppercase",
                            letterSpacing: "0.05em", marginTop: 2,
                        }}>
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Expanded projection chart */}
            {expanded && projItem && chartData.length > 1 && (
                <div style={{ marginTop: 20, borderTop: `1px solid ${palette.brd}`, paddingTop: 16 }}>
                    <div style={{
                        display: "flex", alignItems: "center", gap: 6, marginBottom: 12,
                    }}>
                        <TrendingUp size={14} style={{ color: palette.accent }} />
                        <span style={{
                            fontSize: 12, fontWeight: 700, color: palette.txt2,
                            fontFamily: "var(--font-display)", textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}>
                            Projected Growth
                        </span>
                    </div>
                    <div style={{ height: 200 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id={`grad-${goal.id}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id={`grad-target-${goal.id}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#FBBF24" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="year"
                                    tick={{ fontSize: 11, fill: palette.mute, fontFamily: "var(--font-display)" }}
                                    label={{ value: "Year", position: "insideBottomRight", offset: -4, fontSize: 11, fill: palette.mute }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tickFormatter={(v) => formatCurrency(Number(v), true)}
                                    tick={{ fontSize: 10, fill: palette.mute, fontFamily: "var(--font-display)" }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={56}
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
                                    formatter={(value) => [formatCurrency(Number(value), true), ""]}
                                    labelFormatter={(label) => `Year ${label}`}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="projected"
                                    name="Projected"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    fill={`url(#grad-${goal.id})`}
                                    dot={false}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="target"
                                    name="Target"
                                    stroke="#FBBF24"
                                    strokeWidth={1.5}
                                    strokeDasharray="4 4"
                                    fill={`url(#grad-target-${goal.id})`}
                                    dot={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Expanded with no projection data — informational note */}
            {expanded && !projItem && (
                <div style={{
                    marginTop: 16, borderTop: `1px solid ${palette.brd}`, paddingTop: 12,
                    fontSize: 12, color: palette.mute, fontFamily: "var(--font-display)",
                    textAlign: "center",
                }}>
                    Complete your financial assessment to see projection charts.
                </div>
            )}
        </div>
    );
}

export default function GoalsDashboardPage() {
    const palette = useAppTheme();
    const { data: goals, isLoading: goalsLoading } = useGoalsQuery();
    const { data: projection } = useGoalProjectionQuery();

    const isLoading = goalsLoading;

    if (isLoading) {
        return (
            <div style={{ padding: "32px 24px", fontFamily: "var(--font-display)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 960, margin: "0 auto" }}>
                    <div style={{
                        height: 100, borderRadius: 16,
                        backgroundImage: `linear-gradient(90deg, ${palette.s1} 25%, ${palette.s2} 50%, ${palette.s1} 75%)`,
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.4s ease infinite",
                    }} />
                    {[0, 1, 2].map((i) => (
                        <div key={i} style={{
                            height: 160, borderRadius: 16,
                            backgroundImage: `linear-gradient(90deg, ${palette.s1} 25%, ${palette.s2} 50%, ${palette.s1} 75%)`,
                            backgroundSize: "200% 100%",
                            animation: "shimmer 1.4s ease infinite",
                            animationDelay: `${i * 0.1}s`,
                        }} />
                    ))}
                    <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
                </div>
            </div>
        );
    }

    const goalsList = goals ?? [];

    // Empty state
    if (goalsList.length === 0) {
        return (
            <div style={{
                padding: "64px 24px",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                textAlign: "center", fontFamily: "var(--font-display)",
                minHeight: "60vh",
            }}>
                <div style={{ opacity: 0.4, marginBottom: 20 }}>
                    <Target size={64} style={{ color: palette.mute }} />
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: palette.txt, marginBottom: 10 }}>
                    No financial goals yet
                </h2>
                <p style={{ fontSize: 15, color: palette.mute, marginBottom: 28, maxWidth: 340, lineHeight: 1.6 }}>
                    Set your first financial goal to start tracking progress toward your dreams.
                </p>
                <Link href="/assessment/goals" style={{
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
                    Set Goals
                </Link>
            </div>
        );
    }

    // Build projection lookup
    const projLookup = new Map<string, GoalProjectionItem>(
        (projection as GoalProjection | undefined)?.goals?.map((p) => [p.id, p]) ?? []
    );

    // Summary stats
    const totalGoals = goalsList.length;
    const onTrackCount = goalsList.filter((g) => {
        const p = projLookup.get(g.id);
        return p ? p.progressPercent > 80 : false;
    }).length;
    const atRiskCount = goalsList.filter((g) => {
        const p = projLookup.get(g.id);
        return p ? p.progressPercent >= 50 && p.progressPercent <= 80 : false;
    }).length;
    const totalSip = (projection as GoalProjection | undefined)?.totalSipRequired ?? 0;

    // Sort: High importance first, then by progressPercent ascending (most urgent on top)
    const sortedGoals = [...goalsList].sort((a, b) => {
        const impA = IMPORTANCE_ORDER[a.importance] ?? 99;
        const impB = IMPORTANCE_ORDER[b.importance] ?? 99;
        if (impA !== impB) return impA - impB;
        const pA = projLookup.get(a.id)?.progressPercent ?? 0;
        const pB = projLookup.get(b.id)?.progressPercent ?? 0;
        return pA - pB;
    });

    const summaryStats = [
        { label: "Total Goals", value: String(totalGoals), color: palette.txt },
        { label: "On Track", value: String(onTrackCount), color: "#10B981" },
        { label: "At Risk", value: String(atRiskCount), color: "#FBBF24" },
        { label: "Total Monthly SIP", value: formatCurrency(totalSip, true), color: palette.accent },
    ];

    return (
        <div style={{ padding: "32px 24px", fontFamily: "var(--font-display)", maxWidth: 960, margin: "0 auto" }}>
            <style>{`
                @media (max-width: 767px) {
                    .goals-grid { grid-template-columns: 1fr !important; }
                    .goals-stats { grid-template-columns: repeat(2, 1fr) !important; }
                }
            `}</style>

            {/* Page heading */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: palette.txt, marginBottom: 4 }}>
                    Goal Progress
                </h1>
                <p style={{ fontSize: 14, color: palette.mute }}>
                    Track how each financial goal is progressing toward its target.
                </p>
            </div>

            {/* Summary stats strip */}
            <div className="goals-stats" style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 12,
                marginBottom: 24,
            }}>
                {summaryStats.map((stat) => (
                    <div key={stat.label} style={{
                        background: palette.s1,
                        border: `1px solid ${palette.brd}`,
                        borderRadius: 12,
                        padding: "16px 14px",
                        textAlign: "center",
                    }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: stat.color, lineHeight: 1 }}>
                            {stat.value}
                        </div>
                        <div style={{
                            fontSize: 11, color: palette.mute, marginTop: 4,
                            textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600,
                        }}>
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Goal cards grid */}
            <div className="goals-grid" style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 16,
            }}>
                {sortedGoals.map((goal) => (
                    <GoalCard
                        key={goal.id}
                        goal={goal}
                        projItem={projLookup.get(goal.id) ?? null}
                    />
                ))}
            </div>
        </div>
    );
}
