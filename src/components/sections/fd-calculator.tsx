"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";

export function FDCalculatorSection() {
    const [rate, setRate] = useState("7.0");
    const [tax, setTax] = useState("30");
    const [inflation, setInflation] = useState("6.0");

    const r = parseFloat(rate) || 0;
    const t = parseFloat(tax) || 0;
    const inf = parseFloat(inflation) || 0;
    const postTax = r * (1 - t / 100);
    const realReturn = postTax - inf;
    const hasValues = r > 0 && t >= 0 && inf > 0;

    return (
        <section className="section-padding bg-white" id="calculator">
            <div className="container-marketing">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
                        <Calculator size={14} />
                        MINI DEMO
                    </div>
                    <h2 className="text-h2 text-foreground mb-3">
                        Real Return Calculator
                    </h2>
                    <p className="text-body text-gray-500">
                        See what your Fixed Deposit is actually earning after inflation and taxes.
                    </p>
                </div>

                {/* Calculator Card */}
                <div className="max-w-[560px] mx-auto bg-gray-50 rounded-2xl border border-gray-100 p-8">
                    {/* Input Row */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                FD Interest Rate
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={rate}
                                    onChange={(e) => setRate(e.target.value)}
                                    placeholder="e.g. 7.5"
                                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Tax Slab
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={tax}
                                    onChange={(e) => setTax(e.target.value)}
                                    placeholder="e.g. 30"
                                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Inflation
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inflation}
                                    onChange={(e) => setInflation(e.target.value)}
                                    placeholder="e.g. 6"
                                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                            </div>
                        </div>
                    </div>

                    {/* Result */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 text-center mb-6">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Your Real Return (Approx)
                        </p>
                        {hasValues ? (
                            <>
                                <p className={`text-3xl font-extrabold ${realReturn >= 0 ? "text-accent" : "text-red-500"}`}>
                                    {realReturn >= 0 ? "+" : ""}{realReturn.toFixed(1)}%
                                    <span className="text-lg ml-1">{realReturn >= 0 ? "↗" : "↘"}</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {realReturn < 0
                                        ? "You are losing purchasing power."
                                        : "Your money is growing in real terms."}
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-1 bg-foreground rounded-full mx-auto mb-2" />
                                <p className="text-xs text-gray-400">Enter values above to calculate</p>
                            </>
                        )}
                    </div>

                    {/* CTA */}
                    <a
                        href="#"
                        className="block text-center bg-accent text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-accent-dark transition-colors w-full"
                    >
                        Calculate Real Return →
                    </a>
                </div>
            </div>
        </section>
    );
}
