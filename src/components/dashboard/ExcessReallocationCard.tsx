"use client";

import { ArrowRight, TrendingUp, Shield, Clock, PiggyBank } from "lucide-react";
import { useDashboardSummary } from "@/hooks/dashboard/useDashboardSummary";
import { useAppTheme } from "@/hooks/useAppTheme";

// Suppress unused import warning — ArrowRight may be used in future
void ArrowRight;

export function ExcessReallocationCard() {
  const palette = useAppTheme();
  const { data } = useDashboardSummary();
  const realloc = (data as Record<string, unknown> | undefined)?.excessReallocation as Record<string, unknown> | undefined;

  if (!realloc?.hasExcess) return null;

  const deployableSurplusFormatted = String(realloc.deployableSurplusFormatted ?? "");
  const equityTransferFormatted = String(realloc.equityTransferFormatted ?? "");
  const debtTransferFormatted = String(realloc.debtTransferFormatted ?? "");
  const equityPct = String(realloc.equityPct ?? "");
  const debtPct = String(realloc.debtPct ?? "");
  const equityTransfer = Number(realloc.equityTransfer ?? 0);
  const debtTransfer = Number(realloc.debtTransfer ?? 0);
  const useStp = Boolean(realloc.useStp);
  const stpMonths = String(realloc.stpMonths ?? "");
  const riskProfile = String(realloc.riskProfile ?? "");
  const emergencyTargetMonths = String(realloc.emergencyTargetMonths ?? "");
  const bufferMonths = String(realloc.bufferMonths ?? "");
  const yearsToRetirement = String(realloc.yearsToRetirement ?? "");
  const reason = String(realloc.reason ?? "");

  const riskLabel =
    riskProfile === "conservative"
      ? "Conservative"
      : riskProfile === "aggressive"
      ? "Aggressive"
      : "Moderate";

  return (
    <div style={{ background: palette.s1, borderRadius: 16, border: `1px solid ${palette.brd}`, boxShadow: "0 4px 24px rgba(0,0,0,0.3)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.1), rgba(52,211,153,0.1))", padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingUp size={20} style={{ color: "#10B981" }} />
          </div>
          <div>
            <h3 style={{ fontWeight: 700, color: palette.txt, fontSize: 13, letterSpacing: "0.05em", margin: 0, fontFamily: "var(--font-display)" }}>EXCESS REALLOCATION</h3>
            <p style={{ fontSize: 12, color: palette.mute, margin: 0, marginTop: 2, fontFamily: "var(--font-display)" }}>Deploy idle liquid assets into retirement corpus</p>
          </div>
        </div>
      </div>

      {/* Protected vs Deployable */}
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${palette.brd}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Shield size={16} style={{ color: "#34D399" }} />
          <p style={{ fontSize: 14, color: palette.mute, margin: 0, fontFamily: "var(--font-display)" }}>
            Keeping <span style={{ color: palette.txt, fontWeight: 600 }}>{Number(emergencyTargetMonths) + Number(bufferMonths)} months</span> protected
            <span style={{ color: palette.mute, marginLeft: 4 }}>({emergencyTargetMonths} emergency + {bufferMonths} buffer)</span>
          </p>
        </div>
        <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: 16, textAlign: "center" }}>
          <p style={{ fontSize: 11, color: palette.mute, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, marginBottom: 4, fontFamily: "var(--font-display)" }}>Deployable Surplus</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#10B981", fontVariantNumeric: "tabular-nums", margin: 0, fontFamily: "var(--font-display)" }}>{deployableSurplusFormatted}</p>
          <p style={{ fontSize: 11, color: palette.mute, margin: 0, marginTop: 4, fontFamily: "var(--font-display)" }}>100% → Retirement Corpus</p>
        </div>
      </div>

      {/* Allocation Split */}
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${palette.brd}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: palette.mute, margin: 0, fontFamily: "var(--font-display)" }}>Recommended Split</p>
          <span style={{ fontSize: 11, color: palette.mute, fontFamily: "var(--font-display)" }}>{riskLabel} · {yearsToRetirement}y to retirement</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {equityTransfer > 0 && (
            <div style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#60A5FA" }} />
                <p style={{ fontSize: 10, fontWeight: 700, color: "#60A5FA", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0, flex: 1, fontFamily: "var(--font-display)" }}>Equity</p>
                <span style={{ fontSize: 11, color: palette.mute, fontFamily: "var(--font-display)" }}>{equityPct}%</span>
              </div>
              <p style={{ fontSize: 18, fontWeight: 700, color: palette.txt, margin: 0, fontFamily: "var(--font-display)" }}>{equityTransferFormatted}</p>
              {useStp && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
                  <Clock size={12} style={{ color: "#FBBF24" }} />
                  <p style={{ fontSize: 11, color: "#FBBF24", fontWeight: 500, margin: 0, fontFamily: "var(--font-display)" }}>Via STP over {stpMonths} months</p>
                </div>
              )}
            </div>
          )}
          {debtTransfer > 0 && (
            <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#34D399" }} />
                <p style={{ fontSize: 10, fontWeight: 700, color: "#34D399", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0, flex: 1, fontFamily: "var(--font-display)" }}>Debt</p>
                <span style={{ fontSize: 11, color: palette.mute, fontFamily: "var(--font-display)" }}>{debtPct}%</span>
              </div>
              <p style={{ fontSize: 18, fontWeight: 700, color: palette.txt, margin: 0, fontFamily: "var(--font-display)" }}>{debtTransferFormatted}</p>
              <p style={{ fontSize: 11, color: palette.mute, margin: 0, marginTop: 8, fontFamily: "var(--font-display)" }}>Direct investment</p>
            </div>
          )}
        </div>
      </div>

      {/* Reason */}
      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, background: palette.brd, borderRadius: 12, padding: "12px 16px" }}>
          <PiggyBank size={20} style={{ color: "#10B981", flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 14, color: palette.txt2, lineHeight: 1.6, margin: 0, fontFamily: "var(--font-display)" }}>{reason}</p>
        </div>
      </div>
    </div>
  );
}
