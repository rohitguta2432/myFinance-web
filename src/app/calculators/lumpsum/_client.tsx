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
import { calcLumpsum, formatLakhsCrores } from "@/lib/calculator-utils";
import { useAppTheme } from "@/hooks/useAppTheme";

export function LumpsumCalculatorClient() {
    const palette = useAppTheme();
    const [principal, setPrincipal] = useState(100000);
    const [annualRate, setAnnualRate] = useState(12);
    const [years, setYears] = useState(10);

    const maturity = calcLumpsum(principal, annualRate, years);
    const gains = maturity - principal;

    const chartData = Array.from({ length: years }, (_, i) => ({
        year: i + 1,
        Principal: principal,
        Returns: Math.max(0, calcLumpsum(principal, annualRate, i + 1) - principal),
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
                Enter Details
            </h3>
            <SliderInput
                label="Investment Amount"
                value={principal}
                min={10000}
                max={10000000}
                step={10000}
                onChange={setPrincipal}
                formatDisplay={formatLakhsCrores}
            />
            <SliderInput
                label="Expected Annual Return"
                value={annualRate}
                min={1}
                max={30}
                step={0.5}
                onChange={setAnnualRate}
                unit="%"
            />
            <SliderInput
                label="Investment Duration"
                value={years}
                min={1}
                max={30}
                step={1}
                onChange={setYears}
                unit="yrs"
            />
        </div>
    );

    const results = (
        <div>
            <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
                <ResultCard label="Maturity Value" value={formatLakhsCrores(maturity)} accent />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <ResultCard label="Total Invested" value={formatLakhsCrores(principal)} />
                    <ResultCard label="Estimated Gains" value={formatLakhsCrores(gains)} />
                </div>
            </div>

            <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                        <defs>
                            <linearGradient id="lsPrincipal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={palette.brd2} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={palette.brd2} stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="lsReturns" x1="0" y1="0" x2="0" y2="1">
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
                            formatter={(value: number) => formatLakhsCrores(value)}
                        />
                        <Area
                            type="monotone"
                            dataKey="Principal"
                            stackId="a"
                            stroke={palette.brd2}
                            fill="url(#lsPrincipal)"
                            strokeWidth={1.5}
                        />
                        <Area
                            type="monotone"
                            dataKey="Returns"
                            stackId="a"
                            stroke="#10B981"
                            fill="url(#lsReturns)"
                            strokeWidth={1.5}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    return (
        <CalculatorLayout
            title="Lumpsum Calculator"
            description="Calculate how a one-time investment grows over time with the power of compounding returns."
            inputs={inputs}
            results={results}
            relatedLinks={[
                { label: "SIP Calculator", href: "/calculators/sip" },
                { label: "FD Calculator", href: "/calculators/fd" },
                { label: "Retirement Calculator", href: "/calculators/retirement" },
            ]}
        />
    );
}
