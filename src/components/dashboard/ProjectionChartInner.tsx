"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { TrendingUp, Zap, Clock, Info } from "lucide-react";
import { useProjection } from "@/hooks/dashboard/useProjection";
import type { ProjectionDataPoint } from "@/hooks/dashboard/useProjection";
import { useAppTheme } from "@/hooks/useAppTheme";

const formatYAxis = (v: number) => {
  if (v >= 10000000) return `${(v / 10000000).toFixed(1)}Cr`;
  if (v >= 100000) return `${(v / 100000).toFixed(0)}L`;
  if (v >= 1000) return `${Math.round(v / 1000)}K`;
  return String(v);
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ProjectionDataPoint }>;
  label?: string;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  const palette = useAppTheme();
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  const fmt = (v: number) => {
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
    if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
    return `₹${Math.round(v).toLocaleString("en-IN")}`;
  };

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: 12,
      padding: 12,
      boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
      fontSize: 13,
      minWidth: 180,
    }}>
      <p style={{ color: palette.mute, fontWeight: 600, marginBottom: 8 }}>{d.year} · Age {d.age}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          { color: "#34d399", label: "Optimized", value: fmt(d.optimized), textColor: "#059669" },
          { color: "#60a5fa", label: "Current", value: fmt(d.currentPath), textColor: "#2563EB" },
          { color: "#fbbf24", label: "If started 5yr ago", value: fmt(d.earlyStart), textColor: "#D97706" },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, color: palette.mute }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, display: "inline-block" }} />
              {item.label}
            </span>
            <span style={{ fontWeight: 700, color: item.textColor }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LegendItemProps {
  color: string;
  label: string;
  value: string;
  icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>;
}

function LegendItem({ color, label, value, icon: Icon }: LegendItemProps) {
  const palette = useAppTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 12, height: 12, borderRadius: 3, flexShrink: 0, background: color }} />
      <div>
        <p style={{ fontSize: 11, color: palette.mute, display: "flex", alignItems: "center", gap: 4, margin: 0, fontFamily: "var(--font-display)" }}>
          <Icon size={14} style={{ display: "inline" }} /> {label}
        </p>
        <p style={{ fontSize: 15, fontWeight: 700, color: palette.txt, margin: 0, fontFamily: "var(--font-display)" }}>{value}</p>
      </div>
    </div>
  );
}

export function ProjectionChartInner() {
  const palette = useAppTheme();
  const projection = useProjection();

  if (!projection || !projection.data?.length) return null;

  const {
    data, finalCurrentFormatted, finalOptimizedFormatted, finalEarlyFormatted,
    extraByOptimizingFormatted, projectionYears, retirementAge, milestones, optimizationPct,
    monthlySavings, optimizedSavings,
  } = projection;

  const tickYears = data
    .filter((_, i) => i === 0 || i === data.length - 1 || (data[0].year + i) % 5 === 0)
    .map((d) => d.year);

  return (
    <div id="pdf-projection-chart" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: palette.mute, margin: 0, fontFamily: "var(--font-display)" }}>
          {projectionYears}-Year Wealth Projection
        </h4>
        <span style={{ fontSize: 11, color: palette.mute, fontFamily: "var(--font-display)" }}>Retiring at {retirementAge}</span>
      </div>

      {/* Legend */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <LegendItem color="#34d399" label={`Optimized (+${optimizationPct}% savings)`} value={finalOptimizedFormatted} icon={Zap} />
        <LegendItem color="#60a5fa" label="Current Path" value={finalCurrentFormatted} icon={TrendingUp} />
        <LegendItem color="#fbbf24" label="If started 5yr ago" value={finalEarlyFormatted} icon={Clock} />
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 280, marginLeft: -8 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradOptimized" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradEarly" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} ticks={tickYears} />
            <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} width={50} />
            <Tooltip content={<CustomTooltip />} />
            {milestones.map((m) => (
              <ReferenceLine
                key={m.amount}
                y={m.value}
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="8 4"
                label={{ value: m.amount, position: "right", style: { fontSize: 11, fill: "#475569" } }}
              />
            ))}
            <Area type="monotone" dataKey="earlyStart" stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="6 3" fill="url(#gradEarly)" dot={false} activeDot={{ r: 4, stroke: "#fbbf24", strokeWidth: 2, fill: "#1a1a2e" }} />
            <Area type="monotone" dataKey="optimized" stroke="#34d399" strokeWidth={2} fill="url(#gradOptimized)" dot={false} activeDot={{ r: 4, stroke: "#34d399", strokeWidth: 2, fill: "#1a1a2e" }} />
            <Area type="monotone" dataKey="currentPath" stroke="#60a5fa" strokeWidth={2} fill="url(#gradCurrent)" dot={false} activeDot={{ r: 4, stroke: "#60a5fa", strokeWidth: 2, fill: "#1a1a2e" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Extra by optimizing callout */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 12, background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.15)" }}>
        <Zap size={20} style={{ color: "#34D399", flexShrink: 0 }} />
        <p style={{ fontSize: 14, color: palette.txt2, margin: 0, fontFamily: "var(--font-display)" }}>
          Optimizing your savings by just {optimizationPct}% could earn you an extra{" "}
          <span style={{ fontWeight: 700, color: "#34D399" }}>{extraByOptimizingFormatted}</span> by retirement.
        </p>
      </div>

      {/* Assumptions */}
      <div style={{ borderRadius: 12, padding: 12, background: palette.brd, border: `1px solid ${palette.brd}` }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: palette.mute, textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 6, margin: 0, marginBottom: 8, fontFamily: "var(--font-display)" }}>
          <Info size={12} /> Assumptions
        </p>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            "12% CAGR — based on Indian equity market long-term average (BSE Sensex)",
            `Monthly SIP of ₹${monthlySavings?.toLocaleString("en-IN")} — derived from your income minus expenses & EMIs`,
            `Optimized scenario assumes ${optimizationPct}% higher monthly savings (₹${optimizedSavings?.toLocaleString("en-IN")}/mo)`,
            "Returns compounded monthly using SIP future value formula",
            "Does not account for inflation, taxation, or market volatility",
            "Past performance does not guarantee future results",
          ].map((text, i) => (
            <li key={i} style={{ fontSize: 11, color: palette.mute, lineHeight: 1.5, display: "flex", alignItems: "flex-start", gap: 6, fontFamily: "var(--font-display)" }}>
              <span style={{ color: palette.mute, marginTop: 2 }}>•</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
