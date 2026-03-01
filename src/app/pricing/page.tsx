import type { Metadata } from "next";
import { Check } from "lucide-react";

export const metadata: Metadata = {
    title: "Pricing | MyFinancial",
    description: "Simple, transparent pricing for MyFinancial. Start free, upgrade when ready.",
};

const APP_URL = "https://app.myfinancial.in";

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

export default function PricingPage() {
    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#0B1120" }}>
            {/* Hero */}
            <section className="section-padding" style={{ background: "linear-gradient(180deg, #111827 0%, #0B1120 100%)" }}>
                <div className="container-marketing text-center">
                    <p className="text-overline" style={{ color: "#10B981", marginBottom: 12 }}>PRICING</p>
                    <h1 className="text-h1" style={{ color: "#F1F5F9", marginBottom: 16 }}>
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-body-lg" style={{ color: "#94A3B8", maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
                        Start for free, upgrade to Premium for advanced insights when you&apos;re ready to take control.
                    </p>
                </div>
            </section>

            {/* Plan Cards */}
            <section style={{ paddingBottom: 80, backgroundColor: "#0B1120" }}>
                <div className="container-marketing">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ maxWidth: 720, marginLeft: "auto", marginRight: "auto" }}>
                        {plans.map((plan, i) => (
                            <div
                                key={i}
                                style={{
                                    position: "relative",
                                    borderRadius: 16,
                                    padding: 32,
                                    backgroundColor: plan.highlight ? "rgba(15, 23, 42, 0.8)" : "rgba(15, 23, 42, 0.6)",
                                    border: plan.highlight
                                        ? "1px solid rgba(16,185,129,0.3)"
                                        : "1px solid rgba(255,255,255,0.06)",
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
                                        color: plan.highlight ? "#10B981" : "#F1F5F9",
                                    }}
                                >
                                    {plan.name}
                                </h3>
                                <div style={{ marginBottom: 12 }}>
                                    <span style={{ fontSize: 30, fontWeight: 800, color: "#F1F5F9" }}>{plan.price}</span>
                                    <span style={{ fontSize: 14, color: "#64748B", marginLeft: 4 }}>{plan.priceLabel}</span>
                                </div>
                                <p style={{ fontSize: 14, color: "#94A3B8", marginBottom: 24, lineHeight: 1.6 }}>{plan.description}</p>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: 32 }} className="space-y-2.5">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-2.5" style={{ fontSize: 14, color: "#F1F5F9" }}>
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
                                    target="_blank"
                                    rel="noopener noreferrer"
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
                                                color: "#F1F5F9",
                                                border: "1px solid rgba(255,255,255,0.1)",
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
            <section className="section-padding" style={{ backgroundColor: "#111827" }}>
                <div className="container-marketing">
                    <h2 className="text-h3 text-center" style={{ color: "#F1F5F9", marginBottom: 40 }}>Compare Features</h2>

                    <div style={{ maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
                        {/* Header */}
                        <div
                            className="grid grid-cols-[1fr_100px_100px] items-end"
                            style={{
                                borderBottom: "1px solid rgba(255,255,255,0.06)",
                                paddingBottom: 12,
                            }}
                        >
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#64748B" }}>Feature</span>
                            <span className="text-center" style={{ fontSize: 14, fontWeight: 600, color: "#F1F5F9" }}>Free</span>
                            <span className="text-center" style={{ fontSize: 14, fontWeight: 600, color: "#10B981" }}>Premium</span>
                        </div>

                        {compareCategories.map((cat, ci) => (
                            <div key={ci}>
                                {/* Category Header */}
                                <div style={{ paddingTop: 16, paddingBottom: 12, marginTop: 16 }}>
                                    <span style={{ fontSize: 10, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>{cat.title}</span>
                                </div>
                                {cat.features.map((f, fi) => (
                                    <div
                                        key={fi}
                                        className="grid grid-cols-[1fr_100px_100px] items-center"
                                        style={{
                                            padding: "12px 0",
                                            borderBottom: "1px solid rgba(255,255,255,0.04)",
                                        }}
                                    >
                                        <span style={{ fontSize: 14, color: "#F1F5F9" }}>{f.name}</span>
                                        <div className="flex justify-center">
                                            {f.free === true ? (
                                                <Check size={16} style={{ color: "#10B981" }} />
                                            ) : f.free === false ? (
                                                <span style={{ color: "#334155" }}>—</span>
                                            ) : (
                                                <span style={{ fontSize: 12, color: "#64748B" }}>{f.free}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-center">
                                            {f.premium === true ? (
                                                <Check size={16} style={{ color: "#10B981" }} />
                                            ) : f.premium === false ? (
                                                <span style={{ color: "#334155" }}>—</span>
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
