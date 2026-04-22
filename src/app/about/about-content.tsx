"use client";

import Link from "next/link";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ShieldCheck, BookOpen, Sparkles } from "lucide-react";

export function AboutContent() {
    const palette = useAppTheme();

    return (
        <section style={{ padding: "clamp(64px, 8vw, 96px) 24px", minHeight: "80vh" }}>
            <div style={{ maxWidth: 880, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: 48 }}>
                    <span
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "6px 16px", borderRadius: 9999,
                            fontSize: 12, fontWeight: 600, letterSpacing: "0.03em",
                            background: "rgba(16, 185, 129, 0.12)",
                            color: "#10B981",
                            border: "1px solid rgba(16, 185, 129, 0.2)",
                            marginBottom: 20,
                        }}
                    >
                        <Sparkles size={12} /> About
                    </span>
                    <h1
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(32px, 5vw, 52px)",
                            fontWeight: 800, lineHeight: 1.1,
                            letterSpacing: "-1.5px",
                            color: palette.txt,
                            marginBottom: 16,
                        }}
                    >
                        Built to show you the full picture.
                    </h1>
                    <p
                        style={{
                            fontSize: 18, lineHeight: 1.6, color: palette.txt2,
                            maxWidth: 640, margin: "0 auto",
                        }}
                    >
                        MyFinancial is a privacy-first financial diagnostic for Indian earning
                        professionals. No signup, no data sharing, no products to sell you.
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "220px 1fr",
                        gap: 40,
                        alignItems: "start",
                        marginBottom: 56,
                    }}
                    className="about-founder-grid"
                >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                        <div
                            style={{
                                width: 200, height: 200, borderRadius: 20, overflow: "hidden",
                                border: "2px solid rgba(16,185,129,0.22)",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                            }}
                        >
                            <img
                                src="/nitin.jpeg"
                                alt="Nithin Pushkaran, Founder of MyFinancial"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <strong
                                style={{
                                    display: "block",
                                    fontFamily: "var(--font-display)",
                                    color: palette.txt,
                                    fontSize: 17,
                                    marginBottom: 4,
                                }}
                            >
                                Nithin Pushkaran
                            </strong>
                            <span style={{ fontSize: 13, color: palette.txt2 }}>
                                Founder · NISM Certified
                            </span>
                        </div>
                    </div>

                    <div style={{ color: palette.txt2, fontSize: 15.5, lineHeight: 1.85 }}>
                        <h2
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(22px, 3vw, 30px)",
                                fontWeight: 700,
                                letterSpacing: "-0.4px",
                                color: palette.txt,
                                marginBottom: 12,
                            }}
                        >
                            The founder
                        </h2>
                        <blockquote
                            style={{
                                fontFamily: "var(--font-serif)",
                                fontSize: 18, fontStyle: "italic",
                                lineHeight: 1.55, color: palette.txt2,
                                margin: "0 0 20px",
                                paddingLeft: 18,
                                borderLeft: "2px solid #10B981",
                            }}
                        >
                            &ldquo;Most people aren&apos;t bad with money. They just never had a
                            system that showed them the full picture — without an agenda behind
                            it.&rdquo;
                        </blockquote>
                        <p style={{ marginBottom: 14 }}>
                            Nithin Pushkaran built MyFinancial after observing a consistent gap in
                            the Indian financial landscape — qualified professionals earning well,
                            yet making financial decisions in the dark. No holistic view. No
                            structured diagnosis. Just fragmented advice from people with products
                            to sell.
                        </p>
                        <p style={{ marginBottom: 14 }}>
                            Nithin is certified by the National Institute of Securities Markets
                            (NISM), the educational initiative of SEBI. He writes every article on
                            this site himself and reviews every tool that ships.
                        </p>
                        <p>
                            MyFinancial is his answer: a structured, transparent, and conflict-free
                            way to understand where you truly stand. The problem was never the
                            individual — it was the advice ecosystem around them. Fragmented.
                            Incentive-driven. Incapable of providing a full, honest view.
                        </p>
                    </div>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: 20,
                        marginBottom: 56,
                    }}
                >
                    {[
                        {
                            icon: <ShieldCheck size={20} color="#10B981" />,
                            title: "Privacy-first",
                            body: "No name, phone, email required. Assessment data stays local. Full disclosure in our privacy policy.",
                        },
                        {
                            icon: <BookOpen size={20} color="#10B981" />,
                            title: "Conflict-free",
                            body: "No brokerage. No product commissions. SEBI RIA registration in progress — current status disclosed on every page.",
                        },
                        {
                            icon: <Sparkles size={20} color="#10B981" />,
                            title: "Built for India",
                            body: "Tax, insurance, and investment frameworks tuned to Indian law and Budget 2025-26.",
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            style={{
                                padding: 20,
                                borderRadius: 14,
                                background: palette.s2,
                                border: `1px solid ${palette.brd2}`,
                            }}
                        >
                            <div style={{ marginBottom: 10 }}>{item.icon}</div>
                            <h3
                                style={{
                                    fontSize: 15, fontWeight: 700,
                                    color: palette.txt, marginBottom: 6,
                                }}
                            >
                                {item.title}
                            </h3>
                            <p style={{ fontSize: 13, lineHeight: 1.6, color: palette.txt2, margin: 0 }}>
                                {item.body}
                            </p>
                        </div>
                    ))}
                </div>

                <div
                    style={{
                        padding: "28px 28px 30px",
                        borderRadius: 16,
                        background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))",
                        border: "1px solid rgba(16,185,129,0.2)",
                    }}
                >
                    <h3
                        style={{
                            fontSize: 17, fontWeight: 700,
                            color: palette.txt, marginBottom: 10,
                        }}
                    >
                        Editorial policy
                    </h3>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: palette.txt2, margin: "0 0 8px" }}>
                        Every blog post is written by Nithin Pushkaran and reflects personal
                        research plus primary sources (Budget documents, Income Tax Department
                        circulars, SEBI and IRDAI disclosures). We do not accept sponsored posts
                        or paid placements.
                    </p>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: palette.txt2, margin: 0 }}>
                        MyFinancial content is educational, not personalised financial advice.
                        Read the{" "}
                        <Link
                            href="/disclaimer"
                            style={{ color: "#10B981", textDecoration: "underline" }}
                        >
                            full disclaimer
                        </Link>{" "}
                        before acting on anything on this site.
                    </p>
                </div>
            </div>

            <style>{`
                @media (max-width: 720px) {
                    .about-founder-grid {
                        grid-template-columns: 1fr !important;
                        gap: 24px !important;
                        text-align: center;
                    }
                }
            `}</style>
        </section>
    );
}
