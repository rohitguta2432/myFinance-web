import { useDashboardSummary } from "./useDashboardSummary";

export interface Benchmark {
  id: string;
  label: string;
  icon: string;
  trafficLight: "green" | "amber" | "red";
  note: string;
  userValue: string;
  benchTarget: string;
  barPercent: number;
}

export function usePersonalisedBenchmarks() {
  const { data, isLoading, error } = useDashboardSummary();

  if (isLoading || error || !data) {
    return { benchmarks: [] as Benchmark[], isLoading, error };
  }

  const bm = (data as Record<string, unknown>).benchmarks as Record<string, unknown> || {};
  const rawBenchmarks = (bm.benchmarks as Record<string, unknown>[]) ?? [];

  const benchmarks: Benchmark[] = rawBenchmarks.map((b) => {
    const userVal = (b.userValue as number) ?? 0;
    const benchVal = ((b.benchmarkValue as number) ?? 1) || 1;
    const statusMap: Record<string, Benchmark["trafficLight"]> = {
      green: "green", yellow: "amber", red: "red",
    };
    const trafficLight = statusMap[(b.status as string)] ?? "amber";
    const barPercent = benchVal > 0 ? Math.round((userVal / benchVal) * 100) : 0;

    return {
      id: (b.id as string),
      label: (b.label as string),
      icon: (b.icon as string) ?? "📊",
      trafficLight,
      note: (b.description as string) ?? "",
      userValue: (b.userValueFormatted as string) ?? String(userVal),
      benchTarget: (b.benchmarkValueFormatted as string) ?? String(benchVal),
      barPercent,
    };
  });

  return { benchmarks, isLoading: false, error: null };
}
