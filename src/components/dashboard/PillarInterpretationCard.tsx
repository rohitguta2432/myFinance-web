"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle, XCircle, CheckCircle2, Zap } from "lucide-react";
import type { Pillar } from "@/hooks/dashboard/useFinancialHealthScore";
import type { HookTextData } from "@/hooks/dashboard/useHookText";

interface Props {
  pillar: Pillar;
  hookData: HookTextData | undefined;
  index?: number;
  isWorst?: boolean;
}

const STATUS_CONFIG = {
  critical: {
    bg: "rgba(239,68,68,0.05)",
    border: "rgba(239,68,68,0.25)",
    glow: "0 0 20px rgba(239,68,68,0.1)",
    chipBg: "#EF4444",
    chipText: "#fff",
    textColor: "#F87171",
    barFrom: "#ef4444cc",
    barTo: "#ef4444",
    Icon: XCircle,
    label: "CRITICAL",
  },
  warn: {
    bg: "rgba(245,158,11,0.05)",
    border: "rgba(245,158,11,0.2)",
    glow: "0 0 20px rgba(245,158,11,0.08)",
    chipBg: "#F59E0B",
    chipText: "#000",
    textColor: "#FBBF24",
    barFrom: "#f59e0bcc",
    barTo: "#f59e0b",
    Icon: AlertTriangle,
    label: "WARNING",
  },
  ok: {
    bg: "rgba(16,185,129,0.05)",
    border: "rgba(16,185,129,0.2)",
    glow: "0 0 20px rgba(16,185,129,0.08)",
    chipBg: "#10B981",
    chipText: "#000",
    textColor: "#34D399",
    barFrom: "#10b981cc",
    barTo: "#10b981",
    Icon: CheckCircle2,
    label: "ON TRACK",
  },
};

export function PillarInterpretationCard({ pillar, hookData, index = 0, isWorst = false }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showAction, setShowAction] = useState(false);

  if (!pillar || !hookData) return null;

  const tier = (hookData.tier as keyof typeof STATUS_CONFIG) || "ok";
  const config = STATUS_CONFIG[tier] || STATUS_CONFIG.ok;
  const pct = ((pillar.score / pillar.maxScore) * 100).toFixed(0);

  return (
    <div
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: 16,
        overflow: "hidden",
        transition: "all 0.5s",
        boxShadow: config.glow,
        animation: `fadeSlideUp 0.5s ease-out ${index * 0.08}s both`,
      }}
    >
      <button
        onClick={() => { setExpanded(!expanded); if (expanded) setShowAction(false); }}
        style={{ width: "100%", textAlign: "left", padding: "12px 16px 12px", background: "none", border: "none", cursor: "pointer" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{pillar.icon}</span>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "var(--font-display)" }}>
              {pillar.name}
            </h4>
            <span style={{
              padding: "2px 8px",
              background: config.chipBg,
              color: config.chipText,
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              borderRadius: 99,
              flexShrink: 0,
              fontFamily: "var(--font-display)",
            }}>
              {config.label}
            </span>
            {isWorst && (
              <span style={{
                padding: "2px 8px",
                background: "#EF4444",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                borderRadius: 99,
                flexShrink: 0,
                fontFamily: "var(--font-display)",
              }}>
                RISK
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 8 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
              <span style={{ fontSize: 20, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: config.barTo, fontFamily: "var(--font-display)" }}>
                {pillar.score}
              </span>
              <span style={{ fontSize: 12, color: "#64748B" }}>/{pillar.maxScore}</span>
            </div>
            <div style={{ color: config.textColor, transition: "transform 0.2s" }}>
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>
        </div>

        {/* Score bar */}
        <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            borderRadius: 99,
            transition: "width 1000ms ease-out",
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${config.barFrom}, ${config.barTo})`,
          }} />
        </div>
      </button>

      {/* Expandable insight body */}
      <div style={{
        overflow: "hidden",
        maxHeight: expanded ? 600 : 0,
        opacity: expanded ? 1 : 0,
        transition: "all 0.3s ease-out",
      }}>
        <div style={{ padding: "12px 16px 16px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontSize: 14, color: "#CBD5E1", lineHeight: 1.6, margin: 0 }}>{hookData.text}</p>

          {hookData.dscrOverride && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "8px 12px" }}>
              <AlertTriangle size={16} style={{ color: "#F87171", flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 12, color: "#FCA5A5", lineHeight: 1.5, margin: 0 }}>
                Your current EMIs exceed your disposable income — immediate restructuring is required.
              </p>
            </div>
          )}

          {hookData.equityOverride && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "8px 12px" }}>
              <AlertTriangle size={16} style={{ color: "#F87171", flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 12, color: "#FCA5A5", lineHeight: 1.5, margin: 0 }}>
                With zero equity, inflation is eroding the real value of your savings every year.
              </p>
            </div>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); setShowAction(!showAction); }}
            style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: config.textColor, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "var(--font-display)" }}
          >
            <Zap size={16} />
            {showAction ? "Hide Action" : "What Should I Do?"}
            {showAction ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <div style={{
            overflow: "hidden",
            maxHeight: showAction ? 160 : 0,
            opacity: showAction ? 1 : 0,
            transition: "all 0.3s ease-out",
          }}>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 16px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ fontSize: 16, marginTop: 2 }}>📌</span>
                <p style={{ fontSize: 14, color: "#CBD5E1", lineHeight: 1.6, margin: 0 }}>{hookData.action}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
