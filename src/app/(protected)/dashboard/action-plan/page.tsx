"use client";

import { useState } from "react";
import {
  Shield, HeartPulse, Zap, ChevronDown, ChevronUp,
  CheckCircle2, AlertTriangle, Info, ArrowUpRight,
  Target, TrendingUp, Wallet, Check, X,
  ListChecks, Sparkles, Clock, BadgeAlert,
} from "lucide-react";
import { useActionPlan } from "@/hooks/dashboard/useActionPlan";
import type { ActionPlanItem } from "@/hooks/dashboard/useActionPlan";

const CATEGORY_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  SRV: { label: "Survival", bg: "rgba(239,68,68,0.15)", text: "#F87171", border: "rgba(239,68,68,0.2)" },
  INS: { label: "Protection", bg: "rgba(168,85,247,0.15)", text: "#C084FC", border: "rgba(168,85,247,0.2)" },
  TAX: { label: "Tax", bg: "rgba(245,158,11,0.15)", text: "#FBBF24", border: "rgba(245,158,11,0.2)" },
  RET: { label: "Retirement", bg: "rgba(6,182,212,0.15)", text: "#22D3EE", border: "rgba(6,182,212,0.2)" },
  WLT: { label: "Wealth", bg: "rgba(59,130,246,0.15)", text: "#60A5FA", border: "rgba(59,130,246,0.2)" },
  DBT: { label: "Debt", bg: "rgba(249,115,22,0.15)", text: "#FB923C", border: "rgba(249,115,22,0.2)" },
};

const PILLAR_ICONS: Record<string, React.ComponentType<{ size: number; style?: React.CSSProperties }>> = {
  Survival: Shield,
  Protection: HeartPulse,
  Tax: Wallet,
  Retirement: TrendingUp,
  Wealth: Sparkles,
  Debt: Zap,
};

function GuidancePanel({ items, type }: { items: string[]; type: "do" | "dont" }) {
  const [open, setOpen] = useState(false);
  const isDoList = type === "do";
  const Icon = isDoList ? Check : X;
  const color = isDoList ? "#34D399" : "#F87171";
  const bg = isDoList ? "rgba(52,211,153,0.05)" : "rgba(239,68,68,0.05)";
  const border = isDoList ? "rgba(52,211,153,0.15)" : "rgba(239,68,68,0.15)";
  const headerBg = isDoList ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)";
  const title = isDoList ? "What To Do" : "What Not To Do";

  return (
    <div style={{ borderRadius: 12, border: `1px solid ${border}`, overflow: "hidden", background: bg }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: headerBg, border: "none", cursor: "pointer" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon size={16} style={{ color }} />
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", color, fontFamily: "var(--font-display)" }}>{title}</span>
          <span style={{ fontSize: 12, color: "#64748B", fontFamily: "var(--font-display)" }}>{items.length} items</span>
        </div>
        {open ? <ChevronUp size={14} style={{ color: "#64748B" }} /> : <ChevronDown size={14} style={{ color: "#64748B" }} />}
      </button>
      {open && (
        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((item, idx) => (
            <div key={idx} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Icon size={14} style={{ color, marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.5, fontFamily: "var(--font-display)" }}>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StepsPanel({ steps }: { steps: { text: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderRadius: 12, border: "1px solid rgba(59,130,246,0.15)", overflow: "hidden", background: "rgba(59,130,246,0.05)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "rgba(59,130,246,0.1)", border: "none", cursor: "pointer" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ListChecks size={16} style={{ color: "#60A5FA" }} />
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", color: "#60A5FA", fontFamily: "var(--font-display)" }}>Step-by-Step Guide</span>
          <span style={{ fontSize: 12, color: "#64748B", fontFamily: "var(--font-display)" }}>{steps.length} steps</span>
        </div>
        {open ? <ChevronUp size={14} style={{ color: "#64748B" }} /> : <ChevronDown size={14} style={{ color: "#64748B" }} />}
      </button>
      {open && (
        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {steps.map((step, idx) => (
            <div key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#60A5FA", fontFamily: "var(--font-display)" }}>{idx + 1}</span>
              </div>
              <span style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.5, fontFamily: "var(--font-display)" }}>{step.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ActionCard({ action, rank }: { action: ActionPlanItem; rank: number }) {
  const catConfig = CATEGORY_CONFIG[action.category] || CATEGORY_CONFIG.SRV;
  const PillarIcon = PILLAR_ICONS[action.pillar] || Shield;

  return (
    <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(15,23,42,0.8)", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#10B981", fontFamily: "var(--font-display)" }}>#{rank}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", background: catConfig.bg, color: catConfig.text, border: `1px solid ${catConfig.border}`, fontFamily: "var(--font-display)" }}>
                {action.category}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <PillarIcon size={12} style={{ color: "#64748B" }} />
                <span style={{ fontSize: 11, color: "#64748B", fontWeight: 500, fontFamily: "var(--font-display)" }}>{action.pillar}</span>
              </div>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9", lineHeight: 1.3, margin: 0, fontFamily: "var(--font-display)" }}>{action.title}</h3>
            <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.5, margin: 0, fontFamily: "var(--font-display)" }}>{action.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Impact badges */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
          <ArrowUpRight size={14} style={{ color: "#10B981" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#10B981", fontFamily: "var(--font-display)" }}>Impact: {action.impact}</span>
        </div>
        {action.urgencyMultiplier >= 3 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <Clock size={14} style={{ color: "#F87171" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#F87171", fontFamily: "var(--font-display)" }}>URGENT</span>
          </div>
        )}
        {action.feasibilityFactor < 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 8, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <BadgeAlert size={14} style={{ color: "#FBBF24" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#FBBF24", fontFamily: "var(--font-display)" }}>Build EF First</span>
          </div>
        )}
      </div>

      {/* Expandable panels */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <GuidancePanel items={action.whatToDo} type="do" />
        <GuidancePanel items={action.whatNotToDo} type="dont" />
        <StepsPanel steps={action.steps} />
      </div>
    </div>
  );
}

export default function ActionPlanPage() {
  const { actions, count, isLoading } = useActionPlan();

  if (isLoading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(16,185,129,0.3)", borderTopColor: "#10B981", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const now = new Date();
  const fyStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const fyLabel = `FY ${fyStart}–${(fyStart + 1).toString().slice(-2)}`;

  return (
    <section style={{ minHeight: "100vh", paddingBottom: 96 }}>
      <div style={{ width: "100%", maxWidth: 1152, margin: "0 auto", padding: "40px 16px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Page header */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Target size={24} style={{ color: "#10B981" }} />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F1F5F9", letterSpacing: "-0.025em", margin: 0, fontFamily: "var(--font-display)" }}>Action Plan</h1>
              <p style={{ fontSize: 13, color: "#64748B", margin: 0, fontFamily: "var(--font-display)" }}>{fyLabel} · {count} action{count !== 1 ? "s" : ""} for your profile</p>
            </div>
          </div>

          {count === 0 && (
            <div style={{ borderRadius: 16, border: "1px solid rgba(52,211,153,0.2)", background: "rgba(52,211,153,0.05)", padding: 24, textAlign: "center", display: "flex", flexDirection: "column", gap: 8 }}>
              <CheckCircle2 size={40} style={{ color: "#34D399", margin: "0 auto" }} />
              <p style={{ fontSize: 15, fontWeight: 700, color: "#34D399", margin: 0, fontFamily: "var(--font-display)" }}>All Clear!</p>
              <p style={{ fontSize: 13, color: "#94A3B8", margin: 0, fontFamily: "var(--font-display)" }}>No priority actions detected. You&apos;re doing great!</p>
            </div>
          )}

          {count > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 12, background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)" }}>
              <AlertTriangle size={15} style={{ color: "#FBBF24", flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: "rgba(251,191,36,0.8)", margin: 0, fontFamily: "var(--font-display)" }}>
                Actions are ranked by <span style={{ fontWeight: 700 }}>Financial Impact × Urgency × Feasibility</span>. Address #1 first.
              </p>
            </div>
          )}
        </div>

        {/* Action cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {actions.map((action, idx) => (
            <ActionCard key={action.id} action={action} rank={idx + 1} />
          ))}
        </div>

        {/* Footer note */}
        {count > 0 && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <Info size={15} style={{ color: "#475569", marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, margin: 0, fontFamily: "var(--font-display)" }}>
              These recommendations are based on the data you provided during assessment. They are not financial advice. Consult a SEBI-registered advisor for personalised planning.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
