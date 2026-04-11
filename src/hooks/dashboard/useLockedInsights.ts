import { useDashboardSummary } from "./useDashboardSummary";

const fmt = (val: number | null | undefined): string => {
  if (val == null || isNaN(val)) return "₹0";
  const n = Number(val);
  if (Math.abs(n) >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (Math.abs(n) >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  if (Math.abs(n) >= 1e3) return `₹${(n / 1e3).toFixed(1)} K`;
  return `₹${n.toLocaleString("en-IN")}`;
};

export interface LockedInsightCard {
  id: string;
  label: string;
  impactLabel: string;
  icon: string;
  category: string;
}

export function useLockedInsights() {
  const { data, isLoading, error } = useDashboardSummary();

  if (isLoading || error || !data) {
    return { cards: [] as LockedInsightCard[], maxFigureFormatted: "₹0", hiddenCount: 0, isLoading, error };
  }

  const li = (data as Record<string, unknown>).lockedInsights as Record<string, unknown> || {};
  const rawCards = (li.cards as Record<string, unknown>[]) ?? [];
  const totalAvailable = (li.totalAvailable as number) ?? rawCards.length;

  const cards: LockedInsightCard[] = rawCards.map((c) => ({
    id: (c.id as string),
    label: (c.title ?? c.label) as string ?? "Insight",
    impactLabel: (c.teaser as string) ?? fmt(c.score as number ?? 0),
    icon: (c.icon as string) ?? "🔒",
    category: (c.category as string) ?? "",
  }));

  const maxScore = rawCards.reduce((max, c) => Math.max(max, (c.score as number) ?? 0), 0);
  const visibleCount = Math.min(cards.length, 4);
  const hiddenCount = Math.max(0, totalAvailable - visibleCount);

  return {
    cards: cards.slice(0, 4),
    maxFigureFormatted: fmt(maxScore),
    hiddenCount,
    isLoading: false,
    error: null,
  };
}
