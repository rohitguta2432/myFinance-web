"use client";

import { useQuery } from "@tanstack/react-query";
import { getRiskScoring } from "@/lib/assessment-api";

/**
 * Fetch backend-computed risk scoring (profile label + target allocation).
 */
export const useRiskScoringQuery = () =>
    useQuery({
        queryKey: ["risk-scoring"],
        queryFn: getRiskScoring,
        staleTime: 10 * 60 * 1000,
    });
