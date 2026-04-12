"use client";

import React from "react";
import Link from "next/link";
import { useAppTheme } from "@/hooks/useAppTheme";

export interface CalculatorLayoutProps {
    title: string;
    description: string;
    inputs: React.ReactNode;
    results: React.ReactNode;
    relatedLinks?: Array<{ label: string; href: string }>;
}

export function CalculatorLayout({ title, description, inputs, results, relatedLinks }: CalculatorLayoutProps) {
    const palette = useAppTheme();

    return (
        <div style={{ minHeight: "100vh", paddingTop: 96, background: palette.bg }}>
            <style>{`
                .calc-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
                @media (min-width: 768px) { .calc-grid { grid-template-columns: 1fr 1fr; gap: 32px; } }
                .calc-outer { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
                @media (min-width: 768px) { .calc-outer { padding: 0 48px; } }
            `}</style>

            <div className="calc-outer">
                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                    <h1
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "2rem",
                            fontWeight: 800,
                            color: palette.txt,
                            margin: 0,
                            marginBottom: 8,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {title}
                    </h1>
                    <p style={{ color: palette.mute, fontSize: 15, margin: 0 }}>{description}</p>
                </div>

                {/* Two-column grid */}
                <div className="calc-grid">
                    {/* Left: Inputs */}
                    <div
                        style={{
                            background: palette.s1,
                            border: `1px solid ${palette.brd}`,
                            borderRadius: 16,
                            padding: 28,
                        }}
                    >
                        {inputs}
                    </div>

                    {/* Right: Results */}
                    <div
                        style={{
                            background: palette.s1,
                            border: `1px solid ${palette.brd}`,
                            borderRadius: 16,
                            padding: 28,
                        }}
                    >
                        {results}
                    </div>
                </div>

                {/* CTA */}
                <div style={{ marginTop: 48, textAlign: "center" }}>
                    <Link href="/assessment/step-1" className="btn-teal">
                        Get Your Full Financial Diagnosis →
                    </Link>
                </div>

                {/* Related calculators */}
                {relatedLinks && relatedLinks.length > 0 && (
                    <div style={{ marginTop: 24, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                        {relatedLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    display: "inline-block",
                                    padding: "6px 14px",
                                    borderRadius: 20,
                                    fontSize: 13,
                                    fontFamily: "var(--font-display)",
                                    fontWeight: 600,
                                    color: palette.txt2,
                                    border: `1px solid ${palette.brd2}`,
                                    background: palette.s2,
                                    textDecoration: "none",
                                    transition: "border-color 0.15s",
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Bottom spacing */}
                <div style={{ height: 64 }} />
            </div>
        </div>
    );
}
