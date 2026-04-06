const testimonials = [
    { initials: "SM", name: "Sneha M.", role: "PM · Pune · ₹28L", text: "\u201c6 overlapping large-cap funds. Restructured in 3 weeks.\u201d", result: "↗ ₹2.1L saved" },
    { initials: "RK", name: "Rohit K.", role: "Eng Lead · Hyd · ₹34L", text: "\u201cWrong regime, missing NPS. CA never flagged it.\u201d", result: "↗ ₹1.84L recovered" },
    { initials: "PP", name: "Priya P.", role: "Finance · Mumbai · ₹42L", text: "\u201cDashboard made me uncomfortable. Worth every rupee.\u201d", result: "↗ ₹3.6L fixed" },
];

const allTestimonials = [...testimonials, ...testimonials];

export function TestimonialsSection() {
    return (
        <section style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "clamp(80px, 10vw, 120px) 0" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem" }}>
                <div style={{ textAlign: "center" }}>
                    <div className="section-tag" style={{ justifyContent: "center" }}>Outcomes</div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-1.5px" }}>
                        After the <span className="text-gradient">truth hits.</span>
                    </h2>
                </div>
            </div>

            <div className="testi-track" style={{ marginTop: 40 }}>
                {allTestimonials.map((t, i) => (
                    <div key={`${t.initials}-${i}`} className="testi-card">
                        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(45,212,191,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 800, color: "#2DD4BF", fontSize: 11 }}>{t.initials}</div>
                            <div>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700 }}>{t.name}</div>
                                <div style={{ fontSize: 11, color: "#94A3B8" }}>{t.role}</div>
                            </div>
                        </div>
                        <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.65, fontStyle: "italic", margin: 0 }}>{t.text}</p>
                        <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700, color: "#2DD4BF", background: "rgba(45,212,191,0.06)", padding: "4px 10px", borderRadius: 6 }}>{t.result}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
