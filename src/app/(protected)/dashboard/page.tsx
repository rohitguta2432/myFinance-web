"use client";

import { useState } from "react";
import { Lock, AlertTriangle, XCircle, Info, ChevronRight, Wallet, PiggyBank, BarChart3, Footprints, Map, Target, PieChart, Smile, ShieldCheck, Calculator, Flame } from "lucide-react";
import { useFinancialHealthScore } from "@/hooks/dashboard/useFinancialHealthScore";
import { useHookText } from "@/hooks/dashboard/useHookText";
import { useRedFlags } from "@/hooks/dashboard/useRedFlags";
import { usePriorityActions } from "@/hooks/dashboard/usePriorityActions";
import { ScoreRing } from "@/components/dashboard/ScoreRing";
import { PillarInterpretationCard } from "@/components/dashboard/PillarInterpretationCard";
import { BenchmarkComparison } from "@/components/dashboard/BenchmarkComparison";
import { ExcessReallocationCard } from "@/components/dashboard/ExcessReallocationCard";
import { LockedPremiumInsights } from "@/components/dashboard/LockedPremiumInsights";
import { FinancialTimeMachine } from "@/components/dashboard/FinancialTimeMachine";
import { SectionNav } from "@/components/dashboard/SectionNav";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useBadges } from "@/hooks/gamification/useBadges";

const DASHBOARD_SECTIONS = [
  { id: "snapshot", label: "Snapshot" },
  { id: "badges", label: "Badges" },
  { id: "score", label: "Health Score" },
  { id: "projections", label: "Projections" },
  { id: "red-flags", label: "Red Flags" },
  { id: "actions", label: "Actions" },
  { id: "benchmarks", label: "Benchmarks" },
  { id: "premium", label: "Premium" },
];

const FREE_FLAGS_LIMIT = 1;
const FREE_ACTIONS_LIMIT = 3;


function formatInLakh(v: number): string {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)} L`;
  return `₹${Math.round(v).toLocaleString("en-IN")}`;
}

const BADGE_ICONS: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  Footprints, Map, Target, PieChart, Smile, ShieldCheck, Calculator, Flame,
};

const BADGE_COLORS: Record<string, string> = {
  "first-steps": "#3B82F6",
  "money-map": "#8B5CF6",
  "goal-setter": "#F59E0B",
  "diversified": "#06B6D4",
  "debt-free": "#10B981",
  "protected": "#EC4899",
  "tax-smart": "#F97316",
  "streak-master": "#EF4444",
};

export default function DashboardSummaryPage() {
  const palette = useAppTheme();
  const { totalScore, scoreLabel, sortedPillars, mostCritical, rawData, isLoading } = useFinancialHealthScore();
  const hookTexts = useHookText(sortedPillars, rawData);
  const { allFlags, totalTriggered: flagsTriggered } = useRedFlags();
  const { allActions, totalTriggered: actionsTriggered } = usePriorityActions();
  const badges = useBadges();
  const [activeBadgeTooltip, setActiveBadgeTooltip] = useState<string | null>(null);

  const isPremium = typeof window !== "undefined"
    ? localStorage.getItem("myfinancial_premium") === "true"
    : false;

  const visibleFlags = isPremium ? allFlags : allFlags.slice(0, FREE_FLAGS_LIMIT);
  const lockedFlags = isPremium ? [] : allFlags.slice(FREE_FLAGS_LIMIT);
  const visibleActions = isPremium ? allActions : allActions.slice(0, FREE_ACTIONS_LIMIT);
  const lockedActions = isPremium ? [] : allActions.slice(FREE_ACTIONS_LIMIT);

  const netWorth = Number((rawData as Record<string, unknown>)?.netWorth) || 0;
  const monthlySurplus = Number((rawData as Record<string, unknown>)?.monthlySurplus) || 0;
  const savingsRate = Number((rawData as Record<string, unknown>)?.savingsRate) || 0;

  if (isLoading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid rgba(16,185,129,0.3)", borderTopColor: "#10B981", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: palette.mute, fontFamily: "var(--font-display)" }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SectionNav sections={DASHBOARD_SECTIONS} />
      <div style={{ width: "100%", maxWidth: 1152, margin: "0 auto", padding: "24px 24px 96px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Greeting */}
        <div id="snapshot">
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em", color: palette.txt, margin: 0, fontFamily: "var(--font-display)" }}>Your Financial Snapshot</h2>
        </div>

        {/* Quick Stats Strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {[
            { label: "Net Worth", value: formatInLakh(netWorth), icon: Wallet, color: netWorth > 0 ? "#10B981" : "#F87171" },
            { label: "Monthly Surplus", value: formatInLakh(monthlySurplus), icon: PiggyBank, color: monthlySurplus > 0 ? "#10B981" : "#F87171" },
            { label: "Savings Rate", value: `${Number(savingsRate).toFixed(0)}%`, icon: BarChart3, color: savingsRate >= 20 ? "#10B981" : savingsRate >= 10 ? "#FBBF24" : "#F87171" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} style={{ background: palette.s1, borderRadius: 12, border: `1px solid ${palette.brd}`, padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: palette.brd, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={16} style={{ color: stat.color }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 11, color: palette.mute, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, margin: 0, fontFamily: "var(--font-display)" }}>{stat.label}</p>
                  <p style={{ fontSize: 18, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: stat.color, margin: 0, fontFamily: "var(--font-display)" }}>{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Achievements — minimal inline row */}
        <div id="badges" style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px", background: palette.s1, borderRadius: 12, border: `1px solid ${palette.brd}` }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: palette.mute, textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap", fontFamily: "var(--font-display)" }}>
            {badges.totalEarned}/{badges.totalBadges}
          </span>
          <div style={{ display: "flex", gap: 6, flex: 1, overflowX: "auto" }}>
            {badges.definitions.map((badge) => {
              const isEarned = badges.earned.includes(badge.id);
              const IconComponent = BADGE_ICONS[badge.icon];
              const color = BADGE_COLORS[badge.id] || "#94A3B8";
              const isTooltipOpen = activeBadgeTooltip === badge.id;
              return (
                <div key={badge.id} style={{ position: "relative", flexShrink: 0 }}>
                  <button
                    onClick={() => setActiveBadgeTooltip(isTooltipOpen ? null : badge.id)}
                    aria-label={`${badge.name}${isEarned ? " — earned" : " — locked"}`}
                    title={badge.name}
                    style={{
                      width: 44, height: 44, borderRadius: 10,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: isEarned ? `${color}15` : palette.brd,
                      border: `1.5px solid ${isEarned ? `${color}50` : "transparent"}`,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      padding: 0,
                    }}
                  >
                    {IconComponent && (
                      <IconComponent size={16} style={{ color: isEarned ? color : palette.mute, opacity: isEarned ? 1 : 0.3 }} />
                    )}
                  </button>
                  {isTooltipOpen && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
                      width: 180, background: palette.bg, border: `1px solid ${palette.brd}`,
                      borderRadius: 10, padding: 10, zIndex: 10,
                      boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
                    }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: isEarned ? color : palette.mute, margin: "0 0 4px", fontFamily: "var(--font-display)" }}>{badge.name}</p>
                      <p style={{ fontSize: 11, color: palette.mute, margin: 0, lineHeight: 1.4, fontFamily: "var(--font-display)" }}>
                        {isEarned ? badge.description : badge.howToEarn}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Score Overview */}
        <div id="score" style={{ background: palette.s1, borderRadius: 24, padding: 24, border: `1px solid ${palette.brd}`, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          <style>{`
            @media (min-width: 1024px) { .score-inner { flex-direction: row !important; } .score-divider-h { display: none !important; } .score-divider-v { display: block !important; } }
          `}</style>
          <div className="score-inner" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Left: Score Ring */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: palette.mute, margin: 0, fontFamily: "var(--font-display)" }}>Financial Health Score</p>
              <ScoreRing score={totalScore} label={scoreLabel.label} color={scoreLabel.color} />
              {mostCritical && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", padding: "6px 12px", borderRadius: 8 }}>
                  <AlertTriangle size={16} style={{ color: "#F87171", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: palette.txt2, lineHeight: 1.4, fontFamily: "var(--font-display)" }}>
                    <span style={{ color: "#F87171", fontWeight: 700 }}>RISK:</span> {mostCritical.name}
                  </span>
                </div>
              )}
            </div>

            {/* Vertical divider (desktop) */}
            <div className="score-divider-v" style={{ display: "none", width: 1, background: palette.brd, alignSelf: "stretch" }} />
            {/* Horizontal divider (mobile) */}
            <div className="score-divider-h" style={{ height: 1, background: palette.brd, width: "100%" }} />

            {/* Right: Pillar Breakdown */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: palette.mute, margin: 0, fontFamily: "var(--font-display)" }}>Health Pillars</h3>
                <span style={{ fontSize: 13, color: palette.mute, fontFamily: "var(--font-display)" }}>Tap a pillar for insights</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sortedPillars.map((p, i) => (
                  <PillarInterpretationCard
                    key={p.id}
                    pillar={p}
                    hookData={hookTexts[p.id]}
                    index={i}
                    isWorst={i === 0}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Financial Time Machine */}
        <div id="projections">
          <FinancialTimeMachine isPremium={isPremium} />
        </div>

        {/* Red Flags */}
        {allFlags.length > 0 && (
          <div id="red-flags">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: palette.mute, margin: 0, fontFamily: "var(--font-display)" }}>
                Red Flags ({flagsTriggered})
              </h3>
              {!isPremium && flagsTriggered > FREE_FLAGS_LIMIT && (
                <span style={{ fontSize: 12, color: "#FBBF24", fontWeight: 600, fontFamily: "var(--font-display)" }}>{flagsTriggered - FREE_FLAGS_LIMIT} locked</span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {visibleFlags.map((flag) => {
                const sevStyles = {
                  CRITICAL: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", badge: "#EF4444", text: "#F87171", Icon: XCircle },
                  WARNING: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", badge: "#F59E0B", text: "#FBBF24", Icon: AlertTriangle },
                  INFO: { bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", badge: "#3B82F6", text: "#60A5FA", Icon: Info },
                };
                const s = sevStyles[(flag.severity as keyof typeof sevStyles)] || sevStyles.WARNING;
                const Icon = s.Icon;
                return (
                  <div key={flag.id} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: 16 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: palette.brd, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                        <Icon size={16} style={{ color: s.text }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                          <span style={{ padding: "2px 8px", background: s.badge, fontSize: 11, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em", borderRadius: 99, fontFamily: "var(--font-display)" }}>
                            {flag.severity}
                          </span>
                          <h4 style={{ fontSize: 17, fontWeight: 700, color: palette.txt, margin: 0, fontFamily: "var(--font-display)" }}>{flag.title}</h4>
                        </div>
                        <p style={{ fontSize: 15, color: palette.mute, lineHeight: 1.6, margin: 0, marginBottom: 8, fontFamily: "var(--font-display)" }}>{flag.explanation}</p>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: palette.brd, borderRadius: 8, padding: "8px 12px" }}>
                          <span style={{ fontSize: 15, marginTop: 2 }}>📌</span>
                          <p style={{ fontSize: 13, color: palette.txt2, lineHeight: 1.5, margin: 0, fontFamily: "var(--font-display)" }}>{flag.action}</p>
                        </div>
                        {flag.impact > 0 && (
                          <p style={{ fontSize: 13, color: palette.mute, marginTop: 8, fontFamily: "var(--font-display)" }}>
                            Financial impact: <span style={{ fontWeight: 600, color: s.text }}>{formatInLakh(flag.impact)}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Locked flags */}
              {lockedFlags.map((flag) => {
                const sevStyles = {
                  CRITICAL: { bg: "rgba(239,68,68,0.05)", border: "rgba(239,68,68,0.1)", badge: "#EF4444", text: "#F87171", Icon: XCircle },
                  WARNING: { bg: "rgba(245,158,11,0.05)", border: "rgba(245,158,11,0.1)", badge: "#F59E0B", text: "#FBBF24", Icon: AlertTriangle },
                  INFO: { bg: "rgba(59,130,246,0.05)", border: "rgba(59,130,246,0.1)", badge: "#3B82F6", text: "#60A5FA", Icon: Info },
                };
                const s = sevStyles[(flag.severity as keyof typeof sevStyles)] || sevStyles.WARNING;
                const Icon = s.Icon;
                return (
                  <div key={flag.id} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: 16, position: "relative", overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: palette.brd, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                        <Icon size={16} style={{ color: s.text }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                          <span style={{ padding: "2px 8px", background: s.badge, fontSize: 11, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em", borderRadius: 99, fontFamily: "var(--font-display)" }}>
                            {flag.severity}
                          </span>
                          <h4 style={{ fontSize: 17, fontWeight: 700, color: palette.txt, margin: 0, fontFamily: "var(--font-display)" }}>{flag.title}</h4>
                        </div>
                        <div style={{ filter: "blur(6px)", userSelect: "none", pointerEvents: "none" }}>
                          <p style={{ fontSize: 15, color: palette.mute, lineHeight: 1.6, fontFamily: "var(--font-display)" }}>{flag.explanation}</p>
                        </div>
                      </div>
                      <Lock size={16} style={{ color: "rgba(245,158,11,0.6)", flexShrink: 0, marginTop: 4 }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {lockedFlags.length > 0 && (
              <div style={{ marginTop: 12, background: "linear-gradient(135deg, rgba(245,158,11,0.05), rgba(234,88,12,0.05))", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 12, padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Lock size={20} style={{ color: "#FBBF24" }} />
                  <span style={{ fontSize: 13, color: palette.mute, fontFamily: "var(--font-display)" }}>Unlock all {flagsTriggered} red flags with detailed action plans</span>
                </div>
                <span style={{ fontSize: 13, color: "#FBBF24", fontWeight: 700, whiteSpace: "nowrap", fontFamily: "var(--font-display)" }}>Upgrade →</span>
              </div>
            )}
          </div>
        )}

        {/* Priority Actions */}
        {allActions.length > 0 && (
          <div id="actions">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: palette.mute, margin: 0, fontFamily: "var(--font-display)" }}>
                Priority Actions ({actionsTriggered})
              </h3>
              {!isPremium && actionsTriggered > FREE_ACTIONS_LIMIT && (
                <span style={{ fontSize: 12, color: "#FBBF24", fontWeight: 600, fontFamily: "var(--font-display)" }}>{actionsTriggered - FREE_ACTIONS_LIMIT} locked</span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {visibleActions.map((act, i) => (
                <div key={act.id} style={{ background: palette.s1, border: `1px solid ${palette.brd}`, borderRadius: 12, padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                      {act.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ padding: "2px 8px", background: "rgba(52,211,153,0.15)", fontSize: 11, fontWeight: 700, color: "#34D399", textTransform: "uppercase", letterSpacing: "0.08em", borderRadius: 99, fontFamily: "var(--font-display)" }}>
                          #{i + 1}
                        </span>
                        <h4 style={{ fontSize: 15, fontWeight: 700, color: palette.txt, margin: 0, fontFamily: "var(--font-display)" }}>{act.title}</h4>
                      </div>
                      <p style={{ fontSize: 13, color: palette.mute, lineHeight: 1.5, margin: 0, marginBottom: 8, fontFamily: "var(--font-display)" }}>{act.description}</p>
                      {act.howTo && (
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: palette.brd, borderRadius: 8, padding: "8px 12px", marginBottom: 8 }}>
                          <span style={{ fontSize: 15, marginTop: 2 }}>▶</span>
                          <p style={{ fontSize: 13, color: palette.txt2, lineHeight: 1.5, margin: 0, fontFamily: "var(--font-display)" }}>{act.howTo}</p>
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12 }}>
                        <span style={{ color: palette.mute, fontFamily: "var(--font-display)" }}>
                          Impact: <span style={{ color: "#34D399", fontWeight: 600 }}>{formatInLakh(act.impact)}</span>
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color: palette.mute, flexShrink: 0, marginTop: 8 }} />
                  </div>
                </div>
              ))}

              {lockedActions.map((act, i) => (
                <div key={act.id} style={{ background: palette.s1, border: `1px solid ${palette.brd}`, borderRadius: 12, padding: 16, position: "relative", overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: palette.brd, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, opacity: 0.5 }}>
                      {act.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ padding: "2px 8px", background: "rgba(100,116,139,0.15)", fontSize: 11, fontWeight: 700, color: palette.mute, textTransform: "uppercase", letterSpacing: "0.08em", borderRadius: 99, fontFamily: "var(--font-display)" }}>
                          #{FREE_ACTIONS_LIMIT + i + 1}
                        </span>
                        <h4 style={{ fontSize: 15, fontWeight: 700, color: palette.txt, margin: 0, fontFamily: "var(--font-display)" }}>{act.title}</h4>
                      </div>
                      <div style={{ filter: "blur(6px)", userSelect: "none", pointerEvents: "none" }}>
                        <p style={{ fontSize: 13, color: palette.mute, lineHeight: 1.5, fontFamily: "var(--font-display)" }}>{act.description}</p>
                      </div>
                    </div>
                    <Lock size={16} style={{ color: "rgba(245,158,11,0.6)", flexShrink: 0, marginTop: 4 }} />
                  </div>
                </div>
              ))}
            </div>

            {lockedActions.length > 0 && (
              <div style={{ marginTop: 12, background: "linear-gradient(135deg, rgba(245,158,11,0.05), rgba(234,88,12,0.05))", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 12, padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Lock size={20} style={{ color: "#FBBF24" }} />
                  <span style={{ fontSize: 13, color: palette.mute, fontFamily: "var(--font-display)" }}>Unlock all {actionsTriggered} actions with step-by-step guides</span>
                </div>
                <span style={{ fontSize: 13, color: "#FBBF24", fontWeight: 700, whiteSpace: "nowrap", fontFamily: "var(--font-display)" }}>Upgrade →</span>
              </div>
            )}
          </div>
        )}

        {/* Benchmarks */}
        <div id="benchmarks">
          <BenchmarkComparison />
        </div>

        {/* Excess Reallocation */}
        <ExcessReallocationCard />

        {/* Premium Insights */}
        <div id="premium">
          <LockedPremiumInsights />
        </div>

        {/* Upgrade CTA */}
        <div style={{
          background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(234,88,12,0.1), rgba(239,68,68,0.1))",
          border: "1px solid rgba(245,158,11,0.2)",
          borderRadius: 24,
          padding: 24,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.3, background: "radial-gradient(circle at 50% 0%, rgba(245,158,11,0.2), transparent 60%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: palette.txt, marginBottom: 8, fontFamily: "var(--font-display)" }}>Unlock Your Full Financial Blueprint</h3>
            <p style={{ fontSize: 15, color: palette.mute, marginBottom: 20, maxWidth: 512, margin: "0 auto 20px", lineHeight: 1.6, fontFamily: "var(--font-display)" }}>
              Get personalized action plans, detailed pillar breakdowns, and step-by-step recommendations to reach 90+ score.
            </p>
            <button style={{
              padding: "14px 32px",
              background: "linear-gradient(135deg, #F59E0B, #EA580C)",
              color: "#000",
              fontWeight: 700,
              fontSize: 15,
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 25px rgba(245,158,11,0.3)",
              fontFamily: "var(--font-display)",
            }}>
              Upgrade to Premium
              <span style={{ display: "block", fontSize: 12, fontWeight: 500, opacity: 0.8, marginTop: 2 }}>₹999/year — Cancel anytime</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
