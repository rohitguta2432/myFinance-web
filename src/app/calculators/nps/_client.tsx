"use client";

import React, { useState, useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { CalculatorLayout } from "@/components/calculators/calculator-layout";
import { SliderInput } from "@/components/calculators/slider-input";
import { ResultCard } from "@/components/calculators/result-card";
import { calcNPS, formatLakhsCrores, formatIndianCurrency } from "@/lib/calculator-utils";
import { useAppTheme } from "@/hooks/useAppTheme";

export function NpsCalculatorClient() {
    const palette = useAppTheme();

    const [monthlyContribution, setMonthlyContribution] = useState(5000);
    const [currentAge, setCurrentAge] = useState(30);
    const [retirementAge, setRetirementAge] = useState(60);

    const isInvalidAge = retirementAge <= currentAge;

    const derived = useMemo(() => {
        if (isInvalidAge) return null;
        const { corpus, monthlyPension } = calcNPS(monthlyContribution, currentAge, retirementAge);
        const totalInvested = monthlyContribution * 12 * (retirementAge - currentAge);
        return { corpus, monthlyPension, totalInvested };
    }, [monthlyContribution, currentAge, retirementAge, isInvalidAge]);

    const chartData = useMemo(() => {
        if (isInvalidAge) return [];
        return Array.from({ length: retirementAge - currentAge }, (_, i) => ({
            age: currentAge + i + 1,
            corpus: calcNPS(monthlyContribution, currentAge, currentAge + i + 1).corpus,
        }));
    }, [monthlyContribution, currentAge, retirementAge, isInvalidAge]);

    const inputs = (
        <>
            <SliderInput
                label="Monthly Contribution"
                value={monthlyContribution}
                min={500}
                max={100000}
                step={500}
                onChange={setMonthlyContribution}
                formatDisplay={formatLakhsCrores}
            />
            <SliderInput
                label="Current Age"
                value={currentAge}
                min={18}
                max={60}
                step={1}
                onChange={setCurrentAge}
                unit="yrs"
            />
            <SliderInput
                label="Retirement Age"
                value={retirementAge}
                min={40}
                max={70}
                step={1}
                onChange={setRetirementAge}
                unit="yrs"
            />
        </>
    );

    const results = (
        <>
            {isInvalidAge ? (
                <div
                    style={{
                        background: palette.s2,
                        border: `1px solid ${palette.danger}`,
                        borderRadius: 12,
                        padding: "20px 24px",
                        color: palette.danger,
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: 14,
                    }}
                >
                    Retirement age must be greater than current age.
                </div>
            ) : (
                <>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                        <ResultCard
                            label="Estimated Corpus"
                            value={formatLakhsCrores(derived!.corpus)}
                            accent
                        />
                        <ResultCard
                            label="Monthly Pension"
                            value={formatIndianCurrency(derived!.monthlyPension)}
                            sublabel="after retirement (40% annuity at 6%)"
                        />
                        <ResultCard
                            label="Total Invested"
                            value={formatLakhsCrores(derived!.totalInvested)}
                        />
                    </div>

                    {/* Corpus growth AreaChart */}
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
                            Corpus Growth by Age
                        </p>
                        <ResponsiveContainer width="100%" height={180}>
                            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                                <defs>
                                    <linearGradient id="npsCorpusGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={palette.accent} stopOpacity={0.25} />
                                        <stop offset="95%" stopColor={palette.accent} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={palette.brd2} vertical={false} />
                                <XAxis
                                    dataKey="age"
                                    tick={{ fill: palette.mute, fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis hide />
                                <Tooltip
                                    formatter={(v) => [formatLakhsCrores(Number(v)), "Corpus"]}
                                    labelFormatter={(l) => `Age ${l}`}
                                    contentStyle={{
                                        background: palette.s2,
                                        border: `1px solid ${palette.brd2}`,
                                        borderRadius: 8,
                                        color: palette.txt,
                                        fontSize: 13,
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="corpus"
                                    stroke={palette.accent}
                                    strokeWidth={2}
                                    fill="url(#npsCorpusGrad)"
                                    dot={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </>
    );

    return (
        <CalculatorLayout
            title="NPS Calculator"
            description="Estimate your National Pension System corpus and monthly pension at retirement."
            inputs={inputs}
            results={results}
            relatedLinks={[
                { label: "PPF Calculator", href: "/calculators/ppf" },
                { label: "Retirement Calculator", href: "/calculators/retirement" },
                { label: "SIP Calculator", href: "/calculators/sip" },
            ]}
        />
    );
}
