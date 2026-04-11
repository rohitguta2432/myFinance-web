import { useDashboardSummary } from "./useDashboardSummary";

export interface RedFlag {
  id: string;
  title: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  explanation: string;
  action: string;
  impact: number;
  urgency: number;
}

export function useRedFlags() {
  const { data, isLoading, error } = useDashboardSummary();

  if (isLoading || error || !data) {
    return {
      allFlags: [] as RedFlag[],
      topFlags: [] as RedFlag[],
      hiddenCount: 0,
      totalTriggered: 0,
      isLoading,
      error,
    };
  }

  const rf = (data as Record<string, unknown>).redFlags as Record<string, unknown> || {};
  const allFlags = (rf.flags as RedFlag[]) ?? [];
  const totalCount = (rf.totalCount as number) ?? allFlags.length;

  return {
    allFlags,
    topFlags: allFlags.slice(0, 3),
    hiddenCount: Math.max(0, totalCount - 3),
    totalTriggered: totalCount,
    isLoading: false,
    error: null,
  };
}
