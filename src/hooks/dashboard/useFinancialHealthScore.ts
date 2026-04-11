import { useDashboardSummary } from "./useDashboardSummary";

export interface Pillar {
  id: string;
  name: string;
  icon: string;
  score: number;
  maxScore: number;
  status: string;
}

export interface ScoreLabel {
  label: string;
  color: string;
}

export function useFinancialHealthScore() {
  const { data, isLoading, error } = useDashboardSummary();

  if (isLoading || error || !data) {
    return {
      totalScore: 0,
      scoreLabel: { label: "Loading...", color: "#64748b" } as ScoreLabel,
      sortedPillars: [] as Pillar[],
      mostCritical: null as Pillar | null,
      rawData: {} as Record<string, unknown>,
      isLoading,
      error,
    };
  }

  const hs = (data as Record<string, unknown>).healthScore as Record<string, unknown> || {};
  return {
    totalScore: (hs.totalScore as number) ?? 0,
    scoreLabel: { label: (hs.scoreLabel as string) ?? "", color: (hs.scoreLabelColor as string) ?? "#64748b" } as ScoreLabel,
    sortedPillars: (hs.sortedPillars as Pillar[]) ?? [],
    mostCritical: (hs.mostCritical as Pillar | null) ?? null,
    rawData: (hs.rawData as Record<string, unknown>) ?? {},
    isLoading: false,
    error: null,
  };
}
