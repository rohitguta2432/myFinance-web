import { useDashboardSummary } from "./useDashboardSummary";

/** Indian currency formatter */
const fmt = (val: number | null | undefined): string => {
  if (val == null || isNaN(val)) return "₹0";
  const n = Number(val);
  if (Math.abs(n) >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (Math.abs(n) >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  if (Math.abs(n) >= 1e3) return `₹${(n / 1e3).toFixed(1)} K`;
  return `₹${n.toLocaleString("en-IN")}`;
};

export interface ProjectionDataPoint {
  year: number;
  age: number;
  currentPath: number;
  optimized: number;
  earlyStart: number;
}

export interface ProjectionResult {
  data: ProjectionDataPoint[];
  finalCurrentFormatted: string;
  finalOptimizedFormatted: string;
  finalEarlyFormatted: string;
  extraByOptimizingFormatted: string;
  projectionYears: number;
  retirementAge: number;
  milestones: { amount: string; value: number }[];
  optimizationPct: number;
  monthlySavings: number;
  optimizedSavings: number;
  fmt: (val: number | null | undefined) => string;
}

export function useProjection(): ProjectionResult | null {
  const { data: summaryData, isLoading, error } = useDashboardSummary();

  if (isLoading || error || !summaryData) return null;

  const d = summaryData as Record<string, unknown>;
  const p = (d.projection as Record<string, unknown>) || {};
  const tm = (d.timeMachine as Record<string, unknown>) || {};
  const sm = (d.scorecardMetrics as Record<string, unknown>) || {};

  const points = ((p.currentPath ?? p.optimizedPath) as Array<Record<string, unknown>>) || [];
  if (!points.length) return null;

  const currentAge = (tm.actualStartAge ?? tm.currentAge ?? 30) as number;
  const projectionYears = points.length > 0
    ? (points[points.length - 1].year as number)
    : 30;
  const retirementAge = Math.round(currentAge + projectionYears);
  const annualRate = 0.12;

  const data: ProjectionDataPoint[] = points.map((pt) => {
    const yr = (pt.year as number) ?? 0;
    const currentVal = (pt.current as number) ?? 0;
    const optimizedVal = (pt.optimized as number) ?? 0;
    const earlyStartVal = Math.round(currentVal * Math.pow(1 + annualRate, 5));
    return {
      year: new Date().getFullYear() + yr,
      age: Math.round(currentAge + yr),
      currentPath: currentVal,
      optimized: optimizedVal,
      earlyStart: earlyStartVal,
    };
  });

  const lastPoint = data[data.length - 1] ?? { currentPath: 0, optimized: 0, earlyStart: 0 };
  const currentEnd = lastPoint.currentPath;
  const optimizedEnd = lastPoint.optimized;
  const earlyEnd = lastPoint.earlyStart;
  const extraByOptimizing = optimizedEnd - currentEnd;

  const milestoneAmounts = [
    { amount: "₹1 Cr", value: 10000000 },
    { amount: "₹5 Cr", value: 50000000 },
    { amount: "₹10 Cr", value: 100000000 },
  ];
  const maxVal = Math.max(optimizedEnd, earlyEnd);
  const milestones = milestoneAmounts.filter((m) => m.value <= maxVal * 1.2);

  const monthlyIncome = (sm.monthlyIncome as number) ?? 0;
  const monthlyExpenses = (sm.monthlyExpenses as number) ?? 0;
  const monthlySavings = Math.max(0, monthlyIncome - monthlyExpenses);
  const optimizationPct = (p.optimizationPct as number) ?? 20;
  const optimizedSavings = Math.round(monthlySavings * (1 + optimizationPct / 100));

  return {
    data,
    finalCurrentFormatted: fmt(currentEnd),
    finalOptimizedFormatted: fmt(optimizedEnd),
    finalEarlyFormatted: fmt(earlyEnd),
    extraByOptimizingFormatted: fmt(extraByOptimizing),
    projectionYears,
    retirementAge,
    milestones,
    optimizationPct,
    monthlySavings,
    optimizedSavings,
    fmt,
  };
}
