import { useDashboardSummary } from "./useDashboardSummary";

export interface HookTextData {
  tier: "critical" | "warn" | "ok";
  text: string;
  action: string;
  dscrOverride?: boolean;
  equityOverride?: boolean;
  emotionalDriver?: string;
}

/**
 * Returns the pillarInterpretations map from the backend dashboard summary.
 * { [pillarId]: HookTextData }
 */
export function useHookText(
  _pillars?: unknown[],
  _rawData?: unknown
): Record<string, HookTextData> {
  const { data } = useDashboardSummary();

  if (!data || !(data as Record<string, unknown>).pillarInterpretations) {
    return {};
  }

  return (data as Record<string, unknown>).pillarInterpretations as Record<string, HookTextData>;
}
