"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getGoals,
    addGoal,
    updateGoal,
    deleteGoal,
} from "@/lib/assessment-api";
import type { GoalAPIItem } from "@/lib/assessment-api";

/**
 * Step 4: Financial Goals — fetch list on mount, CRUD via mutations.
 */
export const useGoalsQuery = () =>
    useQuery({
        queryKey: ["goals"],
        queryFn: getGoals,
        staleTime: 5 * 60 * 1000,
    });

export const useAddGoalMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Omit<GoalAPIItem, "id">) => addGoal(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["goals"] });
            queryClient.invalidateQueries({ queryKey: ["goal-projection"] });
        },
    });
};

export const useUpdateGoalMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: GoalAPIItem) => updateGoal(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["goals"] });
            queryClient.invalidateQueries({ queryKey: ["goal-projection"] });
        },
    });
};

export const useDeleteGoalMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteGoal(id),
        retry: false,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["goals"] });
            queryClient.invalidateQueries({ queryKey: ["goal-projection"] });
        },
    });
};
