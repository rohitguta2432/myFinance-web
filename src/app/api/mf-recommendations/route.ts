import { NextRequest, NextResponse } from "next/server";
import fundsData from "@/data/funds.json";

// Bucket → MF category mapping. Keep aligned with backend `risk_to_allocation` table.
const BUCKETS = [
    {
        id: "flexi",
        label: "Equity Diversified",
        categoryLabel: "Flexi Cap",
        blurb: "Diversified equity across market caps. Best for long-term wealth.",
        targetPct: 25,
        categories: ["Flexi Cap", "Multi Cap"],
    },
    {
        id: "mid",
        label: "Equity Growth",
        categoryLabel: "Mid Cap",
        blurb: "Higher growth potential with higher volatility. 7+ year horizon.",
        targetPct: 20,
        categories: ["Mid Cap"],
    },
    {
        id: "elss",
        label: "Tax Saver",
        categoryLabel: "ELSS",
        blurb: "Save up to ₹46,800 in tax under 80C. 3-year lock-in.",
        targetPct: 15,
        categories: ["ELSS"],
    },
    {
        id: "hybrid",
        label: "Hybrid",
        categoryLabel: "Aggressive Hybrid",
        blurb: "Equity + debt mix. Smoother ride than pure equity.",
        targetPct: 25,
        categories: ["Aggressive Hybrid", "Balanced Advantage"],
    },
    {
        id: "debt",
        label: "Debt",
        categoryLabel: "Debt — Short Duration",
        blurb: "Stability + liquidity. Low risk, low return.",
        targetPct: 15,
        categories: ["Debt - Short Duration", "Debt - Liquid"],
    },
];

const FUNDS_PER_BUCKET = 5;

export async function GET(req: NextRequest) {
    const lumpsum = Math.max(0, Number(req.nextUrl.searchParams.get("lumpsum")) || 0);
    const monthlyAmount = Math.max(0, Number(req.nextUrl.searchParams.get("monthlyAmount")) || 0);

    const buckets = BUCKETS.map((b) => {
        const matched = fundsData.funds
            .filter((f) => b.categories.includes(f.category))
            .sort((a, c) => (c.expertScore ?? 0) - (a.expertScore ?? 0))
            .slice(0, FUNDS_PER_BUCKET)
            .map((f, i) => ({ ...f, rank: i + 1 }));

        const fraction = b.targetPct / 100;
        return {
            bucketId: b.id,
            bucketLabel: b.label,
            categoryLabel: b.categoryLabel,
            blurb: b.blurb,
            targetPct: b.targetPct,
            lumpsumAmount: Math.round(lumpsum * fraction),
            monthlyAmount: Math.round(monthlyAmount * fraction),
            funds: matched,
        };
    });

    return NextResponse.json({
        riskProfile: "AGGRESSIVE",
        riskProfileLabel: "Aggressive",
        lumpsum,
        monthlyAmount,
        lastRefreshedAt: fundsData.lastRefreshedAt,
        qualityFundCount: fundsData.funds.length,
        buckets,
    });
}
