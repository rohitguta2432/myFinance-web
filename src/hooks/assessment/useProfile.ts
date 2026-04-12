"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, saveProfile } from "@/lib/assessment-api";
import type { ProfileDTO } from "@/lib/assessment-api";

/**
 * Step 1: Profile & Risk — fetch on mount, save on Next.
 */
export const useProfileQuery = () =>
    useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
        staleTime: 5 * 60 * 1000,
    });

export const useProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ProfileDTO) => saveProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            queryClient.invalidateQueries({ queryKey: ["risk-scoring"] });
            queryClient.invalidateQueries({ queryKey: ["portfolio-analysis"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
        },
    });
};
