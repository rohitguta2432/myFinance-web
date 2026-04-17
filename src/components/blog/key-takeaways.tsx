"use client";

import { Zap } from "lucide-react";
import { useAppTheme } from "@/hooks/useAppTheme";

export function KeyTakeaways({ takeaways }: { takeaways: string[] }) {
    const palette = useAppTheme();
    if (!takeaways || takeaways.length === 0) return null;

    return (
        <div
            style={{
                position: "relative",
                borderRadius: 16,
                border: "1px solid rgba(16, 185, 129, 0.2)",
                background: palette.s1,
                backdropFilter: "blur(16px)",
                padding: "28px 32px",
                boxShadow: "0 0 40px -12px rgba(16, 185, 129, 0.12)",
                overflow: "hidden",
            }}
        >
            {/* Subtle corner glow */}
            <div
                style={{
                    position: "absolute",
                    top: -40,
                    right: -40,
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.06)",
                    filter: "blur(40px)",
                    pointerEvents: "none",
                }}
            />

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 9,
                        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.15))",
                        border: "1px solid rgba(16, 185, 129, 0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Zap size={16} color="#10B981" fill="#10B981" />
                </div>
                <h3 style={{
                    margin: 0,
                    fontSize: 15,
                    fontWeight: 700,
                    color: palette.txt,
                    letterSpacing: "-0.01em",
                }}>
                    Key Takeaways
                </h3>
                <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#10B981",
                    background: "rgba(16, 185, 129, 0.1)",
                    padding: "2px 8px",
                    borderRadius: 6,
                    letterSpacing: "0.03em",
                }}>
                    {takeaways.length} points
                </span>
            </div>

            {/* Bullet points */}
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                {takeaways.map((point, i) => (
                    <li
                        key={i}
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 12,
                            fontSize: "0.95rem",
                            lineHeight: 1.6,
                            color: palette.txt2,
                        }}
                    >
                        <span
                            style={{
                                flexShrink: 0,
                                width: 22,
                                height: 22,
                                borderRadius: 7,
                                background: "rgba(16, 185, 129, 0.12)",
                                border: "1px solid rgba(16, 185, 129, 0.2)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#10B981",
                                marginTop: 2,
                            }}
                        >
                            {i + 1}
                        </span>
                        {point}
                    </li>
                ))}
            </ul>
        </div>
    );
}
