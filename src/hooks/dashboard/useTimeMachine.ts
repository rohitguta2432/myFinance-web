import { useDashboardSummary } from "./useDashboardSummary";

export type TimeMachineCardTone = "danger" | "warning" | "positive";

export interface TimeMachineCard {
  badge: string;
  amountPrefix?: string;
  amountFormatted: string;
  amountSuffix?: string;
  heading: string;
  body: string;
  formula?: string;
  tone: TimeMachineCardTone;
}

export interface TimeMachineData {
  dailyCost: number;
  missedWealth: number;
  missedWealthFormatted: string;
  avgYearlyCostFormatted: string;
  delayYears: number;
  heroSubtitle: string | null;
  explanation: string | null;
  cards: TimeMachineCard[] | null;
}

function formatInr(value: number): string {
  if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2)} Cr`;
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(2)} L`;
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

export function useTimeMachine(): TimeMachineData | null {
  const { data, isLoading, error } = useDashboardSummary();

  if (isLoading || error || !data) return null;

  const tm = (data as Record<string, unknown>).timeMachine as Record<string, unknown> || {};
  const dailyCost = (tm.dailyCostOfInaction ?? tm.dailyCost ?? 0) as number;
  const missedWealth = (tm.missedWealth as number) ?? 0;
  const delayYears = (tm.delayYears as number) ?? 0;
  const avgYearlyCost = delayYears > 0 ? missedWealth / delayYears : 0;
  const rawCards = tm.cards as TimeMachineCard[] | undefined;

  return {
    dailyCost,
    missedWealth,
    missedWealthFormatted: (tm.missedWealthFormatted as string) ?? "₹0",
    avgYearlyCostFormatted: avgYearlyCost > 0 ? formatInr(avgYearlyCost) : "₹0",
    delayYears,
    heroSubtitle: (tm.heroSubtitle as string) ?? null,
    explanation: (tm.explanation as string) ?? null,
    cards: Array.isArray(rawCards) && rawCards.length > 0 ? rawCards : null,
  };
}
