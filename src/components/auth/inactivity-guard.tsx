"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Clock } from "lucide-react";
import type { ReactNode } from "react";

const INACTIVITY_LIMIT_MS = 20 * 60 * 1000;
const WARNING_AT_MS = 15 * 60 * 1000;
const CHECK_INTERVAL_MS = 10 * 1000;

function hasUserSession(): boolean {
    if (typeof document === "undefined") return false;
    return document.cookie.includes("user_profile=");
}

async function logoutAndRedirect(router: ReturnType<typeof useRouter>): Promise<void> {
    try {
        await fetch("/api/auth/logout", { method: "POST" });
    } catch {
        // ignore fetch errors — proceed to redirect
    }
    router.replace("/");
}

export function InactivityGuard({ children }: { children: ReactNode }) {
    const router = useRouter();
    const lastActivityRef = useRef(0);

    useEffect(() => {
        lastActivityRef.current = Date.now();
    }, []);

    const [showWarning, setShowWarning] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(300);

    const resetActivity = useCallback(() => {
        lastActivityRef.current = Date.now();
        setShowWarning(false);
    }, []);

    // Track user activity events (throttled to once/second)
    useEffect(() => {
        if (!hasUserSession()) return;

        let lastUpdate = 0;
        const handler = () => {
            const now = Date.now();
            if (now - lastUpdate < 1000) return;
            lastUpdate = now;
            lastActivityRef.current = now;
            if (showWarning) setShowWarning(false);
        };

        const events = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"];
        events.forEach((e) => window.addEventListener(e, handler, { passive: true }));
        return () => events.forEach((e) => window.removeEventListener(e, handler));
    }, [showWarning]);

    // Periodic inactivity check
    useEffect(() => {
        if (!hasUserSession()) return;

        const interval = setInterval(() => {
            const idle = Date.now() - lastActivityRef.current;

            if (idle >= INACTIVITY_LIMIT_MS) {
                clearInterval(interval);
                void logoutAndRedirect(router);
                return;
            }

            if (idle >= WARNING_AT_MS) {
                setShowWarning(true);
                setRemainingSeconds(Math.ceil((INACTIVITY_LIMIT_MS - idle) / 1000));
            }
        }, CHECK_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [router]);

    // Countdown timer when warning is visible
    useEffect(() => {
        if (!showWarning) return;

        const countdown = setInterval(() => {
            const idle = Date.now() - lastActivityRef.current;
            const remaining = Math.ceil((INACTIVITY_LIMIT_MS - idle) / 1000);

            if (remaining <= 0) {
                clearInterval(countdown);
                void logoutAndRedirect(router);
                return;
            }

            setRemainingSeconds(remaining);
        }, 1000);

        return () => clearInterval(countdown);
    }, [showWarning, router]);

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    return (
        <>
            <style>{`
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.92); }
                    to   { opacity: 1; transform: scale(1); }
                }
                .inactivity-modal {
                    animation: scaleIn 0.18s ease-out both;
                }
            `}</style>

            {children}

            {showWarning && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 9999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 16,
                    }}
                >
                    {/* Backdrop */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(0,0,0,0.70)",
                            backdropFilter: "blur(4px)",
                        }}
                    />

                    {/* Modal */}
                    <div
                        className="inactivity-modal"
                        style={{
                            position: "relative",
                            background: "#0F172A",
                            width: "100%",
                            maxWidth: 360,
                            borderRadius: 20,
                            padding: 24,
                            boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            textAlign: "center",
                        }}
                    >
                        {/* Icon */}
                        <div
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: "50%",
                                background: "rgba(245,158,11,0.10)",
                                border: "1px solid rgba(245,158,11,0.20)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 16px",
                            }}
                        >
                            <AlertTriangle
                                style={{ width: 28, height: 28, color: "#F59E0B" }}
                            />
                        </div>

                        <h3
                            style={{
                                fontSize: 18,
                                fontWeight: 700,
                                color: "#F1F5F9",
                                marginBottom: 8,
                            }}
                        >
                            Session Expiring Soon
                        </h3>
                        <p
                            style={{
                                fontSize: 14,
                                color: "#94A3B8",
                                marginBottom: 16,
                                lineHeight: 1.5,
                            }}
                        >
                            You&apos;ve been inactive for a while. Your session will expire in:
                        </p>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                marginBottom: 20,
                            }}
                        >
                            <Clock style={{ width: 20, height: 20, color: "#F59E0B" }} />
                            <span
                                style={{
                                    fontSize: 32,
                                    fontWeight: 700,
                                    color: "#F59E0B",
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {minutes}:{seconds.toString().padStart(2, "0")}
                            </span>
                        </div>

                        <button
                            onClick={resetActivity}
                            style={{
                                width: "100%",
                                padding: "12px 0",
                                background: "#10B981",
                                color: "#0B0F1A",
                                fontWeight: 700,
                                fontSize: 15,
                                border: "none",
                                borderRadius: 12,
                                cursor: "pointer",
                                transition: "opacity 0.15s",
                            }}
                            onMouseEnter={(e) =>
                                ((e.currentTarget as HTMLButtonElement).style.opacity = "0.9")
                            }
                            onMouseLeave={(e) =>
                                ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
                            }
                        >
                            I&apos;m Still Here
                        </button>

                        <p style={{ fontSize: 11, color: "#475569", marginTop: 12 }}>
                            Any mouse or keyboard activity will also reset the timer
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
