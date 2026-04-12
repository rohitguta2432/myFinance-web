"use client";

import React from "react";
import { useAppTheme } from "@/hooks/useAppTheme";

export interface ResultCardProps {
    label: string;
    value: string;
    sublabel?: string;
    accent?: boolean;
    className?: string;
}

export function ResultCard({ label, value, sublabel, accent = false, className }: ResultCardProps) {
    const palette = useAppTheme();

    return (
        <div
            className={className}
            style={{
                background: palette.s2,
                border: `1px solid ${palette.brd}`,
                borderRadius: 12,
                padding: "20px 24px",
            }}
        >
            <p
                style={{
                    fontSize: 13,
                    color: palette.mute,
                    margin: 0,
                    marginBottom: 6,
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                }}
            >
                {label}
            </p>
            <p
                style={{
                    fontSize: "1.75rem",
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    color: accent ? palette.accent : palette.txt,
                    margin: 0,
                    marginBottom: sublabel ? 6 : 0,
                    lineHeight: 1.2,
                    letterSpacing: "-0.02em",
                }}
            >
                {value}
            </p>
            {sublabel && (
                <p style={{ fontSize: 13, color: palette.mute, margin: 0 }}>{sublabel}</p>
            )}
        </div>
    );
}
