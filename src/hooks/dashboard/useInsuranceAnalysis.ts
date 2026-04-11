import { useDashboardSummary } from "./useDashboardSummary";

export interface TermLife {
  hlvFormatted: string;
  needsAnalysisFormatted: string;
  requiredCoverFormatted: string;
  existingCoverFormatted: string;
  coverGapFormatted: string;
  personalCover: number;
  corporateCover: number;
  isAdequate: boolean;
  adequacyPct: number;
  barColor: string;
  label: string;
}

export interface HealthInsurance {
  cityBenchmarkFormatted: string;
  effectiveCoverFormatted: string;
  gapFormatted: string;
  personalCover: number;
  corporateCover: number;
  baseCoverFormatted: string;
  totalWithTopUp: string;
  isAdequate: boolean;
  isEmployerOnly: boolean;
  showSuperTopUpReco: boolean;
  cityTier: string;
}

export interface AdditionalCoverageCard {
  id: string;
  icon: string;
  title: string;
  explanation: string;
  estimatedPremium: number | string;
}

export function useInsuranceAnalysis() {
  const { data, isLoading, error } = useDashboardSummary();

  if (isLoading || error || !data) {
    return {
      termLife: null as TermLife | null,
      healthInsurance: null as HealthInsurance | null,
      additionalCoverage: [] as AdditionalCoverageCard[],
      age: 0,
      city: "",
      annualIncome: 0,
      annualIncomeFormatted: "₹0",
      totalEMI: 0,
      totalEMIFormatted: "₹0",
      isLoading,
      error,
    };
  }

  const ia = (data as Record<string, unknown>).insuranceAnalysis as Record<string, unknown> || {};
  return {
    termLife: (ia.termLife as TermLife) ?? null,
    healthInsurance: (ia.healthInsurance ?? ia.health) as HealthInsurance ?? null,
    additionalCoverage: ((ia.additionalCoverage ?? ia.additionalCovers) as AdditionalCoverageCard[]) ?? [],
    age: (ia.age as number) ?? 0,
    city: (ia.city as string) ?? "",
    annualIncome: (ia.annualIncome as number) ?? 0,
    annualIncomeFormatted: (ia.annualIncomeFormatted as string) ?? "₹0",
    totalEMI: (ia.totalEMI as number) ?? 0,
    totalEMIFormatted: (ia.totalEMIFormatted as string) ?? "₹0",
    isLoading: false,
    error: null,
  };
}
