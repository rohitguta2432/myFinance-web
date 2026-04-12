"use client";

import React, { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { CalculatorLayout } from "@/components/calculators/calculator-layout";
import { SliderInput } from "@/components/calculators/slider-input";
import { ResultCard } from "@/components/calculators/result-card";
import { calcPPF, formatLakhsCrores } from "@/lib/calculator-utils";
import { useAppTheme } from "@/hooks/useAppTheme";

export function PpfCalculatorClient() {
    const palette = useAppTheme();
    // Guard: yearlyDeposit <= 0 → calcPPF returns 0 (via max(0, yearlyDeposit) inside)
    const [yearlyDeposit, setYearlyDeposit] = useState(50000);

    const DURATION = 15; // PPF mandatory lock-in

    const chartData = Array.from({ length: DURATION }, (_, i) => ({
        year: i + 1,
        Invested: yearlyDeposit * (i + 1),
        Balance: Math.max(0, calcPPF(yearlyDeposit, i + 1) - yearlyDeposit * (i + 1)),
    }));

    const maturity = calcPPF(yearlyDeposit, DURATION);
    const totalInvested = yearlyDeposit * DURATION;
    const returns = maturity - totalInvested;

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
                PPF Details
            </h3>
            <SliderInput
                label="Yearly Deposit"
                value={yearlyDeposit}
                min={500}
                max={150000}
                step={500}
                onChange={setYearlyDeposit}
                formatDisplay={formatLakhsCrores}
            />

            {/* Duration: fixed at 15 years */}
            <div
                style={{
                    marginBottom: 24,
                    padding: "16px 20px",
                    background: palette.s2,
                    borderRadius: 12,
                    border: `1px solid ${palette.brd}`,
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                        style={{
                            fontSize: 14,
                            color: palette.txt2,
                            fontFamily: "var(--font-display)",
                            fontWeight: 600,
                        }}
                    >
                        Lock-in Duration
                    </span>
                    <span
                        style={{
                            fontSize: 15,
                            color: palette.accent,
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                        }}
                    >
                        15 years
                    </span>
                </div>
                <p style={{ fontSize: 12, color: palette.mute, margin: "8px 0 0", lineHeight: 1.5 }}>
                    PPF has a mandatory 15-year lock-in period as per government regulations.
                </p>
            </div>

            {/* Disclaimer */}
            <p
                style={{
                    fontSize: 12,
                    color: palette.mute,
                    marginTop: 16,
                    lineHeight: 1.6,
                    padding: "12px 16px",
                    background: palette.s2,
                    borderRadius: 8,
                    border: `1px solid ${palette.brd}`,
                }}
            >
                Interest rate 7.1% p.a. (subject to change by Govt. of India). Maximum contribution is ₹1,50,000 per year.
            </p>
        </div>
    );

    const results = (
        <div>
            <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
                <ResultCard label="Maturity Value" value={formatLakhsCrores(maturity)} accent />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <ResultCard label="Total Invested" value={formatLakhsCrores(totalInvested)} />
                    <ResultCard label="Interest Earned" value={formatLakhsCrores(returns)} />
                </div>
            </div>

            <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={palette.brd} vertical={false} />
                        <XAxis
                            dataKey="year"
                            tick={{ fill: palette.mute, fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `Y${v}`}
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
                            formatter={(value: number) => formatLakhsCrores(value)}
                        />
                        <Bar dataKey="Invested" stackId="ppf" fill={palette.brd2} />
                        <Bar dataKey="Balance" stackId="ppf" fill={palette.accent} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    return (
        <CalculatorLayout
            title="PPF Calculator"
            description="Calculate your Public Provident Fund maturity value after 15 years at 7.1% p.a. interest rate."
            inputs={inputs}
            results={results}
            relatedLinks={[
                { label: "SIP Calculator", href: "/calculators/sip" },
                { label: "NPS Calculator", href: "/calculators/nps" },
                { label: "FD Calculator", href: "/calculators/fd" },
            ]}
        />
    );
}
