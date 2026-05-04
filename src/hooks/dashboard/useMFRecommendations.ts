"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

// ── Response shape — mirrors MFRecommendationResponse on the Spring Boot side ──

export type RiskProfile = "CONSERVATIVE" | "MODERATE" | "AGGRESSIVE";

export interface MFFund {
    schemeId: number;
    name: string;
    category: string;
    rank: number;
    expertScore: number | null;

    return1y: number | null;
    return3y: number | null;
    return5y: number | null;
    return10y: number | null;
    returnInception: number | null;
    sipReturn1y: number | null;
    sipReturn3y: number | null;
    sipReturn5y: number | null;

    sharpe3y: number | null;
    sortino3y: number | null;
    volatility3y: number | null;
    maxDrawdown: number | null;
    calmar3y: number | null;
    var95: number | null;

    upsideCapture: number | null;
    downsideCapture: number | null;

    alpha3y: number | null;
    beta3y: number | null;
    rSquared3y: number | null;
    informationRatio: number | null;

    pctPos1y: number | null;
    pctPos3y: number | null;

    navLatest: number | null;
    navDate: string | null;
    inceptionDate: string | null;
    historyYears: number | null;
    percentileRank: number | null;
}

export interface MFBucket {
    bucketId: string;
    bucketLabel: string;
    categoryLabel: string;
    blurb: string;
    targetPct: number;
    lumpsumAmount: number;
    monthlyAmount: number;
    funds: MFFund[];
}

export interface MFRecommendationResponse {
    riskProfile: RiskProfile | null;
    riskProfileLabel: string | null;
    lumpsum: number;
    monthlyAmount: number;
    lastRefreshedAt: string | null;
    qualityFundCount: number;
    buckets: MFBucket[];
}

interface Params {
    lumpsum?: number;
    monthlyAmount?: number;
}

/**
 * Fetches mutual fund recommendations for the authenticated user.
 * Backend caches the heavy DB join keyed only on userId — amount changes
 * recompute fast in-memory without busting the cache.
 */
export function useMFRecommendations({ lumpsum, monthlyAmount }: Params = {}) {
    return useQuery<MFRecommendationResponse>({
        queryKey: ["mf-recommendations", lumpsum ?? 0, monthlyAmount ?? 0],
        queryFn: () => {
            const params = new URLSearchParams();
            if (lumpsum != null && lumpsum > 0) params.set("lumpsum", String(lumpsum));
            if (monthlyAmount != null && monthlyAmount > 0) params.set("monthlyAmount", String(monthlyAmount));
            const qs = params.toString();
            return api.get<MFRecommendationResponse>(`/mf-recommendations${qs ? `?${qs}` : ""}`);
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
            // Don't retry on 400 (missing risk profile — needs assessment)
            const message = String((error as Error)?.message ?? "");
            if (message.includes("Risk profile missing")) return false;
            return failureCount < 2;
        },
    });
}
