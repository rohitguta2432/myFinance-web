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
        <section className="section-padding bg-white" id="pricing">
            <div className="container-marketing">
                {/* Header */}
                <div className="text-center mb-14">
                    <h2 className="text-h3 text-foreground font-bold mb-2">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-body text-gray-500">
                        Start for free, upgrade when you need deeper insights.
                    </p>
                </div>

                {/* Pricing Table */}
                <div className="max-w-[680px] mx-auto">
                    {/* Header Row — shaded background matching Stitch */}
                    <div className="grid grid-cols-[1fr_110px_110px] items-end bg-gray-50 rounded-t-xl px-5 py-3.5 border border-gray-200 border-b-0">
                        <span className="text-sm font-semibold text-gray-500">Features</span>
                        <div className="text-center">
                            <span className="text-sm font-bold text-foreground block">Free</span>
                            <span className="text-xs text-gray-400">₹0 forever</span>
                        </div>
                        <div className="text-center">
                            <span className="text-sm font-bold text-accent block">Premium</span>
                            <span className="text-xs text-gray-400">₹499/year</span>
                        </div>
                    </div>

                    {/* Feature Rows */}
                    <div className="border border-gray-200 border-t-0 rounded-b-xl overflow-hidden">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="grid grid-cols-[1fr_110px_110px] items-center py-3.5 px-5 border-b border-gray-100 last:border-b-0"
                            >
                                <span className="text-sm text-foreground">{f.name}</span>
                                <div className="flex justify-center">
                                    {f.free ? (
                                        <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                                            <Check size={12} className="text-white" strokeWidth={3} />
                                        </span>
                                    ) : (
                                        <span className="text-gray-300">—</span>
                                    )}
                                </div>
                                <div className="flex justify-center">
                                    {f.premium ? (
                                        <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                                            <Check size={12} className="text-white" strokeWidth={3} />
                                        </span>
                                    ) : (
                                        <span className="text-gray-300">—</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-8 text-center">
                        <a
                            href="#"
                            className="inline-flex items-center px-8 py-3.5 bg-accent text-white text-sm font-semibold rounded-xl hover:bg-accent-dark transition-colors"
                        >
                            Start Free Assessment →
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
