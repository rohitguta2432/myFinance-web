import { TrendingDown } from "lucide-react";

/* Mini sparkline SVGs for each card */
function SparklineUp() {
    return (
        <svg viewBox="0 0 60 24" width="60" height="24" style={{ display: "block" }}>
            <path d="M1,20 C10,18 20,14 30,10 C40,6 50,3 59,2" stroke="#10B981" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
    );
}

function SparklineDown() {
    return (
        <svg viewBox="0 0 60 24" width="60" height="24" style={{ display: "block" }}>
            <path d="M1,4 C10,6 20,10 30,14 C40,18 50,20 59,22" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
    );
}

const insights = [
    {
        badge: "EXAMPLE",
        label: "POST-TAX TAKE-HOME",
        metric: "₹38.2L",
        suffix: " /yr",
        description: "On a CTC of ₹45.7L, after income tax (new regime), EPF, and professional tax — this is what actually reaches you.",
        footer: "↘ −₹7.5L from gross",
        footerSub: "Significant tax savings identified",
        footerColor: "#10B981",
        sparkline: <SparklineUp />,
    },
    {
        badge: "EXAMPLE",
        label: "INSURANCE GAP",
        metric: "₹1.6Cr",
        description: "Your current term cover of ₹50L covers 3.2 years of expenses. Your dependents need coverage for 16.7 years.",
        footer: "▲ Cover 13.5 yrs gap",
        footerSub: "Family protection is critical",
        footerColor: "#EF4444",
        sparkline: <SparklineDown />,
    },
    {
        badge: "EXAMPLE",
        label: "RETIREMENT CORPUS",
        metric: "₹2.4Cr",
        suffix: " needed",
        description: "To retire at 50 with monthly expenses of ₹85K — adjusted for inflation at 6% over 15 years.",
        footer: "↘ ₹1.3Cr shortfall",
        footerSub: "Action plan needs to bridge gap",
        footerColor: "#EF4444",
        sparkline: <SparklineDown />,
    },
];

export function SampleInsightsSection() {
    return (
        <section className="section-padding" style={{ backgroundColor: "#0B1120" }} id="insights">
            <div className="container-marketing">
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 56 }}>
                    <p className="text-overline" style={{ color: "#10B981", marginBottom: 12 }}>SAMPLE REPORT</p>
                    <h2 className="text-h2" style={{ color: "#F1F5F9", marginBottom: 12 }}>
                        Uncover hidden gaps in your finances
                    </h2>
                    <p className="text-body" style={{ color: "#94A3B8", maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
                        See exactly where your money goes and what you need to do next with our comprehensive analysis.
                    </p>
                </div>

                {/* 3 Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, maxWidth: 960, marginLeft: "auto", marginRight: "auto" }}>
                    {insights.map((item, i) => (
                        <div
                            key={i}
                            style={{
                                borderRadius: 16,
                                padding: 24,
                                display: "flex",
                                flexDirection: "column",
                                backgroundColor: "rgba(15, 23, 42, 0.6)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                backdropFilter: "blur(12px)",
                                transition: "all 0.3s ease",
                            }}
                        >
                            {/* Badge + Sparkline */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                                <span
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 700,
                                        borderRadius: 4,
                                        padding: "2px 8px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                        color: "#64748B",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                    }}
                                >
                                    {item.badge}
                                </span>
                                {item.sparkline}
                            </div>

                            {/* Label */}
                            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748B", marginBottom: 4 }}>
                                {item.label}
                            </p>

                            {/* Metric */}
                            <p style={{ fontSize: 30, fontWeight: 800, color: "#F1F5F9", marginBottom: 12 }}>
                                {item.metric}
                                {item.suffix && <span style={{ fontSize: 16, fontWeight: 400, color: "#64748B" }}>{item.suffix}</span>}
                            </p>

                            {/* Footer */}
                            <div style={{ paddingTop: 12, marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                <p style={{ fontSize: 14, fontWeight: 600, color: item.footerColor }}>
                                    {item.footer}
                                </p>
                                <p style={{ fontSize: 12, marginTop: 2, color: "#64748B" }}>{item.footerSub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
