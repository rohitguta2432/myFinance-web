"use client";

import { useState, useEffect } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";

interface ScoreRingProps {
  score: number;
  label: string;
  color: string;
}

export function ScoreRing({ score, label, color }: ScoreRingProps) {
  const palette = useAppTheme();
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 80;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, (animatedScore / 100) * 100);
  const offset = circumference - (pct / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="100" cy="100" r={radius}
          fill="none"
          stroke="rgba(100,116,139,0.1)"
          strokeWidth={stroke}
        />
        <circle
          cx="100" cy="100" r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1500ms ease-out",
            filter: `drop-shadow(0 0 8px ${color}40)`,
          }}
        />
      </svg>
      <div style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 140,
        textAlign: "center",
      }}>
        <span style={{
          fontSize: 48,
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.025em",
          color: palette.s3,
          textShadow: `0 0 20px ${color}30`,
          fontFamily: "var(--font-display)",
        }}>
          {Math.round(animatedScore)}
        </span>
        <span style={{
          fontSize: 12,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginTop: 4,
          color,
          lineHeight: 1.2,
          fontFamily: "var(--font-display)",
        }}>
          {label}
        </span>
        <span style={{ fontSize: 12, color: palette.mute, marginTop: 2, fontFamily: "var(--font-display)" }}>
          out of 100
        </span>
      </div>
    </div>
  );
}
