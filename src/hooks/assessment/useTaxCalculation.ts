"use client";

import { useQuery } from "@tanstack/react-query";
import { getTaxCalculation } from "@/lib/assessment-api";
import type { TaxCalculationParams } from "@/lib/assessment-api";

/**
 * Step 6: Tax calculation — fetches both regime results with manual deduction params.
 * Debounce is handled by the calling component.
 */
export const useTaxCalculationQuery = (params: TaxCalculationParams) =>
    useQuery({
        queryKey: [
            "tax-calculation",
            params.deductions80C,
            params.deductions80D,
            params.otherDeductions,
        ],
        queryFn: () => getTaxCalculation(params),
        staleTime: 30 * 1000,
        placeholderData: (prev) => prev,
    });
