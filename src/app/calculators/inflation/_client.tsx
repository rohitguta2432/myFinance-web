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
import { calcInflation, formatLakhsCrores, formatIndianCurrency } from "@/lib/calculator-utils";
import { useAppTheme } from "@/hooks/useAppTheme";

export function InflationCalculatorClient() {
    const palette = useAppTheme();

    const [currentCost, setCurrentCost] = useState(100000);
    const [inflationRate, setInflationRate] = useState(6);
    const [years, setYears] = useState(20);

    const derived = useMemo(() => {
        const futureCost = calcInflation(currentCost, inflationRate, years);
        const percentageIncrease = ((futureCost - currentCost) / currentCost * 100).toFixed(1);
        const purchasingPower = (100000 / futureCost * currentCost).toFixed(0);
        return { futureCost, percentageIncrease, purchasingPower };
    }, [currentCost, inflationRate, years]);

    const chartData = useMemo(() => {
        return Array.from({ length: years }, (_, i) => ({
            year: i + 1,
            cost: calcInflation(currentCost, inflationRate, i + 1),
        }));
    }, [currentCost, inflationRate, years]);

    const requiredReturn = (inflationRate + 4).toFixed(1);

    const inputs = (
        <>
            <SliderInput
                label="Current Cost / Expense"
                value={currentCost}
                min={1000}
                max={10000000}
                step={1000}
                onChange={setCurrentCost}
                formatDisplay={formatIndianCurrency}
            />
            <SliderInput
                label="Inflation Rate"
                value={inflationRate}
                min={1}
                max={15}
                step={0.5}
                onChange={setInflationRate}
                unit="%"
            />
            <SliderInput
                label="Years"
                value={years}
                min={1}
                max={40}
                step={1}
                onChange={setYears}
                unit="yrs"
            />
        </>
    );

    const results = (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                <ResultCard
                    label="Future Cost"
                    value={formatLakhsCrores(derived.futureCost)}
                    accent
                />
                <ResultCard
                    label="Cost Increase"
                    value={`${derived.percentageIncrease}%`}
                    sublabel={`over ${years} years`}
                />
                <ResultCard
                    label="Purchasing Power"
                    value={`₹${Number(derived.purchasingPower).toLocaleString("en-IN")}`}
                    sublabel="of ₹1L today, in the future"
                />
            </div>

            {/* Inflation AreaChart — orange warn color */}
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
                    Cost Growth Over Time
                </p>
                <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                        <defs>
                            <linearGradient id="inflationGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FB923C" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#FB923C" stopOpacity={0} />
                            </linearGradient>
                        </defs>
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
                            formatter={(v) => [formatLakhsCrores(Number(v)), "Future Cost"]}
                            labelFormatter={(l) => `Year ${l}`}
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
                            dataKey="cost"
                            stroke="#FB923C"
                            strokeWidth={2}
                            fill="url(#inflationGrad)"
                            dot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Dynamic insight text */}
            <p style={{ fontSize: 13, color: palette.txt2, marginTop: 12, lineHeight: 1.6 }}>
                To maintain your purchasing power, your investments must grow at more than{" "}
                <strong style={{ color: palette.warn }}>{inflationRate}%</strong> per year. A
                diversified equity portfolio targeting{" "}
                <strong style={{ color: palette.accent }}>{requiredReturn}%+</strong> real returns
                would offset this.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Inflation Calculator"
            description="See how inflation erodes your purchasing power and what your expenses will cost in the future."
            inputs={inputs}
            results={results}
            relatedLinks={[
                { label: "SIP Calculator", href: "/calculators/sip" },
                { label: "Retirement Calculator", href: "/calculators/retirement" },
                { label: "NPS Calculator", href: "/calculators/nps" },
            ]}
        />
    );
}
