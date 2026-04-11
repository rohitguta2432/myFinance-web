"use client";

import { useQuery } from "@tanstack/react-query";
import { getRetirementAutoFill } from "@/lib/assessment-api";

/**
 * Step 4: Retirement auto-fill — fetches corpus, gap, SIP from backend.
 */
export const useRetirementAutoFillQuery = () =>
    useQuery({
        queryKey: ["retirement-autofill"],
        queryFn: getRetirementAutoFill,
        staleTime: 30 * 1000,
    });
