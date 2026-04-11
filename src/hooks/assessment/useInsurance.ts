"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInsurance, saveInsurance } from "@/lib/assessment-api";
import type { InsuranceSavePayload } from "@/lib/assessment-api";
import { useAssessmentStore } from "@/store/useAssessmentStore";

/**
 * Step 5: Insurance Gap — fetch on mount (hydrates store), save on Next.
 */
export const useInsuranceQuery = () => {
    const store = useAssessmentStore();
    return useQuery({
        queryKey: ["insurance"],
        queryFn: async () => {
            const data = await getInsurance();
            // Hydrate store only if no complex data entered yet
            const hasComplexData =
                store.insurance.personalHealth.length > 0 ||
                store.insurance.personalLife.length > 0 ||
                store.insurance.corporateHealth ||
                store.insurance.corporateLife;
            if (!hasComplexData) {
                if (data.health > 0) {
                    store.addPersonalHealth({
                        id: String(Date.now()),
                        type: "Existing Health",
                        sumInsured: data.health,
                        premium: 0,
                        copay: 0,
                    });
                }
                if (data.life > 0) {
                    store.addPersonalLife({
                        id: String(Date.now() + 1),
                        type: "Existing Life",
                        sumAssured: data.life,
                        premium: 0,
                        spouseAge: store.age || 30,
                    });
                }
            }
            return data;
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useInsuranceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: InsuranceSavePayload) => saveInsurance(data),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["insurance"] }),
    });
};
