const problems = [
    { icon: "🔥", title: "Tax Overpayment", desc: "HRA, NPS, capital gain offsets — missed by your CA.", val: "–₹1.2L/yr" },
    { icon: "🔄", title: "Portfolio Drift", desc: "Overlapping funds, wrong categories, excess cash.", val: "–₹2.4L/yr" },
    { icon: "🛡️", title: "Insurance Trap", desc: "Endowments as investments. Inadequate term cover.", val: "–₹1.8L/yr" },
    { icon: "🦊", title: "Retirement Gap", desc: "PF isn't a plan. Corpus shortfall risk.", val: "–₹15L gap" },
];

export function ProblemsSection() {
    return (
        <section id="prob" style={{ padding: "clamp(80px, 10vw, 120px) 0" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem" }}>
                <div className="section-tag">The hidden cost</div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-1.5px", marginBottom: 16 }}>
                    Investing ≠ Financial Health.<br />
                    Most earners <span className="text-gradient">confuse the two.</span>
                </h2>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: "#94A3B8", lineHeight: 1.75, maxWidth: 520, fontStyle: "italic" }}>
                    Control is not clarity — that gap costs you silently every month.
                </p>

                <div className="bento-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 40 }}>
                    {problems.map((p) => (
                        <div key={p.title} className="bento-card">
                            <div style={{ width: 36, height: 36, borderRadius: 9, background: "#121A22", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 14 }}>
                                {p.icon}
                            </div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, marginBottom: 6, letterSpacing: "-0.01em" }}>{p.title}</div>
                            <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>{p.desc}</div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "#FB923C", marginTop: 12, letterSpacing: "-0.5px" }}>{p.val}</div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) { .bento-grid { grid-template-columns: 1fr 1fr !important; } }
                @media (max-width: 600px) { .bento-grid { grid-template-columns: 1fr !important; } }
            `}</style>
        </section>
    );
}
