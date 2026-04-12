"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StreakRecord {
    count: number;
    lastVisit: string; // YYYY-MM-DD
}

export interface StreakData {
    count: number;
    lastVisit: string;
    isNewMilestone: boolean; // true if count is exactly 7, 30, or 100
}

const STREAK_KEY = "myfinancial_streak";
const MILESTONES = [7, 30, 100];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysBetween(dateA: string, dateB: string): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    const a = new Date(dateA).getTime();
    const b = new Date(dateB).getTime();
    return Math.abs(Math.round((b - a) / msPerDay));
}

function getToday(): string {
    return new Date().toISOString().slice(0, 10);
}

function loadStreak(): StreakRecord | null {
    try {
        const raw = localStorage.getItem(STREAK_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as StreakRecord;
    } catch {
        return null;
    }
}

function saveStreak(record: StreakRecord): void {
    try {
        localStorage.setItem(STREAK_KEY, JSON.stringify(record));
    } catch {
        // localStorage unavailable — silently ignore
    }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useStreak(): StreakData {
    const [streakData, setStreakData] = useState<StreakData>({
        count: 1,
        lastVisit: getToday(),
        isNewMilestone: false,
    });

    useEffect(() => {
        const today = getToday();
        const stored = loadStreak();

        let newCount: number;
        let isNewMilestone = false;

        if (!stored) {
            // First ever visit — initialize
            newCount = 1;
        } else if (stored.lastVisit === today) {
            // Already counted today — no change
            setStreakData({
                count: stored.count,
                lastVisit: stored.lastVisit,
                isNewMilestone: MILESTONES.includes(stored.count),
            });
            return;
        } else {
            const diff = daysBetween(stored.lastVisit, today);
            if (diff <= 2) {
                // Yesterday or 2 days ago (48h grace period) — increment
                newCount = stored.count + 1;
            } else {
                // 3+ days gap — reset
                newCount = 1;
            }
        }

        const updatedRecord: StreakRecord = {
            count: newCount,
            lastVisit: today,
        };
        saveStreak(updatedRecord);

        // Check milestone thresholds
        isNewMilestone = MILESTONES.includes(newCount);
        if (isNewMilestone) {
            const milestoneMessages: Record<number, string> = {
                7: "7-day streak! You're on fire! Keep it up!",
                30: "30-day streak! Incredible consistency!",
                100: "100-day streak! You're a financial champion!",
            };
            toast.success(`🔥 ${milestoneMessages[newCount]}`, {
                id: "streak-milestone",
                duration: 5000,
            });
        }

        setStreakData({
            count: newCount,
            lastVisit: today,
            isNewMilestone,
        });
    }, []);

    return streakData;
}
