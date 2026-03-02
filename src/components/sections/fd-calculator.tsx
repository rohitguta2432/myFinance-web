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

    const labelStyle: React.CSSProperties = {
        display: "block",
        fontSize: 11,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "#64748B",
        marginBottom: 8,
    };

    const percentStyle: React.CSSProperties = {
        position: "absolute",
        right: 12,
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: 12,
        color: "#64748B",
    };

    return (
        <section style={{ paddingTop: 48, paddingBottom: 56, backgroundColor: "#111827" }} id="calculator">
            <div className="container-marketing">
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "6px 16px",
                            borderRadius: 9999,
                            fontSize: 14,
                            fontWeight: 500,
                            backgroundColor: "rgba(16,185,129,0.1)",
                            color: "#10B981",
                            marginBottom: 16,
                        }}
                    >
                        <Calculator size={14} />
                        MINI DEMO
                    </div>
                    <h2 className="text-h2" style={{ color: "#F1F5F9", marginBottom: 12 }}>
                        Real Return Calculator
                    </h2>
                    <p className="text-body" style={{ color: "#94A3B8" }}>
                        See what your Fixed Deposit is actually earning after inflation and taxes.
                    </p>
                </div>

                {/* Calculator Card */}
                <div
                    style={{
                        maxWidth: 560,
                        marginLeft: "auto",
                        marginRight: "auto",
                        borderRadius: 16,
                        padding: 32,
                        backgroundColor: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        backdropFilter: "blur(12px)",
                    }}
                >
                    {/* Input Row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
                        <div>
                            <label style={labelStyle}>FD Interest Rate</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type="text"
                                    value={rate}
                                    onChange={(e) => setRate(e.target.value)}
                                    placeholder="e.g. 7.5"
                                    style={inputStyle}
                                />
                                <span style={percentStyle}>%</span>
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>Tax Slab</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type="text"
                                    value={tax}
                                    onChange={(e) => setTax(e.target.value)}
                                    placeholder="e.g. 30"
                                    style={inputStyle}
                                />
                                <span style={percentStyle}>%</span>
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>Inflation</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type="text"
                                    value={inflation}
                                    onChange={(e) => setInflation(e.target.value)}
                                    placeholder="e.g. 6"
                                    style={inputStyle}
                                />
                                <span style={percentStyle}>%</span>
                            </div>
                        </div>
                    </div>

                    {/* Result */}
                    <div
                        style={{
                            borderRadius: 12,
                            padding: 24,
                            textAlign: "center",
                            marginBottom: 24,
                            backgroundColor: "#1E293B",
                            border: "1px solid rgba(255,255,255,0.04)",
                        }}
                    >
                        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748B", marginBottom: 8 }}>
                            Your Real Return (Approx)
                        </p>
                        {hasValues ? (
                            <>
                                <p style={{ fontSize: 30, fontWeight: 800, color: realReturn >= 0 ? "#10B981" : "#EF4444" }}>
                                    {realReturn >= 0 ? "+" : ""}{realReturn.toFixed(1)}%
                                    <span style={{ fontSize: 18, marginLeft: 4 }}>{realReturn >= 0 ? "↗" : "↘"}</span>
                                </p>
                                <p style={{ fontSize: 12, marginTop: 4, color: "#64748B" }}>
                                    {realReturn < 0
                                        ? "You are losing purchasing power."
                                        : "Your money is growing in real terms."}
                                </p>
                            </>
                        ) : (
                            <>
                                <div style={{ width: 48, height: 4, borderRadius: 9999, backgroundColor: "#F1F5F9", marginLeft: "auto", marginRight: "auto", marginBottom: 8 }} />
                                <p style={{ fontSize: 12, color: "#64748B" }}>Enter values above to calculate</p>
                            </>
                        )}
                    </div>

                    {/* CTA */}
                    <a
                        href="#"
                        style={{
                            display: "block",
                            textAlign: "center",
                            color: "#fff",
                            fontWeight: 600,
                            padding: "14px 24px",
                            borderRadius: 12,
                            width: "100%",
                            backgroundColor: "#10B981",
                            boxShadow: "0 0 20px -4px rgba(16,185,129,0.3)",
                            textDecoration: "none",
                            transition: "background-color 0.2s ease",
                        }}
                    >
                        Calculate Real Return →
                    </a>
                </div>
            </div>
        </section>
    );
}
