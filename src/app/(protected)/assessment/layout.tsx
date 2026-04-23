"use client";

import { usePathname, useRouter } from "next/navigation";
import { User, DollarSign, Wallet, Flag, Shield, Calculator, CheckCircle } from "lucide-react";
import type { ReactNode } from "react";
import { InactivityGuard } from "@/components/auth/inactivity-guard";
import { useAppTheme, type AppPalette } from "@/hooks/useAppTheme";

// ─── Steps Config ─────────────────────────────────────────────────────────────

const STEPS = [
    { num: 1, title: "Personal Profile",     icon: User,        path: "/assessment/profile" },
    { num: 2, title: "Cash Flow",            icon: DollarSign,  path: "/assessment/cash-flow" },
    { num: 3, title: "Assets & Liabilities", icon: Wallet,      path: "/assessment/assets-liabilities" },
    { num: 4, title: "Financial Goals",      icon: Flag,        path: "/assessment/goals" },
    { num: 5, title: "Insurance Gap",        icon: Shield,      path: "/assessment/insurance" },
    { num: 6, title: "Tax Planning",         icon: Calculator,  path: "/assessment/tax" },
] as const;

const STEP_PROGRESS: Record<number, number> = {
    1: 16, 2: 33, 3: 50, 4: 66, 5: 83, 6: 96,
};

// ─── Step Button ──────────────────────────────────────────────────────────────

function StepButton({
    step,
    activeStep,
    onClick,
    palette,
}: {
    step: (typeof STEPS)[number];
    activeStep: number;
    onClick: () => void;
    palette: AppPalette;
}) {
    const Icon = step.icon;
    const isActive = step.num === activeStep;
    const isCompleted = step.num < activeStep;
    const isFuture = step.num > activeStep;

    return (
        <button
            onClick={isFuture ? undefined : onClick}
            disabled={isFuture}
            style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 12,
                textAlign: "left",
                border: isActive ? "1px solid rgba(16,185,129,0.30)" : "1px solid transparent",
                background: isActive ? "rgba(16,185,129,0.10)" : "transparent",
                opacity: isFuture ? 0.4 : 1,
                cursor: isFuture ? "default" : "pointer",
                transition: "background 0.15s, opacity 0.15s",
            }}
            onMouseEnter={(e) => {
                if (!isFuture && !isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = palette.brd;
                }
            }}
            onMouseLeave={(e) => {
                if (!isFuture && !isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }
            }}
        >
            {/* Icon circle */}
            <div
                style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    background: isActive
                        ? palette.accent
                        : isCompleted
                        ? "rgba(16,185,129,0.20)"
                        : palette.s3,
                    boxShadow: isActive ? "0 0 12px rgba(16,185,129,0.4)" : "none",
                    transition: "background 0.15s",
                }}
            >
                {isCompleted ? (
                    <CheckCircle style={{ width: 16, height: 16, color: palette.accent }} />
                ) : (
                    <Icon
                        style={{
                            width: 16,
                            height: 16,
                            color: isActive ? palette.bg : palette.mute,
                        }}
                    />
                )}
            </div>

            {/* Labels */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <p
                    style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: isActive ? palette.accent : isCompleted ? palette.mute : palette.mute,
                        marginBottom: 2,
                    }}
                >
                    Step {step.num}
                </p>
                <p
                    style={{
                        fontSize: 13,
                        fontWeight: 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: isActive ? palette.txt : isCompleted ? palette.txt2 : palette.mute,
                    }}
                >
                    {step.title}
                </p>
            </div>
        </button>
    );
}

// ─── Assessment Layout ────────────────────────────────────────────────────────

export default function AssessmentLayout({ children }: { children: ReactNode }) {
    const palette = useAppTheme();
    const pathname = usePathname();
    const router = useRouter();

    // Derive active step from URL pathname
    const activeStep =
        STEPS.find((s) => pathname.includes(s.path.split("/").pop()!))?.num ?? 0;
    const progress = STEP_PROGRESS[activeStep] ?? 0;

    return (
        <div style={{ height: "100vh", background: palette.bg, display: "flex", flexDirection: "column", paddingTop: 64, paddingBottom: 72, overflow: "hidden", fontFamily: "var(--font-display)" }}>
            <style>{`
                .assessment-sidebar { display: none; }
                @media (min-width: 1024px) { .assessment-sidebar { display: flex; } }
                .assessment-mobile-progress { display: flex; }
                @media (min-width: 1024px) { .assessment-mobile-progress { display: none; } }
                .assessment-main::-webkit-scrollbar { display: none; }
                .assessment-main { scrollbar-width: none; }
            `}</style>

            {/* Mobile progress bar — hidden on desktop */}
            <div
                className="assessment-mobile-progress"
                style={{
                    flexDirection: "column",
                    gap: 8,
                    padding: "12px 24px 12px",
                    borderBottom: `1px solid ${palette.brd}`,
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span
                        style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: palette.accent,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}
                    >
                        Step {activeStep} of 6
                    </span>
                    <span style={{ fontSize: 12, color: palette.mute }}>{progress}% Completed</span>
                </div>
                <div
                    style={{
                        height: 6,
                        background: palette.s3,
                        borderRadius: 99,
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            height: "100%",
                            width: `${progress}%`,
                            background: palette.accent,
                            borderRadius: 99,
                            boxShadow: "0 0 10px rgba(16,185,129,0.5)",
                            transition: "width 0.5s ease-out",
                        }}
                    />
                </div>
            </div>

            {/* Sidebar + Main */}
            <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
                {/* Desktop sidebar — hidden on mobile */}
                <aside
                    className="assessment-sidebar"
                    style={{
                        flexDirection: "column",
                        width: 256,
                        flexShrink: 0,
                        padding: "32px 24px",
                        borderRight: `1px solid ${palette.brd}`,
                        overflowY: "auto",
                    }}
                >
                    <p
                        style={{
                            fontSize: 10,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 700,
                            color: palette.mute,
                            marginBottom: 24,
                        }}
                    >
                        Assessment Progress
                    </p>

                    <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {STEPS.map((step) => (
                            <StepButton
                                key={step.num}
                                step={step}
                                activeStep={activeStep}
                                onClick={() => router.push(step.path)}
                                palette={palette}
                            />
                        ))}
                    </nav>

                    {/* Overall progress bar at sidebar bottom */}
                    <div
                        style={{
                            marginTop: "auto",
                            paddingTop: 24,
                            borderTop: `1px solid ${palette.brd}`,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: 12,
                                marginBottom: 8,
                            }}
                        >
                            <span style={{ color: palette.mute, fontWeight: 500 }}>Overall</span>
                            <span style={{ color: palette.accent, fontWeight: 700 }}>{progress}%</span>
                        </div>
                        <div
                            style={{
                                height: 6,
                                background: palette.s3,
                                borderRadius: 99,
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    height: "100%",
                                    width: `${progress}%`,
                                    background: palette.accent,
                                    borderRadius: 99,
                                    boxShadow: "0 0 10px rgba(16,185,129,0.5)",
                                    transition: "width 0.5s ease-out",
                                }}
                            />
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <main className="assessment-main" style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
                    <div style={{ maxWidth: 1152, margin: "0 auto", padding: "16px 24px" }}>
                        <InactivityGuard>{children}</InactivityGuard>
                    </div>
                </main>
            </div>
        </div>
    );
}
