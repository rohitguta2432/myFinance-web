"use client";

import React, { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/calculators/calculator-layout";
import { SliderInput } from "@/components/calculators/slider-input";
import { ResultCard } from "@/components/calculators/result-card";
import {
    calcRetirement,
    calcInflation,
    formatLakhsCrores,
    formatIndianCurrency,
} from "@/lib/calculator-utils";
import { useAppTheme } from "@/hooks/useAppTheme";

export function RetirementCalculatorClient() {
    const palette = useAppTheme();

    const [monthlyExpenses, setMonthlyExpenses] = useState(50000);
    const [currentAge, setCurrentAge] = useState(30);
    const [retirementAge, setRetirementAge] = useState(60);
    const [inflationRate, setInflationRate] = useState(6);

    const derived = useMemo(() => {
        const yearsToRetire = Math.max(0, retirementAge - currentAge);
        const futureMonthlyExpenses = calcInflation(monthlyExpenses, inflationRate, yearsToRetire);
        const requiredCorpus = calcRetirement(monthlyExpenses, currentAge, retirementAge, inflationRate);
        // Monthly SIP needed at 12% p.a. to build requiredCorpus
        const r = 0.12 / 12;
        const n = yearsToRetire * 12;
        let sipNeeded = 0;
        if (n > 0 && r > 0) {
            // M = FV * r / ((1+r)^n - 1) / (1+r)
            sipNeeded = (requiredCorpus * r) / ((Math.pow(1 + r, n) - 1) * (1 + r));
        }
        return { futureMonthlyExpenses, requiredCorpus, sipNeeded, yearsToRetire };
    }, [monthlyExpenses, currentAge, retirementAge, inflationRate]);

    const inputs = (
        <>
            <SliderInput
                label="Monthly Expenses (today)"
                value={monthlyExpenses}
                min={10000}
                max={500000}
                step={5000}
                onChange={setMonthlyExpenses}
                formatDisplay={formatIndianCurrency}
            />
            <SliderInput
                label="Current Age"
                value={currentAge}
                min={20}
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
            <SliderInput
                label="Inflation Rate"
                value={inflationRate}
                min={2}
                max={12}
                step={0.5}
                onChange={setInflationRate}
                unit="%"
            />
        </>
    );

    const results = (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                <ResultCard
                    label="Required Corpus"
                    value={formatLakhsCrores(derived.requiredCorpus)}
                    accent
                />
                <ResultCard
                    label="Future Monthly Expenses"
                    value={formatIndianCurrency(derived.futureMonthlyExpenses)}
                    sublabel={`at retirement (after ${derived.yearsToRetire} yrs at ${inflationRate}% inflation)`}
                />
                <ResultCard
                    label="Monthly SIP Needed"
                    value={formatIndianCurrency(derived.sipNeeded)}
                    sublabel="at 12% p.a. to build the required corpus"
                />
            </div>

            <p style={{ fontSize: 12, color: palette.mute, marginTop: 8 }}>
                Based on 4% safe withdrawal rate. Assumes 6% annuity returns post-retirement.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Retirement Calculator"
            description="Find out exactly how much corpus you need to retire comfortably in India."
            inputs={inputs}
            results={results}
            relatedLinks={[
                { label: "SIP Calculator", href: "/calculators/sip" },
                { label: "NPS Calculator", href: "/calculators/nps" },
                { label: "Inflation Calculator", href: "/calculators/inflation" },
            ]}
        />
    );
}
