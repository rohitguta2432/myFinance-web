const rules = [
    { icon: "🍽️", title: "Meal Coupons: ₹50 → ₹200/meal", sub: "~₹1.05L annual tax-free" },
    { icon: "📚", title: "Child Education: ₹100 → ₹3,000/mo", sub: "₹72,000/yr for 2 children" },
    { icon: "🫠", title: "Hostel: ₹300 → ₹9,000/mo", sub: "₹2,16,000/yr for 2 children" },
];

const taxRows = [
    { label: "HRA under-optimisation", val: "-₹48,000" },
    { label: "NPS Tier I (80CCD)", val: "-₹46,800" },
    { label: "Wrong regime", val: "-₹36,400" },
    { label: "LTA not claimed", val: "-₹18,000" },
    { label: "Meal Coupons", sub: "₹200/meal · ~250 days", val: "-₹1,05,000" },
    { label: "Child Education", sub: "₹3,000/mo × 2", val: "-₹72,000" },
    { label: "Hostel Allowance", sub: "₹9,000/mo × 2", val: "-₹2,16,000" },
];

export function TaxSection() {
    return (
        <section style={{ background: "#0C1319", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "clamp(80px, 10vw, 120px) 0" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem" }}>
                <div className="tax-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
                    {/* Left */}
                    <div>
                        <div className="section-tag">Tax Rules · April 2026</div>
                        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-1.5px", marginBottom: 16 }}>
                            2026 rules changed. Most employees <span className="text-gradient">don&apos;t know yet.</span>
                        </h2>
                        <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: "#94A3B8", lineHeight: 1.75, maxWidth: 520, fontStyle: "italic", marginBottom: 16 }}>
                            Significantly raised allowances. Most haven&apos;t acted.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "20px 0 28px" }}>
                            {rules.map((r) => (
                                <div key={r.title} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: 14, background: "#121A22", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "#1A242F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{r.icon}</div>
                                    <div>
                                        <b style={{ fontFamily: "var(--font-display)", display: "block", fontSize: 13, color: "#F0F4F8" }}>{r.title}</b>
                                        <span style={{ fontSize: 12, color: "#94A3B8" }}>{r.sub}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <a href="https://app.myfinancial.in" target="_blank" rel="noopener noreferrer" className="btn-teal">Discover My Tax Savings →</a>
                    </div>

                    {/* Right — Tax Card */}
                    <div style={{ background: "#121A22", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, overflow: "hidden" }}>
                        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <h4 style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
                                Illustrative Opportunity
                                <span style={{ background: "rgba(16,185,129,0.06)", color: "#10B981", fontFamily: "var(--font-display)", fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 4 }}>New Rules</span>
                            </h4>
                        </div>
                        <div style={{ padding: "6px 20px" }}>
                            {taxRows.map((row) => (
                                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                                    <span style={{ fontSize: 13, color: "#CBD5E1" }}>
                                        {row.label}
                                        {row.sub && <small style={{ display: "block", fontSize: 11, color: "#334155", marginTop: 1 }}>{row.sub}</small>}
                                    </span>
                                    <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "#FB923C", whiteSpace: "nowrap" }}>{row.val}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(251,146,60,0.03)" }}>
                            <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700 }}>Potential savings</span>
                            <span style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "#FB923C", letterSpacing: "-0.5px" }}>₹5,42,200</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) { .tax-grid { grid-template-columns: 1fr !important; gap: 32px !important; } }
            `}</style>
        </section>
    );
}
