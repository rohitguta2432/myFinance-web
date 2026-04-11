"use client";

import { useQuery } from "@tanstack/react-query";
import { getPortfolioAnalysis } from "@/lib/assessment-api";

/**
 * Fetch backend-computed portfolio analysis (allocation %, DTI, net worth, EMI mismatch).
 */
export const usePortfolioAnalysisQuery = () =>
    useQuery({
        queryKey: ["portfolio-analysis"],
        queryFn: getPortfolioAnalysis,
        staleTime: 5 * 60 * 1000,
    });
