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
                <div className="text-center mb-14">
                    <p className="text-overline text-accent mb-3">SAMPLE REPORT</p>
                    <h2 className="text-h2 mb-3" style={{ color: "#F1F5F9" }}>
                        Uncover hidden gaps in your finances
                    </h2>
                    <p className="text-body max-w-[520px] mx-auto" style={{ color: "#94A3B8" }}>
                        See exactly where your money goes and what you need to do next with our comprehensive analysis.
                    </p>
                </div>

                {/* 3 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[960px] mx-auto">
                    {insights.map((item, i) => (
                        <div
                            key={i}
                            className="rounded-2xl p-6 flex flex-col"
                            style={{
                                backgroundColor: "rgba(15, 23, 42, 0.6)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                backdropFilter: "blur(12px)",
                                transition: "all 0.3s ease",
                            }}
                        >
                            {/* Badge + Sparkline */}
                            <div className="flex items-center justify-between mb-4">
                                <span
                                    className="text-[10px] font-bold rounded px-2 py-0.5 uppercase tracking-wider"
                                    style={{
                                        color: "#64748B",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                    }}
                                >
                                    {item.badge}
                                </span>
                                {item.sparkline}
                            </div>

                            {/* Label */}
                            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#64748B" }}>
                                {item.label}
                            </p>

                            {/* Metric */}
                            <p className="text-3xl font-extrabold mb-3" style={{ color: "#F1F5F9" }}>
                                {item.metric}
                                {item.suffix && <span className="text-base font-normal" style={{ color: "#64748B" }}>{item.suffix}</span>}
                            </p>

                            {/* Footer */}
                            <div className="pt-3 mt-auto" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                <p className="text-sm font-semibold" style={{ color: item.footerColor }}>
                                    {item.footer}
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>{item.footerSub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
