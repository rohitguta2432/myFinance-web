import { useDashboardSummary } from "./useDashboardSummary";

export interface PriorityAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  impact: number;
  urgency: number;
  feasibility: number;
  actionCost?: number;
  howTo?: string;
}

export function usePriorityActions() {
  const { data, isLoading, error } = useDashboardSummary();

  if (isLoading || error || !data) {
    return {
      allActions: [] as PriorityAction[],
      topActions: [] as PriorityAction[],
      hiddenCount: 0,
      totalTriggered: 0,
      isLoading,
      error,
    };
  }

  const pa = (data as Record<string, unknown>).priorityActions as Record<string, unknown> || {};
  const allActions = (pa.actions as PriorityAction[]) ?? [];

  return {
    allActions,
    topActions: allActions.slice(0, 3),
    hiddenCount: Math.max(0, allActions.length - 3),
    totalTriggered: allActions.length,
    isLoading: false,
    error: null,
  };
}
