"use client";

import { useQuery } from "@tanstack/react-query";
import { getInsuranceGap } from "@/lib/assessment-api";

/**
 * Step 5: Fetches recommended life + health cover from backend.
 */
export const useInsuranceGapQuery = () =>
    useQuery({
        queryKey: ["insurance-gap"],
        queryFn: getInsuranceGap,
        staleTime: 5 * 60 * 1000,
    });
