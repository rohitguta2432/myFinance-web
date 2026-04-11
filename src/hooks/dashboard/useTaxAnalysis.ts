import { useDashboardSummary } from "./useDashboardSummary";

/** Indian currency formatter */
export const fmt = (val: number | null | undefined): string => {
  if (val == null || isNaN(val)) return "₹0";
  const n = Number(val);
  if (Math.abs(n) >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (Math.abs(n) >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  if (Math.abs(n) >= 1e3) return `₹${(n / 1e3).toFixed(1)} K`;
  return `₹${n.toLocaleString("en-IN")}`;
};

export interface RegimeBreakdown {
  grossIncome: number;
  stdDeduction: number;
  deductions80C: number;
  deductionsNps: number;
  hraExemption?: number;
  otherDeductions?: number;
  totalDeductions: number;
  taxableIncome: number;
  baseTax: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  rebateApplied?: boolean;
}

export interface RegimeComparison {
  old: RegimeBreakdown;
  new: RegimeBreakdown;
  recommended: "old" | "new";
  savings: number;
  savingsFormatted: string;
}

export interface TdsData {
  totalTDS: number;
  totalTDSFormatted: string;
  recommendedTax: number;
  recommendedTaxFormatted: string;
  diff: number;
  diffFormatted: string;
  status: "refund" | "due" | "matched";
}

export interface RentalData {
  hasRentalIncome: boolean;
  grossRentalIncome: number;
  grossFormatted: string;
  stdDeduction: number;
  stdDeductionFormatted: string;
  netRentalIncome: number;
  netFormatted: string;
}

export interface DeductionItem {
  label: string;
  sublabel: string;
  amount: number;
  max: number;
  gap: number;
  potentialSaving: number;
  status: "full" | "partial" | "unused";
}

export interface DeductionsData {
  isOldRegime: boolean;
  items: DeductionItem[];
  totalDeductions: number;
  newRegimeDeduction: number;
}

export interface EmployerNpsData {
  show: boolean;
  hasEmployerNps: boolean;
  amount: number;
  amountFormatted: string;
  potentialSaving: number;
  potentialSavingFormatted: string;
}

const EMPTY_REGIME: RegimeBreakdown = {
  grossIncome: 0, stdDeduction: 0, deductions80C: 0, deductionsNps: 0,
  totalDeductions: 0, taxableIncome: 0, baseTax: 0, cess: 0,
  totalTax: 0, effectiveRate: 0, rebateApplied: false,
};

const EMPTY_TDS: TdsData = {
  totalTDS: 0, totalTDSFormatted: "₹0",
  recommendedTax: 0, recommendedTaxFormatted: "₹0",
  diff: 0, diffFormatted: "₹0", status: "matched",
};

const EMPTY_RENTAL: RentalData = {
  hasRentalIncome: false, grossRentalIncome: 0, grossFormatted: "₹0",
  stdDeduction: 0, stdDeductionFormatted: "₹0",
  netRentalIncome: 0, netFormatted: "₹0",
};

const EMPTY_DEDUCTIONS: DeductionsData = {
  isOldRegime: false, items: [], totalDeductions: 0, newRegimeDeduction: 0,
};

const EMPTY_EMPLOYER_NPS: EmployerNpsData = {
  show: false, hasEmployerNps: false, amount: 0, amountFormatted: "₹0",
  potentialSaving: 0, potentialSavingFormatted: "₹0",
};

export function useTaxAnalysis() {
  const { data, isLoading, error } = useDashboardSummary();

  if (isLoading || error || !data) {
    return {
      regimeComparison: null as RegimeComparison | null,
      tds: EMPTY_TDS,
      rental: EMPTY_RENTAL,
      deductions: EMPTY_DEDUCTIONS,
      employerNps: EMPTY_EMPLOYER_NPS,
      grossTotalIncome: 0,
      grossTotalIncomeFormatted: "₹0",
      fmt,
      isLoading,
      error,
    };
  }

  const ta = (data as Record<string, unknown>).taxAnalysis as Record<string, unknown> || {};
  const rc = ta.regimeComparison as Record<string, unknown> | undefined;

  const regimeComparison: RegimeComparison | null = rc
    ? {
        old: (rc.old as RegimeBreakdown) ?? EMPTY_REGIME,
        new: (rc.newRegime ?? rc.new) as RegimeBreakdown ?? EMPTY_REGIME,
        recommended: (rc.recommended as "old" | "new") ?? "new",
        savings: (rc.savings as number) ?? 0,
        savingsFormatted: (rc.savingsFormatted as string) ?? "₹0",
      }
    : null;

  return {
    regimeComparison,
    tds: (ta.tds as TdsData) ?? EMPTY_TDS,
    rental: (ta.rental as RentalData) ?? EMPTY_RENTAL,
    deductions: (ta.deductions as DeductionsData) ?? EMPTY_DEDUCTIONS,
    employerNps: (ta.employerNps as EmployerNpsData) ?? EMPTY_EMPLOYER_NPS,
    grossTotalIncome: (ta.grossTotalIncome as number) ?? 0,
    grossTotalIncomeFormatted: (ta.grossTotalIncomeFormatted as string) ?? "₹0",
    fmt,
    isLoading: false,
    error: null,
  };
}
