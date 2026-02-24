import type { Metadata } from "next";
import { Check } from "lucide-react";

export const metadata: Metadata = {
    title: "Pricing | MyFinancial",
    description: "Simple, transparent pricing for MyFinancial. Start free, upgrade when ready.",
};

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
        ctaStyle: "border border-gray-200 text-foreground hover:bg-gray-50",
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
        ctaStyle: "bg-accent text-white hover:bg-accent-dark",
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
        <main className="min-h-screen bg-white">
            {/* Hero */}
            <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
                <div className="container-marketing text-center">
                    <p className="text-overline text-accent mb-3">PRICING</p>
                    <h1 className="text-h1 text-foreground mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-body-lg text-gray-500 max-w-[500px] mx-auto">
                        Start for free, upgrade to Premium for advanced insights when you're ready to take control.
                    </p>
                </div>
            </section>

            {/* Plan Cards */}
            <section className="pb-20">
                <div className="container-marketing">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[720px] mx-auto">
                        {plans.map((plan, i) => (
                            <div
                                key={i}
                                className={`relative rounded-2xl p-8 border ${plan.highlight
                                        ? "border-accent bg-white shadow-lg"
                                        : "border-gray-200 bg-white"
                                    }`}
                            >
                                {plan.badge && (
                                    <span className="absolute -top-3 right-6 text-xs font-bold text-white bg-accent px-3 py-1 rounded-full">
                                        {plan.badge}
                                    </span>
                                )}
                                <h3 className={`text-lg font-bold mb-2 ${plan.highlight ? "text-accent" : "text-foreground"}`}>
                                    {plan.name}
                                </h3>
                                <div className="mb-3">
                                    <span className="text-3xl font-extrabold text-foreground">{plan.price}</span>
                                    <span className="text-sm text-gray-400 ml-1">{plan.priceLabel}</span>
                                </div>
                                <p className="text-sm text-gray-500 mb-6 leading-relaxed">{plan.description}</p>
                                <ul className="space-y-2.5 mb-8">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-2.5 text-sm text-foreground">
                                            <span className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center">
                                                <Check size={12} className="text-accent" />
                                            </span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <a
                                    href="#"
                                    className={`block text-center text-sm font-semibold px-6 py-3 rounded-xl transition-colors ${plan.ctaStyle}`}
                                >
                                    {plan.cta}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Compare Features */}
            <section className="section-padding bg-gray-50">
                <div className="container-marketing">
                    <h2 className="text-h3 text-foreground text-center mb-10">Compare Features</h2>

                    <div className="max-w-[800px] mx-auto">
                        {/* Header */}
                        <div className="grid grid-cols-[1fr_100px_100px] items-end border-b border-gray-200 pb-3 mb-0">
                            <span className="text-sm font-semibold text-gray-400">Feature</span>
                            <span className="text-sm font-semibold text-foreground text-center">Free</span>
                            <span className="text-sm font-semibold text-accent text-center">Premium</span>
                        </div>

                        {compareCategories.map((cat, ci) => (
                            <div key={ci}>
                                {/* Category Header */}
                                <div className="py-3 mt-4">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{cat.title}</span>
                                </div>
                                {cat.features.map((f, fi) => (
                                    <div
                                        key={fi}
                                        className="grid grid-cols-[1fr_100px_100px] items-center py-3 border-b border-gray-100"
                                    >
                                        <span className="text-sm text-foreground">{f.name}</span>
                                        <div className="flex justify-center">
                                            {f.free === true ? (
                                                <Check size={16} className="text-accent" />
                                            ) : f.free === false ? (
                                                <span className="text-gray-300">—</span>
                                            ) : (
                                                <span className="text-xs text-gray-400">{f.free}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-center">
                                            {f.premium === true ? (
                                                <Check size={16} className="text-accent" />
                                            ) : f.premium === false ? (
                                                <span className="text-gray-300">—</span>
                                            ) : (
                                                <span className="text-xs font-semibold text-accent">{f.premium}</span>
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
