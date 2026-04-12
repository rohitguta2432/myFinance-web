"use client";

import React, { useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { CalculatorLayout } from "@/components/calculators/calculator-layout";
import { SliderInput } from "@/components/calculators/slider-input";
import { ResultCard } from "@/components/calculators/result-card";
import { calcFD, formatLakhsCrores } from "@/lib/calculator-utils";
import { useAppTheme } from "@/hooks/useAppTheme";

const COMPOUNDING_OPTIONS: Array<{ label: string; freq: number }> = [
    { label: "Quarterly", freq: 4 },
    { label: "Half-Yearly", freq: 2 },
    { label: "Annually", freq: 1 },
];

export function FdCalculatorClient() {
    const palette = useAppTheme();
    const [principal, setPrincipal] = useState(100000);
    const [interestRate, setInterestRate] = useState(7);
    const [years, setYears] = useState(5);
    const [freq, setFreq] = useState(4);

    const maturity = calcFD(principal, interestRate, years, freq);
    const interest = maturity - principal;

    const chartData = Array.from({ length: years }, (_, i) => ({
        year: i + 1,
        Principal: principal,
        Interest: Math.max(0, calcFD(principal, interestRate, i + 1, freq) - principal),
    }));

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
                FD Details
            </h3>
            <SliderInput
                label="Principal Amount"
                value={principal}
                min={1000}
                max={10000000}
                step={1000}
                onChange={setPrincipal}
                formatDisplay={formatLakhsCrores}
            />
            <SliderInput
                label="Annual Interest Rate"
                value={interestRate}
                min={1}
                max={15}
                step={0.25}
                onChange={setInterestRate}
                unit="%"
            />
            <SliderInput
                label="Duration"
                value={years}
                min={1}
                max={10}
                step={1}
                onChange={setYears}
                unit="yrs"
            />

            {/* Compounding frequency toggle */}
            <div style={{ marginTop: 8 }}>
                <p
                    style={{
                        fontSize: 14,
                        color: palette.txt2,
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        marginBottom: 10,
                    }}
                >
                    Compounding Frequency
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                    {COMPOUNDING_OPTIONS.map((opt) => (
                        <button
                            key={opt.freq}
                            onClick={() => setFreq(opt.freq)}
                            style={{
                                flex: 1,
                                padding: "8px 4px",
                                borderRadius: 8,
                                border: `1px solid ${freq === opt.freq ? palette.accent : palette.brd2}`,
                                background: freq === opt.freq ? "rgba(16,185,129,0.15)" : "transparent",
                                color: freq === opt.freq ? palette.accent : palette.txt2,
                                fontFamily: "var(--font-display)",
                                fontWeight: 600,
                                fontSize: 13,
                                cursor: "pointer",
                                transition: "all 0.15s",
                            }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const results = (
        <div>
            <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
                <ResultCard label="Maturity Amount" value={formatLakhsCrores(maturity)} accent />
                <ResultCard label="Interest Earned" value={formatLakhsCrores(interest)} />
            </div>

            <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                        <defs>
                            <linearGradient id="fdPrincipal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={palette.brd2} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={palette.brd2} stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="fdInterest" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.7} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={palette.brd} />
                        <XAxis
                            dataKey="year"
                            tick={{ fill: palette.mute, fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `Yr ${v}`}
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
                        <Area
                            type="monotone"
                            dataKey="Principal"
                            stackId="a"
                            stroke={palette.brd2}
                            fill="url(#fdPrincipal)"
                            strokeWidth={1.5}
                        />
                        <Area
                            type="monotone"
                            dataKey="Interest"
                            stackId="a"
                            stroke="#10B981"
                            fill="url(#fdInterest)"
                            strokeWidth={1.5}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    return (
        <CalculatorLayout
            title="FD Calculator"
            description="Calculate your fixed deposit maturity amount with quarterly, half-yearly, or annual compounding."
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
