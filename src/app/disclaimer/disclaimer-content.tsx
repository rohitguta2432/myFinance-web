"use client";

import { AlertTriangle } from "lucide-react";
import { useAppTheme } from "@/hooks/useAppTheme";

const sections = [
    {
        title: "Not Financial Advice",
        content:
            "MyFinancial is an informational and educational tool designed to help you understand your financial position. It does not constitute financial, investment, tax, or legal advice. The outputs are based solely on the numbers you provide and general calculation models.",
    },
    {
        title: "No Professional Relationship",
        content:
            "Use of MyFinancial does not create a financial advisor-client relationship. We are not SEBI-registered investment advisors, AMFI-certified mutual fund distributors, or licensed insurance intermediaries.",
    },
    {
        title: "Accuracy & Limitations",
        content:
            "While we strive for accuracy, the calculations are based on publicly available tax slabs, standard formulas, and assumptions. Actual tax liability, insurance requirements, and investment returns may differ based on your specific circumstances.",
    },
    {
        title: "Tax Information",
        content:
            "Tax calculations are based on FY 2026-27 slabs from the Union Budget. Tax laws change frequently. The tool's outputs should not be used as the sole basis for tax planning. Always consult a chartered accountant (CA) or tax professional.",
    },
    {
        title: "Insurance Assessment",
        content:
            "Insurance gap calculations use standard human life value and income replacement methods. Actual insurance needs depend on individual circumstances, health conditions, lifestyle, and other factors not captured by this tool.",
    },
    {
        title: "Investment Projections",
        content:
            "Any growth projections or goal feasibility calculations use assumed rates of return and inflation. Past performance does not guarantee future results. Market investments carry inherent risks including potential loss of principal.",
    },
    {
        title: "Limitation of Liability",
        content:
            "MyFinancial, its creators, and contributors shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use this tool or reliance on its outputs.",
    },
    {
        title: "Governing Law",
        content:
            "This disclaimer and your use of MyFinancial shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.",
    },
];

export function DisclaimerContent() {
    const palette = useAppTheme();

    return (
        <>
            {/* Hero */}
            <section className="section-padding" style={{ backgroundColor: palette.bg }}>
                <div className="container-marketing text-center">
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 16,
                            backgroundColor: "rgba(245,158,11,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 24px",
                        }}
                    >
                        <AlertTriangle size={28} style={{ color: "#F59E0B" }} />
                    </div>
                    <h1 className="text-h1" style={{ color: palette.txt, marginBottom: 16 }}>Disclaimer</h1>
                    <p className="text-body-lg" style={{ color: palette.mute, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
                        Please read this disclaimer carefully before using MyFinancial.
                    </p>
                </div>
            </section>

            {/* Sections */}
            <section className="section-padding" style={{ backgroundColor: palette.s1 }}>
                <div className="container-marketing" style={{ maxWidth: 700 }}>
                    {sections.map((s, i) => (
                        <div
                            key={i}
                            style={{
                                paddingTop: 32,
                                paddingBottom: 32,
                                borderBottom: i < sections.length - 1 ? `1px solid ${palette.brd}` : "none",
                            }}
                        >
                            <h2 style={{ fontSize: 18, fontWeight: 600, color: palette.txt, marginBottom: 12 }}>
                                {i + 1}. {s.title}
                            </h2>
                            <p style={{ fontSize: 15, lineHeight: 1.7, color: palette.mute }}>
                                {s.content}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Updated */}
            <section style={{ padding: "48px 0", backgroundColor: palette.bg }}>
                <div className="container-marketing text-center">
                    <p style={{ fontSize: 13, color: palette.mute }}>
                        Last updated: February 2026
                    </p>
                </div>
            </section>
        </>
    );
}
