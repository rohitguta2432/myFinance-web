"use client";

import React, { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { CalculatorLayout } from "@/components/calculators/calculator-layout";
import { SliderInput } from "@/components/calculators/slider-input";
import { ResultCard } from "@/components/calculators/result-card";
import { calcEMI, formatLakhsCrores, formatIndianCurrency } from "@/lib/calculator-utils";
import { useAppTheme } from "@/hooks/useAppTheme";

export function EmiCalculatorClient() {
    const palette = useAppTheme();
    const [loanAmount, setLoanAmount] = useState(1000000);
    const [interestRate, setInterestRate] = useState(9);
    const [tenureMonths, setTenureMonths] = useState(120);

    // Guard: if interestRate <= 0, calcEMI returns principal/tenureMonths (simple division)
    const emi = calcEMI(loanAmount, Math.max(0.01, interestRate), tenureMonths);
    const totalPayment = emi * tenureMonths;
    const totalInterest = totalPayment - loanAmount;
    const interestPct = totalPayment > 0 ? (totalInterest / totalPayment * 100).toFixed(1) : "0.0";

    const chartData = [
        { name: "Breakdown", Principal: loanAmount, Interest: Math.max(0, totalInterest) },
    ];

    const inputs = (
        <div>
            <h3
                style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    color: palette.txt,
                    fontSize: 16,
                    marginTop: 0,
                    marginBottom: 24,
                }}
            >
                Loan Details
            </h3>
            <SliderInput
                label="Loan Amount"
                value={loanAmount}
                min={10000}
                max={10000000}
                step={10000}
                onChange={setLoanAmount}
                formatDisplay={formatLakhsCrores}
            />
            <SliderInput
                label="Annual Interest Rate"
                value={interestRate}
                min={1}
                max={36}
                step={0.25}
                onChange={setInterestRate}
                unit="%"
            />
            <SliderInput
                label="Loan Tenure"
                value={tenureMonths}
                min={6}
                max={360}
                step={6}
                onChange={setTenureMonths}
                unit="mo"
            />
        </div>
    );

    const results = (
        <div>
            <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
                <ResultCard label="Monthly EMI" value={formatIndianCurrency(emi)} accent />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <ResultCard label="Total Payment" value={formatLakhsCrores(totalPayment)} />
                    <ResultCard
                        label="Total Interest"
                        value={formatLakhsCrores(totalInterest)}
                        sublabel={`${interestPct}% of total`}
                    />
                </div>
            </div>

            <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                        <XAxis
                            dataKey="name"
                            tick={{ fill: palette.mute, fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tick={{ fill: palette.mute, fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={formatLakhsCrores}
                            width={60}
                        />
                        <Tooltip
                            contentStyle={{
                                background: palette.s2,
                                border: `1px solid ${palette.brd2}`,
                                borderRadius: 8,
                                fontSize: 13,
                                color: palette.txt,
                            }}
                            formatter={(value) => formatLakhsCrores(Number(value))}
                        />
                        <Bar dataKey="Principal" stackId="loan" fill={palette.accent} radius={[0, 0, 0, 0]}>
                            <Cell fill={palette.accent} />
                        </Bar>
                        <Bar dataKey="Interest" stackId="loan" fill="#F5C842" radius={[4, 4, 0, 0]}>
                            <Cell fill="#F5C842" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    return (
        <CalculatorLayout
            title="EMI Calculator"
            description="Calculate your monthly loan EMI for home loans, car loans, and personal loans instantly."
            inputs={inputs}
            results={results}
            relatedLinks={[
                { label: "SIP Calculator", href: "/calculators/sip" },
                { label: "FD Calculator", href: "/calculators/fd" },
                { label: "Blog", href: "/blog" },
            ]}
        />
    );
}
