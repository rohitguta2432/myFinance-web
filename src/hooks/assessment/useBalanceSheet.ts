"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getBalanceSheet,
    addAsset,
    addLiability,
    updateAsset,
    updateLiability,
    deleteAsset,
    deleteLiability,
} from "@/lib/assessment-api";
import type { AssetItem, LiabilityItem } from "@/lib/assessment-api";

/**
 * Step 3: Assets & Liabilities — fetch on mount, CRUD via mutations.
 * Invalidates balance-sheet + downstream portfolio queries on every mutation.
 */

function invalidateDependents(queryClient: ReturnType<typeof useQueryClient>) {
    queryClient.invalidateQueries({ queryKey: ["balance-sheet"] });
    queryClient.invalidateQueries({ queryKey: ["portfolio-analysis"] });
    queryClient.invalidateQueries({ queryKey: ["goal-projection"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    queryClient.invalidateQueries({ queryKey: ["tax-calculation"] });
}

export const useBalanceSheetQuery = () =>
    useQuery({
        queryKey: ["balance-sheet"],
        queryFn: getBalanceSheet,
        staleTime: 5 * 60 * 1000,
    });

export const useAddAssetMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Omit<AssetItem, "id">) => addAsset(data),
        onSuccess: () => invalidateDependents(queryClient),
    });
};

export const useAddLiabilityMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Omit<LiabilityItem, "id">) => addLiability(data),
        onSuccess: () => invalidateDependents(queryClient),
    });
};

export const useUpdateAssetMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: AssetItem) => updateAsset(data),
        onSuccess: () => invalidateDependents(queryClient),
    });
};

export const useUpdateLiabilityMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: LiabilityItem) => updateLiability(data),
        onSuccess: () => invalidateDependents(queryClient),
    });
};

export const useDeleteAssetMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteAsset(id),
        onSuccess: () => invalidateDependents(queryClient),
    });
};

export const useDeleteLiabilityMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteLiability(id),
        onSuccess: () => invalidateDependents(queryClient),
    });
};
