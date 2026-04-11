"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getFinancials,
    addIncome,
    addExpense,
    deleteIncome,
    deleteExpense,
    updateIncome,
    updateExpense,
} from "@/lib/assessment-api";
import type { IncomeItem, ExpenseItem } from "@/lib/assessment-api";

/**
 * Step 2: Income & Expenses — fetch list on mount, CRUD via mutations.
 * Store hydration is handled by useEffect in the Step 2 component.
 */
export const useFinancialsQuery = () =>
    useQuery({
        queryKey: ["financials"],
        queryFn: getFinancials,
        staleTime: 5 * 60 * 1000,
    });

export const useAddIncomeMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Omit<IncomeItem, "id">) => addIncome(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["financials"] }),
    });
};

export const useAddExpenseMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Omit<ExpenseItem, "id">) => addExpense(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["financials"] }),
    });
};

export const useDeleteIncomeMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteIncome(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["financials"] }),
    });
};

export const useDeleteExpenseMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteExpense(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["financials"] }),
    });
};

export const useUpdateIncomeMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: IncomeItem) => updateIncome(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["financials"] }),
    });
};

export const useUpdateExpenseMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ExpenseItem) => updateExpense(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["financials"] }),
    });
};
