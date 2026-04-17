"use client";

import { Check } from "lucide-react";
import { useAppTheme } from "@/hooks/useAppTheme";

const APP_URL = "/dashboard";

const plans = [
    {
        name: "Free",
        price: "₹0",
        priceLabel: "forever",
        description: "Perfect for getting started with your financial health check.",
        features: [
            "Basic Assessment",
            "Limited Reports",
            "Community Access",
        ],
        cta: "Start Free →",
        highlight: false,
    },
    {
        name: "Premium",
        price: "₹499",
        priceLabel: "/year",
        description: "Comprehensive tools for serious financial planning and growth.",
        features: [
            "Full Financial Audit",
            "Advanced Analysis",
            "Export Tools (CSV/PDF)",
            "Priority Support",
        ],
        cta: "Get Premium →",
        highlight: true,
        badge: "Recommended",
    },
];

const compareCategories = [
    {
        title: "CORE ASSESSMENT",
        features: [
            { name: "Core Assessment Checks", free: true, premium: true },
            { name: "Basic Budgeting Tool", free: true, premium: true },
            { name: "Expense Tracking", free: true, premium: true },
            { name: "Mobile App Access", free: true, premium: true },
            { name: "Data Security", free: true, premium: true },
            { name: "Community Forum", free: true, premium: true },
        ],
    },
    {
        title: "ADVANCED ANALYSIS",
        features: [
            { name: "Advanced Investment Analysis", free: false, premium: true },
            { name: "Retirement Planning Pro", free: false, premium: true },
            { name: "Tax Optimization Reports", free: false, premium: true },
            { name: "Personalized Recommendations", free: false, premium: true },
            { name: "Scenario Modeling", free: false, premium: true },
        ],
    },
    {
        title: "EXPORT & TRACKING",
        features: [
            { name: "Export Data (CSV/PDF)", free: false, premium: true },
            { name: "Historical Tracking", free: "Up to 3", premium: "Unlimited" },
            { name: "Custom Categories", free: "Up to 5", premium: "Unlimited" },
            { name: "Bank Syncing", free: false, premium: true },
        ],
    },
    {
        title: "SUPPORT",
        features: [
            { name: "Help Center Access", free: true, premium: true },
            { name: "Email Support", free: "Standard", premium: "Priority" },
            { name: "Onboarding Call", free: false, premium: true },
        ],
    },
];

export function PricingContent() {
    const palette = useAppTheme();

    return (
        <main style={{ minHeight: "100vh", backgroundColor: palette.bg }}>
            {/* Hero */}
            <section className="section-padding" style={{ background: `linear-gradient(180deg, ${palette.s1} 0%, ${palette.bg} 100%)` }}>
                <div className="container-marketing text-center">
                    <p className="text-overline" style={{ color: "#10B981", marginBottom: 12 }}>PRICING</p>
                    <h1 className="text-h1" style={{ color: palette.txt, marginBottom: 16 }}>
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-body-lg" style={{ color: palette.mute, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
                        Start for free, upgrade to Premium for advanced insights when you&apos;re ready to take control.
                    </p>
                </div>
            </section>

            {/* Plan Cards */}
            <section style={{ paddingBottom: 80, backgroundColor: palette.bg }}>
                <div className="container-marketing">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ maxWidth: 720, marginLeft: "auto", marginRight: "auto" }}>
                        {plans.map((plan, i) => (
                            <div
                                key={i}
                                style={{
                                    position: "relative",
                                    borderRadius: 16,
                                    padding: 32,
                                    backgroundColor: palette.s1,
                                    border: plan.highlight
                                        ? "1px solid rgba(16,185,129,0.3)"
                                        : `1px solid ${palette.brd}`,
                                    backdropFilter: "blur(12px)",
                                    boxShadow: plan.highlight
                                        ? "0 0 40px -10px rgba(16,185,129,0.2)"
                                        : "none",
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
                                <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: 32 }} className="space-y-2.5">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-2.5" style={{ fontSize: 14, color: palette.txt }}>
                                            <span
                                                className="flex items-center justify-center"
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: 9999,
                                                    backgroundColor: "rgba(16,185,129,0.1)",
                                                }}
                                            >
                                                <Check size={12} style={{ color: "#10B981" }} />
                                            </span>
                                            {f}
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
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Compare Features */}
            <section className="section-padding" style={{ backgroundColor: palette.s1 }}>
                <div className="container-marketing">
                    <h2 className="text-h3 text-center" style={{ color: palette.txt, marginBottom: 40 }}>Compare Features</h2>

                    <div style={{ maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
                        {/* Header */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 100px 100px",
                                alignItems: "end",
                                borderBottom: `1px solid ${palette.brd}`,
                                paddingBottom: 12,
                            }}
                        >
                            <span style={{ fontSize: 14, fontWeight: 600, color: palette.mute }}>Feature</span>
                            <span className="text-center" style={{ fontSize: 14, fontWeight: 600, color: palette.txt }}>Free</span>
                            <span className="text-center" style={{ fontSize: 14, fontWeight: 600, color: "#10B981" }}>Premium</span>
                        </div>

                        {compareCategories.map((cat, ci) => (
                            <div key={ci}>
                                {/* Category Header */}
                                <div style={{ paddingTop: 16, paddingBottom: 12, marginTop: 16 }}>
                                    <span style={{ fontSize: 10, fontWeight: 700, color: palette.mute, textTransform: "uppercase", letterSpacing: "0.05em" }}>{cat.title}</span>
                                </div>
                                {cat.features.map((f, fi) => (
                                    <div
                                        key={fi}
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 100px 100px",
                                            alignItems: "center",
                                            padding: "12px 0",
                                            borderBottom: `1px solid ${palette.brd}`,
                                        }}
                                    >
                                        <span style={{ fontSize: 14, color: palette.txt }}>{f.name}</span>
                                        <div className="flex justify-center">
                                            {f.free === true ? (
                                                <Check size={16} style={{ color: "#10B981" }} />
                                            ) : f.free === false ? (
                                                <span style={{ color: palette.mute }}>—</span>
                                            ) : (
                                                <span style={{ fontSize: 12, color: palette.mute }}>{f.free}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-center">
                                            {f.premium === true ? (
                                                <Check size={16} style={{ color: "#10B981" }} />
                                            ) : f.premium === false ? (
                                                <span style={{ color: palette.mute }}>—</span>
                                            ) : (
                                                <span style={{ fontSize: 12, fontWeight: 600, color: "#10B981" }}>{f.premium}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
