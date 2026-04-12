"use client";

import React, { useState, useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { CalculatorLayout } from "@/components/calculators/calculator-layout";
import { SliderInput } from "@/components/calculators/slider-input";
import { ResultCard } from "@/components/calculators/result-card";
import { calcSWP, formatLakhsCrores, formatIndianCurrency } from "@/lib/calculator-utils";
import { useAppTheme } from "@/hooks/useAppTheme";

export function SwpCalculatorClient() {
    const palette = useAppTheme();

    const [corpus, setCorpus] = useState(10000000);
    const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(50000);
    const [annualGrowthRate, setAnnualGrowthRate] = useState(8);

    const derived = useMemo(() => {
        const yearsLast = calcSWP(corpus, monthlyWithdrawal, annualGrowthRate);
        const totalWithdrawn = monthlyWithdrawal * 12 * yearsLast;
        const withdrawalRate = ((monthlyWithdrawal * 12) / corpus * 100).toFixed(2);
        return { yearsLast, totalWithdrawn, withdrawalRate };
    }, [corpus, monthlyWithdrawal, annualGrowthRate]);

    const chartData = useMemo(() => {
        const r = annualGrowthRate / 100;
        const totalYears = Math.ceil(derived.yearsLast) + 1;
        return Array.from({ length: totalYears }, (_, i) => {
            const bal = r === 0
                ? Math.max(0, corpus - monthlyWithdrawal * 12 * i)
                : corpus * Math.pow(1 + r, i) - (monthlyWithdrawal * 12) * (Math.pow(1 + r, i) - 1) / r;
            return { year: i, balance: Math.max(0, bal) };
        });
    }, [corpus, monthlyWithdrawal, annualGrowthRate, derived.yearsLast]);

    const inputs = (
        <>
            <SliderInput
                label="Total Corpus"
                value={corpus}
                min={100000}
                max={100000000}
                step={100000}
                onChange={setCorpus}
                formatDisplay={formatLakhsCrores}
            />
            <SliderInput
                label="Monthly Withdrawal"
                value={monthlyWithdrawal}
                min={1000}
                max={500000}
                step={1000}
                onChange={setMonthlyWithdrawal}
                formatDisplay={formatIndianCurrency}
            />
            <SliderInput
                label="Expected Annual Returns"
                value={annualGrowthRate}
                min={1}
                max={20}
                step={0.5}
                onChange={setAnnualGrowthRate}
                unit="%"
            />
        </>
    );

    const results = (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                <ResultCard
                    label="Corpus Lasts"
                    value={`${derived.yearsLast.toFixed(1)} years`}
                    accent
                />
                <ResultCard
                    label="Total Withdrawn"
                    value={formatLakhsCrores(derived.totalWithdrawn)}
                />
                <ResultCard
                    label="Annual Withdrawal Rate"
                    value={`${derived.withdrawalRate}%`}
                    sublabel="of initial corpus"
                />
            </div>

            {/* Corpus depletion LineChart */}
            <div>
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
                    Corpus Balance Over Time
                </p>
                <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={palette.brd2} vertical={false} />
                        <XAxis
                            dataKey="year"
                            tick={{ fill: palette.mute, fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `Yr ${v}`}
                        />
                        <YAxis hide />
                        <Tooltip
                            formatter={(v) => [formatLakhsCrores(Number(v)), "Balance"]}
                            labelFormatter={(l) => `Year ${l}`}
                            contentStyle={{
                                background: palette.s2,
                                border: `1px solid ${palette.brd2}`,
                                borderRadius: 8,
                                color: palette.txt,
                                fontSize: 13,
                            }}
                        />
                        <ReferenceLine y={0} stroke="#F87171" strokeDasharray="4 2" />
                        <Line
                            type="monotone"
                            dataKey="balance"
                            stroke={palette.accent}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <p style={{ fontSize: 12, color: palette.mute, marginTop: 12 }}>
                Corpus sustainability depends on market returns. Past performance is not indicative of future results.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="SWP Calculator"
            description="Find out how long your retirement corpus will last with systematic monthly withdrawals."
            inputs={inputs}
            results={results}
            relatedLinks={[
                { label: "NPS Calculator", href: "/calculators/nps" },
                { label: "Retirement Calculator", href: "/calculators/retirement" },
                { label: "SIP Calculator", href: "/calculators/sip" },
            ]}
        />
    );
}
