"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useFeatureFlag, useFeatureFlagsPublic } from "@/hooks/useFeatureFlags";

const APP_URL = "/dashboard";

const plans = [
    {
        name: "Essentials",
        price: "₹0",
        priceLabel: "free forever",
        description: "Your financial blind spots, revealed. No credit card needed.",
        features: [
            { text: "Basic financial health score", ok: true },
            { text: "Highlights key problems & issues in your financial life", ok: true },
            { text: "Protection, Wealth & Debt snapshot", ok: true },
            { text: "Identifies critical gaps to address", ok: true },
            { text: "Full 5-dimension analysis", ok: false },
            { text: "Action plan & step-by-step guides", ok: false },
        ],
        cta: "Start Free →",
        highlight: false,
    },
    {
        name: "Comprehensive (Diagnostic)",
        price: "₹999",
        priceLabel: "one-time",
        description: "Full financial picture, instant clarity. Interactive dashboard.",
        features: [
            { text: "Complete financial health score (out of 100)", ok: true },
            { text: "Income & expense analysis", ok: true },
            { text: "Insurance gap assessment", ok: true },
            { text: "Investment health review", ok: true },
            { text: "Tax optimisation insights", ok: true },
            { text: "Goal planning overview", ok: true },
            { text: "Step-by-step action guides", ok: true },
        ],
        cta: "Get My Dashboard →",
        highlight: false,
    },
    {
        name: "Guided Diagnostic",
        price: "₹2,999",
        priceLabel: "one-time",
        description: "Self-serve review with a 60-min 1-on-1 diagnostic walkthrough (educational only).",
        features: [
            { text: "Everything in Comprehensive", ok: true },
            { text: "60-min 1-on-1 diagnostic walkthrough (educational only)", ok: true },
            { text: "Risk profiling assessment", ok: true },
            { text: "Portfolio diagnostic snapshot based on your risk profile", ok: true },
            { text: "Tax optimisation blueprint", ok: true },
        ],
        cta: "Get Guided Diagnostic →",
        highlight: true,
        badge: "Most Popular",
    },
    {
        name: "Annual Diagnostic",
        price: "₹9,999",
        priceLabel: "/ year",
        description: "Year-round diagnostic partnership. Only 15 clients per month.",
        features: [
            { text: "Everything in Guided Diagnostic", ok: true },
            { text: "Portfolio diagnostic guidelines", ok: true },
            { text: "Personalised investment restructuring worksheet", ok: true },
            { text: "Quarterly portfolio diagnostic snapshots", ok: true },
            { text: "Quarterly self-serve reviews & course corrections", ok: true },
            { text: "Tax-filing checklist + DIY worksheet", ok: true },
            { text: "Annual tax strategy session (educational only)", ok: true },
            { text: "Goal tracking & rebalancing alerts", ok: true },
            { text: "Annual net worth tracking", ok: true },
        ],
        cta: "Apply for Annual Diagnostic →",
        highlight: false,
    },
];

export function PricingContent() {
    const palette = useAppTheme();
    const router = useRouter();
    const { isLoading: flagsLoading } = useFeatureFlagsPublic();
    const showPricing = useFeatureFlag("show_pricing");
    const showSebi = useFeatureFlag("show_sebi_disclaimers");

    useEffect(() => {
        if (!flagsLoading && !showPricing) router.replace("/");
    }, [flagsLoading, showPricing, router]);

    if (flagsLoading || !showPricing) return null;

    return (
        <main style={{ minHeight: "100vh", backgroundColor: palette.bg }}>
            {/* Hero */}
            <section className="section-padding" style={{ background: `linear-gradient(180deg, ${palette.s1} 0%, ${palette.bg} 100%)` }}>
                <div className="container-marketing text-center">
                    <p className="text-overline" style={{ color: "#10B981", marginBottom: 12 }}>PRICING</p>
                    <h1 className="text-h1" style={{ color: palette.txt, marginBottom: 16 }}>
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-body-lg" style={{ color: palette.mute, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
                        Educational diagnostic platform. Start free, upgrade when you&apos;re ready for a deeper diagnostic.
                    </p>
                </div>
            </section>

            {/* Plan Cards */}
            <section style={{ paddingBottom: 80, backgroundColor: palette.bg }}>
                <div className="container-marketing">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ maxWidth: 1200, marginLeft: "auto", marginRight: "auto" }}>
                        {plans.map((plan, i) => (
                            <div
                                key={i}
                                style={{
                                    position: "relative",
                                    borderRadius: 16,
                                    padding: 28,
                                    backgroundColor: palette.s1,
                                    border: plan.highlight
                                        ? "1px solid rgba(16,185,129,0.3)"
                                        : `1px solid ${palette.brd}`,
                                    backdropFilter: "blur(12px)",
                                    boxShadow: plan.highlight
                                        ? "0 0 40px -10px rgba(16,185,129,0.2)"
                                        : "none",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {plan.badge && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: -12,
                                            right: 24,
                                            fontSize: 12,
                                            fontWeight: 700,
                                            color: "#fff",
                                            backgroundColor: "#10B981",
                                            padding: "4px 12px",
                                            borderRadius: 9999,
                                            boxShadow: "0 0 12px -2px rgba(16,185,129,0.4)",
                                        }}
                                    >
                                        {plan.badge}
                                    </span>
                                )}
                                <h3
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 700,
                                        marginBottom: 8,
                                        color: plan.highlight ? "#10B981" : palette.txt,
                                    }}
                                >
                                    {plan.name}
                                </h3>
                                <div style={{ marginBottom: 12 }}>
                                    <span style={{ fontSize: 30, fontWeight: 800, color: palette.txt }}>{plan.price}</span>
                                    <span style={{ fontSize: 14, color: palette.mute, marginLeft: 4 }}>{plan.priceLabel}</span>
                                </div>
                                <p style={{ fontSize: 14, color: palette.mute, marginBottom: 24, lineHeight: 1.6 }}>{plan.description}</p>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: 24, flex: 1 }} className="space-y-2.5">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-start gap-2.5" style={{ fontSize: 14, color: f.ok ? palette.txt : palette.mute, marginBottom: 8 }}>
                                            <span
                                                className="flex items-center justify-center"
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: 9999,
                                                    backgroundColor: f.ok ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)",
                                                    flexShrink: 0,
                                                    marginTop: 2,
                                                }}
                                            >
                                                {f.ok ? (
                                                    <Check size={12} style={{ color: "#10B981" }} />
                                                ) : (
                                                    <X size={12} style={{ color: palette.mute }} />
                                                )}
                                            </span>
                                            <span>{f.text}</span>
                                        </li>
                                    ))}
                                </ul>
                                <a
                                    href={APP_URL}
                                    className="block text-center transition-all"
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 600,
                                        padding: "12px 24px",
                                        borderRadius: 12,
                                        textDecoration: "none",
                                        ...(plan.highlight
                                            ? {
                                                backgroundColor: "#10B981",
                                                color: "#fff",
                                                boxShadow: "0 0 20px -4px rgba(16,185,129,0.3)",
                                            }
                                            : {
                                                backgroundColor: "transparent",
                                                color: palette.txt,
                                                border: `1px solid ${palette.brd2}`,
                                            }),
                                    }}
                                >
                                    {plan.cta}
                                </a>
                                {showSebi && (
                                    <div style={{ marginTop: 12, fontSize: 11, lineHeight: 1.5, color: palette.mute, fontStyle: "italic" }}>
                                        Educational diagnostic only. Not investment advice. We are not SEBI-registered investment advisors.
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Compliance Notice */}
            {showSebi && (
                <section className="section-padding" style={{ backgroundColor: palette.s1 }}>
                    <div className="container-marketing" style={{ maxWidth: 720 }}>
                        <div
                            style={{
                                border: `1px solid ${palette.brd}`,
                                borderRadius: 16,
                                padding: 24,
                                background: palette.bg,
                            }}
                        >
                            <h2 className="text-h3" style={{ color: palette.txt, marginBottom: 12, fontSize: 18 }}>Important: What you&apos;re paying for</h2>
                            <p style={{ fontSize: 14, lineHeight: 1.7, color: palette.mute, marginBottom: 12 }}>
                                MyFinancial is an <strong style={{ color: palette.txt2 }}>educational diagnostic platform</strong>. All tiers
                                provide informational tools, dashboards, checklists, and walkthroughs designed to help you
                                understand your own financial position. Nothing in any tier constitutes investment advice,
                                tax advice, or insurance recommendations.
                            </p>
                            <p style={{ fontSize: 14, lineHeight: 1.7, color: palette.mute }}>
                                We are <strong style={{ color: palette.txt2 }}>not</strong> SEBI-registered investment advisors,
                                AMFI-certified mutual fund distributors, or licensed insurance intermediaries. For
                                personalised advice, please consult a SEBI-registered investment adviser or a qualified
                                chartered accountant.
                            </p>
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
