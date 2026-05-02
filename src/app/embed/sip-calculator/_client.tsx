"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { calcSIP, formatLakhsCrores } from "@/lib/calculator-utils";

// Embed-safe palette (no theme hook — must work without provider context).
const PALETTE = {
    bg: "#0B0F1A",
    surface: "#121A22",
    surface2: "#1A242F",
    border: "rgba(255,255,255,0.08)",
    border2: "rgba(255,255,255,0.16)",
    text: "#F0F4F8",
    mute: "#94A3B8",
    accent: "#10B981",
    accentDim: "rgba(16,185,129,0.15)",
};

// Strict-mode-friendly attribution param sanitiser.
// Partners pass ?ref=tradebrains — we whitelist [a-z0-9_-] so nothing
// nasty rides into the UTM string.
function sanitizeRef(raw: string | null): string {
    if (!raw) return "partner";
    const cleaned = raw.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 32);
    return cleaned || "partner";
}

function CalcContents() {
    const searchParams = useSearchParams();
    const ref = sanitizeRef(searchParams.get("ref"));

    const [monthly, setMonthly] = useState(5000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(10);

    const invested = monthly * years * 12;
    const maturity = calcSIP(monthly, rate, years);
    const gains = Math.max(0, maturity - invested);

    const chartData = useMemo(
        () =>
            Array.from({ length: years }, (_, i) => {
                const y = i + 1;
                const inv = monthly * y * 12;
                const fv = calcSIP(monthly, rate, y);
                return {
                    year: y,
                    Invested: inv,
                    Returns: Math.max(0, fv - inv),
                };
            }),
        [monthly, rate, years]
    );

    const utmHref = `https://myfinancial.in/?utm_source=embed&utm_medium=calculator&utm_campaign=${encodeURIComponent(
        ref
    )}`;

    return (
        <div
            style={{
                height: 600,
                background: PALETTE.bg,
                color: PALETTE.text,
                fontFamily:
                    "var(--font-display), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                padding: 16,
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 12,
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        fontSize: 18,
                        fontWeight: 700,
                        color: PALETTE.text,
                    }}
                >
                    SIP Calculator
                </h2>
                <span
                    style={{
                        fontSize: 11,
                        color: PALETTE.mute,
                        textTransform: "uppercase",
                        letterSpacing: 0.6,
                    }}
                >
                    Free • No signup
                </span>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                    gap: 16,
                    flex: 1,
                    minHeight: 0,
                }}
                className="embed-grid"
            >
                {/* INPUTS */}
                <div
                    style={{
                        background: PALETTE.surface,
                        border: `1px solid ${PALETTE.border}`,
                        borderRadius: 10,
                        padding: 14,
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                        minHeight: 0,
                        overflow: "auto",
                    }}
                >
                    <Field
                        label="Monthly Investment"
                        value={monthly}
                        min={500}
                        max={100000}
                        step={500}
                        onChange={setMonthly}
                        format={formatLakhsCrores}
                    />
                    <Field
                        label="Expected Return"
                        value={rate}
                        min={1}
                        max={30}
                        step={0.5}
                        onChange={setRate}
                        unit="%"
                    />
                    <Field
                        label="Duration"
                        value={years}
                        min={1}
                        max={40}
                        step={1}
                        onChange={setYears}
                        unit="yrs"
                    />
                </div>

                {/* RESULTS */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        minHeight: 0,
                    }}
                >
                    <Stat label="Total Value" value={formatLakhsCrores(maturity)} accent />
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 8,
                        }}
                    >
                        <Stat label="Invested" value={formatLakhsCrores(invested)} />
                        <Stat label="Returns" value={formatLakhsCrores(gains)} />
                    </div>
                    <div
                        style={{
                            flex: 1,
                            minHeight: 140,
                            background: PALETTE.surface,
                            border: `1px solid ${PALETTE.border}`,
                            borderRadius: 10,
                            padding: 8,
                        }}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={chartData}
                                margin={{ top: 4, right: 8, left: 4, bottom: 4 }}
                            >
                                <defs>
                                    <linearGradient id="embedInv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={PALETTE.border2} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={PALETTE.border2} stopOpacity={0.1} />
                                    </linearGradient>
                                    <linearGradient id="embedRet" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={PALETTE.accent} stopOpacity={0.7} />
                                        <stop offset="95%" stopColor={PALETTE.accent} stopOpacity={0.08} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
                                <XAxis
                                    dataKey="year"
                                    tick={{ fill: PALETTE.mute, fontSize: 10 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(v) => `Y${v}`}
                                />
                                <YAxis
                                    tick={{ fill: PALETTE.mute, fontSize: 10 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={formatLakhsCrores}
                                    width={56}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: PALETTE.surface2,
                                        border: `1px solid ${PALETTE.border2}`,
                                        borderRadius: 8,
                                        fontSize: 12,
                                        color: PALETTE.text,
                                    }}
                                    formatter={(v) => formatLakhsCrores(Number(v))}
                                    labelFormatter={(l) => `Year ${l}`}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="Invested"
                                    stackId="a"
                                    stroke={PALETTE.border2}
                                    fill="url(#embedInv)"
                                    strokeWidth={1.5}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="Returns"
                                    stackId="a"
                                    stroke={PALETTE.accent}
                                    fill="url(#embedRet)"
                                    strokeWidth={1.5}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Branded footer — do-follow attribution. */}
            <div
                style={{
                    marginTop: 10,
                    paddingTop: 8,
                    borderTop: `1px solid ${PALETTE.border}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 11,
                    color: PALETTE.mute,
                }}
            >
                <span>
                    Powered by{" "}
                    <a
                        href={utmHref}
                        target="_blank"
                        rel="noopener"
                        style={{
                            color: PALETTE.accent,
                            textDecoration: "none",
                            fontWeight: 600,
                        }}
                    >
                        myFinancial.in
                    </a>
                </span>
                <span style={{ fontSize: 10 }}>Mutual fund returns are not guaranteed.</span>
            </div>

            {/* Mobile: stack inputs above results below 520px. */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `@media (max-width: 520px) { .embed-grid { grid-template-columns: 1fr !important; grid-template-rows: auto 1fr; } }`,
                }}
            />
        </div>
    );
}

// ── Sub-components ─────────────────────────────────────────────────────

interface FieldProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (v: number) => void;
    format?: (v: number) => string;
    unit?: string;
}

function Field({ label, value, min, max, step, onChange, format, unit }: FieldProps) {
    const display = format ? format(value) : `${value}${unit ?? ""}`;
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                }}
            >
                <label
                    style={{
                        fontSize: 12,
                        color: PALETTE.mute,
                        fontWeight: 500,
                    }}
                >
                    {label}
                </label>
                <input
                    type="number"
                    value={value}
                    min={min}
                    max={max}
                    step={step}
                    onChange={(e) => {
                        const n = Number(e.target.value);
                        if (Number.isFinite(n)) onChange(Math.min(max, Math.max(min, n)));
                    }}
                    style={{
                        width: 96,
                        background: PALETTE.surface2,
                        border: `1px solid ${PALETTE.border2}`,
                        borderRadius: 6,
                        color: PALETTE.text,
                        padding: "4px 8px",
                        fontSize: 13,
                        textAlign: "right",
                        fontFamily: "inherit",
                    }}
                />
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                style={{
                    width: "100%",
                    accentColor: PALETTE.accent,
                    cursor: "pointer",
                }}
            />
            <div
                style={{
                    fontSize: 11,
                    color: PALETTE.mute,
                    marginTop: 2,
                    textAlign: "right",
                }}
            >
                {display}
            </div>
        </div>
    );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
    return (
        <div
            style={{
                background: accent ? PALETTE.accentDim : PALETTE.surface,
                border: `1px solid ${accent ? PALETTE.accent : PALETTE.border}`,
                borderRadius: 10,
                padding: accent ? "10px 12px" : "8px 10px",
            }}
        >
            <div style={{ fontSize: 10, color: PALETTE.mute, textTransform: "uppercase", letterSpacing: 0.4 }}>
                {label}
            </div>
            <div
                style={{
                    fontSize: accent ? 22 : 16,
                    fontWeight: 700,
                    color: accent ? PALETTE.accent : PALETTE.text,
                    marginTop: 2,
                }}
            >
                {value}
            </div>
        </div>
    );
}

// useSearchParams must live under a Suspense boundary in Next 15 App Router.
export function EmbedSipCalculator() {
    return (
        <Suspense
            fallback={
                <div
                    style={{
                        height: 600,
                        background: PALETTE.bg,
                        color: PALETTE.mute,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                    }}
                >
                    Loading calculator…
                </div>
            }
        >
            <CalcContents />
        </Suspense>
    );
}
