"use client";

import { Lock } from "lucide-react";
import { useLockedInsights } from "@/hooks/dashboard/useLockedInsights";
import type { LockedInsightCard } from "@/hooks/dashboard/useLockedInsights";

function LockedInsightCardItem({ card }: { card: LockedInsightCard }) {
  return (
    <div style={{
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 16,
      padding: 20,
      overflow: "hidden",
      background: "rgba(255,255,255,0.02)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <h4 style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9", margin: 0, flex: 1, fontFamily: "var(--font-display)" }}>{card.label}</h4>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Lock size={14} style={{ color: "rgba(255,255,255,0.6)" }} />
        </div>
      </div>
      <p style={{ fontSize: 22, fontWeight: 700, color: "#FBBF24", marginBottom: 12, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-display)" }}>
        {card.impactLabel}
      </p>
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
        Unlock Full Analysis
      </button>
    </div>
  );
}

export function LockedPremiumInsights() {
  const { cards, maxFigureFormatted, hiddenCount } = useLockedInsights();

  if (!cards || cards.length === 0) return null;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#64748B", margin: 0, fontFamily: "var(--font-display)" }}>
          Premium Insights Waiting For You
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#F59E0B" }}>
          <Lock size={16} />
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-display)" }}>Pro</span>
        </div>
      </div>

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {cards.map((card) => (
          <LockedInsightCardItem key={card.id} card={card} />
        ))}
      </div>

      <button style={{
        marginTop: 16,
        width: "100%",
        padding: "12px 24px",
        background: "linear-gradient(135deg, #F59E0B, #EA580C)",
        fontSize: 15,
        fontWeight: 700,
        color: "#000",
        borderRadius: 12,
        border: "none",
        cursor: "pointer",
        boxShadow: "0 4px 24px rgba(245,158,11,0.3)",
        fontFamily: "var(--font-display)",
      }}>
        Unlock Full Analysis — {maxFigureFormatted} waiting
        {hiddenCount > 0 && ` (+${hiddenCount} more)`}
      </button>
    </div>
  );
}
