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

function CheckCircle() {
    return (
        <span
            style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                backgroundColor: "#10B981",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Check size={12} color="#fff" strokeWidth={3} />
        </span>
    );
}

export function PricingTableSection() {
    return (
        <section className="section-padding" style={{ backgroundColor: "#111827" }} id="pricing">
            <div className="container-marketing">
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 56 }}>
                    <h2 className="text-h3" style={{ color: "#F1F5F9", fontWeight: 700, marginBottom: 8 }}>
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-body" style={{ color: "#94A3B8" }}>
                        Start for free, upgrade when you need deeper insights.
                    </p>
                </div>

                {/* Pricing Table */}
                <div style={{ maxWidth: 680, marginLeft: "auto", marginRight: "auto" }}>
                    {/* Header Row */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 110px 110px",
                            alignItems: "end",
                            borderRadius: "12px 12px 0 0",
                            padding: "14px 20px",
                            backgroundColor: "rgba(15, 23, 42, 0.6)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderBottom: "none",
                        }}
                    >
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#64748B" }}>Features</span>
                        <div style={{ textAlign: "center" }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9", display: "block" }}>Free</span>
                            <span style={{ fontSize: 12, color: "#64748B" }}>₹0 forever</span>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: "#10B981", display: "block" }}>Premium</span>
                            <span style={{ fontSize: 12, color: "#64748B" }}>₹499/year</span>
                        </div>
                    </div>

                    {/* Feature Rows */}
                    <div
                        style={{
                            borderRadius: "0 0 12px 12px",
                            overflow: "hidden",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderTop: "none",
                        }}
                    >
                        {features.map((f, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 110px 110px",
                                    alignItems: "center",
                                    padding: "14px 20px",
                                    borderBottom: i < features.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                                }}
                            >
                                <span style={{ fontSize: 14, color: "#F1F5F9" }}>{f.name}</span>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    {f.free ? <CheckCircle /> : <span style={{ color: "#334155" }}>—</span>}
                                </div>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    {f.premium ? <CheckCircle /> : <span style={{ color: "#334155" }}>—</span>}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div style={{ marginTop: 32, textAlign: "center" }}>
                        <a
                            href="https://app.myfinancial.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "14px 32px",
                                color: "#fff",
                                fontSize: 14,
                                fontWeight: 600,
                                borderRadius: 12,
                                backgroundColor: "#10B981",
                                boxShadow: "0 0 20px -4px rgba(16,185,129,0.3)",
                                textDecoration: "none",
                                transition: "background-color 0.2s ease",
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
