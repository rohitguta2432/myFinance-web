"use client";

import { usePathname, useRouter } from "next/navigation";
import { User, DollarSign, Wallet, Flag, Shield, Calculator, CheckCircle } from "lucide-react";
import type { ReactNode } from "react";
import { InactivityGuard } from "@/components/auth/inactivity-guard";

// ─── Steps Config ─────────────────────────────────────────────────────────────

const STEPS = [
    { num: 1, title: "Personal Profile",     icon: User,        path: "/assessment/step-1" },
    { num: 2, title: "Cash Flow",            icon: DollarSign,  path: "/assessment/step-2" },
    { num: 3, title: "Assets & Liabilities", icon: Wallet,      path: "/assessment/step-3" },
    { num: 4, title: "Financial Goals",      icon: Flag,        path: "/assessment/step-4" },
    { num: 5, title: "Insurance Gap",        icon: Shield,      path: "/assessment/step-5" },
    { num: 6, title: "Tax Planning",         icon: Calculator,  path: "/assessment/step-6" },
] as const;

const STEP_PROGRESS: Record<number, number> = {
    1: 16, 2: 33, 3: 50, 4: 66, 5: 83, 6: 96,
};

// ─── Step Button ──────────────────────────────────────────────────────────────

function StepButton({
    step,
    activeStep,
    onClick,
}: {
    step: (typeof STEPS)[number];
    activeStep: number;
    onClick: () => void;
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
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
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
                        ? "#10B981"
                        : isCompleted
                        ? "rgba(16,185,129,0.20)"
                        : "#1E293B",
                    boxShadow: isActive ? "0 0 12px rgba(16,185,129,0.4)" : "none",
                    transition: "background 0.15s",
                }}
            >
                {isCompleted ? (
                    <CheckCircle style={{ width: 16, height: 16, color: "#10B981" }} />
                ) : (
                    <Icon
                        style={{
                            width: 16,
                            height: 16,
                            color: isActive ? "#0B0F1A" : "#64748B",
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
                        color: isActive ? "#10B981" : isCompleted ? "#94A3B8" : "#475569",
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
                        color: isActive ? "#F1F5F9" : isCompleted ? "#CBD5E1" : "#64748B",
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
    const pathname = usePathname();
    const router = useRouter();

    // Derive active step from URL pathname
    const activeStep =
        STEPS.find((s) => pathname.includes(s.path.split("/").pop()!))?.num ?? 0;
    const progress = STEP_PROGRESS[activeStep] ?? 0;

    return (
        <div style={{ minHeight: "100vh", background: "#0B0F1A", display: "flex", flexDirection: "column" }}>
            <style>{`
                .assessment-sidebar { display: none; }
                @media (min-width: 1024px) { .assessment-sidebar { display: flex; } }
                .assessment-mobile-progress { display: flex; }
                @media (min-width: 1024px) { .assessment-mobile-progress { display: none; } }
            `}</style>

            {/* Mobile progress bar — hidden on desktop */}
            <div
                className="assessment-mobile-progress"
                style={{
                    flexDirection: "column",
                    gap: 8,
                    padding: "12px 24px 12px",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span
                        style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#10B981",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}
                    >
                        Step {activeStep} of 6
                    </span>
                    <span style={{ fontSize: 12, color: "#94A3B8" }}>{progress}% Completed</span>
                </div>
                <div
                    style={{
                        height: 6,
                        background: "#1E293B",
                        borderRadius: 99,
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            height: "100%",
                            width: `${progress}%`,
                            background: "#10B981",
                            borderRadius: 99,
                            boxShadow: "0 0 10px rgba(16,185,129,0.5)",
                            transition: "width 0.5s ease-out",
                        }}
                    />
                </div>
            </div>

            {/* Sidebar + Main */}
            <div style={{ display: "flex", flex: 1 }}>
                {/* Desktop sidebar — hidden on mobile */}
                <aside
                    className="assessment-sidebar"
                    style={{
                        flexDirection: "column",
                        width: 256,
                        flexShrink: 0,
                        padding: "32px 24px",
                        borderRight: "1px solid rgba(255,255,255,0.05)",
                    }}
                >
                    <p
                        style={{
                            fontSize: 10,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 700,
                            color: "#64748B",
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
                            />
                        ))}
                    </nav>

                    {/* Overall progress bar at sidebar bottom */}
                    <div
                        style={{
                            marginTop: "auto",
                            paddingTop: 24,
                            borderTop: "1px solid rgba(255,255,255,0.05)",
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
                            <span style={{ color: "#64748B", fontWeight: 500 }}>Overall</span>
                            <span style={{ color: "#10B981", fontWeight: 700 }}>{progress}%</span>
                        </div>
                        <div
                            style={{
                                height: 6,
                                background: "#1E293B",
                                borderRadius: 99,
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    height: "100%",
                                    width: `${progress}%`,
                                    background: "#10B981",
                                    borderRadius: 99,
                                    boxShadow: "0 0 10px rgba(16,185,129,0.5)",
                                    transition: "width 0.5s ease-out",
                                }}
                            />
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <main style={{ flex: 1, width: "100%" }}>
                    <InactivityGuard>{children}</InactivityGuard>
                </main>
            </div>
        </div>
    );
}
