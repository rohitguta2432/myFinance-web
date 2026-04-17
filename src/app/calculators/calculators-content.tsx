"use client";

import Link from "next/link";
import { CALCULATOR_META } from "@/lib/calculator-utils";
import { useAppTheme } from "@/hooks/useAppTheme";

// Icon emoji map — server-safe; no Lucide client icons needed on index page
const ICON_MAP: Record<string, string> = {
    TrendingUp: "📈",
    DollarSign: "💰",
    CreditCard: "💳",
    PiggyBank: "🐷",
    Shield: "🛡️",
    Home: "🏠",
    Award: "🏆",
    Sunset: "🌅",
    RefreshCw: "🔄",
    BarChart2: "📊",
};

export function CalculatorsContent() {
    const palette = useAppTheme();

    return (
        <main
            id="main-content"
            style={{
                minHeight: "100vh",
                paddingTop: 96,
                background: palette.bg,
                color: palette.txt,
            }}
        >
            <style>{`
                .calc-index-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px;
                }
                @media (min-width: 768px) {
                    .calc-index-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
                @media (min-width: 1024px) {
                    .calc-index-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }
                .calc-card {
                    display: flex;
                    flex-direction: column;
                    border-radius: 16px;
                    padding: 24px 20px;
                    text-decoration: none;
                    color: inherit;
                    transition: border-color 0.2s, transform 0.15s, box-shadow 0.2s;
                }
                .calc-card:hover {
                    border-color: rgba(16,185,129,0.35);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 32px rgba(16,185,129,0.08);
                }
                .calc-card-arrow {
                    display: inline-block;
                    margin-top: auto;
                    padding-top: 16px;
                    font-size: 13px;
                    font-weight: 700;
                    color: #10B981;
                    font-family: var(--font-display);
                }
            `}</style>

            <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 24px 80px" }}>
                {/* Hero */}
                <div style={{ textAlign: "center", marginBottom: 56 }}>
                    <span className="section-tag">Free & Instant</span>
                    <h1
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(2rem, 5vw, 3rem)",
                            fontWeight: 800,
                            color: palette.txt,
                            letterSpacing: "-0.03em",
                            margin: "12px 0 16px",
                        }}
                    >
                        Financial Calculators
                    </h1>
                    <p style={{ fontSize: 17, color: palette.mute, maxWidth: 560, margin: "0 auto" }}>
                        Instant calculations for SIP, EMI, PPF, FD, HRA, NPS, and more — built for Indian investors.
                    </p>
                </div>

                {/* Calculator grid */}
                <div className="calc-index-grid">
                    {Object.entries(CALCULATOR_META).map(([key, meta]) => (
                        <Link
                            key={key}
                            href={meta.href}
                            className="calc-card"
                            style={{
                                background: palette.s1,
                                border: `1px solid ${palette.brd}`,
                            }}
                        >
                            <div style={{ fontSize: 28, marginBottom: 12 }}>{ICON_MAP[meta.icon] ?? "🧮"}</div>
                            <h3
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: palette.txt,
                                    margin: "0 0 8px",
                                }}
                            >
                                {meta.title}
                            </h3>
                            <p style={{ fontSize: 13, color: palette.mute, margin: 0, lineHeight: 1.5 }}>
                                {meta.description}
                            </p>
                            <span className="calc-card-arrow">Calculate →</span>
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div style={{ textAlign: "center", marginTop: 64 }}>
                    <p style={{ fontSize: 15, color: palette.mute, marginBottom: 20 }}>
                        Want a complete picture of your finances?
                    </p>
                    <Link href="/assessment/step-1" className="btn-teal">
                        Get Your Full Financial Diagnosis →
                    </Link>
                </div>
            </div>
        </main>
    );
}
