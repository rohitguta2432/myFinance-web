"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export interface AppPalette {
    bg: string;
    s1: string;
    s2: string;
    s3: string;
    txt: string;
    txt2: string;
    mute: string;
    accent: string;
    brd: string;
    brd2: string;
    danger: string;
    warn: string;
}

export const DARK_PALETTE: AppPalette = {
    bg: "#080E12",
    s1: "#0C1319",
    s2: "#121A22",
    s3: "#1A242F",
    txt: "#F0F4F8",
    txt2: "#CBD5E1",
    mute: "#94A3B8",
    accent: "#10B981",
    brd: "rgba(255,255,255,0.05)",
    brd2: "rgba(255,255,255,0.10)",
    danger: "#F87171",
    warn: "#FB923C",
};

export const LIGHT_PALETTE: AppPalette = {
    bg: "#F8FAFC",
    s1: "#FFFFFF",
    s2: "#F1F5F9",
    s3: "#E2E8F0",
    txt: "#0F172A",
    txt2: "#334155",
    mute: "#64748B",
    accent: "#10B981",
    brd: "rgba(0,0,0,0.06)",
    brd2: "rgba(0,0,0,0.12)",
    danger: "#DC2626",
    warn: "#D97706",
};

/**
 * Returns the current color palette based on the active theme.
 * Initializes to DARK_PALETTE to match server render and avoid hydration mismatches.
 */
export function useAppTheme(): AppPalette {
    const { resolvedTheme } = useTheme();
    const [palette, setPalette] = useState<AppPalette>(DARK_PALETTE);

    useEffect(() => {
        setPalette(resolvedTheme === "light" ? LIGHT_PALETTE : DARK_PALETTE);
    }, [resolvedTheme]);

    return palette;
}
