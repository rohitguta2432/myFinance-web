import { Check } from "lucide-react";

const features = [
    { name: "Post-tax Income Analysis", free: true, premium: true },
    { name: "Old vs New Tax Regime", free: true, premium: true },
    { name: "Net Worth Tracking", free: true, premium: true },
    { name: "Basic Investment Allocation", free: true, premium: true },
    { name: "Detailed Portfolio X-Ray", free: false, premium: true },
    { name: "Real Inflation Impact", free: false, premium: true },
    { name: "Retirement Goal Planning", free: false, premium: true },
    { name: "Tax Harvesting Alerts", free: false, premium: true },
    { name: "Priority Support", free: false, premium: true },
];

export function PricingTableSection() {
    return (
        <section className="section-padding" style={{ backgroundColor: "#111827" }} id="pricing">
            <div className="container-marketing">
                {/* Header */}
                <div className="text-center mb-14">
                    <h2 className="text-h3 font-bold mb-2" style={{ color: "#F1F5F9" }}>
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-body" style={{ color: "#94A3B8" }}>
                        Start for free, upgrade when you need deeper insights.
                    </p>
                </div>

                {/* Pricing Table */}
                <div className="max-w-[680px] mx-auto">
                    {/* Header Row */}
                    <div
                        className="grid grid-cols-[1fr_110px_110px] items-end rounded-t-xl px-5 py-3.5"
                        style={{
                            backgroundColor: "rgba(15, 23, 42, 0.6)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderBottom: "none",
                        }}
                    >
                        <span className="text-sm font-semibold" style={{ color: "#64748B" }}>Features</span>
                        <div className="text-center">
                            <span className="text-sm font-bold block" style={{ color: "#F1F5F9" }}>Free</span>
                            <span className="text-xs" style={{ color: "#64748B" }}>₹0 forever</span>
                        </div>
                        <div className="text-center">
                            <span className="text-sm font-bold block" style={{ color: "#10B981" }}>Premium</span>
                            <span className="text-xs" style={{ color: "#64748B" }}>₹499/year</span>
                        </div>
                    </div>

                    {/* Feature Rows */}
                    <div
                        className="rounded-b-xl overflow-hidden"
                        style={{
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderTop: "none",
                        }}
                    >
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="grid grid-cols-[1fr_110px_110px] items-center py-3.5 px-5"
                                style={{
                                    borderBottom: i < features.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                                }}
                            >
                                <span className="text-sm" style={{ color: "#F1F5F9" }}>{f.name}</span>
                                <div className="flex justify-center">
                                    {f.free ? (
                                        <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                                            <Check size={12} className="text-white" strokeWidth={3} />
                                        </span>
                                    ) : (
                                        <span style={{ color: "#334155" }}>—</span>
                                    )}
                                </div>
                                <div className="flex justify-center">
                                    {f.premium ? (
                                        <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                                            <Check size={12} className="text-white" strokeWidth={3} />
                                        </span>
                                    ) : (
                                        <span style={{ color: "#334155" }}>—</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-8 text-center">
                        <a
                            href="https://app.myfinancial.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-8 py-3.5 text-white text-sm font-semibold rounded-xl transition-colors"
                            style={{
                                backgroundColor: "#10B981",
                                boxShadow: "0 0 20px -4px rgba(16,185,129,0.3)",
                            }}
                        >
                            Start Free Assessment →
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
