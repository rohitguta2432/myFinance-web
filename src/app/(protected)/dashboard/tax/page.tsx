"use client";

import {
  Receipt, FileText, Building2,
  CheckCircle2, AlertTriangle, Info, ArrowDownRight,
  ArrowUpRight, Sparkles, TrendingDown, Home,
} from "lucide-react";
import { useTaxAnalysis } from "@/hooks/dashboard/useTaxAnalysis";
import { SectionNav } from "@/components/dashboard/SectionNav";
import { useAppTheme } from "@/hooks/useAppTheme";

const TAX_SECTIONS = [
  { id: "regime", label: "Regime" },
  { id: "tds", label: "TDS" },
  { id: "deductions", label: "Deductions" },
  { id: "nps", label: "NPS" },
];

function SectionCard({ children, id }: { children: React.ReactNode; id?: string }) {
  const palette = useAppTheme();
  return (
    <section id={id} style={{ background: palette.s1, borderRadius: 24, border: `1px solid ${palette.brd}`, boxShadow: "0 8px 32px rgba(0,0,0,0.3)", overflow: "hidden" }}>
      {children}
    </section>
  );
}

function SectionHeader({ icon: Icon, iconColor, bgGradient, title, subtitle }: {
  icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>;
  iconColor: string;
  bgGradient: string;
  title: string;
  subtitle: string;
}) {
  const palette = useAppTheme();
  return (
    <div style={{ background: bgGradient, padding: 24, borderBottom: `1px solid ${palette.brd}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: iconColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: palette.txt, margin: 0, fontFamily: "var(--font-display)" }}>{title}</h3>
          <span style={{ fontSize: 11, fontWeight: 600, color: palette.mute, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-display)" }}>{subtitle}</span>
        </div>
      </div>
    </div>
  );
}

export default function TaxPage() {
  const palette = useAppTheme();
  const data = useTaxAnalysis();
  const { regimeComparison, tds, rental, deductions, employerNps, fmt } = data;

  if (!regimeComparison) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(16,185,129,0.3)", borderTopColor: "#10B981", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const { old: oldR, new: newR, recommended, savingsFormatted } = regimeComparison;

  return (
    <>
      <SectionNav sections={TAX_SECTIONS} />
      <div style={{ width: "100%", maxWidth: 1152, margin: "0 auto", padding: "24px 16px 96px", display: "flex", flexDirection: "column", gap: 32 }}>

        {/* Page Title */}
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em", color: palette.txt, margin: 0, fontFamily: "var(--font-display)" }}>Tax Planning</h2>
          <p style={{ fontSize: 13, color: palette.mute, marginTop: 2, fontFamily: "var(--font-display)" }}>FY 2026-27 · Personalised tax analysis</p>
        </div>

        {/* Recommendation Banner */}
        <div id="regime" style={{ borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.1)" }}>
          <h3 style={{ fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", gap: 8, color: "#10B981", margin: 0, marginBottom: 4, fontFamily: "var(--font-display)" }}>
            <Sparkles size={20} />
            RECOMMENDATION: Choose <span style={{ color: palette.txt, marginLeft: 4 }}>{recommended === "old" ? "OLD" : "NEW"} REGIME</span>
          </h3>
          <p style={{ color: palette.txt, fontSize: 20, fontWeight: 700, marginBottom: 8, fontFamily: "var(--font-display)" }}>You SAVE {savingsFormatted}</p>
          <p style={{ color: palette.mute, fontSize: 13, lineHeight: 1.5, margin: 0, fontFamily: "var(--font-display)" }}>
            {recommended === "old"
              ? "Your deductions make Old Regime more beneficial. Review this each year if your investments change."
              : "With lower deductions, New Regime's wider slabs give you better savings."}
          </p>
        </div>

        {/* Comparison Table */}
        <div style={{ background: palette.s1, border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <th style={{ textAlign: "left", padding: "16px 20px", fontSize: 13, fontWeight: 700, color: palette.mute, width: "40%" }}></th>
                  <th style={{
                    textAlign: "center", padding: "16px 20px", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", width: "30%",
                    color: recommended === "old" ? "#10B981" : palette.mute,
                    background: recommended === "old" ? "rgba(16,185,129,0.05)" : "transparent",
                    borderBottom: recommended === "old" ? "2px solid #10B981" : "none",
                    fontFamily: "var(--font-display)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      Old Regime
                      {recommended === "old" && <CheckCircle2 size={16} style={{ color: "#10B981" }} />}
                    </div>
                  </th>
                  <th style={{
                    textAlign: "center", padding: "16px 20px", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", width: "30%",
                    color: recommended === "new" ? "#10B981" : palette.mute,
                    background: recommended === "new" ? "rgba(16,185,129,0.05)" : "transparent",
                    borderBottom: recommended === "new" ? "2px solid #10B981" : "none",
                    fontFamily: "var(--font-display)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      New Regime
                      {recommended === "new" && <CheckCircle2 size={16} style={{ color: "#10B981" }} />}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Gross Income", old: oldR.grossIncome, new: newR.grossIncome },
                  { label: "Standard Deduction", old: oldR.stdDeduction, new: newR.stdDeduction },
                  { label: "Section 80C", old: oldR.deductions80C, new: 0 },
                  { label: "NPS 80CCD", old: oldR.deductionsNps, new: 0 },
                  { label: "HRA Exemption", old: oldR.hraExemption ?? 0, new: 0 },
                  { label: "Other Deductions", old: oldR.otherDeductions ?? 0, new: 0 },
                  { label: "Net Taxable Income", old: oldR.taxableIncome, new: newR.taxableIncome, bold: true },
                  { label: "Tax Calculated", old: oldR.baseTax, new: newR.baseTax },
                  { label: "Cess (4%)", old: oldR.cess, new: newR.cess },
                  { label: "FINAL TAX", old: oldR.totalTax, new: newR.totalTax, final: true },
                ].map((row) => (
                  <tr
                    key={row.label}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      background: row.final ? "rgba(255,255,255,0.04)" : row.bold ? "rgba(255,255,255,0.02)" : "transparent",
                    }}
                  >
                    <td style={{ padding: "12px 20px", fontSize: row.final ? 15 : 13, color: row.final ? palette.txt : row.bold ? palette.txt : palette.txt2, fontWeight: row.final ? 700 : row.bold ? 700 : 400, fontFamily: "var(--font-display)" }}>
                      {row.label}
                    </td>
                    <td style={{
                      textAlign: "center", padding: "12px 20px",
                      fontFamily: "monospace",
                      fontSize: row.final ? 17 : 13,
                      fontWeight: row.final || row.bold ? 700 : 400,
                      color: row.final ? (recommended === "old" ? palette.txt : palette.txt2) : palette.txt2,
                      background: recommended === "old" ? "rgba(16,185,129,0.05)" : "transparent",
                    }}>
                      {fmt(row.old)}
                    </td>
                    <td style={{
                      textAlign: "center", padding: "12px 20px",
                      fontFamily: "monospace",
                      fontSize: row.final ? 17 : 13,
                      fontWeight: row.final || row.bold ? 700 : 400,
                      color: row.final ? (recommended === "new" ? "#10B981" : palette.txt2) : palette.txt2,
                      background: recommended === "new" ? "rgba(16,185,129,0.05)" : "transparent",
                    }}>
                      {fmt(row.new)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TDS Reconciliation */}
        <SectionCard id="tds">
          <SectionHeader icon={Receipt} iconColor="rgba(14,165,233,0.15)" bgGradient="linear-gradient(90deg, rgba(14,165,233,0.1), transparent)" title="TDS Reconciliation" subtitle="Tax deducted at source vs liability" />
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: palette.bg, borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", padding: 16, textAlign: "center" }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: palette.mute, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4, fontFamily: "var(--font-display)" }}>Estimated Tax Liability</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: palette.txt, margin: 0, fontFamily: "var(--font-display)" }}>{tds.recommendedTaxFormatted}</p>
                <p style={{ fontSize: 11, color: palette.mute, marginTop: 2, fontFamily: "var(--font-display)" }}>{recommended === "old" ? "Old Regime" : "New Regime"}</p>
              </div>
              <div style={{ background: palette.bg, borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", padding: 16, textAlign: "center" }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: palette.mute, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4, fontFamily: "var(--font-display)" }}>TDS Deducted (Est.)</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: palette.txt, margin: 0, fontFamily: "var(--font-display)" }}>{tds.totalTDSFormatted}</p>
                <p style={{ fontSize: 11, color: palette.mute, marginTop: 2, fontFamily: "var(--font-display)" }}>@10% of salary</p>
              </div>
            </div>
            {tds.status === "refund" && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 12, padding: 16 }}>
                <ArrowDownRight size={20} style={{ color: "#34D399", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#34D399", marginBottom: 4, fontFamily: "var(--font-display)" }}>Refund Due: {tds.diffFormatted}</p>
                  <p style={{ fontSize: 13, color: palette.mute, lineHeight: 1.5, margin: 0, fontFamily: "var(--font-display)" }}>File your ITR before 31 July to claim it.</p>
                </div>
              </div>
            )}
            {tds.status === "due" && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: 16 }}>
                <ArrowUpRight size={20} style={{ color: "#F87171", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#F87171", marginBottom: 4, fontFamily: "var(--font-display)" }}>Additional Tax Due: {tds.diffFormatted}</p>
                  <p style={{ fontSize: 13, color: palette.mute, lineHeight: 1.5, margin: 0, fontFamily: "var(--font-display)" }}>Pay as Advance Tax before 15 March to avoid interest.</p>
                </div>
              </div>
            )}
            {tds.status === "matched" && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.2)", borderRadius: 12, padding: 16 }}>
                <CheckCircle2 size={20} style={{ color: "#38BDF8", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#38BDF8", marginBottom: 4, fontFamily: "var(--font-display)" }}>TDS Perfectly Matched</p>
                  <p style={{ fontSize: 13, color: palette.mute, lineHeight: 1.5, margin: 0, fontFamily: "var(--font-display)" }}>No additional payment required.</p>
                </div>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Rental Income */}
        {rental.hasRentalIncome && (
          <SectionCard>
            <SectionHeader icon={Home} iconColor="rgba(245,158,11,0.15)" bgGradient="linear-gradient(90deg, rgba(245,158,11,0.1), transparent)" title="Rental Income Treatment" subtitle="Section 24(a) — Standard deduction" />
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: palette.bg, borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: palette.txt2, fontFamily: "var(--font-display)" }}>Gross Rental Income</span>
                  <span style={{ fontWeight: 700, color: palette.txt, fontFamily: "monospace" }}>{rental.grossFormatted}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#FCA5A5", fontFamily: "var(--font-display)" }}>(-) 30% Standard Deduction</span>
                  <span style={{ color: "#FCA5A5", fontFamily: "monospace" }}>-{rental.stdDeductionFormatted}</span>
                </div>
                <div style={{ borderTop: "1px dashed rgba(255,255,255,0.1)", paddingTop: 10, display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ fontWeight: 700, color: palette.txt, fontFamily: "var(--font-display)" }}>Net Rental Added to Income</span>
                  <span style={{ fontWeight: 700, color: "#10B981", fontFamily: "monospace" }}>{rental.netFormatted}</span>
                </div>
              </div>
            </div>
          </SectionCard>
        )}

        {/* Deductions */}
        <SectionCard id="deductions">
          <SectionHeader
            icon={FileText}
            iconColor="rgba(99,102,241,0.15)"
            bgGradient="linear-gradient(90deg, rgba(99,102,241,0.1), transparent)"
            title="Deductions"
            subtitle={deductions.isOldRegime ? "Old Regime — Section 80C / 80CCD" : "New Regime — Limited deductions"}
          />
          <div style={{ padding: 24 }}>
            {deductions.isOldRegime ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ background: palette.bg, borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 24, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 11, fontWeight: 700, color: palette.mute, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    <span style={{ fontFamily: "var(--font-display)" }}>Deduction Type</span>
                    <span style={{ textAlign: "right", fontFamily: "var(--font-display)" }}>Amount</span>
                    <span style={{ textAlign: "right", fontFamily: "var(--font-display)" }}>Status</span>
                  </div>
                  {deductions.items.map((item, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 24, alignItems: "center", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: palette.txt, margin: 0, fontFamily: "var(--font-display)" }}>{item.label}</p>
                        <p style={{ fontSize: 11, color: palette.mute, margin: 0, fontFamily: "var(--font-display)" }}>{item.sublabel}</p>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: palette.txt, textAlign: "right", whiteSpace: "nowrap", fontFamily: "monospace" }}>
                        {fmt(item.amount)} / {fmt(item.max)}
                      </span>
                      <div style={{ textAlign: "right" }}>
                        {item.status === "full" && (
                          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 700, color: "#34D399", fontFamily: "var(--font-display)" }}>
                            <CheckCircle2 size={14} /> Full
                          </span>
                        )}
                        {item.status === "partial" && (
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#FBBF24", fontFamily: "var(--font-display)" }}>Gap: {fmt(item.gap)}</span>
                        )}
                        {item.status === "unused" && (
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#F87171", fontFamily: "var(--font-display)" }}>Not utilised</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {deductions.items[1]?.status !== "full" && deductions.items[1]?.potentialSaving > 0 && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12, padding: 16 }}>
                    <AlertTriangle size={16} style={{ color: "#FBBF24", flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontSize: 13, color: palette.mute, lineHeight: 1.5, margin: 0, fontFamily: "var(--font-display)" }}>
                      NPS 80CCD(1B) not fully utilised — investing the gap could save up to{" "}
                      <span style={{ fontWeight: 700, color: "#FBBF24" }}>{fmt(deductions.items[1].potentialSaving)}</span> in taxes.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ background: palette.bg, borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", padding: 20 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <Info size={20} style={{ color: "#818CF8", flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontSize: 13, color: palette.mute, lineHeight: 1.5, margin: 0, marginBottom: 8, fontFamily: "var(--font-display)" }}>
                      Deductions under 80C, 80CCD(1B), and HRA are <span style={{ fontWeight: 700, color: palette.txt }}>not available</span> under the New Tax Regime. Only the ₹75,000 standard deduction applies.
                    </p>
                    <p style={{ fontSize: 12, color: palette.mute, margin: 0, fontFamily: "var(--font-display)" }}>
                      Your total deduction: <span style={{ fontWeight: 700, color: "#10B981" }}>{fmt(deductions.newRegimeDeduction)}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Employer NPS */}
        {employerNps.show && (
          <SectionCard id="nps">
            <SectionHeader icon={Building2} iconColor="rgba(6,182,212,0.15)" bgGradient="linear-gradient(90deg, rgba(6,182,212,0.1), transparent)" title="Employer NPS Deduction" subtitle="Section 80CCD(2)" />
            <div style={{ padding: 24 }}>
              {employerNps.hasEmployerNps ? (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 12, padding: 16 }}>
                  <CheckCircle2 size={20} style={{ color: "#34D399", flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#34D399", marginBottom: 4, fontFamily: "var(--font-display)" }}>Employer NPS Active</p>
                    <p style={{ fontSize: 13, color: palette.mute, lineHeight: 1.5, margin: 0, fontFamily: "var(--font-display)" }}>
                      Your employer contributes {employerNps.amountFormatted} to your NPS under Section 80CCD(2). This does not count against your ₹1.5L 80C or ₹50K NPS limits.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12, padding: 16 }}>
                  <TrendingDown size={20} style={{ color: "#FBBF24", flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#FBBF24", marginBottom: 4, fontFamily: "var(--font-display)" }}>Potential Tax Saving</p>
                    <p style={{ fontSize: 13, color: palette.mute, lineHeight: 1.5, margin: 0, fontFamily: "var(--font-display)" }}>
                      Setting up employer NPS could save{" "}
                      <span style={{ fontWeight: 700, color: "#FBBF24" }}>{employerNps.potentialSavingFormatted}</span>{" "}
                      in taxes — contact your HR team to set up employer NPS contribution.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </SectionCard>
        )}
      </div>
    </>
  );
}
