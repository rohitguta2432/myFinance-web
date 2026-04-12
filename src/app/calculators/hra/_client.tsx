"use client";

import React, { useState, useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { CalculatorLayout } from "@/components/calculators/calculator-layout";
import { SliderInput } from "@/components/calculators/slider-input";
import { ResultCard } from "@/components/calculators/result-card";
import { calcHRA, formatIndianCurrency } from "@/lib/calculator-utils";
import { useAppTheme } from "@/hooks/useAppTheme";

export function HraCalculatorClient() {
    const palette = useAppTheme();

    const [basicSalary, setBasicSalary] = useState(50000);
    const [hraReceived, setHraReceived] = useState(20000);
    const [rentPaid, setRentPaid] = useState(18000);
    const [isMetro, setIsMetro] = useState(true);

    const derived = useMemo(() => {
        const exemption = calcHRA(basicSalary, hraReceived, rentPaid, isMetro);
        const rule1 = Math.max(0, hraReceived);
        const rule2 = Math.max(0, rentPaid - 0.1 * basicSalary);
        const rule3 = basicSalary * (isMetro ? 0.5 : 0.4);
        const taxable = Math.max(0, hraReceived - exemption);
        const minValue = Math.min(rule1, rule2, rule3);
        return { exemption, rule1, rule2, rule3, taxable, minValue };
    }, [basicSalary, hraReceived, rentPaid, isMetro]);

    const chartData = [
        { rule: "Actual HRA", value: derived.rule1 },
        { rule: "Rent−10%", value: derived.rule2 },
        { rule: isMetro ? "50% Basic" : "40% Basic", value: derived.rule3 },
    ];

    const inputs = (
        <>
            <SliderInput
                label="Basic Salary (monthly)"
                value={basicSalary}
                min={10000}
                max={500000}
                step={1000}
                onChange={setBasicSalary}
                formatDisplay={formatIndianCurrency}
            />
            <SliderInput
                label="HRA Received (monthly)"
                value={hraReceived}
                min={0}
                max={300000}
                step={500}
                onChange={setHraReceived}
                formatDisplay={formatIndianCurrency}
            />
            <SliderInput
                label="Rent Paid (monthly)"
                value={rentPaid}
                min={0}
                max={300000}
                step={500}
                onChange={setRentPaid}
                formatDisplay={formatIndianCurrency}
            />

            {/* Metro toggle */}
            <div style={{ marginBottom: 24 }}>
                <p
                    style={{
                        fontSize: 14,
                        color: palette.txt2,
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        marginBottom: 10,
                    }}
                >
                    City Type
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                    <button
                        onClick={() => setIsMetro(true)}
                        style={{
                            flex: 1,
                            padding: "10px 0",
                            borderRadius: 24,
                            border: "none",
                            cursor: "pointer",
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: 14,
                            background: isMetro ? "#10B981" : palette.s2,
                            color: isMetro ? "#080E12" : palette.mute,
                            transition: "background 0.2s, color 0.2s",
                        }}
                    >
                        Metro
                    </button>
                    <button
                        onClick={() => setIsMetro(false)}
                        style={{
                            flex: 1,
                            padding: "10px 0",
                            borderRadius: 24,
                            border: "none",
                            cursor: "pointer",
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: 14,
                            background: !isMetro ? "#10B981" : palette.s2,
                            color: !isMetro ? "#080E12" : palette.mute,
                            transition: "background 0.2s, color 0.2s",
                        }}
                    >
                        Non-Metro
                    </button>
                </div>
                <p style={{ fontSize: 12, color: palette.mute, marginTop: 8 }}>
                    Metro: Mumbai, Delhi, Kolkata, Chennai
                </p>
            </div>
        </>
    );

    const results = (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                <ResultCard
                    label="HRA Exemption"
                    value={formatIndianCurrency(derived.exemption)}
                    sublabel="per month"
                    accent
                />
                <ResultCard
                    label="Taxable HRA"
                    value={formatIndianCurrency(derived.taxable)}
                    sublabel="per month"
                />
            </div>

            {/* BarChart — 3 exemption rules */}
            <div style={{ marginBottom: 16 }}>
                <p
                    style={{
                        fontSize: 12,
                        color: palette.mute,
                        marginBottom: 8,
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                    }}
                >
                    Exemption Rules — Minimum Applies
                </p>
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={palette.brd2} vertical={false} />
                        <XAxis
                            dataKey="rule"
                            tick={{ fill: palette.mute, fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis hide />
                        <Tooltip
                            formatter={(v) => [formatIndianCurrency(Number(v)), "Amount"]}
                            contentStyle={{
                                background: palette.s2,
                                border: `1px solid ${palette.brd2}`,
                                borderRadius: 8,
                                color: palette.txt,
                                fontSize: 13,
                            }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.value === derived.minValue ? "#F5C842" : palette.accent}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <p style={{ fontSize: 12, color: palette.warn, marginTop: 8 }}>
                HRA exemption is only available under the old tax regime.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="HRA Calculator"
            description="Calculate your House Rent Allowance tax exemption under the old tax regime."
            inputs={inputs}
            results={results}
            relatedLinks={[
                { label: "PPF Calculator", href: "/calculators/ppf" },
                { label: "SIP Calculator", href: "/calculators/sip" },
                { label: "Retirement Calculator", href: "/calculators/retirement" },
            ]}
        />
    );
}
