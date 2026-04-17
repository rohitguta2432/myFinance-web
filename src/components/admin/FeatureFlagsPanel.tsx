"use client";

import { useMemo } from "react";
import { Flag, ShieldCheck, AlertCircle } from "lucide-react";
import { useAdminFlags, useToggleFlag } from "@/hooks/useFeatureFlags";
import type { FeatureFlag, FeatureFlagKey } from "@/lib/feature-flags";
import { useAppTheme } from "@/hooks/useAppTheme";

const FONT = "var(--font-display, 'DM Sans', sans-serif)";
const ACCENT = "#10B981";

function fmtWhen(iso?: string): string {
    if (!iso) return "—";
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function Toggle({
    enabled,
    onChange,
    disabled,
}: {
    enabled: boolean;
    onChange: (v: boolean) => void;
    disabled?: boolean;
}) {
    return (
        <button
            role="switch"
            aria-checked={enabled}
            disabled={disabled}
            onClick={() => onChange(!enabled)}
            style={{
                width: 46,
                height: 26,
                borderRadius: 99,
                border: "none",
                cursor: disabled ? "not-allowed" : "pointer",
                background: enabled ? ACCENT : "#475569",
                position: "relative",
                transition: "background 0.2s ease",
                opacity: disabled ? 0.6 : 1,
                padding: 0,
            }}
        >
            <span
                style={{
                    position: "absolute",
                    top: 3,
                    left: enabled ? 23 : 3,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#fff",
                    transition: "left 0.2s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
                }}
            />
        </button>
    );
}

function FlagRow({ flag }: { flag: FeatureFlag }) {
    const palette = useAppTheme();
    const toggle = useToggleFlag();
    const handleChange = (enabled: boolean) => {
        toggle.mutate({ key: flag.key as FeatureFlagKey, enabled });
    };
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 20px",
                borderBottom: `1px solid ${palette.brd}`,
                background: palette.s1,
            }}
        >
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: palette.txt, fontFamily: FONT }}>
                        {flag.label}
                    </span>
                    <code
                        style={{
                            fontSize: 10,
                            color: palette.mute,
                            padding: "2px 6px",
                            borderRadius: 4,
                            background: palette.brd,
                            fontFamily: "var(--font-mono, monospace)",
                        }}
                    >
                        {flag.key}
                    </code>
                </div>
                {flag.description && (
                    <p style={{ fontSize: 12, color: palette.txt2, margin: 0, lineHeight: 1.5 }}>
                        {flag.description}
                    </p>
                )}
                <p style={{ fontSize: 11, color: palette.mute, marginTop: 6 }}>
                    Last changed {fmtWhen(flag.updatedAt)}
                    {flag.updatedBy ? ` by ${flag.updatedBy}` : ""}
                </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                    style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: flag.enabled ? ACCENT : palette.mute,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        minWidth: 30,
                        textAlign: "right",
                    }}
                >
                    {flag.enabled ? "ON" : "OFF"}
                </span>
                <Toggle
                    enabled={flag.enabled}
                    disabled={toggle.isPending}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
}

function CategorySection({
    title,
    flags,
}: {
    title: string;
    flags: FeatureFlag[];
}) {
    const palette = useAppTheme();
    if (flags.length === 0) return null;
    return (
        <section style={{ marginBottom: 24 }}>
            <h3
                style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: palette.mute,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    marginBottom: 10,
                    fontFamily: FONT,
                }}
            >
                {title}
            </h3>
            <div
                style={{
                    border: `1px solid ${palette.brd}`,
                    borderRadius: 16,
                    overflow: "hidden",
                }}
            >
                {flags.map((f) => (
                    <FlagRow key={f.key} flag={f} />
                ))}
            </div>
        </section>
    );
}

export function FeatureFlagsPanel() {
    const palette = useAppTheme();
    const { data, isLoading, error } = useAdminFlags();

    const grouped = useMemo(() => {
        const map: Record<string, FeatureFlag[]> = {};
        for (const f of data ?? []) {
            const cat = f.category || "other";
            (map[cat] ||= []).push(f);
        }
        return map;
    }, [data]);

    if (isLoading) {
        return (
            <div style={{ padding: 32, color: palette.mute, fontFamily: FONT }}>
                Loading feature flags…
            </div>
        );
    }
    if (error) {
        return (
            <div
                style={{
                    padding: 20,
                    color: "#ef4444",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontFamily: FONT,
                }}
            >
                <AlertCircle size={18} />
                <span>Failed to load feature flags.</span>
            </div>
        );
    }

    const total = data?.length ?? 0;
    const on = data?.filter((f) => f.enabled).length ?? 0;

    return (
        <div style={{ maxWidth: 920, fontFamily: FONT }}>
            <header
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 20,
                }}
            >
                <div
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: `${ACCENT}22`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Flag size={20} color={ACCENT} />
                </div>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: palette.txt, margin: 0 }}>
                        Feature Flags
                    </h1>
                    <p style={{ fontSize: 13, color: palette.txt2, margin: 0 }}>
                        {on}/{total} enabled · changes apply within ~60s
                    </p>
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        borderRadius: 99,
                        background: `${ACCENT}18`,
                        color: ACCENT,
                        fontSize: 11,
                        fontWeight: 700,
                    }}
                >
                    <ShieldCheck size={14} />
                    ADMIN
                </div>
            </header>

            <CategorySection title="Premium Features" flags={grouped.premium ?? []} />
            <CategorySection title="Experimental" flags={grouped.experimental ?? []} />
            <CategorySection title="Core" flags={grouped.core ?? []} />
            <CategorySection title="Other" flags={grouped.other ?? []} />
        </div>
    );
}
