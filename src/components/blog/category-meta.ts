import {
    Sparkles,
    Wallet,
    BookOpen,
    TrendingUp,
    LineChart,
    Receipt,
    PiggyBank,
    Shield,
    CreditCard,
    Globe,
    Brain,
    Stethoscope,
    Newspaper,
    Layers,
    type LucideIcon,
} from "lucide-react";

export interface CategoryMeta {
    bg: string;
    text: string;
    icon: LucideIcon;
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
    "Personal Finance Foundations": { bg: "rgba(14, 165, 233, 0.15)", text: "#0EA5E9", icon: Sparkles },
    "Income & Cash Flow Management": { bg: "rgba(168, 85, 247, 0.15)", text: "#A855F7", icon: Wallet },
    "Investment Basics": { bg: "rgba(59, 130, 246, 0.15)", text: "#3B82F6", icon: BookOpen },
    "Mutual Funds Investing": { bg: "rgba(99, 102, 241, 0.15)", text: "#6366F1", icon: TrendingUp },
    "Stock Market Investing": { bg: "rgba(244, 63, 94, 0.15)", text: "#F43F5E", icon: LineChart },
    "Tax Planning": { bg: "rgba(16, 185, 129, 0.15)", text: "#10B981", icon: Receipt },
    "Retirement Planning": { bg: "rgba(236, 72, 153, 0.15)", text: "#EC4899", icon: PiggyBank },
    "Insurance Planning": { bg: "rgba(245, 158, 11, 0.15)", text: "#F59E0B", icon: Shield },
    "Debt Management & Credit Score": { bg: "rgba(239, 68, 68, 0.15)", text: "#EF4444", icon: CreditCard },
    "NRI Financial Planning": { bg: "rgba(139, 92, 246, 0.15)", text: "#8B5CF6", icon: Globe },
    "Behavioral Finance & Money Psychology": { bg: "rgba(20, 184, 166, 0.15)", text: "#14B8A6", icon: Brain },
    "MyFinancial Services & Financial Diagnostics": { bg: "rgba(217, 119, 6, 0.15)", text: "#D97706", icon: Stethoscope },
    "Market Updates": { bg: "rgba(56, 189, 248, 0.15)", text: "#38BDF8", icon: Newspaper },
    General: { bg: "rgba(148, 163, 184, 0.12)", text: "#94A3B8", icon: Layers },
    // Legacy aliases (DynamoDB still has rows with these older categories)
    "Tax Saving": { bg: "rgba(16, 185, 129, 0.15)", text: "#10B981", icon: Receipt },
    Investing: { bg: "rgba(59, 130, 246, 0.15)", text: "#3B82F6", icon: TrendingUp },
    Budgeting: { bg: "rgba(168, 85, 247, 0.15)", text: "#A855F7", icon: Wallet },
    Insurance: { bg: "rgba(245, 158, 11, 0.15)", text: "#F59E0B", icon: Shield },
    "NPS & Retirement": { bg: "rgba(236, 72, 153, 0.15)", text: "#EC4899", icon: PiggyBank },
};

export function getCategoryMeta(category: string | undefined): CategoryMeta {
    if (!category) return CATEGORY_META.General;
    return CATEGORY_META[category] || CATEGORY_META.General;
}
