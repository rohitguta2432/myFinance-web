import { ScrollReveal } from "./scroll-reveal";

const steps = [
    { num: "1", badge: "Step One", title: "You Submit", desc: "Structured intake: salary, investments, insurance, loans, goals. 15 minutes, no documents.", active: false },
    { num: "2", badge: "Step Two", title: "We Analyse", desc: "140+ data points cross-referenced across tax, portfolio, insurance, retirement.", active: true },
    { num: "3", badge: "Step Three", title: "Instant Dashboard", desc: "Interactive dashboard with gaps, scores, and prioritised action plan.", active: false },
];

export function HowItWorksSection() {
    return (
        <section id="how" style={{ padding: "clamp(80px, 10vw, 120px) 0" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem" }}>
                <ScrollReveal>
                    <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
                        <div className="section-tag" style={{ justifyContent: "center" }}>How it works</div>
                        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-1.5px", marginBottom: 16 }}>
                            Not a consultation. A <span className="text-gradient">truth reveal.</span>
                        </h2>
                    </div>
                </ScrollReveal>

                <ScrollReveal>
                    <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 48 }}>
                        {steps.map((s) => (
                            <div
                                key={s.num}
                                style={{
                                    background: s.active ? "rgba(16,185,129,0.06)" : "#0C1319",
                                    border: s.active ? "1px solid rgba(16,185,129,0.15)" : "1px solid rgba(255,255,255,0.05)",
                                    borderRadius: 14,
                                    padding: "28px 22px",
                                    transition: "all 0.3s",
                                }}
                            >
                                <div style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: s.active ? "#10B981" : "#64748B", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                                    <div style={{
                                        width: 22, height: 22, borderRadius: 6,
                                        background: s.active ? "rgba(16,185,129,0.06)" : "#121A22",
                                        border: s.active ? "1px solid rgba(16,185,129,0.15)" : "1px solid rgba(255,255,255,0.05)",
                                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 11, fontWeight: 800, color: s.active ? "#10B981" : undefined,
                                    }}>
                                        {s.num}
                                    </div>
                                    {s.badge}
                                </div>
                                <h4 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 6, letterSpacing: "-0.3px" }}>{s.title}</h4>
                                <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </ScrollReveal>
            </div>

            <style>{`
                @media (max-width: 900px) { .steps-grid { grid-template-columns: 1fr 1fr !important; } }
                @media (max-width: 600px) { .steps-grid { grid-template-columns: 1fr !important; } }
            `}</style>
        </section>
    );
}
