"use client";

import { useState, useEffect } from "react";
import { Hourglass, Lock } from "lucide-react";
import { useTimeMachine, type TimeMachineCard, type TimeMachineCardTone } from "@/hooks/dashboard/useTimeMachine";
import { ProjectionChart } from "./ProjectionChart";
import { useAppTheme } from "@/hooks/useAppTheme";

interface Props {
  isPremium?: boolean;
}

const TONE_COLORS: Record<TimeMachineCardTone, { badgeBg: string; badgeText: string; amount: string }> = {
  danger: { badgeBg: "rgba(239,68,68,0.15)", badgeText: "#F87171", amount: "#EF4444" },
  warning: { badgeBg: "rgba(245,158,11,0.15)", badgeText: "#FBBF24", amount: "#F59E0B" },
  positive: { badgeBg: "rgba(59,130,246,0.15)", badgeText: "#60A5FA", amount: "#3B82F6" },
};

function renderBold(text: string, boldColor: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ fontWeight: 700, color: boldColor }}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function Card({ card, palette }: { card: TimeMachineCard; palette: ReturnType<typeof useAppTheme> }) {
  const tone = TONE_COLORS[card.tone] ?? TONE_COLORS.danger;
  return (
    <div style={{
      padding: 20,
      borderRadius: 12,
      background: palette.brd,
      border: `1px solid ${palette.brd2}`,
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}>
      <span style={{
        alignSelf: "flex-start",
        padding: "4px 10px",
        borderRadius: 6,
        background: tone.badgeBg,
        color: tone.badgeText,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontFamily: "var(--font-display)",
      }}>{card.badge}</span>
      <p style={{
        fontSize: 28,
        fontWeight: 700,
        color: tone.amount,
        margin: 0,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "-0.02em",
        fontFamily: "var(--font-display)",
      }}>
        {card.amountPrefix ?? ""}{card.amountFormatted}
        {card.amountSuffix && <span style={{ fontSize: 18, marginLeft: 2 }}>{card.amountSuffix}</span>}
      </p>
      <p style={{ fontSize: 14, fontWeight: 700, color: palette.txt, margin: 0, fontFamily: "var(--font-display)" }}>
        {card.heading}
      </p>
      <p style={{ fontSize: 12, lineHeight: 1.6, color: palette.mute, margin: 0, fontFamily: "var(--font-display)" }}>
        {renderBold(card.body, palette.txt)}
      </p>
    </div>
  );
}

export function FinancialTimeMachine({ isPremium = false }: Props) {
  const palette = useAppTheme();
  const data = useTimeMachine();
  const [tickerCost, setTickerCost] = useState(0);

  useEffect(() => {
    if (!data) return;
    const target = Math.round(data.dailyCost);
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(target, Math.round(increment * step));
      setTickerCost(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [data?.dailyCost]);

  if (!data || data.dailyCost <= 0) return null;

  const { missedWealthFormatted, avgYearlyCostFormatted, delayYears, explanation, cards } = data;

  return (
    <div style={{
      position: "relative",
      borderRadius: 16,
      overflow: "hidden",
      background: "linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(239,68,68,0.04) 100%)",
      border: "1px solid rgba(245,158,11,0.15)",
    }}>
      {/* Subtle glow line */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "75%",
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)",
      }} />

      <div style={{ padding: 20 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>⏳</span>
            <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: palette.mute, margin: 0, fontFamily: "var(--font-display)" }}>
              Financial Time Machine
            </h3>
          </div>
          {delayYears > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 99 }}>
              <Hourglass size={14} style={{ color: "#FB923C" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#FB923C", fontFamily: "var(--font-display)" }}>{delayYears}-yr delay</span>
            </div>
          )}
        </div>

        {/* Hero ₹/day */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", padding: "16px 32px", borderRadius: 12, background: palette.brd, border: `1px solid ${palette.brd}`, maxWidth: 640 }}>
            <p style={{
              fontSize: 36,
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.025em",
              margin: 0,
              background: "linear-gradient(135deg, #F59E0B, #EF4444)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "var(--font-display)",
            }}>
              ₹{tickerCost.toLocaleString("en-IN")}/day
            </p>
            {explanation && (
              <p style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: palette.mute,
                marginTop: 10,
                margin: 0,
                fontFamily: "var(--font-display)",
                textAlign: "center",
              }}>
                {explanation}
              </p>
            )}
          </div>
        </div>


        {cards ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(cards.length, 3)}, 1fr)`,
            gap: 12,
            marginBottom: 20,
          }}>
            {cards.map((card, i) => <Card key={i} card={card} palette={palette} />)}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 20 }}>
            <div style={{ borderRadius: 12, padding: 12, textAlign: "center", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#059669", fontVariantNumeric: "tabular-nums", margin: 0, fontFamily: "var(--font-display)" }}>{missedWealthFormatted}</p>
              <p style={{ fontSize: 11, color: palette.mute, marginTop: 2, lineHeight: 1.4, margin: 0, fontFamily: "var(--font-display)" }}>missed by not starting {delayYears} yrs ago</p>
            </div>
            <div style={{ borderRadius: 12, padding: 12, textAlign: "center", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#DC2626", fontVariantNumeric: "tabular-nums", margin: 0, fontFamily: "var(--font-display)" }}>{avgYearlyCostFormatted}</p>
              <p style={{ fontSize: 11, color: palette.mute, marginTop: 2, lineHeight: 1.4, margin: 0, fontFamily: "var(--font-display)" }}>average cost per year of delay</p>
            </div>
          </div>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: palette.brd, margin: "20px 0" }} />

        {/* 30-Year Projection — gated for premium */}
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 12 }}>
          {!isPremium && (
            <div style={{
              position: "absolute",
              inset: 0,
              backdropFilter: "blur(2px)",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: palette.brd2, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
                  <Lock size={20} style={{ color: "rgba(255,255,255,0.6)" }} />
                </div>
                <button style={{
                  padding: "8px 20px",
                  background: "linear-gradient(135deg, #F59E0B, #EA580C)",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#000",
                  borderRadius: 99,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(245,158,11,0.2)",
                  fontFamily: "var(--font-display)",
                }}>
                  Unlock Deep Insights
                </button>
              </div>
            </div>
          )}
          <div style={!isPremium ? { userSelect: "none", pointerEvents: "none" } : {}}>
            <ProjectionChart />
          </div>
        </div>
      </div>
    </div>
  );
}
