const plans = [
    {
        badge: "Free", badgeBg: "#121A22", badgeColor: "#94A3B8",
        name: "Essentials", tagline: "Blind spots revealed", price: "₹0", cycle: "No credit card",
        features: [
            { text: "Basic health score", ok: true }, { text: "Key problems", ok: true },
            { text: "Full analysis", ok: false }, { text: "Action plan", ok: false },
        ],
        btnText: "Start Free", popular: false,
    },
    {
        badge: "Starter", badgeBg: "rgba(45,212,191,0.06)", badgeColor: "#2DD4BF",
        name: "Comprehensive", tagline: "Full picture", price: "₹999", cycle: "One-time · Dashboard",
        features: [
            { text: "Score out of 100", ok: true }, { text: "Tax insights", ok: true },
            { text: "Insurance gap check", ok: true }, { text: "Action guides", ok: true },
            { text: "1-on-1 session", ok: false },
        ],
        btnText: "Get Dashboard →", popular: false,
    },
    {
        badge: "Most Popular", badgeBg: "linear-gradient(135deg, #2DD4BF, #F5C842)", badgeColor: "#080E12",
        name: "Advisory", tagline: "Guidance + correction", price: "₹2,999", cycle: "One-time",
        features: [
            { text: "Everything in Comprehensive", ok: true }, { text: "60-min advisor call", ok: true },
            { text: "Risk profiling", ok: true }, { text: "Portfolio correction plan", ok: true },
            { text: "Tax blueprint", ok: true },
        ],
        btnText: "Get Advisory →", popular: true,
    },
    {
        badge: "Best Value", badgeBg: "rgba(245,200,66,0.06)", badgeColor: "#F5C842",
        name: "Annual", tagline: "Year-round", price: "₹9,999", cycle: "Annual · ₹15/mo",
        features: [
            { text: "Everything in Advisory", ok: true }, { text: "4 quarterly reviews", ok: true },
            { text: "Tax filing support", ok: true }, { text: "Goal tracking", ok: true },
        ],
        btnText: "Apply →", popular: false, gold: true,
    },
];

export function PricingSection() {
    return (
        <section id="pricing" style={{ background: "#0C1319", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "clamp(80px, 10vw, 120px) 0" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem" }}>
                <div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto 8px" }}>
                    <div className="section-tag" style={{ justifyContent: "center" }}>Pricing</div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-1.5px" }}>
                        What does <span className="text-gradient">clarity</span> cost?
                    </h2>
                </div>

                <div className="plans-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 48 }}>
                    {plans.map((p) => (
                        <div key={p.name} className={p.popular ? "plan-card popular" : "plan-card"}>
                            <span style={{ fontFamily: "var(--font-display)", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 6, marginBottom: 14, width: "fit-content", background: p.badgeBg, color: p.badgeColor }}>{p.badge}</span>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 2 }}>{p.name}</div>
                            <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>{p.tagline}</div>
                            <div className="text-gradient" style={{ fontFamily: "var(--font-display)", fontSize: 38, fontWeight: 800, lineHeight: 1, marginBottom: 4, letterSpacing: "-1.5px" }}>{p.price}</div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: 11, color: "#94A3B8", marginBottom: 20 }}>{p.cycle}</div>

                            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7, marginBottom: "auto", paddingBottom: 20, margin: 0, padding: "0 0 20px 0" }}>
                                {p.features.map((f) => (
                                    <li key={f.text} style={{ fontSize: 12, display: "flex", gap: 6, lineHeight: 1.5, color: f.ok ? "#CBD5E1" : "#334155" }}>
                                        <span style={{ color: f.ok ? "#2DD4BF" : "#334155", fontWeight: 700, flexShrink: 0 }}>{f.ok ? "✓" : "✗"}</span>
                                        {f.text}
                                    </li>
                                ))}
                            </ul>

                            <a href="https://app.myfinancial.in" target="_blank" rel="noopener noreferrer" className={p.popular ? "btn-plan popular" : "btn-plan"} style={p.gold ? { borderColor: "#F5C842", color: "#F5C842", textDecoration: "none", textAlign: "center" } : { textDecoration: "none", textAlign: "center" }}>{p.btnText}</a>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) { .plans-grid { grid-template-columns: 1fr 1fr !important; } }
                @media (max-width: 600px) { .plans-grid { grid-template-columns: 1fr !important; } }
            `}</style>
        </section>
    );
}
