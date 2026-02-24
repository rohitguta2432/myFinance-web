import { TrendingDown } from "lucide-react";

const insights = [
    {
        badge: "EXAMPLE",
        label: "POST-TAX TAKE-HOME",
        metric: "₹38.2L",
        suffix: " /yr",
        description: "On a CTC of ₹45.7L, after income tax (new regime), EPF, and professional tax — this is what actually reaches you.",
        footer: "↘ −₹7.5L from gross",
        footerSub: "Significant tax savings identified",
        footerColor: "text-accent",
        iconColor: "bg-accent",
    },
    {
        badge: "EXAMPLE",
        label: "INSURANCE GAP",
        metric: "₹1.6Cr",
        description: "Your current term cover of ₹50L covers 3.2 years of expenses. Your dependents need coverage for 16.7 years.",
        footer: "▲ Cover 13.5 yrs gap",
        footerSub: "Family protection is critical",
        footerColor: "text-red-500",
        iconColor: "bg-accent",
    },
    {
        badge: "EXAMPLE",
        label: "RETIREMENT CORPUS",
        metric: "₹2.4Cr",
        suffix: " needed",
        description: "To retire at 50 with monthly expenses of ₹85K — adjusted for inflation at 6% over 15 years.",
        footer: "↘ ₹1.3Cr shortfall",
        footerSub: "Action plan needs to bridge gap",
        footerColor: "text-red-500",
        iconColor: "bg-accent",
    },
];

export function SampleInsightsSection() {
    return (
        <section className="section-padding bg-white" id="insights">
            <div className="container-marketing">
                {/* Header */}
                <div className="text-center mb-14">
                    <p className="text-overline text-accent mb-3">SAMPLE REPORT</p>
                    <h2 className="text-h2 text-foreground mb-3">
                        Uncover hidden gaps in your finances
                    </h2>
                    <p className="text-body text-gray-500 max-w-[520px] mx-auto">
                        See exactly where your money goes and what you need to do next with our comprehensive analysis.
                    </p>
                </div>

                {/* 3 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[960px] mx-auto">
                    {insights.map((item, i) => (
                        <div
                            key={i}
                            className="bg-gray-50 rounded-2xl border border-gray-100 p-6 flex flex-col hover:shadow-lg transition-shadow"
                        >
                            {/* Badge + Icon Row */}
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-bold text-gray-400 border border-gray-200 rounded px-2 py-0.5 uppercase tracking-wider">
                                    {item.badge}
                                </span>
                                <span className={`w-6 h-6 rounded-full ${item.iconColor} flex items-center justify-center`}>
                                    <TrendingDown size={12} className="text-white" />
                                </span>
                            </div>

                            {/* Label */}
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                {item.label}
                            </p>

                            {/* Metric */}
                            <p className="text-3xl font-extrabold text-foreground mb-3">
                                {item.metric}
                                {item.suffix && <span className="text-base font-normal text-gray-400">{item.suffix}</span>}
                            </p>

                            {/* Footer — colored line */}
                            <div className="border-t border-gray-200 pt-3 mt-auto">
                                <p className={`text-sm font-semibold ${item.footerColor}`}>
                                    {item.footer}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">{item.footerSub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
