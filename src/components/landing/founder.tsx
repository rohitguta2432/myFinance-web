"use client";

import { useAppTheme } from "@/hooks/useAppTheme";

export function FounderSection() {
    const palette = useAppTheme();
    return (
        <section id="founder" style={{ padding: "clamp(80px, 10vw, 120px) 0" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem" }}>
                <div className="founder-grid" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 48, alignItems: "center" }}>
                    {/* Visual */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 220, height: 220, borderRadius: 20, overflow: "hidden", border: "2px solid rgba(16,185,129,0.2)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                            <img
                                src="/nitin.jpeg"
                                alt="Nithin Pushkaran"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                        <div style={{ textAlign: "center", fontSize: 14, color: palette.txt2 }}>
                            <strong style={{ display: "block", fontFamily: "var(--font-display)", color: palette.txt, fontSize: 16, marginBottom: 2 }}>Nithin Pushkaran</strong>
                            Founder · NISM Certified
                        </div>
                    </div>

                    {/* Text */}
                    <div>
                        <div className="section-tag">The founder</div>
                        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-1.5px", marginBottom: 16, color: palette.txt }}>
                            Built on One Belief: Every Earning Professional Deserves a <span className="text-gradient">Clear, Honest Picture.</span>
                        </h2>
                        <blockquote style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontStyle: "italic", lineHeight: 1.5, color: palette.txt2, margin: "20px 0", paddingLeft: 20, borderLeft: "2px solid #10B981" }}>
                            &ldquo;Most people aren&apos;t bad with money. They just never had a system that showed them the full picture — without an agenda behind it.&rdquo;
                        </blockquote>
                        <p style={{ color: palette.txt2, fontSize: 14, lineHeight: 1.8, marginBottom: 10 }}>Nithin Pushkaran built MyFinancial after observing a consistent gap in the Indian financial landscape — qualified professionals earning well, yet making financial decisions in the dark. No holistic view. No structured diagnosis. Just fragmented advice from people with products to sell.</p>
                        <p style={{ color: palette.txt2, fontSize: 14, lineHeight: 1.8, marginBottom: 18 }}>MyFinancial is his answer: a structured, transparent, and conflict-free way to understand where you truly stand. The problem was never the individual — it was the advice ecosystem around them. Fragmented. Incentive-driven. Incapable of providing a full, honest view of one&apos;s financial health.</p>

                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) { .founder-grid { grid-template-columns: 1fr !important; gap: 32px !important; } }
            `}</style>
        </section>
    );
}
