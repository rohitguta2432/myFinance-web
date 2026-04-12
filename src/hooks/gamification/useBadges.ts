"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import { useStreak } from "@/hooks/gamification/useStreak";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BadgeDefinition {
    id: string;
    name: string;
    description: string;
    howToEarn: string;
    icon: string; // Lucide icon name
}

export interface BadgesData {
    earned: string[];          // Array of earned badge IDs
    totalEarned: number;       // earned.length
    totalBadges: number;       // 8 (constant)
    newlyEarned: string[];     // Badges earned this session (for animation triggers)
    definitions: BadgeDefinition[];
}

// ─── Badge Definitions ────────────────────────────────────────────────────────

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
    {
        id: "first-steps",
        name: "First Steps",
        description: "You took the first step toward financial clarity.",
        howToEarn: "Complete Step 1 of the financial assessment.",
        icon: "Footprints",
    },
    {
        id: "money-map",
        name: "Money Map",
        description: "You have a complete picture of your finances.",
        howToEarn: "Complete all 6 steps of the financial assessment.",
        icon: "Map",
    },
    {
        id: "goal-setter",
        name: "Goal Setter",
        description: "You know what you're working toward.",
        howToEarn: "Add your first financial goal in Step 4.",
        icon: "Target",
    },
    {
        id: "diversified",
        name: "Diversified",
        description: "Your portfolio spans multiple asset classes.",
        howToEarn: "Have assets in 3 or more different categories.",
        icon: "PieChart",
    },
    {
        id: "debt-free",
        name: "Debt Free",
        description: "You carry no outstanding liabilities.",
        howToEarn: "Have zero liabilities in your net worth assessment.",
        icon: "Smile",
    },
    {
        id: "protected",
        name: "Protected",
        description: "You have both life and health insurance coverage.",
        howToEarn: "Add at least one personal life policy and one personal health policy.",
        icon: "ShieldCheck",
    },
    {
        id: "tax-smart",
        name: "Tax Smart",
        description: "You have optimized your tax strategy.",
        howToEarn: "Complete the tax optimization step in the assessment.",
        icon: "Calculator",
    },
    {
        id: "streak-master",
        name: "Streak Master",
        description: "You check in consistently — 30 days in a row!",
        howToEarn: "Maintain a 30-day login streak.",
        icon: "Flame",
    },
];

const BADGES_KEY = "myfinancial_badges";
const TOTAL_BADGES = BADGE_DEFINITIONS.length; // 8

// ─── localStorage helpers ─────────────────────────────────────────────────────

function loadEarnedBadges(): string[] {
    try {
        const raw = localStorage.getItem(BADGES_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as string[];
    } catch {
        return [];
    }
}

function saveEarnedBadges(ids: string[]): void {
    try {
        localStorage.setItem(BADGES_KEY, JSON.stringify(ids));
    } catch {
        // localStorage unavailable — silently ignore
    }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useBadges(): BadgesData {
    const [badgesData, setBadgesData] = useState<BadgesData>({
        earned: [],
        totalEarned: 0,
        totalBadges: TOTAL_BADGES,
        newlyEarned: [],
        definitions: BADGE_DEFINITIONS,
    });

    // Assessment store selectors
    const currentStep = useAssessmentStore((s) => s.currentStep);
    const isComplete = useAssessmentStore((s) => s.isComplete);
    const goals = useAssessmentStore((s) => s.goals);
    const assets = useAssessmentStore((s) => s.assets);
    const liabilities = useAssessmentStore((s) => s.liabilities);
    const insurance = useAssessmentStore((s) => s.insurance);

    // Streak data for "Streak Master" badge
    const { count: streakCount } = useStreak();

    // Guard against double-toast in React StrictMode
    const hasCheckedRef = useRef(false);

    useEffect(() => {
        if (hasCheckedRef.current) return;
        hasCheckedRef.current = true;

        // Evaluate each badge criterion
        const nowEarned: string[] = [];

        if (currentStep >= 2) {
            nowEarned.push("first-steps");
        }
        if (isComplete) {
            nowEarned.push("money-map");
            nowEarned.push("tax-smart"); // tax is step 6, completion implies it
        }
        if (goals.length > 0) {
            nowEarned.push("goal-setter");
        }
        if (new Set(assets.map((a) => a.category)).size >= 3) {
            nowEarned.push("diversified");
        }
        if (liabilities.length === 0) {
            nowEarned.push("debt-free");
        }
        if (
            insurance.personalLife.length > 0 &&
            insurance.personalHealth.length > 0
        ) {
            nowEarned.push("protected");
        }
        if (streakCount >= 30) {
            nowEarned.push("streak-master");
        }

        // Compare against previously stored badges
        const previouslyEarned = loadEarnedBadges();
        const previousSet = new Set(previouslyEarned);

        const newlyEarned = nowEarned.filter((id) => !previousSet.has(id));

        // Fire celebratory toast for each newly earned badge
        for (const badgeId of newlyEarned) {
            const def = BADGE_DEFINITIONS.find((b) => b.id === badgeId);
            const name = def?.name ?? badgeId;
            toast.success(`🎉 New badge earned: ${name}!`, {
                id: `badge-${badgeId}`,
                duration: 5000,
            });
        }

        // Persist the updated set (union of previous + new)
        const allEarned = Array.from(new Set([...previouslyEarned, ...nowEarned]));
        saveEarnedBadges(allEarned);

        setBadgesData({
            earned: allEarned,
            totalEarned: allEarned.length,
            totalBadges: TOTAL_BADGES,
            newlyEarned,
            definitions: BADGE_DEFINITIONS,
        });
    }, [currentStep, isComplete, goals, assets, liabilities, insurance, streakCount]);

    return badgesData;
}
