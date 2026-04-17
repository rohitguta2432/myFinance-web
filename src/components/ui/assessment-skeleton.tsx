"use client";

import type { CSSProperties } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";

// ─── Shimmer Primitives ───────────────────────────────────────────────────────

// One shared style injection — rendered by the first skeleton that mounts
function ShimmerStyles() {
    return (
        <style>{`
            @keyframes shimmer-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.4; }
            }
        `}</style>
    );
}

function Shimmer({ style, baseBg }: { style?: CSSProperties; baseBg: string }) {
    return (
        <div
            style={{
                background: baseBg,
                borderRadius: 8,
                animation: "shimmer-pulse 1.5s ease-in-out infinite",
                ...style,
            }}
        />
    );
}

// ─── Step 1: Profile Skeleton ─────────────────────────────────────────────────

export function ProfileSkeleton() {
    const palette = useAppTheme();
    const shimmerBg = palette.s3;
    const card: CSSProperties = {
        background: palette.s1,
        borderRadius: 20,
        border: `1px solid ${palette.brd}`,
        padding: 24,
    };
    return (
        <div
            style={{
                width: "100%",
                maxWidth: 896,
                margin: "0 auto",
                padding: "32px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 24,
            }}
        >
            <ShimmerStyles />
            <div>
                <Shimmer baseBg={shimmerBg} style={{ height: 32, width: 256, marginBottom: 8 }} />
                <Shimmer baseBg={shimmerBg} style={{ height: 16, width: 384 }} />
            </div>

            {/* Form fields */}
            <div style={{ ...card, display: "flex", flexDirection: "column", gap: 20 }}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <Shimmer baseBg={shimmerBg} style={{ height: 12, width: 112 }} />
                        <Shimmer baseBg={shimmerBg} style={{ height: 44, width: "100%", borderRadius: 12 }} />
                    </div>
                ))}
            </div>

            {/* Risk questions */}
            <div style={{ ...card, display: "flex", flexDirection: "column", gap: 16 }}>
                <Shimmer baseBg={shimmerBg} style={{ height: 20, width: 160, marginBottom: 12 }} />
                {[1, 2, 3].map((i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <Shimmer baseBg={shimmerBg} style={{ height: 16, width: 288 }} />
                        <div style={{ display: "flex", gap: 8 }}>
                            {[1, 2, 3].map((j) => (
                                <Shimmer baseBg={shimmerBg} key={j} style={{ height: 40, width: 112, borderRadius: 12 }} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Step 2: Cash Flow Skeleton ───────────────────────────────────────────────

export function CashFlowSkeleton() {
    const palette = useAppTheme();
    const shimmerBg = palette.s3;
    const rowStyle: CSSProperties = {
        background: palette.s1,
        borderRadius: 12,
        border: `1px solid ${palette.brd}`,
        padding: 16,
        display: "flex",
        alignItems: "center",
        gap: 12,
    };
    return (
        <div
            style={{
                width: "100%",
                maxWidth: 896,
                margin: "0 auto",
                padding: "32px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 24,
            }}
        >
            <ShimmerStyles />
            <div>
                <Shimmer baseBg={shimmerBg} style={{ height: 32, width: 288, marginBottom: 8 }} />
                <Shimmer baseBg={shimmerBg} style={{ height: 16, width: 320 }} />
            </div>

            {/* Income items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[1, 2].map((i) => (
                    <div key={i} style={rowStyle}>
                        <Shimmer baseBg={shimmerBg} style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0 }} />
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                            <Shimmer baseBg={shimmerBg} style={{ height: 16, width: 96 }} />
                            <Shimmer baseBg={shimmerBg} style={{ height: 12, width: 144 }} />
                        </div>
                        <Shimmer baseBg={shimmerBg} style={{ width: 32, height: 32, borderRadius: 8 }} />
                        <Shimmer baseBg={shimmerBg} style={{ width: 32, height: 32, borderRadius: 8 }} />
                    </div>
                ))}
                <Shimmer baseBg={shimmerBg} style={{ height: 48, width: "100%", borderRadius: 12 }} />
            </div>

            {/* Expense items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[1, 2, 3].map((i) => (
                    <div key={i} style={rowStyle}>
                        <Shimmer baseBg={shimmerBg} style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0 }} />
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                            <Shimmer baseBg={shimmerBg} style={{ height: 16, width: 128 }} />
                            <Shimmer baseBg={shimmerBg} style={{ height: 12, width: 112 }} />
                        </div>
                        <Shimmer baseBg={shimmerBg} style={{ width: 32, height: 32, borderRadius: 8 }} />
                        <Shimmer baseBg={shimmerBg} style={{ width: 32, height: 32, borderRadius: 8 }} />
                    </div>
                ))}
                <Shimmer baseBg={shimmerBg} style={{ height: 48, width: "100%", borderRadius: 12 }} />
            </div>

            {/* Summary */}
            <Shimmer baseBg={shimmerBg} style={{ height: 128, width: "100%", borderRadius: 20 }} />
        </div>
    );
}

// ─── Step 3: Assets & Liabilities Skeleton ────────────────────────────────────

export function AssetsLiabilitiesSkeleton() {
    const palette = useAppTheme();
    const shimmerBg = palette.s3;
    const card: CSSProperties = {
        background: palette.s1,
        borderRadius: 20,
        border: `1px solid ${palette.brd}`,
        padding: 24,
    };
    return (
        <div
            style={{
                width: "100%",
                maxWidth: 896,
                margin: "0 auto",
                padding: "32px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 24,
            }}
        >
            <ShimmerStyles />
            <div>
                <Shimmer baseBg={shimmerBg} style={{ height: 32, width: 288, marginBottom: 8 }} />
                <Shimmer baseBg={shimmerBg} style={{ height: 16, width: 256 }} />
            </div>

            {/* Net Worth Card */}
            <div style={card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <Shimmer baseBg={shimmerBg} style={{ height: 12, width: 112 }} />
                        <Shimmer baseBg={shimmerBg} style={{ height: 40, width: 160 }} />
                    </div>
                    <div style={{ display: "flex", gap: 16 }}>
                        <Shimmer baseBg={shimmerBg} style={{ height: 64, width: 112, borderRadius: 12 }} />
                        <Shimmer baseBg={shimmerBg} style={{ height: 64, width: 112, borderRadius: 12 }} />
                    </div>
                </div>
            </div>

            {/* Portfolio Mix */}
            <div style={{ ...card, display: "flex", flexDirection: "column", gap: 16 }}>
                <Shimmer baseBg={shimmerBg} style={{ height: 20, width: 144 }} />
                <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                    <Shimmer
                        baseBg={shimmerBg}
                        style={{
                            width: 144,
                            height: 144,
                            borderRadius: "50%",
                            flexShrink: 0,
                        }}
                    />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                                <Shimmer baseBg={shimmerBg} style={{ height: 12, width: 80 }} />
                                <Shimmer baseBg={shimmerBg} style={{ height: 12, width: 96 }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Target table */}
            <div style={{ ...card, display: "flex", flexDirection: "column", gap: 12 }}>
                <Shimmer baseBg={shimmerBg} style={{ height: 20, width: 224 }} />
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                        <Shimmer baseBg={shimmerBg} style={{ height: 12, width: 80 }} />
                        <Shimmer baseBg={shimmerBg} style={{ height: 12, width: 48 }} />
                        <Shimmer baseBg={shimmerBg} style={{ height: 12, width: 48 }} />
                        <Shimmer baseBg={shimmerBg} style={{ height: 12, width: 80 }} />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Step 4: Goals Skeleton ───────────────────────────────────────────────────

export function GoalsSkeleton() {
    const palette = useAppTheme();
    const shimmerBg = palette.s3;
    const card: CSSProperties = {
        background: palette.s1,
        borderRadius: 20,
        border: `1px solid ${palette.brd}`,
        padding: 24,
    };
    return (
        <div
            style={{
                width: "100%",
                maxWidth: 896,
                margin: "0 auto",
                padding: "32px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 24,
            }}
        >
            <ShimmerStyles />
            <div>
                <Shimmer baseBg={shimmerBg} style={{ height: 32, width: 224, marginBottom: 8 }} />
                <Shimmer baseBg={shimmerBg} style={{ height: 16, width: 288 }} />
            </div>

            {/* Goal cards */}
            {[1, 2, 3].map((i) => (
                <div key={i} style={{ ...card, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Shimmer baseBg={shimmerBg} style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0 }} />
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                            <Shimmer baseBg={shimmerBg} style={{ height: 20, width: 144 }} />
                            <Shimmer baseBg={shimmerBg} style={{ height: 12, width: 192 }} />
                        </div>
                        <Shimmer baseBg={shimmerBg} style={{ width: 32, height: 32, borderRadius: 8 }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                        {[1, 2, 3].map((j) => (
                            <div key={j} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                <Shimmer baseBg={shimmerBg} style={{ height: 12, width: 64 }} />
                                <Shimmer baseBg={shimmerBg} style={{ height: 20, width: 96 }} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <Shimmer baseBg={shimmerBg} style={{ height: 48, width: "100%", borderRadius: 12 }} />
        </div>
    );
}

// ─── Step 5: Insurance Skeleton ───────────────────────────────────────────────

export function InsuranceGapSkeleton() {
    const palette = useAppTheme();
    const shimmerBg = palette.s3;
    const card: CSSProperties = {
        background: palette.s1,
        borderRadius: 20,
        border: `1px solid ${palette.brd}`,
        padding: 24,
    };
    return (
        <div
            style={{
                width: "100%",
                maxWidth: 896,
                margin: "0 auto",
                padding: "32px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 24,
            }}
        >
            <ShimmerStyles />
            <div>
                <Shimmer baseBg={shimmerBg} style={{ height: 32, width: 224, marginBottom: 8 }} />
                <Shimmer baseBg={shimmerBg} style={{ height: 16, width: 320 }} />
            </div>

            {/* Term Life card */}
            <div style={{ ...card, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Shimmer baseBg={shimmerBg} style={{ width: 40, height: 40, borderRadius: 12 }} />
                    <Shimmer baseBg={shimmerBg} style={{ height: 20, width: 128 }} />
                </div>
                <Shimmer baseBg={shimmerBg} style={{ height: 80, width: "100%", borderRadius: 12 }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <Shimmer baseBg={shimmerBg} style={{ height: 12, width: 112 }} />
                        <Shimmer baseBg={shimmerBg} style={{ height: 44, width: "100%", borderRadius: 12 }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <Shimmer baseBg={shimmerBg} style={{ height: 12, width: 112 }} />
                        <Shimmer baseBg={shimmerBg} style={{ height: 44, width: "100%", borderRadius: 12 }} />
                    </div>
                </div>
            </div>

            {/* Health card */}
            <div style={{ ...card, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Shimmer baseBg={shimmerBg} style={{ width: 40, height: 40, borderRadius: 12 }} />
                    <Shimmer baseBg={shimmerBg} style={{ height: 20, width: 144 }} />
                </div>
                <Shimmer baseBg={shimmerBg} style={{ height: 80, width: "100%", borderRadius: 12 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Shimmer baseBg={shimmerBg} style={{ height: 12, width: 112 }} />
                    <Shimmer baseBg={shimmerBg} style={{ height: 44, width: "100%", borderRadius: 12 }} />
                </div>
            </div>
        </div>
    );
}

// ─── Step 6: Tax Optimization Skeleton ───────────────────────────────────────

export function TaxOptimizationSkeleton() {
    const palette = useAppTheme();
    const shimmerBg = palette.s3;
    const card: CSSProperties = {
        background: palette.s1,
        borderRadius: 20,
        border: `1px solid ${palette.brd}`,
        padding: 24,
    };
    return (
        <div
            style={{
                width: "100%",
                maxWidth: 896,
                margin: "0 auto",
                padding: "32px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 24,
            }}
        >
            <ShimmerStyles />
            <div>
                <Shimmer baseBg={shimmerBg} style={{ height: 32, width: 192, marginBottom: 8 }} />
                <Shimmer baseBg={shimmerBg} style={{ height: 16, width: 288 }} />
            </div>

            {/* Regime comparison */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[1, 2].map((i) => (
                    <div key={i} style={{ ...card, display: "flex", flexDirection: "column", gap: 12 }}>
                        <Shimmer baseBg={shimmerBg} style={{ height: 20, width: 112 }} />
                        <Shimmer baseBg={shimmerBg} style={{ height: 32, width: 128 }} />
                        {[1, 2, 3].map((j) => (
                            <div key={j} style={{ display: "flex", justifyContent: "space-between" }}>
                                <Shimmer baseBg={shimmerBg} style={{ height: 12, width: 112 }} />
                                <Shimmer baseBg={shimmerBg} style={{ height: 12, width: 80 }} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Deductions */}
            <div style={{ ...card, display: "flex", flexDirection: "column", gap: 16 }}>
                <Shimmer baseBg={shimmerBg} style={{ height: 20, width: 128 }} />
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <Shimmer baseBg={shimmerBg} style={{ height: 12, width: 144 }} />
                        <Shimmer baseBg={shimmerBg} style={{ height: 44, width: "100%", borderRadius: 12 }} />
                    </div>
                ))}
            </div>
        </div>
    );
}
