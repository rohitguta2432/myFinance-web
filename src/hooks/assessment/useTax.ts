"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTax, saveTax } from "@/lib/assessment-api";
import type { TaxData } from "@/lib/assessment-api";
import { useAssessmentStore } from "@/store/useAssessmentStore";

/**
 * Step 6: Tax Planning — fetch on mount (hydrates store), save on Complete.
 * Backend now returns granular deduction fields; hydrate regime into local store.
 */
export const useTaxQuery = () => {
    const store = useAssessmentStore();
    return useQuery({
        queryKey: ["tax"],
        queryFn: async () => {
            const data = await getTax();
            if (data.selectedRegime) {
                store.setTaxRegime(data.selectedRegime.toLowerCase() as "old" | "new");
            }
            return data;
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useTaxMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: TaxData) => saveTax(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tax"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
            queryClient.invalidateQueries({ queryKey: ["tax-calculation"] });
        },
    });
};
