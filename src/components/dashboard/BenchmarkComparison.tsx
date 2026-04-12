"use client";

import { usePersonalisedBenchmarks } from "@/hooks/dashboard/usePersonalisedBenchmarks";
import type { Benchmark } from "@/hooks/dashboard/usePersonalisedBenchmarks";
import { useAppTheme } from "@/hooks/useAppTheme";

const TRAFFIC_COLORS = {
  green: { bar: "#0DF259", text: "#10B981" },
  amber: { bar: "#f59e0b", text: "#FBBF24" },
  red: { bar: "#ef4444", text: "#F87171" },
};

function BenchmarkRow({ bm, index }: { bm: Benchmark; index: number }) {
  const palette = useAppTheme();
  const tc = TRAFFIC_COLORS[bm.trafficLight] ?? TRAFFIC_COLORS.amber;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 16px",
      borderTop: index > 0 ? `1px solid ${palette.brd}` : "none",
      transition: "background 0.15s",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = palette.brd)}
    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div style={{ width: 32, flexShrink: 0, textAlign: "center" }}>
        <span style={{ fontSize: 16 }}>{bm.icon}</span>
      </div>
      <div style={{ width: 112, flexShrink: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: palette.txt2, display: "block", fontFamily: "var(--font-display)" }}>{bm.label}</span>
        {bm.note && (
          <span style={{ fontSize: 11, color: palette.mute, display: "block", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {bm.note}
          </span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
        <div style={{ height: 8, width: "100%", background: palette.brd, borderRadius: 99, overflow: "hidden", position: "relative" }}>
          <div style={{
            position: "absolute",
            top: 0, bottom: 0,
            width: 1,
            background: palette.brd2,
            zIndex: 10,
            left: `${Math.min(100, (100 / 120) * 100)}%`,
          }} />
          <div style={{
            height: "100%",
            borderRadius: 99,
            transition: "width 1000ms ease-out",
            width: `${Math.min(100, (bm.barPercent / 120) * 100)}%`,
            background: `linear-gradient(90deg, ${tc.bar}aa, ${tc.bar})`,
            boxShadow: `0 0 12px ${tc.bar}30`,
          }} />
        </div>
      </div>
      <div style={{ width: 64, textAlign: "right", flexShrink: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: tc.text, fontFamily: "var(--font-display)" }}>
          {bm.userValue}
        </span>
      </div>
      <div style={{ width: 64, textAlign: "right", flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: palette.mute, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-display)" }}>
          {bm.benchTarget}
        </span>
      </div>
      <div style={{ width: 12, flexShrink: 0, display: "flex", justifyContent: "center" }}>
        <div style={{
          width: 8, height: 8,
          borderRadius: "50%",
          background: tc.bar,
          boxShadow: `0 0 6px ${tc.bar}60`,
        }} />
      </div>
    </div>
  );
}

export function BenchmarkComparison() {
  const palette = useAppTheme();
  const { benchmarks } = usePersonalisedBenchmarks();

  if (!benchmarks || benchmarks.length === 0) return null;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: palette.mute, margin: 0, fontFamily: "var(--font-display)" }}>
          Your Numbers vs. Benchmarks
        </h3>
        <span style={{ fontSize: 11, color: "#475569", fontFamily: "var(--font-display)" }}>Personalised for your profile</span>
      </div>

      <div style={{ background: "#0F172A", borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
        {/* Column headers */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
          <div style={{ width: 32, flexShrink: 0 }} />
          <div style={{ width: 112, flexShrink: 0 }}>
            <span style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, fontFamily: "var(--font-display)" }}>Metric</span>
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, fontFamily: "var(--font-display)" }}>Progress</span>
          </div>
          <div style={{ width: 64, textAlign: "right", flexShrink: 0 }}>
            <span style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, fontFamily: "var(--font-display)" }}>Yours</span>
          </div>
          <div style={{ width: 64, textAlign: "right", flexShrink: 0 }}>
            <span style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, fontFamily: "var(--font-display)" }}>Target</span>
          </div>
          <div style={{ width: 12, flexShrink: 0 }} />
        </div>

        {benchmarks.map((bm, i) => (
          <BenchmarkRow key={bm.id} bm={bm} index={i} />
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8, padding: "0 4px" }}>
        {[
          { color: "#0DF259", label: "≥ Target" },
          { color: "#f59e0b", label: "Needs attention" },
          { color: "#ef4444", label: "Below minimum" },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: l.color }} />
            <span style={{ fontSize: 11, color: "#475569", fontFamily: "var(--font-display)" }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
