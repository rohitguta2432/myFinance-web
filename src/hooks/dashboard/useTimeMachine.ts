import { useDashboardSummary } from "./useDashboardSummary";

export interface TimeMachineData {
  dailyCost: number;
  missedWealth: number;
  missedWealthFormatted: string;
  totalDelayCostFormatted: string;
  oneYearPenaltyFormatted: string;
  streak: number;
  topAction: { icon: string; title: string } | null;
}

export function useTimeMachine(): TimeMachineData | null {
  const { data, isLoading, error } = useDashboardSummary();

  if (isLoading || error || !data) return null;

  const tm = (data as Record<string, unknown>).timeMachine as Record<string, unknown> || {};
  const dailyCost = (tm.dailyCostOfInaction ?? tm.dailyCost ?? 0) as number;

  return {
    dailyCost,
    missedWealth: (tm.missedWealth as number) ?? 0,
    missedWealthFormatted: (tm.missedWealthFormatted as string) ?? "₹0",
    totalDelayCostFormatted: (tm.costOfDelayFormatted as string) ?? "₹0",
    oneYearPenaltyFormatted: dailyCost > 0
      ? `₹${Math.round(dailyCost * 365).toLocaleString("en-IN")}`
      : "₹0",
    streak: (tm.delayYears as number) ?? 0,
    topAction: null,
  };
}
