export function Footer() {
    return (
        <footer
            style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                padding: "48px 0 40px",
                textAlign: "center",
                color: "#94A3B8",
                fontFamily: "var(--font-display)",
                fontSize: 11,
                lineHeight: 2,
                background: "linear-gradient(180deg, rgba(12,19,25,0.6) 0%, rgba(8,14,18,1) 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 -8px 32px rgba(0,0,0,0.3)",
            }}
        >
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 4 }}>
                    <img src="/myfinancial-icon.svg" alt="MyFinancial" width={22} height={22} style={{ borderRadius: 4 }} />
                    <strong style={{ color: "#F0F4F8", fontSize: 13, letterSpacing: "-0.3px" }}>MyFinancial</strong>
                    <span style={{ color: "rgba(255,255,255,0.15)" }}>—</span>
                    <span>India&apos;s Financial Diagnostic Platform</span>
                </div>
                <p style={{ marginTop: 4, color: "#64748B" }}>SEBI RIA In Progress · Mumbai · © 2026</p>
                <div
                    style={{
                        marginTop: 16,
                        paddingTop: 16,
                        borderTop: "1px solid rgba(255,255,255,0.04)",
                        display: "flex",
                        justifyContent: "center",
                        gap: 24,
                    }}
                >
                    {["Privacy", "Terms", "Refund", "Disclaimer"].map((link) => (
                        <a
                            key={link}
                            href="/"
                            style={{
                                color: "#64748B",
                                textDecoration: "none",
                                fontSize: 11,
                                transition: "color 0.2s",
                            }}
                        >
                            {link}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
