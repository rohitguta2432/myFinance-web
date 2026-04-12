"use client";

import { useMemo } from "react";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import type { AssetItem } from "@/store/useAssessmentStore";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RetirementCorpusBreakdown {
    epfTotal: number;
    ppfTotal: number;
    npsTotal: number;
    otherRetirementTotal: number;
    totalCorpus: number;
    annualSWP: number;
    monthlySWP: number;
    instruments: Array<{ name: string; subCategory: string; amount: number }>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Calculates the user's retirement corpus from Zustand store assets.
 * Buckets: EPF, PPF, NPS (by subCategory), and other retirement-term instruments.
 * Applies 3% annual SWP withdrawal rule per D-09/D-10.
 */
export function useRetirementCorpus(): RetirementCorpusBreakdown {
    const assets = useAssessmentStore((s) => s.assets);

    return useMemo(() => {
        const epfItems: AssetItem[] = [];
        const ppfItems: AssetItem[] = [];
        const npsItems: AssetItem[] = [];
        const otherRetirementItems: AssetItem[] = [];

        for (const asset of assets) {
            const sub = asset.subCategory ?? "";
            if (sub.includes("EPF")) {
                epfItems.push(asset);
            } else if (sub.includes("PPF")) {
                ppfItems.push(asset);
            } else if (sub.includes("NPS")) {
                npsItems.push(asset);
            } else if (asset.timeHorizon === "Retirement") {
                otherRetirementItems.push(asset);
            }
        }

        const epfTotal = epfItems.reduce((sum, a) => sum + (a.amount ?? 0), 0);
        const ppfTotal = ppfItems.reduce((sum, a) => sum + (a.amount ?? 0), 0);
        const npsTotal = npsItems.reduce((sum, a) => sum + (a.amount ?? 0), 0);
        const otherRetirementTotal = otherRetirementItems.reduce((sum, a) => sum + (a.amount ?? 0), 0);

        const totalCorpus = epfTotal + ppfTotal + npsTotal + otherRetirementTotal;
        const annualSWP = totalCorpus * 0.03;
        const monthlySWP = annualSWP / 12;

        const instruments = [
            ...epfItems,
            ...ppfItems,
            ...npsItems,
            ...otherRetirementItems,
        ].map((a) => ({
            name: a.name,
            subCategory: a.subCategory ?? "",
            amount: a.amount ?? 0,
        }));

        return {
            epfTotal,
            ppfTotal,
            npsTotal,
            otherRetirementTotal,
            totalCorpus,
            annualSWP,
            monthlySWP,
            instruments,
        };
    }, [assets]);
}
