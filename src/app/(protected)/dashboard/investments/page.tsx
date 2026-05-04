"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Lock, ChevronDown, ChevronUp, Calendar, Award,
    Shield, Crown, AlertCircle, Wallet, Repeat, Sparkles,
} from "lucide-react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useMFRecommendations, type MFFund, type MFBucket, type MFRecommendationResponse } from "@/hooks/dashboard/useMFRecommendations";
import { useDashboardSummary } from "@/hooks/dashboard/useDashboardSummary";
import { SectionNav } from "@/components/dashboard/SectionNav";

// Admins always see Premium content + use demo data smoothly during early rollout.
const ADMIN_EMAILS = ["rohitgupta2432@gmail.com", "myfinancial.cfp@gmail.com"];

// Bucket colors keyed by bucketId so the legend stays stable across renders.
const BUCKET_COLORS: Record<string, string> = {
    flexi: "#10B981",
    mid: "#06B6D4",
    elss: "#8B5CF6",
    hybrid: "#F59E0B",
    debt: "#94A3B8",
};
const FALLBACK_COLOR = "#64748B";

const FREE_LUMPSUM_DEFAULT = 250000;

// Demo dataset shown when the backend isn't deployed yet OR returns no data.
// Real fund names + full 30-metric rows sourced from the daily MF ranker output.
const DEMO_DATA: MFRecommendationResponse = {
    riskProfile: "AGGRESSIVE", riskProfileLabel: "Aggressive",
    lumpsum: FREE_LUMPSUM_DEFAULT, monthlyAmount: 15000,
    lastRefreshedAt: "2026-04-30T18:30:00", qualityFundCount: 84,
    buckets: [
        { bucketId: "flexi", bucketLabel: "Equity Diversified", categoryLabel: "Flexi Cap", blurb: "Diversified equity across market caps. Best for long-term wealth.", targetPct: 25, lumpsumAmount: 62500, monthlyAmount: 3750,
            funds: [
                { schemeId: 148404, name: "BANK OF INDIA Flexi Cap Fund Direct Plan -Growth", category: "Flexi Cap", rank: 1, expertScore: 86.00, return1y: 16.46, return3y: 23.37, return5y: 20.02, return10y: 14.71, returnInception: 26.56, sipReturn1y: 13.18, sipReturn3y: 14.13, sipReturn5y: 17.79, sharpe3y: 1.11, sortino3y: 1.23, volatility3y: 17.55, maxDrawdown: -23.73, calmar3y: 0.98, var95: -1.66, upsideCapture: 123.20, downsideCapture: 98.00, alpha3y: 11.37, beta3y: 1.11, rSquared3y: 0.66, informationRatio: 1.16, pctPos1y: 82.60, pctPos3y: 100.00, navLatest: 39.62, navDate: "2026-04-30", inceptionDate: "2020-07-01", historyYears: 5.80, percentileRank: 2.00 },
                { schemeId: 120843, name: "quant Flexi Cap Fund - Growth Option-Direct Plan", category: "Flexi Cap", rank: 2, expertScore: 80.80, return1y: 9.19, return3y: 19.03, return5y: 19.91, return10y: 20.47, returnInception: 18.51, sipReturn1y: 12.45, sipReturn3y: 10.61, sipReturn5y: 15.08, sharpe3y: 0.89, sortino3y: 1.12, volatility3y: 16.42, maxDrawdown: -41.28, calmar3y: 0.46, var95: -1.77, upsideCapture: 119.70, downsideCapture: 99.70, alpha3y: 7.76, beta3y: 1.05, rSquared3y: 0.69, informationRatio: 0.88, pctPos1y: 75.90, pctPos3y: 97.00, navLatest: 114.20, navDate: "2026-04-30", inceptionDate: "2013-01-07", historyYears: 13.30, percentileRank: 3.90 },
                { schemeId: 120492, name: "JM Flexicap Fund (Direct) - Growth Option", category: "Flexi Cap", rank: 3, expertScore: 80.50, return1y: 0.19, return3y: 19.81, return5y: 18.51, return10y: 17.77, returnInception: 16.56, sipReturn1y: -2.41, sipReturn3y: 6.59, sipReturn5y: 14.39, sharpe3y: 0.99, sortino3y: 1.15, volatility3y: 15.53, maxDrawdown: -34.95, calmar3y: 0.57, var95: -1.58, upsideCapture: 111.10, downsideCapture: 97.20, alpha3y: 8.56, beta3y: 1.03, rSquared3y: 0.74, informationRatio: 1.09, pctPos1y: 78.40, pctPos3y: 98.70, navLatest: 106.86, navDate: "2026-04-30", inceptionDate: "2013-01-02", historyYears: 13.30, percentileRank: 5.90 },
                { schemeId: 140353, name: "Edelweiss Flexi Cap Fund - Direct Plan - Growth Option", category: "Flexi Cap", rank: 4, expertScore: 78.60, return1y: 6.28, return3y: 18.81, return5y: 16.94, return10y: 15.85, returnInception: 16.91, sipReturn1y: 1.74, sipReturn3y: 10.25, sipReturn5y: 14.17, sharpe3y: 0.98, sortino3y: 1.20, volatility3y: 14.31, maxDrawdown: -36.10, calmar3y: 0.52, var95: -1.33, upsideCapture: 113.10, downsideCapture: 98.40, alpha3y: 7.39, beta3y: 1.04, rSquared3y: 0.88, informationRatio: 1.52, pctPos1y: 85.90, pctPos3y: 98.50, navLatest: 44.25, navDate: "2026-04-30", inceptionDate: "2016-11-28", historyYears: 9.40, percentileRank: 7.80 },
                { schemeId: 118955, name: "HDFC Flexi Cap Fund - Growth Option - Direct Plan", category: "Flexi Cap", rank: 5, expertScore: 78.30, return1y: 1.90, return3y: 19.40, return5y: 20.34, return10y: 17.19, returnInception: 15.97, sipReturn1y: -3.17, sipReturn3y: 10.37, sipReturn5y: 16.09, sharpe3y: 1.22, sortino3y: 1.58, volatility3y: 11.66, maxDrawdown: -41.84, calmar3y: 0.46, var95: -1.09, upsideCapture: 83.00, downsideCapture: 88.30, alpha3y: 9.74, beta3y: 0.86, rSquared3y: 0.91, informationRatio: 1.93, pctPos1y: 83.20, pctPos3y: 94.80, navLatest: 2137.00, navDate: "2026-04-30", inceptionDate: "2013-01-01", historyYears: 13.30, percentileRank: 9.80 },
            ],
        },
        { bucketId: "mid", bucketLabel: "Equity Growth", categoryLabel: "Mid Cap", blurb: "Higher growth potential with higher volatility. 7+ year horizon.", targetPct: 20, lumpsumAmount: 50000, monthlyAmount: 3000,
            funds: [
                { schemeId: 147704, name: "Motilal Oswal Large and Midcap Fund - Direct Plan Growth", category: "Mid Cap", rank: 1, expertScore: 87.80, return1y: 16.81, return3y: 26.83, return5y: 22.55, return10y: 13.97, returnInception: 22.20, sipReturn1y: 11.13, sipReturn3y: 17.25, sipReturn5y: 20.92, sharpe3y: 1.25, sortino3y: 1.54, volatility3y: 18.58, maxDrawdown: -37.44, calmar3y: 0.72, var95: -1.91, upsideCapture: 126.90, downsideCapture: 96.80, alpha3y: 15.20, beta3y: 1.07, rSquared3y: 0.56, informationRatio: 1.21, pctPos1y: 93.80, pctPos3y: 100.00, navLatest: 37.80, navDate: "2026-04-30", inceptionDate: "2019-10-22", historyYears: 6.50, percentileRank: 0.90 },
                { schemeId: 120381, name: "ICICI Prudential MidCap Fund - Direct Plan -  Growth", category: "Mid Cap", rank: 2, expertScore: 87.50, return1y: 25.35, return3y: 26.93, return5y: 21.63, return10y: 18.40, returnInception: 19.54, sipReturn1y: 20.98, sipReturn3y: 19.76, sipReturn5y: 20.62, sharpe3y: 1.34, sortino3y: 1.61, volatility3y: 17.26, maxDrawdown: -44.04, calmar3y: 0.61, var95: -1.83, upsideCapture: 131.90, downsideCapture: 98.10, alpha3y: 14.96, beta3y: 1.08, rSquared3y: 0.65, informationRatio: 1.45, pctPos1y: 83.70, pctPos3y: 95.00, navLatest: 371.42, navDate: "2026-04-30", inceptionDate: "2013-01-02", historyYears: 13.30, percentileRank: 1.90 },
                { schemeId: 120403, name: "Invesco India Midcap Fund - Direct Plan - Growth Option", category: "Mid Cap", rank: 3, expertScore: 87.50, return1y: 14.95, return3y: 26.96, return5y: 22.50, return10y: 19.99, returnInception: 20.70, sipReturn1y: 6.62, sipReturn3y: 17.51, sipReturn5y: 20.72, sharpe3y: 1.39, sortino3y: 1.74, volatility3y: 16.56, maxDrawdown: -34.09, calmar3y: 0.79, var95: -1.78, upsideCapture: 109.30, downsideCapture: 92.10, alpha3y: 15.83, beta3y: 1.00, rSquared3y: 0.61, informationRatio: 1.42, pctPos1y: 89.10, pctPos3y: 99.60, navLatest: 217.06, navDate: "2026-04-30", inceptionDate: "2013-01-02", historyYears: 13.30, percentileRank: 1.90 },
                { schemeId: 118665, name: "Nippon India Growth Mid Cap Fund - Direct Plan Growth Plan - Bonus Option", category: "Mid Cap", rank: 4, expertScore: 87.40, return1y: 13.18, return3y: 26.20, return5y: 23.07, return10y: 19.89, returnInception: 18.27, sipReturn1y: 10.08, sipReturn3y: 15.41, sipReturn5y: 20.02, sharpe3y: 1.35, sortino3y: 1.61, volatility3y: 16.36, maxDrawdown: -35.32, calmar3y: 0.74, var95: -1.75, upsideCapture: 115.40, downsideCapture: 94.40, alpha3y: 14.64, beta3y: 1.04, rSquared3y: 0.67, informationRatio: 1.49, pctPos1y: 86.30, pctPos3y: 96.90, navLatest: 788.69, navDate: "2026-04-30", inceptionDate: "2013-01-03", historyYears: 13.30, percentileRank: 3.70 },
                { schemeId: 125354, name: "Kotak Emerging Equity Fund - Direct Plan - Growth", category: "Mid Cap", rank: 5, expertScore: 77.90, return1y: 9.57, return3y: 19.09, return5y: 19.47, return10y: 19.57, returnInception: 22.41, sipReturn1y: 5.76, sipReturn3y: 10.03, sipReturn5y: 14.80, sharpe3y: 0.97, sortino3y: 1.22, volatility3y: 14.56, maxDrawdown: -34.64, calmar3y: 0.55, var95: -1.57, upsideCapture: 79.80, downsideCapture: 86.80, alpha3y: 9.97, beta3y: 0.85, rSquared3y: 0.57, informationRatio: 0.80, pctPos1y: 88.60, pctPos3y: 99.80, navLatest: 122.80, navDate: "2026-04-30", inceptionDate: "2013-12-05", historyYears: 12.40, percentileRank: 26.50 },
            ],
        },
        { bucketId: "elss", bucketLabel: "Tax Saver", categoryLabel: "ELSS", blurb: "Save up to ₹46,800 in tax under 80C. 3-year lock-in.", targetPct: 15, lumpsumAmount: 37500, monthlyAmount: 2250,
            funds: [
                { schemeId: 133386, name: "Motilal Oswal ELSS Tax Saver Fund - Direct Plan - Growth Option", category: "ELSS", rank: 1, expertScore: 86.00, return1y: 16.87, return3y: 26.08, return5y: 20.81, return10y: 18.66, returnInception: 17.47, sipReturn1y: 14.78, sipReturn3y: 16.69, sipReturn5y: 19.88, sharpe3y: 1.21, sortino3y: 1.48, volatility3y: 18.63, maxDrawdown: -37.72, calmar3y: 0.69, var95: -1.88, upsideCapture: 125.80, downsideCapture: 96.90, alpha3y: 14.75, beta3y: 1.05, rSquared3y: 0.54, informationRatio: 1.13, pctPos1y: 77.50, pctPos3y: 96.50, navLatest: 61.98, navDate: "2026-04-30", inceptionDate: "2015-01-22", historyYears: 11.30, percentileRank: 2.20 },
                { schemeId: 120847, name: "quant ELSS Tax Saver Fund - Growth Option - Direct Plan", category: "ELSS", rank: 2, expertScore: 80.20, return1y: 11.95, return3y: 18.39, return5y: 18.61, return10y: 21.09, returnInception: 19.72, sipReturn1y: 11.32, sipReturn3y: 9.88, sipReturn5y: 14.22, sharpe3y: 0.85, sortino3y: 1.05, volatility3y: 16.48, maxDrawdown: -36.12, calmar3y: 0.51, var95: -1.72, upsideCapture: 121.00, downsideCapture: 100.40, alpha3y: 6.95, beta3y: 1.07, rSquared3y: 0.71, informationRatio: 0.84, pctPos1y: 83.20, pctPos3y: 98.70, navLatest: 429.75, navDate: "2026-04-30", inceptionDate: "2013-01-07", historyYears: 13.30, percentileRank: 4.40 },
                { schemeId: 119723, name: "SBI ELSS Tax Saver FUND - DIRECT PLAN -GROWTH", category: "ELSS", rank: 3, expertScore: 79.80, return1y: 2.86, return3y: 21.28, return5y: 19.18, return10y: 15.53, returnInception: 15.52, sipReturn1y: -1.49, sipReturn3y: 9.61, sipReturn5y: 16.08, sharpe3y: 1.25, sortino3y: 1.54, volatility3y: 12.91, maxDrawdown: -38.20, calmar3y: 0.56, var95: -1.21, upsideCapture: 96.90, downsideCapture: 92.20, alpha3y: 10.88, beta3y: 0.93, rSquared3y: 0.85, informationRatio: 1.85, pctPos1y: 85.10, pctPos3y: 96.30, navLatest: 463.96, navDate: "2026-04-30", inceptionDate: "2013-01-02", historyYears: 13.30, percentileRank: 6.70 },
                { schemeId: 147541, name: "ITI ELSS Tax Saver Fund - Direct Plan - Growth Option", category: "ELSS", rank: 4, expertScore: 79.70, return1y: 10.59, return3y: 20.95, return5y: 15.28, return10y: 10.53, returnInception: 16.62, sipReturn1y: 6.06, sipReturn3y: 11.17, sipReturn5y: 15.10, sharpe3y: 0.99, sortino3y: 1.21, volatility3y: 16.96, maxDrawdown: -38.49, calmar3y: 0.54, var95: -1.79, upsideCapture: 126.00, downsideCapture: 100.00, alpha3y: 9.01, beta3y: 1.11, rSquared3y: 0.71, informationRatio: 1.07, pctPos1y: 84.40, pctPos3y: 100.00, navLatest: 27.39, navDate: "2026-04-30", inceptionDate: "2019-10-25", historyYears: 6.50, percentileRank: 8.90 },
                { schemeId: 120494, name: "JM ELSS Tax Saver Fund (Direct) - Growth Option", category: "ELSS", rank: 5, expertScore: 78.30, return1y: 5.88, return3y: 19.04, return5y: 16.58, return10y: 17.02, returnInception: 16.38, sipReturn1y: 0.58, sipReturn3y: 8.53, sipReturn5y: 13.54, sharpe3y: 0.92, sortino3y: 1.09, volatility3y: 15.78, maxDrawdown: -37.39, calmar3y: 0.51, var95: -1.68, upsideCapture: 112.30, downsideCapture: 97.90, alpha3y: 7.68, beta3y: 1.05, rSquared3y: 0.74, informationRatio: 1.00, pctPos1y: 81.40, pctPos3y: 98.50, navLatest: 54.48, navDate: "2026-04-30", inceptionDate: "2013-01-02", historyYears: 13.30, percentileRank: 11.10 },
            ],
        },
        { bucketId: "hybrid", bucketLabel: "Hybrid", categoryLabel: "Aggressive Hybrid", blurb: "Equity + debt mix. Smoother ride than pure equity.", targetPct: 25, lumpsumAmount: 62500, monthlyAmount: 3750,
            funds: [
                { schemeId: 120700, name: "ICICI Prudential Aggressive Hybrid Active FOF - Direct Plan - Growth", category: "Aggressive Hybrid", rank: 1, expertScore: 74.30, return1y: 1.86, return3y: 17.71, return5y: 17.19, return10y: 15.93, returnInception: 15.37, sipReturn1y: -2.75, sipReturn3y: 9.65, sipReturn5y: 13.84, sharpe3y: 1.27, sortino3y: 1.70, volatility3y: 9.90, maxDrawdown: -35.74, calmar3y: 0.50, var95: -1.01, upsideCapture: 63.70, downsideCapture: 78.70, alpha3y: 10.62, beta3y: 0.70, rSquared3y: 0.78, informationRatio: 1.14, pctPos1y: 91.30, pctPos3y: 96.50, navLatest: 234.62, navDate: "2026-04-30", inceptionDate: "2013-04-05", historyYears: 13.10, percentileRank: 3.30 },
                { schemeId: 147446, name: "Mahindra Manulife Aggressive Hybrid Fund - Direct Plan -Growth", category: "Aggressive Hybrid", rank: 2, expertScore: 73.30, return1y: 2.64, return3y: 16.47, return5y: 15.38, return10y: 11.53, returnInception: 17.49, sipReturn1y: -1.89, sipReturn3y: 8.65, sipReturn5y: 12.54, sharpe3y: 1.06, sortino3y: 1.33, volatility3y: 10.45, maxDrawdown: -25.41, calmar3y: 0.65, var95: -1.01, upsideCapture: 68.70, downsideCapture: 83.90, alpha3y: 7.91, beta3y: 0.77, rSquared3y: 0.91, informationRatio: 1.15, pctPos1y: 99.30, pctPos3y: 100.00, navLatest: 29.79, navDate: "2026-04-30", inceptionDate: "2019-07-23", historyYears: 6.80, percentileRank: 6.70 },
                { schemeId: 118624, name: "Edelweiss Aggressive Hybrid Fund-Direct Plan-Growth Option", category: "Aggressive Hybrid", rank: 3, expertScore: 72.00, return1y: 5.32, return3y: 16.90, return5y: 16.44, return10y: 14.25, returnInception: 13.97, sipReturn1y: 2.25, sipReturn3y: 9.95, sipReturn5y: 13.78, sharpe3y: 1.10, sortino3y: 1.31, volatility3y: 10.42, maxDrawdown: -28.60, calmar3y: 0.59, var95: -1.04, upsideCapture: 65.80, downsideCapture: 81.90, alpha3y: 8.44, beta3y: 0.76, rSquared3y: 0.88, informationRatio: 1.15, pctPos1y: 91.60, pctPos3y: 99.80, navLatest: 73.70, navDate: "2026-04-30", inceptionDate: "2013-01-08", historyYears: 13.30, percentileRank: 10.00 },
                { schemeId: 120484, name: "JM Aggressive Hybrid Fund (Direct) - Growth Option", category: "Aggressive Hybrid", rank: 4, expertScore: 70.60, return1y: 0.64, return3y: 17.94, return5y: 15.32, return10y: 13.30, returnInception: 13.27, sipReturn1y: -3.51, sipReturn3y: 6.12, sipReturn5y: 12.75, sharpe3y: 1.04, sortino3y: 1.29, volatility3y: 12.34, maxDrawdown: -36.57, calmar3y: 0.49, var95: -1.34, upsideCapture: 73.60, downsideCapture: 85.10, alpha3y: 8.97, beta3y: 0.82, rSquared3y: 0.73, informationRatio: 0.96, pctPos1y: 81.70, pctPos3y: 96.70, navLatest: 132.19, navDate: "2026-04-30", inceptionDate: "2013-01-03", historyYears: 13.30, percentileRank: 13.30 },
                { schemeId: 120819, name: "quant Aggressive Hybrid Fund-Growth Option-Direct Plan", category: "Aggressive Hybrid", rank: 5, expertScore: 70.00, return1y: 11.32, return3y: 15.18, return5y: 15.77, return10y: 16.64, returnInception: 16.52, sipReturn1y: 10.92, sipReturn3y: 10.36, sipReturn5y: 12.72, sharpe3y: 0.79, sortino3y: 1.02, volatility3y: 12.71, maxDrawdown: -28.69, calmar3y: 0.53, var95: -1.29, upsideCapture: 72.60, downsideCapture: 86.80, alpha3y: 6.37, beta3y: 0.82, rSquared3y: 0.69, informationRatio: 0.56, pctPos1y: 86.50, pctPos3y: 99.60, navLatest: 485.78, navDate: "2026-04-30", inceptionDate: "2013-01-07", historyYears: 13.30, percentileRank: 16.70 },
            ],
        },
        { bucketId: "debt", bucketLabel: "Debt", categoryLabel: "Debt — Short Duration", blurb: "Stability + liquidity. Low risk, low return.", targetPct: 15, lumpsumAmount: 37500, monthlyAmount: 2250,
            funds: [
                { schemeId: 120541, name: "Invesco India Ultra Short Duration Fund - Direct Plan - Growth", category: "Debt - Short Duration", rank: 1, expertScore: 69.20, return1y: 6.62, return3y: 7.33, return5y: 6.33, return10y: 6.83, returnInception: 51.67, sipReturn1y: 6.42, sipReturn3y: 7.19, sipReturn5y: 6.99, sharpe3y: 3.50, sortino3y: 10.54, volatility3y: 0.33, maxDrawdown: -2.69, calmar3y: 2.72, var95: 0.01, upsideCapture: 2.50, downsideCapture: -9.40, alpha3y: 7.63, beta3y: 0.00, rSquared3y: 0.01, informationRatio: -0.30, pctPos1y: 100.00, pctPos3y: 100.00, navLatest: 3032.88, navDate: "2026-04-30", inceptionDate: "2013-01-02", historyYears: 13.30, percentileRank: 5.00 },
                { schemeId: 120746, name: "UTI Ultra Short Duration Fund - Direct Plan - Growth Option", category: "Debt - Short Duration", rank: 2, expertScore: 63.50, return1y: 6.55, return3y: 7.32, return5y: 6.92, return10y: 6.66, returnInception: 7.41, sipReturn1y: 6.29, sipReturn3y: 7.15, sipReturn5y: 7.07, sharpe3y: 3.48, sortino3y: 8.08, volatility3y: 0.33, maxDrawdown: -3.61, calmar3y: 2.03, var95: 0.01, upsideCapture: 2.50, downsideCapture: -9.40, alpha3y: 7.63, beta3y: 0.00, rSquared3y: 0.01, informationRatio: -0.30, pctPos1y: 100.00, pctPos3y: 100.00, navLatest: 4788.79, navDate: "2026-04-30", inceptionDate: "2013-01-02", historyYears: 13.30, percentileRank: 7.50 },
                { schemeId: 143494, name: "Nippon India Ultra Short Duration Fund- Direct Plan- Growth Option", category: "Debt - Short Duration", rank: 3, expertScore: 63.10, return1y: 6.92, return3y: 7.58, return5y: 7.52, return10y: 5.18, returnInception: 6.56, sipReturn1y: 6.71, sipReturn3y: 7.45, sipReturn5y: 7.36, sharpe3y: 4.13, sortino3y: 15.93, volatility3y: 0.35, maxDrawdown: -5.24, calmar3y: 1.45, var95: 0.01, upsideCapture: 2.60, downsideCapture: -9.70, alpha3y: 7.89, beta3y: 0.00, rSquared3y: 0.01, informationRatio: -0.28, pctPos1y: 100.00, pctPos3y: 100.00, navLatest: 4692.31, navDate: "2026-04-30", inceptionDate: "2018-05-21", historyYears: 7.90, percentileRank: 10.00 },
                { schemeId: 119828, name: "SBI ULTRA SHORT DURATION FUND - DIRECT PLAN - GROWTH", category: "Debt - Short Duration", rank: 4, expertScore: 62.80, return1y: 6.41, return3y: 7.19, return5y: 6.20, return10y: 6.60, returnInception: 7.18, sipReturn1y: 6.14, sipReturn3y: 7.01, sipReturn5y: 6.83, sharpe3y: 2.81, sortino3y: 5.79, volatility3y: 0.33, maxDrawdown: -0.95, calmar3y: 7.57, var95: 0.01, upsideCapture: 2.40, downsideCapture: -9.40, alpha3y: 7.42, beta3y: 0.00, rSquared3y: 0.01, informationRatio: -0.31, pctPos1y: 100.00, pctPos3y: 100.00, navLatest: 6396.16, navDate: "2026-04-30", inceptionDate: "2013-01-01", historyYears: 13.30, percentileRank: 12.50 },
                { schemeId: 152825, name: "Franklin India Ultra Short Duration Fund - Direct - Growth", category: "Debt - Short Duration", rank: 5, expertScore: 58.30, return1y: 6.69, return3y: 3.98, return5y: 2.37, return10y: 1.18, returnInception: 7.28, sipReturn1y: 6.36, sipReturn3y: 6.88, sipReturn5y: 6.88, sharpe3y: 2.82, sortino3y: 7.57, volatility3y: 0.39, maxDrawdown: -0.06, calmar3y: 66.33, var95: 0.00, upsideCapture: 2.10, downsideCapture: -9.40, alpha3y: 7.60, beta3y: 0.00, rSquared3y: 0.00, informationRatio: 0.64, pctPos1y: 100.00, pctPos3y: null, navLatest: 11.24, navDate: "2026-04-30", inceptionDate: "2024-08-29", historyYears: 1.70, percentileRank: 55.00 },
            ],
        },
    ],
};

function formatINR(v: number | null | undefined): string {
    if (v == null) return "₹—";
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
    if (v >= 100000) return `₹${(v / 100000).toFixed(2)} L`;
    if (v >= 1000) return `₹${(v / 1000).toFixed(0)}k`;
    return `₹${Math.round(v).toLocaleString("en-IN")}`;
}

function scoreColor(s: number | null | undefined, accent: string, warn: string, danger: string): string {
    if (s == null) return danger;
    if (s >= 80) return accent;
    if (s >= 70) return warn;
    return danger;
}

function formatDate(iso: string | null): string {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ────────────────────────────────────────────────────────
//  Page
// ────────────────────────────────────────────────────────

export default function InvestmentsPage() {
    const palette = useAppTheme();
    const [mode, setMode] = useState<"lumpsum" | "sip">("lumpsum");
    const [lumpsumInput, setLumpsumInput] = useState(FREE_LUMPSUM_DEFAULT);
    const [expandedFund, setExpandedFund] = useState<number | null>(null);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        fetch("/api/auth/me")
            .then((res) => (res.ok ? res.json() : null))
            .then((d) => { if (d?.user?.email) setUserEmail(d.user.email); })
            .catch(() => {});
    }, []);

    // Real data sources
    const dashSummary = useDashboardSummary();
    const monthlySurplusFromSummary = (() => {
        const raw = (dashSummary.data as Record<string, unknown> | undefined)
            ?.healthScore as Record<string, unknown> | undefined;
        const v = raw?.rawData as Record<string, unknown> | undefined;
        return Number(v?.monthlySurplus) || 0;
    })();

    const { data: apiData, isLoading, error } = useMFRecommendations({
        lumpsum: lumpsumInput,
        monthlyAmount: monthlySurplusFromSummary,
    });

    const isAdmin = ADMIN_EMAILS.includes(userEmail);
    const isPremiumStored = typeof window !== "undefined"
        ? localStorage.getItem("myfinancial_premium") === "true"
        : false;

    // ── Loading state ──
    if (isLoading) {
        return (
            <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center", fontFamily: "var(--font-display)" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", borderStyle: "solid", borderWidth: 3, borderTopColor: palette.accent, borderRightColor: "rgba(16,185,129,0.3)", borderBottomColor: "rgba(16,185,129,0.3)", borderLeftColor: "rgba(16,185,129,0.3)", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <p style={{ color: palette.mute }}>Loading recommendations...</p>
                </div>
            </div>
        );
    }

    // ── "No risk profile" hard block — always send to assessment ──
    const errMsg = String((error as Error | undefined)?.message ?? "");
    const noProfile = errMsg.includes("Risk profile missing");
    if (noProfile) {
        return (
            <div style={{ width: "100%", maxWidth: 720, margin: "0 auto", padding: 32, textAlign: "center", fontFamily: "var(--font-display)" }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(245,158,11,0.10)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <AlertCircle size={28} style={{ color: "#FBBF24" }} />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: palette.txt, margin: 0 }}>Complete your assessment first</h2>
                <p style={{ fontSize: 14, color: palette.mute, margin: "8px 0 24px" }}>
                    We need your risk profile before showing personalised fund picks.
                </p>
                <Link href="/assessment/profile" style={{ display: "inline-block", padding: "12px 24px", borderRadius: 12, background: palette.accent, color: "#000", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                    Take 5-minute assessment
                </Link>
            </div>
        );
    }

    // ── Demo fallback: backend not deployed yet OR returning empty data ──
    const apiHasData = !!apiData && (apiData.buckets?.length ?? 0) > 0
        && apiData.buckets.some(b => b.funds.length > 0);
    const isDemoMode = !apiHasData;
    const data: MFRecommendationResponse = apiHasData ? (apiData as MFRecommendationResponse) : DEMO_DATA;

    // Admins always see Premium content. In demo mode, default to Premium so the design isn't half-blurred.
    const isPremium = isAdmin || isPremiumStored || isDemoMode;

    const buckets: MFBucket[] = data.buckets ?? [];
    const totalAmount = mode === "lumpsum" ? data.lumpsum : data.monthlyAmount;
    const hasFunds = buckets.some(b => b.funds.length > 0);

    const navSections = [
        { id: "overview", label: "Overview" },
        { id: "allocation", label: "Allocation" },
        ...buckets.map((b) => ({ id: b.bucketId, label: b.bucketLabel })),
        ...(!isPremium && hasFunds ? [{ id: "premium", label: "Premium" }] : []),
    ];

    return (
        <>
        <SectionNav sections={navSections} />
        <div style={{ width: "100%", maxWidth: 1152, margin: "0 auto", padding: "32px 24px 96px", display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Header */}
            <div id="overview">
                <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, color: palette.mute, margin: 0, fontFamily: "var(--font-display)" }}>Dashboard · Investments</p>
                <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.025em", color: palette.txt, margin: "4px 0 0", fontFamily: "var(--font-display)" }}>
                    Top funds for you
                </h1>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                    {isDemoMode && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "rgba(139,92,246,0.10)", border: "1px solid rgba(139,92,246,0.25)", color: "#A78BFA", fontSize: 12, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                            <Sparkles size={12} />
                            Demo data — backend deploying
                        </span>
                    )}
                    {data.riskProfileLabel && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.25)", color: palette.accent, fontSize: 12, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                            <Shield size={12} />
                            {data.riskProfileLabel}
                        </span>
                    )}
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: palette.s2, border: `1px solid ${palette.brd2}`, color: palette.txt2, fontSize: 12, fontWeight: 600, fontFamily: "var(--font-display)" }}>
                        <Calendar size={12} />
                        Updated {formatDate(data.lastRefreshedAt)} · Daily refresh
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: palette.s2, border: `1px solid ${palette.brd2}`, color: palette.txt2, fontSize: 12, fontWeight: 600, fontFamily: "var(--font-display)" }}>
                        <Award size={12} />
                        {data.qualityFundCount} quality-passing funds in universe
                    </span>
                </div>
            </div>

            {/* Disclaimer */}
            <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12, padding: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <AlertCircle size={18} style={{ color: "#FBBF24", flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: 13, color: palette.txt2, fontFamily: "var(--font-display)", lineHeight: 1.55 }}>
                    <strong style={{ color: palette.txt }}>Educational, not financial advice.</strong>{" "}
                    These are top quality funds in your risk bucket. Past performance is not indicative of future returns.
                </div>
            </div>

            {/* Wealth toggle + allocation overview */}
            <div id="allocation" style={{ background: palette.s1, border: `1px solid ${palette.brd}`, borderRadius: 16, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                    <div>
                        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, color: palette.mute, margin: 0, fontFamily: "var(--font-display)" }}>How are you investing?</p>
                        <h3 style={{ fontSize: 20, fontWeight: 700, color: palette.txt, margin: "4px 0 0", fontFamily: "var(--font-display)" }}>
                            {mode === "lumpsum" ? formatINR(totalAmount) : `${formatINR(totalAmount)}/month`}
                            <span style={{ fontSize: 13, fontWeight: 500, color: palette.mute, marginLeft: 8 }}>
                                {mode === "lumpsum" ? "to deploy" : "from your monthly surplus"}
                            </span>
                        </h3>
                    </div>
                    <div style={{ display: "flex", background: palette.s2, borderRadius: 999, padding: 4, border: `1px solid ${palette.brd}` }}>
                        <button onClick={() => setMode("lumpsum")} style={{ padding: "8px 18px", borderRadius: 999, fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)", background: mode === "lumpsum" ? palette.accent : "transparent", color: mode === "lumpsum" ? "#000" : palette.txt2, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <Wallet size={14} /> Lumpsum
                        </button>
                        <button onClick={() => setMode("sip")} style={{ padding: "8px 18px", borderRadius: 999, fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)", background: mode === "sip" ? palette.accent : "transparent", color: mode === "sip" ? "#000" : palette.txt2, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <Repeat size={14} /> SIP
                        </button>
                    </div>
                </div>

                {/* Lumpsum slider only in lumpsum mode */}
                {mode === "lumpsum" && (
                    <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        <label style={{ fontSize: 12, color: palette.mute, fontWeight: 600, fontFamily: "var(--font-display)" }}>Adjust lumpsum:</label>
                        <input
                            type="range"
                            min={50000}
                            max={5000000}
                            step={10000}
                            value={lumpsumInput}
                            onChange={(e) => setLumpsumInput(Number(e.target.value))}
                            style={{ flex: 1, minWidth: 200, accentColor: palette.accent }}
                        />
                        <span style={{ fontSize: 14, fontWeight: 700, color: palette.txt, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-display)", minWidth: 100, textAlign: "right" }}>
                            {formatINR(lumpsumInput)}
                        </span>
                    </div>
                )}

                {/* Allocation bar */}
                {hasFunds && (
                    <div style={{ marginTop: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <span style={{ fontSize: 12, color: palette.mute, fontWeight: 600, fontFamily: "var(--font-display)" }}>Target allocation</span>
                            <span style={{ fontSize: 12, color: palette.mute, fontFamily: "var(--font-display)" }}>{buckets.length} buckets</span>
                        </div>
                        <div style={{ display: "flex", height: 10, borderRadius: 999, overflow: "hidden", background: palette.s3 }}>
                            {buckets.map((b) => (
                                <div key={b.bucketId} style={{ width: `${b.targetPct}%`, background: BUCKET_COLORS[b.bucketId] ?? FALLBACK_COLOR }} />
                            ))}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                            {buckets.map((b) => (
                                <div key={b.bucketId} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: 2, background: BUCKET_COLORS[b.bucketId] ?? FALLBACK_COLOR }} />
                                    <span style={{ fontSize: 12, color: palette.txt2, fontWeight: 600, fontFamily: "var(--font-display)" }}>{b.bucketLabel}</span>
                                    <span style={{ fontSize: 12, color: palette.mute, fontFamily: "var(--font-display)" }}>{b.targetPct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Empty-funds banner */}
            {!hasFunds && (
                <div style={{ padding: 24, background: palette.s1, border: `1px solid ${palette.brd}`, borderRadius: 12, textAlign: "center", fontFamily: "var(--font-display)" }}>
                    <p style={{ color: palette.txt, fontSize: 15, fontWeight: 600, margin: 0 }}>Recommendations are being prepared.</p>
                    <p style={{ color: palette.mute, fontSize: 13, margin: "6px 0 0" }}>Daily refresh hasn't completed yet — please check back soon.</p>
                </div>
            )}

            {/* Buckets */}
            {buckets.map((bucket) => {
                const allocAmount = mode === "lumpsum" ? bucket.lumpsumAmount : bucket.monthlyAmount;
                return (
                    <section key={bucket.bucketId} id={bucket.bucketId} style={{ display: "flex", flexDirection: "column", gap: 12, scrollMarginTop: 80 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 8 }}>
                            <div>
                                <h2 style={{ fontSize: 20, fontWeight: 700, color: palette.txt, margin: 0, fontFamily: "var(--font-display)" }}>
                                    {bucket.bucketLabel} <span style={{ color: palette.mute, fontWeight: 500, fontSize: 14 }}>· {bucket.categoryLabel}</span>
                                </h2>
                                <p style={{ fontSize: 13, color: palette.mute, margin: "4px 0 0", fontFamily: "var(--font-display)" }}>{bucket.blurb}</p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <p style={{ fontSize: 11, color: palette.mute, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, margin: 0, fontFamily: "var(--font-display)" }}>Allocate</p>
                                <p style={{ fontSize: 18, fontWeight: 700, color: palette.accent, margin: 0, fontFamily: "var(--font-display)", fontVariantNumeric: "tabular-nums" }}>
                                    {formatINR(allocAmount)}{mode === "sip" ? "/mo" : ""} <span style={{ fontSize: 12, color: palette.mute, fontWeight: 500 }}>· {bucket.targetPct}%</span>
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {bucket.funds.map((fund, idx) => {
                                const isLocked = !isPremium && idx > 0;
                                const isOpen = expandedFund === fund.schemeId;
                                return (
                                    <FundCard
                                        key={fund.schemeId}
                                        fund={fund}
                                        isLocked={isLocked}
                                        isOpen={isOpen}
                                        onToggle={() => setExpandedFund(isOpen ? null : fund.schemeId)}
                                        palette={palette}
                                    />
                                );
                            })}
                            {bucket.funds.length === 0 && (
                                <p style={{ fontSize: 13, color: palette.mute, fontStyle: "italic", padding: 12, fontFamily: "var(--font-display)" }}>No quality-passing funds in this bucket yet.</p>
                            )}
                        </div>

                        {!isPremium && bucket.funds.length > 1 && (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 16px", background: "rgba(245,158,11,0.06)", border: "1px dashed rgba(245,158,11,0.3)", borderRadius: 10, fontFamily: "var(--font-display)" }}>
                                <span style={{ fontSize: 12, color: palette.txt2, display: "flex", alignItems: "center", gap: 8 }}>
                                    <Lock size={14} style={{ color: "#FBBF24" }} />
                                    {bucket.funds.length - 1} more quality picks in this bucket — unlock with Premium
                                </span>
                                <button style={{ padding: "6px 14px", borderRadius: 8, background: "linear-gradient(135deg, #F59E0B, #EA580C)", color: "#000", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-display)" }}>Unlock</button>
                            </div>
                        )}
                    </section>
                );
            })}

            {/* Premium upgrade card */}
            {!isPremium && hasFunds && (
                <div id="premium" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.10), rgba(234,88,12,0.05))", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 16, padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Crown size={22} style={{ color: "#FBBF24" }} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: palette.txt, margin: 0, fontFamily: "var(--font-display)" }}>Unlock all quality picks</h3>
                            <p style={{ fontSize: 13, color: palette.mute, margin: "2px 0 0", fontFamily: "var(--font-display)" }}>+ monthly rebalance alerts, full 35-metric breakdown, downloadable PDF report</p>
                        </div>
                    </div>
                    <button style={{ padding: "12px 20px", borderRadius: 12, background: "linear-gradient(135deg, #F59E0B, #EA580C)", color: "#000", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-display)", whiteSpace: "nowrap" }}>
                        Premium · ₹999/yr
                    </button>
                </div>
            )}

            {/* Footer disclaimer */}
            <p style={{ textAlign: "center", fontSize: 11, color: palette.mute, fontFamily: "var(--font-display)", lineHeight: 1.6, marginTop: 8 }}>
                Mutual fund investments are subject to market risks. Read all scheme-related documents carefully.
                Past performance is not indicative of future returns. MyFinancial does not provide investment advice unless engaged in a paid advisory relationship.
            </p>
        </div>
        </>
    );
}

// ────────────────────────────────────────────────────────
//  Fund card
// ────────────────────────────────────────────────────────

function FundCard({
    fund, isLocked, isOpen, onToggle, palette,
}: {
    fund: MFFund;
    isLocked: boolean;
    isOpen: boolean;
    onToggle: () => void;
    palette: ReturnType<typeof useAppTheme>;
}) {
    const sColor = scoreColor(fund.expertScore, palette.accent, palette.warn, palette.danger);

    if (isLocked) {
        return (
            <div style={{ position: "relative", background: palette.s1, border: `1px solid ${palette.brd}`, borderRadius: 12, padding: 16, overflow: "hidden" }}>
                <div style={{ filter: "blur(4px)", opacity: 0.5, pointerEvents: "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                            <span style={{ width: 28, height: 28, borderRadius: 8, background: palette.s3, color: palette.mute, fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)" }}>#{fund.rank}</span>
                            <span style={{ color: palette.txt, fontSize: 14, fontWeight: 600, fontFamily: "var(--font-display)" }}>████████ ████ ███ Direct Plan</span>
                        </div>
                        <span style={{ color: sColor, fontWeight: 700, fontFamily: "var(--font-display)" }}>{fund.expertScore?.toFixed(0) ?? "—"}/100</span>
                    </div>
                </div>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "var(--font-display)" }}>
                    <Lock size={14} style={{ color: "#FBBF24" }} />
                    <span style={{ fontSize: 13, color: palette.txt2, fontWeight: 600 }}>#{fund.rank} pick · Premium only</span>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: palette.s1, border: `1px solid ${isOpen ? palette.accent : palette.brd}`, borderRadius: 12, transition: "border-color 0.15s", overflow: "hidden" }}>
            <button onClick={onToggle} style={{ width: "100%", background: "transparent", border: "none", cursor: "pointer", padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, fontFamily: "var(--font-display)", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
                    <span style={{ width: 28, height: 28, borderRadius: 8, background: fund.rank === 1 ? "rgba(16,185,129,0.15)" : palette.s3, color: fund.rank === 1 ? palette.accent : palette.txt2, fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>#{fund.rank}</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <span style={{ color: palette.txt, fontSize: 14, fontWeight: 700 }}>{fund.name}</span>
                            {fund.rank === 1 && (
                                <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: "rgba(16,185,129,0.15)", color: palette.accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>Top Pick</span>
                            )}
                        </div>
                        <div style={{ display: "flex", gap: 14, marginTop: 4, fontSize: 12, color: palette.mute, flexWrap: "wrap" }}>
                            <span><strong style={{ color: palette.txt2 }}>3Y:</strong> {fmt(fund.return3y, "%")}</span>
                            <span><strong style={{ color: palette.txt2 }}>5Y:</strong> {fmt(fund.return5y, "%")}</span>
                            <span><strong style={{ color: palette.txt2 }}>Sharpe:</strong> {fmt(fund.sharpe3y)}</span>
                            <span><strong style={{ color: palette.txt2 }}>Max DD:</strong> {fmt(fund.maxDrawdown, "%")}</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: sColor, fontVariantNumeric: "tabular-nums" }}>{fund.expertScore?.toFixed(0) ?? "—"}</div>
                        <div style={{ fontSize: 9, color: palette.mute, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Score</div>
                    </div>
                    {isOpen ? <ChevronUp size={18} style={{ color: palette.mute }} /> : <ChevronDown size={18} style={{ color: palette.mute }} />}
                </div>
            </button>

            {isOpen && (
                <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${palette.brd}`, paddingTop: 16, marginTop: 0, background: palette.bg, fontFamily: "var(--font-display)" }}>
                    <MetricGrid title="Returns (CAGR)" rows={[
                        ["1Y", fmt(fund.return1y, "%")],
                        ["3Y", fmt(fund.return3y, "%")],
                        ["5Y", fmt(fund.return5y, "%")],
                        ["10Y", fmt(fund.return10y, "%")],
                        ["SIP 5Y XIRR", fmt(fund.sipReturn5y, "%")],
                    ]} palette={palette} />

                    <MetricGrid title="Risk metrics (3Y)" rows={[
                        ["Sharpe", fmt(fund.sharpe3y)],
                        ["Sortino", fmt(fund.sortino3y)],
                        ["Volatility", fmt(fund.volatility3y, "%")],
                        ["Max Drawdown", fmt(fund.maxDrawdown, "%")],
                        ["Calmar", fmt(fund.calmar3y)],
                    ]} palette={palette} />

                    <MetricGrid title="Vs Nifty 50" rows={[
                        ["Upside Capture", fmt(fund.upsideCapture, "%")],
                        ["Downside Capture", fmt(fund.downsideCapture, "%")],
                        ["Alpha (3Y)", fmt(fund.alpha3y)],
                        ["Beta (3Y)", fmt(fund.beta3y)],
                        ["R²", fmt(fund.rSquared3y)],
                    ]} palette={palette} />

                    <MetricGrid title="Consistency & rank" rows={[
                        ["% Positive 3Y rolling", fmt(fund.pctPos3y, "%")],
                        ["Percentile rank", fund.percentileRank == null ? "—" : `Top ${fund.percentileRank.toFixed(1)}%`],
                        ["History", fund.historyYears == null ? "—" : `${fund.historyYears.toFixed(1)} yrs`],
                        ["Scheme ID", String(fund.schemeId)],
                    ]} palette={palette} />

                    <p style={{ fontSize: 11, color: palette.mute, marginTop: 12, lineHeight: 1.5, fontFamily: "var(--font-display)" }}>
                        Methodology: Expert score blends returns (35%), risk (30%), capture ratios (15%), alpha (10%), consistency (10%).
                        Quality filter: 10 gates incl. min 5Y CAGR, max drawdown floor, Sharpe ≥ 0.5, expense ratio ≤ 0.7%, manager tenure ≥ 7 yrs.
                    </p>
                </div>
            )}
        </div>
    );
}

function fmt(v: number | null | undefined, suffix = ""): string {
    if (v == null) return "—";
    return `${v.toFixed(2)}${suffix}`;
}

function MetricGrid({ title, rows, palette }: { title: string; rows: [string, string][]; palette: ReturnType<typeof useAppTheme> }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, color: palette.mute, margin: "0 0 6px", fontFamily: "var(--font-display)" }}>{title}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
                {rows.map(([k, v]) => (
                    <div key={k} style={{ background: palette.s1, border: `1px solid ${palette.brd}`, borderRadius: 8, padding: "8px 10px" }}>
                        <p style={{ fontSize: 11, color: palette.mute, margin: 0, fontFamily: "var(--font-display)" }}>{k}</p>
                        <p style={{ fontSize: 14, fontWeight: 700, color: palette.txt, margin: "2px 0 0", fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-display)" }}>{v}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
