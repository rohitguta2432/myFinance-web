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

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "10px 36px 10px 12px",
        backgroundColor: "#1E293B",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12,
        color: "#F1F5F9",
        fontSize: 14,
        outline: "none",
    };

    return (
        <section className="section-padding" style={{ backgroundColor: "#111827" }} id="calculator">
            <div className="container-marketing">
                {/* Header */}
                <div className="text-center mb-10">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
                        style={{
                            backgroundColor: "rgba(16,185,129,0.1)",
                            color: "#10B981",
                        }}
                    >
                        <Calculator size={14} />
                        MINI DEMO
                    </div>
                    <h2 className="text-h2 mb-3" style={{ color: "#F1F5F9" }}>
                        Real Return Calculator
                    </h2>
                    <p className="text-body" style={{ color: "#94A3B8" }}>
                        See what your Fixed Deposit is actually earning after inflation and taxes.
                    </p>
                </div>

                {/* Calculator Card */}
                <div
                    className="max-w-[560px] mx-auto rounded-2xl p-8"
                    style={{
                        backgroundColor: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        backdropFilter: "blur(12px)",
                    }}
                >
                    {/* Input Row */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#64748B" }}>
                                FD Interest Rate
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={rate}
                                    onChange={(e) => setRate(e.target.value)}
                                    placeholder="e.g. 7.5"
                                    style={inputStyle}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "#64748B" }}>%</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#64748B" }}>
                                Tax Slab
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={tax}
                                    onChange={(e) => setTax(e.target.value)}
                                    placeholder="e.g. 30"
                                    style={inputStyle}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "#64748B" }}>%</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#64748B" }}>
                                Inflation
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inflation}
                                    onChange={(e) => setInflation(e.target.value)}
                                    placeholder="e.g. 6"
                                    style={inputStyle}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "#64748B" }}>%</span>
                            </div>
                        </div>
                    </div>

                    {/* Result */}
                    <div
                        className="rounded-xl p-6 text-center mb-6"
                        style={{
                            backgroundColor: "#1E293B",
                            border: "1px solid rgba(255,255,255,0.04)",
                        }}
                    >
                        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#64748B" }}>
                            Your Real Return (Approx)
                        </p>
                        {hasValues ? (
                            <>
                                <p className="text-3xl font-extrabold" style={{ color: realReturn >= 0 ? "#10B981" : "#EF4444" }}>
                                    {realReturn >= 0 ? "+" : ""}{realReturn.toFixed(1)}%
                                    <span className="text-lg ml-1">{realReturn >= 0 ? "↗" : "↘"}</span>
                                </p>
                                <p className="text-xs mt-1" style={{ color: "#64748B" }}>
                                    {realReturn < 0
                                        ? "You are losing purchasing power."
                                        : "Your money is growing in real terms."}
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-1 rounded-full mx-auto mb-2" style={{ backgroundColor: "#F1F5F9" }} />
                                <p className="text-xs" style={{ color: "#64748B" }}>Enter values above to calculate</p>
                            </>
                        )}
                    </div>

                    {/* CTA */}
                    <a
                        href="#"
                        className="block text-center text-white font-semibold px-6 py-3.5 rounded-xl transition-colors w-full"
                        style={{
                            backgroundColor: "#10B981",
                            boxShadow: "0 0 20px -4px rgba(16,185,129,0.3)",
                            textDecoration: "none",
                        }}
                    >
                        Calculate Real Return →
                    </a>
                </div>
            </div>
        </section>
    );
}
