"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Flame, Lock } from "lucide-react";
import { useTimeMachine } from "@/hooks/dashboard/useTimeMachine";
import { ProjectionChart } from "./ProjectionChart";

interface Props {
  isPremium?: boolean;
}

export function FinancialTimeMachine({ isPremium = false }: Props) {
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

  const { missedWealthFormatted, totalDelayCostFormatted, oneYearPenaltyFormatted, streak, topAction } = data;

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
            <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#64748B", margin: 0, fontFamily: "var(--font-display)" }}>
              Financial Time Machine
            </h3>
          </div>
          {streak > 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 99 }}>
              <Flame size={16} style={{ color: "#FB923C" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#FB923C", fontFamily: "var(--font-display)" }}>{streak}-day streak</span>
            </div>
          )}
        </div>

        {/* Hero ₹/day */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", padding: "16px 32px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
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
            <p style={{ fontSize: 14, color: "#64748B", marginTop: 4, margin: 0, fontFamily: "var(--font-display)" }}>
              is slipping away while you wait
            </p>
          </div>
        </div>

        {/* 3 Mini Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
          <div style={{ borderRadius: 12, padding: 12, textAlign: "center", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#059669", fontVariantNumeric: "tabular-nums", margin: 0, fontFamily: "var(--font-display)" }}>{missedWealthFormatted}</p>
            <p style={{ fontSize: 11, color: "#64748B", marginTop: 2, lineHeight: 1.4, margin: 0, fontFamily: "var(--font-display)" }}>missed by not starting 5 yrs ago</p>
          </div>
          <div style={{ borderRadius: 12, padding: 12, textAlign: "center", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#D97706", fontVariantNumeric: "tabular-nums", margin: 0, fontFamily: "var(--font-display)" }}>{totalDelayCostFormatted}</p>
            <p style={{ fontSize: 11, color: "#64748B", marginTop: 2, lineHeight: 1.4, margin: 0, fontFamily: "var(--font-display)" }}>total delay cost so far</p>
          </div>
          <div style={{ borderRadius: 12, padding: 12, textAlign: "center", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#DC2626", fontVariantNumeric: "tabular-nums", margin: 0, fontFamily: "var(--font-display)" }}>{oneYearPenaltyFormatted}</p>
            <p style={{ fontSize: 11, color: "#64748B", marginTop: 2, lineHeight: 1.4, margin: 0, fontFamily: "var(--font-display)" }}>more if you wait another year</p>
          </div>
        </div>

        {/* Top Action */}
        {topAction && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 8, fontFamily: "var(--font-display)" }}>
              Your #1 action to stop the bleed
            </p>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 12,
              borderRadius: 12,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
              cursor: "pointer",
            }}>
              <span style={{ fontSize: 20 }}>{topAction.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0, fontFamily: "var(--font-display)" }}>{topAction.title}</p>
              </div>
              <ChevronRight size={20} style={{ color: "#475569", flexShrink: 0 }} />
            </div>
          </div>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "20px 0" }} />

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
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
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
