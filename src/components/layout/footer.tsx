"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Check, Mail, Loader2 } from "lucide-react";

function FooterNewsletter() {
    const palette = useAppTheme();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === "loading" || status === "success") return;
        setStatus("loading");
        setMessage("");
        try {
            const res = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, source: "footer" }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setStatus("error");
                setMessage(data.error || "Something went wrong.");
                return;
            }
            setStatus("success");
            setMessage("You're in! We'll email you when we publish.");
            setEmail("");
        } catch {
            setStatus("error");
            setMessage("Network error. Try again.");
        }
    };

    const disabled = status === "loading" || status === "success";

    return (
        <form
            onSubmit={submit}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 20,
            }}
        >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: palette.txt2, fontSize: 13 }}>
                <Mail size={14} aria-hidden />
                Get new articles in your inbox
            </span>
            <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={disabled}
                aria-label="Email address"
                style={{
                    width: 220,
                    maxWidth: "60vw",
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: `1px solid ${palette.brd2}`,
                    background: palette.s2,
                    color: palette.txt,
                    fontSize: 13,
                    outline: "none",
                }}
            />
            <button
                type="submit"
                disabled={disabled}
                style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: status === "success" ? "rgba(16,185,129,0.2)" : "#10B981",
                    color: status === "success" ? "#10B981" : "#0B0F1A",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: disabled ? "default" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                }}
            >
                {status === "loading" ? (
                    <>
                        <Loader2 size={13} style={{ animation: "spin 0.8s linear infinite" }} aria-hidden />
                        Subscribing
                    </>
                ) : status === "success" ? (
                    <>
                        <Check size={13} aria-hidden />
                        Subscribed
                    </>
                ) : (
                    "Subscribe"
                )}
            </button>
            {message && (
                <span
                    role="status"
                    style={{
                        flexBasis: "100%",
                        fontSize: 12,
                        color: status === "error" ? "#F87171" : "#10B981",
                        marginTop: 4,
                    }}
                >
                    {message}
                </span>
            )}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </form>
    );
}

export function Footer() {
    const palette = useAppTheme();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    return (
        <footer
            style={{
                borderTop: `1px solid ${palette.brd}`,
                padding: "48px 0 40px",
                textAlign: "center",
                color: palette.mute,
                fontFamily: "var(--font-display)",
                fontSize: 13,
                lineHeight: 2,
                background: `linear-gradient(180deg, ${palette.s1} 0%, ${palette.bg} 100%)`,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 -8px 32px rgba(0,0,0,0.3)",
            }}
        >
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem" }}>
                <FooterNewsletter />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 4 }}>
                    <img
                        src={mounted && resolvedTheme === "light" ? "/myfinancial-logo-light.svg" : "/myfinancial-logo.svg"}
                        alt="MyFinancial"
                        style={{ height: 32, width: "auto" }}
                    />
                    <span style={{ color: palette.brd2 }}>—</span>
                    <span>India&apos;s Financial Diagnostic Platform</span>
                </div>
                <p style={{ marginTop: 4, color: palette.mute }}>Educational diagnostic platform · Not investment advice · Mumbai · © 2026</p>
                <div
                    style={{
                        marginTop: 16,
                        paddingTop: 16,
                        borderTop: `1px solid ${palette.brd}`,
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: 24,
                    }}
                >
                    {[
                        { label: "Privacy", href: "/privacy" },
                        { label: "Terms", href: "/terms" },
                        { label: "Refund", href: "/refund" },
                        { label: "Disclaimer", href: "/disclaimer" },
                    ].map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            style={{
                                color: palette.mute,
                                textDecoration: "none",
                                fontSize: 13,
                                transition: "color 0.2s",
                            }}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
