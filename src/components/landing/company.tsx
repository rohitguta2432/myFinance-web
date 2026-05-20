"use client";

import { useAppTheme } from "@/hooks/useAppTheme";

export function CompanySection() {
    const palette = useAppTheme();
    return (
        <section id="company" style={{ padding: "clamp(80px, 10vw, 120px) 0" }}>
            <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 2rem" }}>
                <div style={{ textAlign: "center", marginBottom: 48 }}>
                    <div className="section-tag">The company</div>
                    <h2 className="landing-h2" style={{ fontFamily: "var(--font-display)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-1.5px", marginBottom: 16, color: palette.txt }}>
                        Built by a <span className="text-gradient">Registered Indian Company.</span>
                    </h2>
                    <p style={{ color: palette.txt2, fontSize: 16, lineHeight: 1.7, maxWidth: 640, margin: "0 auto" }}>
                        MyFinancial is operated by a Ministry of Corporate Affairs registered private limited company, headquartered in Bangalore.
                    </p>
                </div>

                <div
                    className="company-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 24,
                        maxWidth: 920,
                        margin: "0 auto",
                    }}
                >
                    <div
                        style={{
                            padding: "28px 32px",
                            borderRadius: 16,
                            border: "1px solid rgba(16,185,129,0.18)",
                            background: "rgba(16,185,129,0.04)",
                        }}
                    >
                        <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, color: "#10B981", fontWeight: 700, marginBottom: 10 }}>
                            Legal entity
                        </div>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: palette.txt, lineHeight: 1.35, marginBottom: 14 }}>
                            FINNODIAGNOS ANALYTICS PRIVATE LIMITED
                        </div>
                        <div style={{ fontSize: 13, color: palette.txt2, lineHeight: 1.7 }}>
                            <div style={{ marginBottom: 4 }}>
                                <span style={{ color: palette.mute, marginRight: 6 }}>CIN:</span>
                                <span style={{ color: palette.txt, fontFamily: "var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)" }}>
                                    U62099KA2026PTC219284
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            padding: "28px 32px",
                            borderRadius: 16,
                            border: "1px solid rgba(255,255,255,0.08)",
                            background: "rgba(255,255,255,0.02)",
                        }}
                    >
                        <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, color: "#10B981", fontWeight: 700, marginBottom: 10 }}>
                            Registered office
                        </div>
                        <address style={{ fontStyle: "normal", fontSize: 14, color: palette.txt2, lineHeight: 1.7 }}>
                            No.112, AKR Tech Park, B Block,<br />
                            Bommanahalli, Bangalore South,<br />
                            Bangalore &mdash; 560068,<br />
                            Karnataka, India
                        </address>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 720px) { .company-grid { grid-template-columns: 1fr !important; } }
            `}</style>
        </section>
    );
}
