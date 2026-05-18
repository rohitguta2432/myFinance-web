"use client";

import { useState } from "react";
import { Mail, Check, Loader2 } from "lucide-react";
import { useAppTheme } from "@/hooks/useAppTheme";

interface NewsletterSignupProps {
    source?: string;
}

export function NewsletterSignup({ source = "blog" }: NewsletterSignupProps) {
    const palette = useAppTheme();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === "loading") return;

        setStatus("loading");
        setMessage("");

        try {
            const res = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, source }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setStatus("error");
                setMessage(data.error || "Something went wrong. Please try again.");
                return;
            }
            setStatus("success");
            setMessage("You're in! We'll email you when we publish new articles.");
            setEmail("");
        } catch {
            setStatus("error");
            setMessage("Network error. Please try again.");
        }
    };

    return (
        <div
            style={{
                marginTop: 64,
                padding: "40px 32px",
                borderRadius: 20,
                background: `linear-gradient(135deg, rgba(16,185,129,0.12), ${palette.s2})`,
                border: `1px solid ${palette.brd2}`,
                textAlign: "center",
            }}
        >
            <div
                style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: "rgba(16,185,129,0.15)",
                    color: "#10B981",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                }}
            >
                <Mail size={26} />
            </div>
            <h2 className="text-h3" style={{ marginBottom: 8 }}>
                Get new articles in your inbox
            </h2>
            <p style={{ color: palette.mute, maxWidth: 460, margin: "0 auto 24px", fontSize: 14, lineHeight: 1.6 }}>
                Subscribe to MyFinancial and we&apos;ll email you every time we publish a new guide on Indian personal finance. No spam, unsubscribe anytime.
            </p>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    gap: 8,
                    maxWidth: 460,
                    margin: "0 auto",
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}
            >
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={status === "loading" || status === "success"}
                    aria-label="Email address"
                    style={{
                        flex: "1 1 220px",
                        minWidth: 0,
                        padding: "12px 16px",
                        borderRadius: 10,
                        border: `1px solid ${palette.brd2}`,
                        background: palette.s1,
                        color: palette.txt,
                        fontSize: 14,
                        outline: "none",
                    }}
                />
                <button
                    type="submit"
                    disabled={status === "loading" || status === "success"}
                    style={{
                        padding: "12px 22px",
                        borderRadius: 10,
                        border: "none",
                        background: status === "success" ? "rgba(16,185,129,0.2)" : "#10B981",
                        color: status === "success" ? "#10B981" : "#0B0F1A",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: status === "loading" || status === "success" ? "default" : "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        whiteSpace: "nowrap",
                    }}
                >
                    {status === "loading" ? (
                        <>
                            <Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} />
                            Subscribing
                        </>
                    ) : status === "success" ? (
                        <>
                            <Check size={16} />
                            Subscribed
                        </>
                    ) : (
                        "Subscribe"
                    )}
                </button>
            </form>

            {message && (
                <p
                    role="status"
                    style={{
                        marginTop: 16,
                        fontSize: 13,
                        color: status === "error" ? "#F87171" : "#10B981",
                    }}
                >
                    {message}
                </p>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
