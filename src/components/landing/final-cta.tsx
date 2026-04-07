export function FinalCTASection() {
    return (
        <section style={{ textAlign: "center", padding: "clamp(100px, 14vw, 180px) 0", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", bottom: -100, left: "50%", transform: "translateX(-50%)", width: 500, height: 500, background: "radial-gradient(circle, rgba(16,185,129,0.06), transparent 60%)", pointerEvents: "none" }} />

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem", position: "relative" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4.5vw, 60px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-1.5px", maxWidth: 700, margin: "0 auto 20px" }}>
                    The most expensive thing is <span className="text-gradient">waiting to find out.</span>
                </h2>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: "#94A3B8", lineHeight: 1.75, maxWidth: 440, margin: "0 auto 36px", fontStyle: "italic", textAlign: "center" }}>
                    ₹999. One form. Instant dashboard. The clearest picture you&apos;ve ever had.
                </p>

                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                    <a href="https://app.myfinancial.in" target="_blank" rel="noopener noreferrer" className="btn-teal" style={{ fontSize: 16, padding: "16px 38px", textDecoration: "none" }}>Get My Financial Analysis →</a>
                    <a href="https://app.myfinancial.in" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ textDecoration: "none" }}>Try Free Essentials</a>
                </div>

                <div style={{ fontFamily: "var(--font-display)", fontSize: 11, color: "#334155", marginTop: 20, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                    <span>Confidential</span><span>·</span><span>SEBI RIA In Progress</span><span>·</span><span>No product selling</span>
                </div>
            </div>
        </section>
    );
}
