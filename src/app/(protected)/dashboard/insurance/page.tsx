"use client";

import { useState } from "react";
import {
  Shield, HeartPulse, ChevronDown, ChevronUp,
  CheckCircle2, AlertTriangle, Info, ArrowUpRight,
  Wallet, Check, X,
} from "lucide-react";
import { useInsuranceAnalysis } from "@/hooks/dashboard/useInsuranceAnalysis";
import { SectionNav } from "@/components/dashboard/SectionNav";

const INSURANCE_SECTIONS = [
  { id: "life", label: "Term Life" },
  { id: "health", label: "Health" },
  { id: "additional", label: "Additional" },
];

function GuidancePanel({ items, type }: { items: string[]; type: "do" | "dont" }) {
  const [open, setOpen] = useState(false);
  const isDoList = type === "do";
  const Icon = isDoList ? Check : X;
  const color = isDoList ? "#34D399" : "#F87171";
  const bg = isDoList ? "rgba(52,211,153,0.05)" : "rgba(239,68,68,0.05)";
  const border = isDoList ? "rgba(52,211,153,0.15)" : "rgba(239,68,68,0.15)";
  const headerBg = isDoList ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)";
  const label = isDoList ? "✅ WHAT TO DO" : "❌ WHAT NOT TO DO";

  return (
    <div style={{ border: `1px solid ${border}`, borderRadius: 12, overflow: "hidden", background: bg }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: headerBg, border: "none", cursor: "pointer" }}
      >
        <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color, fontFamily: "var(--font-display)" }}>{label}</span>
        {open ? <ChevronUp size={16} style={{ color }} /> : <ChevronDown size={16} style={{ color }} />}
      </button>
      {open && (
        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, background: isDoList ? "rgba(52,211,153,0.2)" : "rgba(239,68,68,0.2)" }}>
                <Icon size={12} style={{ color }} />
              </div>
              <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.5, margin: 0, fontFamily: "var(--font-display)" }}>{item}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CoverBar({ pct, color, label, isAdequate }: { pct: number; color: string; label: string; isAdequate: boolean }) {
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color, fontFamily: "var(--font-display)" }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "#F1F5F9", display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-display)" }}>
          {Math.round(pct)}%
          {isAdequate && <CheckCircle2 size={14} style={{ color: "#34D399" }} />}
        </span>
      </div>
      <div style={{ width: "100%", height: 10, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          borderRadius: 99,
          transition: "width 1000ms ease-out",
          width: `${Math.min(100, pct)}%`,
          background: `linear-gradient(90deg, ${color}cc, ${color})`,
          boxShadow: `0 0 12px ${color}30`,
        }} />
      </div>
    </div>
  );
}

function MetricRow({ label, sublabel, value, icon }: { label: string; sublabel?: string; value: string; icon?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {icon && <span style={{ fontSize: 14 }}>{icon}</span>}
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", margin: 0, fontFamily: "var(--font-display)" }}>{label}</p>
          {sublabel && <p style={{ fontSize: 11, color: "#64748B", margin: 0, fontFamily: "var(--font-display)" }}>{sublabel}</p>}
        </div>
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "#F1F5F9", fontFamily: "var(--font-display)" }}>{value}</span>
    </div>
  );
}

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function InsurancePage() {
  const data = useInsuranceAnalysis();
  const { termLife, healthInsurance, additionalCoverage, age, city } = data;

  if (!termLife || !healthInsurance) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(16,185,129,0.3)", borderTopColor: "#10B981", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const termDo = [
    `Buy a pure term plan with cover extending to at least age 60. Look for: (a) claim settlement ratio > 98%, (b) individual death claim settlement ratio, (c) cover amount adequate to close the gap of ${termLife.coverGapFormatted}.`,
    "Choose a cover period to at least the year your youngest dependent becomes financially independent.",
    "Disclose all existing health conditions and family medical history — accurate disclosure ensures your claim is honoured.",
    "Register your policy in an e-Insurance repository (NSDL or CDSL) so your nominee can track it digitally.",
    "Inform your nominee about the claim process — the insurer's call centre number, documents needed.",
  ];
  const termDont = [
    "Do not buy a ULIP or endowment plan thinking it doubles as life insurance — the cover is inadequate and costs are high.",
    "Do not choose a policy with a return-of-premium feature — this increases the premium by 50–100% for zero additional coverage.",
    "Do not suppress any health information on the proposal form — claim rejection for non-disclosure is the most common failure.",
    "Do not rely on free group term cover from your employer as your primary protection — it disappears when employment ends.",
    "Do not choose a decreasing cover plan if you have fixed liabilities.",
  ];
  const healthDo = [
    `Buy a comprehensive individual or family floater with at least ${healthInsurance.cityBenchmarkFormatted} cover.`,
    "Key features: No room rent sub-limit, no co-payment clause, restoration benefit, daycare procedures covered.",
    "Add a ₹50L super top-up plan — it is the most cost-effective way to increase total cover.",
    "Claim Section 80D deduction: ₹25,000 for self/family, additional ₹25,000–₹50,000 for parents.",
  ];
  const healthDont = [
    "Do not choose a policy based on premium alone — sub-limits can reduce your effective benefit by 50–70%.",
    "Do not ignore the co-payment clause — a 20% co-pay on an ₹8L claim means ₹1.6L out of pocket.",
    "Do not let your policy lapse — pre-existing condition waiting periods restart from day one of a new policy.",
    "Do not count your employer's group health cover as your primary health insurance strategy.",
    "Do not underestimate room rent capping.",
  ];

  return (
    <div style={{ width: "100%", maxWidth: 1152, margin: "0 auto", padding: "24px 16px 96px", display: "flex", flexDirection: "column", gap: 32 }}>
      <SectionNav sections={INSURANCE_SECTIONS} />

      {/* Page Title */}
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em", color: "#F1F5F9", margin: 0, fontFamily: "var(--font-display)" }}>Insurance Analysis</h2>
        <p style={{ fontSize: 12, color: "#64748B", marginTop: 2, fontFamily: "var(--font-display)" }}>
          {city ? `📍 ${city}` : ""} · Personalised coverage assessment
        </p>
      </div>

      {/* TERM LIFE */}
      <section id="life" style={{ background: "#0F172A", borderRadius: 24, border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(90deg, rgba(59,130,246,0.1), transparent)", padding: 24, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={20} style={{ color: "#60A5FA" }} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#F1F5F9", margin: 0, fontFamily: "var(--font-display)" }}>Term Life Insurance</h3>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-display)" }}>Pillar of family security</span>
            </div>
          </div>
        </div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)", borderRadius: 12, padding: 16 }}>
            <h4 style={{ fontSize: 11, fontWeight: 600, color: "#60A5FA", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 8, margin: 0, marginBottom: 8, fontFamily: "var(--font-display)" }}>
              <Info size={14} /> Why Term Insurance Matters
            </h4>
            <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6, margin: 0, fontFamily: "var(--font-display)" }}>
              Term insurance is the foundation of your family&apos;s financial security. It is the only instrument that provides crore-level cover at a monthly cost of ₹500–2,000.
            </p>
          </div>

          <div style={{ background: "#0B0F1A", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", padding: 16 }}>
            <h4 style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, fontFamily: "var(--font-display)" }}>Your Numbers</h4>
            <MetricRow label="HLV Method" sublabel={`Annual Salary × (60 − ${age})`} value={termLife.hlvFormatted} icon="📊" />
            <MetricRow label="Needs Analysis" sublabel="Loans + (10 × Salary) + Goals" value={termLife.needsAnalysisFormatted} icon="📋" />
            <MetricRow label="Required Cover (Max)" value={termLife.requiredCoverFormatted} icon="🎯" />
            <MetricRow
              label="Your Existing Cover"
              sublabel={`Personal: ${fmtCurrency(termLife.personalCover)} + Corporate: ${fmtCurrency(termLife.corporateCover)}`}
              value={termLife.existingCoverFormatted}
              icon="🔒"
            />
            {!termLife.isAdequate && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", marginTop: 4, background: "rgba(239,68,68,0.1)", borderRadius: 8, border: "1px solid rgba(239,68,68,0.15)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <AlertTriangle size={16} style={{ color: "#F87171" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#F87171", fontFamily: "var(--font-display)" }}>COVER GAP</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#F87171", fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-display)" }}>{termLife.coverGapFormatted}</span>
              </div>
            )}
          </div>

          <CoverBar pct={termLife.adequacyPct} color={termLife.barColor} label={termLife.label} isAdequate={termLife.isAdequate} />

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <GuidancePanel items={termDo} type="do" />
            <GuidancePanel items={termDont} type="dont" />
          </div>
        </div>
      </section>

      {/* HEALTH INSURANCE */}
      <section id="health" style={{ background: "#0F172A", borderRadius: 24, border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(90deg, rgba(20,184,166,0.1), transparent)", padding: 24, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(20,184,166,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <HeartPulse size={20} style={{ color: "#2DD4BF" }} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#F1F5F9", margin: 0, fontFamily: "var(--font-display)" }}>Health Insurance</h3>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-display)" }}>Medical protection</span>
            </div>
          </div>
        </div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "rgba(20,184,166,0.05)", border: "1px solid rgba(20,184,166,0.1)", borderRadius: 12, padding: 16 }}>
            <h4 style={{ fontSize: 11, fontWeight: 600, color: "#2DD4BF", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 8, margin: 0, marginBottom: 8, fontFamily: "var(--font-display)" }}>
              <Info size={14} /> Why Health Insurance Matters
            </h4>
            <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6, margin: 0, fontFamily: "var(--font-display)" }}>
              A single ICU admission in a metro hospital costs ₹3–8 lakh. Without adequate cover, one hospitalisation can wipe out years of savings.
            </p>
          </div>

          {/* City Benchmark grid */}
          <div style={{ background: "#0B0F1A", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", padding: 16 }}>
            <h4 style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, fontFamily: "var(--font-display)" }}>City-Based Benchmark</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
              {[
                { tier: "Metro", cover: "₹20 L", cities: "Mumbai, Delhi…", active: healthInsurance.cityTier === "metro" },
                { tier: "Tier-1", cover: "₹15 L", cities: "Ahmedabad, Jaipur…", active: healthInsurance.cityTier === "tier1" },
                { tier: "Tier-2+", cover: "₹10 L", cities: "All other cities", active: healthInsurance.cityTier === "tier2" || healthInsurance.cityTier === "tier3" },
              ].map((t, i) => (
                <div key={i} style={{
                  borderRadius: 8,
                  padding: 12,
                  textAlign: "center",
                  border: t.active ? "1px solid rgba(20,184,166,0.3)" : "1px solid rgba(255,255,255,0.05)",
                  background: t.active ? "rgba(20,184,166,0.1)" : "rgba(255,255,255,0.02)",
                }}>
                  <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4, color: t.active ? "#2DD4BF" : "#64748B", fontFamily: "var(--font-display)" }}>{t.tier}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: t.active ? "#F1F5F9" : "#475569", margin: 0, fontFamily: "var(--font-display)" }}>{t.cover}</p>
                  <p style={{ fontSize: 11, color: "#64748B", marginTop: 2, fontFamily: "var(--font-display)" }}>{t.cities}</p>
                </div>
              ))}
            </div>
            <MetricRow label="Recommended for You" sublabel={`City benchmark`} value={healthInsurance.cityBenchmarkFormatted} icon="🎯" />
            <MetricRow
              label="Your Effective Cover"
              sublabel={`Personal: ${fmtCurrency(healthInsurance.personalCover)} + Corporate: ${fmtCurrency(healthInsurance.corporateCover)}`}
              value={healthInsurance.effectiveCoverFormatted}
              icon="🏥"
            />
            {!healthInsurance.isAdequate ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", marginTop: 4, background: "rgba(245,158,11,0.1)", borderRadius: 8, border: "1px solid rgba(245,158,11,0.15)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <AlertTriangle size={16} style={{ color: "#FBBF24" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#FBBF24", fontFamily: "var(--font-display)" }}>COVER GAP</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#FBBF24", fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-display)" }}>{healthInsurance.gapFormatted}</span>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", marginTop: 4, background: "rgba(52,211,153,0.1)", borderRadius: 8, border: "1px solid rgba(52,211,153,0.15)" }}>
                <CheckCircle2 size={16} style={{ color: "#34D399" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#34D399", fontFamily: "var(--font-display)" }}>Health Cover Adequate</span>
              </div>
            )}
          </div>

          {healthInsurance.isEmployerOnly && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12, padding: 16 }}>
              <AlertTriangle size={20} style={{ color: "#FBBF24", flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#FBBF24", marginBottom: 4, fontFamily: "var(--font-display)" }}>Employer-Dependent Cover</p>
                <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.5, margin: 0, fontFamily: "var(--font-display)" }}>Corporate health insurance ends the day you change jobs, leaving your family exposed.</p>
              </div>
            </div>
          )}

          {healthInsurance.showSuperTopUpReco && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.2)", borderRadius: 12, padding: 16 }}>
              <ArrowUpRight size={20} style={{ color: "#2DD4BF", flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#2DD4BF", marginBottom: 4, fontFamily: "var(--font-display)" }}>Super Top-Up Recommended</p>
                <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.5, margin: 0, fontFamily: "var(--font-display)" }}>
                  Add a ₹50L super top-up to reach {healthInsurance.totalWithTopUp} total cover at minimal cost.
                </p>
              </div>
            </div>
          )}

          {/* 80D */}
          <div style={{ background: "#0B0F1A", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", padding: 16 }}>
            <h4 style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, fontFamily: "var(--font-display)" }}>Section 80D Tax Benefits</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { value: "₹25,000", label: "Self / Family" },
                { value: "₹25,000", label: "Parents (<60)" },
                { value: "₹50,000", label: "Parents (60+)" },
              ].map((item) => (
                <div key={item.label} style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#10B981", margin: 0, fontFamily: "var(--font-display)" }}>{item.value}</p>
                  <p style={{ fontSize: 11, color: "#64748B", fontFamily: "var(--font-display)" }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <GuidancePanel items={healthDo} type="do" />
            <GuidancePanel items={healthDont} type="dont" />
          </div>
        </div>
      </section>

      {/* ADDITIONAL COVERAGE */}
      {additionalCoverage.length > 0 && (
        <section id="additional">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={16} style={{ color: "#FBBF24" }} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#F1F5F9", margin: 0, fontFamily: "var(--font-display)" }}>Additional Coverage</h3>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0, fontFamily: "var(--font-display)" }}>Based on your profile</p>
            </div>
          </div>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {additionalCoverage.map((card) => (
              <div key={card.id} style={{ background: "#0F172A", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                    {card.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9", margin: 0, fontFamily: "var(--font-display)" }}>{card.title}</h4>
                    <span style={{ fontSize: 11, color: "#FBBF24", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-display)" }}>Recommended for you</span>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.5, marginBottom: 12, fontFamily: "var(--font-display)" }}>{card.explanation}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "8px 12px" }}>
                  <Wallet size={14} style={{ color: "#94A3B8", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#94A3B8", fontFamily: "var(--font-display)" }}>
                    Estimated: <span style={{ fontWeight: 700, color: "#F1F5F9" }}>
                      {typeof card.estimatedPremium === "number"
                        ? `₹${card.estimatedPremium.toLocaleString("en-IN")}/year`
                        : `${card.estimatedPremium}/year`}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
