import { useDashboardSummary } from "./useDashboardSummary";

export interface ActionPlanItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  pillar: string;
  scenario: string;
  impact: string;
  urgencyMultiplier: number;
  feasibilityFactor: number;
  whatToDo: string[];
  whatNotToDo: string[];
  steps: { text: string }[];
}

function mapCategory(a: Record<string, unknown>): string {
  const id = (String(a.id ?? "")).toUpperCase();
  if (id.includes("LIFE") || id.includes("HEALTH")) return "INS";
  if (id.includes("TAX") || id.includes("80C") || id.includes("NPS")) return "TAX";
  if (id.includes("RETIRE") || id.includes("RET")) return "RET";
  if (id.includes("DEBT") || id.includes("EMI") || id.includes("LOAN")) return "DBT";
  if (id.includes("EMRG") || id.includes("EMERGENCY") || id.includes("A1")) return "SRV";
  return "WLT";
}

function mapPillar(a: Record<string, unknown>): string {
  const cat = mapCategory(a);
  const MAP: Record<string, string> = {
    SRV: "Survival",
    INS: "Protection",
    TAX: "Tax",
    RET: "Retirement",
    WLT: "Wealth",
    DBT: "Debt",
  };
  return MAP[cat] ?? "Wealth";
}

export function useActionPlan() {
  const { data, isLoading, error } = useDashboardSummary();

  if (isLoading || error || !data) {
    return {
      actions: [] as ActionPlanItem[],
      count: 0,
      isLoading,
      error,
    };
  }

  const ap = (data as Record<string, unknown>).actionPlan as Record<string, unknown> || {};
  const raw = (ap.actions as Record<string, unknown>[]) ?? [];

  const actions: ActionPlanItem[] = raw.map((a): ActionPlanItem => ({
    id: (a.id as string) || "",
    title: (a.title as string) || "",
    subtitle: (a.description as string) || "",
    category: mapCategory(a),
    pillar: mapPillar(a),
    scenario: (a.id as string) || "",
    impact: (a.impact as string) || "HIGH",
    urgencyMultiplier:
      a.urgency === "CRITICAL" ? 3 : a.urgency === "HIGH" ? 2 : 1,
    feasibilityFactor:
      a.feasibility === "EASY" ? 1.2 : a.feasibility === "POSSIBLE" ? 1 : 0.8,
    whatToDo: a.whatToDo ? [a.whatToDo as string] : [],
    whatNotToDo: a.whyItMatters ? [`Why: ${a.whyItMatters}`] : [],
    steps: a.expectedOutcome ? [{ text: `Expected: ${a.expectedOutcome}` }] : [],
  }));

  return {
    actions,
    count: actions.length,
    isLoading: false,
    error: null,
  };
}
