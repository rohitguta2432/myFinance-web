const creds = [
    { icon: "🎓", title: "NISM Certified — X-A & X-B", sub: ", SEBI-mandated." },
    { icon: "📋", title: "SEBI RIA In Progress", sub: "" },
    { icon: "📐", title: "5-Dimension Health Framework", sub: "" },
];

export function FounderSection() {
    return (
        <section id="founder" style={{ padding: "clamp(80px, 10vw, 120px) 0" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem" }}>
                <div className="founder-grid" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 48, alignItems: "center" }}>
                    {/* Visual */}
                    <div style={{ aspectRatio: "1", background: "linear-gradient(145deg, #121A22, #1A242F)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: "-30%", left: "-30%", width: "60%", height: "60%", background: "radial-gradient(circle, rgba(45,212,191,0.06), transparent)", pointerEvents: "none" }} />
                        <div className="text-gradient" style={{ width: 72, height: 72, borderRadius: 14, background: "rgba(45,212,191,0.06)", border: "1px solid rgba(45,212,191,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800 }}>NP</div>
                        <div style={{ textAlign: "center", fontSize: 12, color: "#64748B" }}>
                            <strong style={{ display: "block", fontFamily: "var(--font-display)", color: "#F0F4F8", fontSize: 14, marginBottom: 2 }}>Nithin Pushkaran</strong>
                            Founder · NISM Certified
                        </div>
                    </div>

                    {/* Text */}
                    <div>
                        <div className="section-tag">The founder</div>
                        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-1.5px", marginBottom: 16 }}>
                            Every professional deserves a <span className="text-gradient">clear, honest picture.</span>
                        </h2>
                        <blockquote style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontStyle: "italic", lineHeight: 1.5, color: "#CBD5E1", margin: "20px 0", paddingLeft: 20, borderLeft: "2px solid #2DD4BF" }}>
                            &ldquo;Most people aren&apos;t bad with money. They just never had a system that showed the full picture — without an agenda.&rdquo;
                        </blockquote>
                        <p style={{ color: "#64748B", fontSize: 14, lineHeight: 1.8, marginBottom: 18 }}>Built for professionals earning well yet deciding in the dark.</p>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 20 }}>
                            {creds.map((c) => (
                                <div key={c.title} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: 12, background: "#0C1319", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: 6, background: "#121A22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{c.icon}</div>
                                    <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5, margin: 0 }}><strong style={{ color: "#CBD5E1" }}>{c.title}</strong>{c.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) { .founder-grid { grid-template-columns: 1fr !important; gap: 32px !important; } }
            `}</style>
        </section>
    );
}
