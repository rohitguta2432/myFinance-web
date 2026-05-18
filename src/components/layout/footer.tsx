"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Check, Loader2, Mail, ShieldCheck, Sparkles } from "lucide-react";

function NewsletterBand() {
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
            setMessage("You're in. We'll email you when we publish.");
            setEmail("");
        } catch {
            setStatus("error");
            setMessage("Network error. Please try again.");
        }
    };

    const disabled = status === "loading" || status === "success";

    return (
        <div
            style={{
                position: "relative",
                borderRadius: 20,
                padding: "36px 28px",
                marginBottom: 48,
                background: `linear-gradient(135deg, rgba(16,185,129,0.10) 0%, ${palette.s2} 55%, ${palette.s1} 100%)`,
                border: `1px solid ${palette.brd2}`,
                overflow: "hidden",
                textAlign: "center",
            }}
        >
            <div
                aria-hidden
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "radial-gradient(circle at 20% 0%, rgba(16,185,129,0.15), transparent 45%), radial-gradient(circle at 90% 100%, rgba(16,185,129,0.10), transparent 50%)",
                    pointerEvents: "none",
                }}
            />
            <div style={{ position: "relative", maxWidth: 560, margin: "0 auto" }}>
                <span
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        borderRadius: 999,
                        background: "rgba(16,185,129,0.12)",
                        color: "#10B981",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: 0.6,
                        textTransform: "uppercase",
                        marginBottom: 14,
                    }}
                >
                    <Sparkles size={12} />
                    Newsletter
                </span>
                <h3
                    style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: palette.txt,
                        margin: "0 0 8px",
                        lineHeight: 1.3,
                    }}
                >
                    New finance guides, straight to your inbox
                </h3>
                <p
                    style={{
                        fontSize: 14,
                        color: palette.mute,
                        margin: "0 0 22px",
                        lineHeight: 1.6,
                    }}
                >
                    One short email when we publish a new article. No spam, unsubscribe anytime.
                </p>

                <form
                    onSubmit={submit}
                    style={{
                        display: "flex",
                        alignItems: "stretch",
                        gap: 0,
                        background: palette.s1,
                        border: `1px solid ${palette.brd2}`,
                        borderRadius: 999,
                        padding: 4,
                        maxWidth: 440,
                        margin: "0 auto",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                    }}
                >
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            paddingLeft: 14,
                            color: palette.mute,
                            flexShrink: 0,
                        }}
                    >
                        <Mail size={15} aria-hidden />
                    </div>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        disabled={disabled}
                        aria-label="Email address"
                        style={{
                            flex: 1,
                            minWidth: 0,
                            padding: "10px 12px",
                            border: "none",
                            background: "transparent",
                            color: palette.txt,
                            fontSize: 14,
                            outline: "none",
                        }}
                    />
                    <button
                        type="submit"
                        disabled={disabled}
                        style={{
                            border: "none",
                            borderRadius: 999,
                            padding: "10px 20px",
                            background:
                                status === "success" ? "rgba(16,185,129,0.18)" : "#10B981",
                            color: status === "success" ? "#10B981" : "#06281C",
                            fontSize: 13,
                            fontWeight: 700,
                            cursor: disabled ? "default" : "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            whiteSpace: "nowrap",
                            transition: "transform 0.15s ease, opacity 0.2s",
                            opacity: status === "loading" ? 0.85 : 1,
                        }}
                    >
                        {status === "loading" ? (
                            <>
                                <Loader2
                                    size={14}
                                    style={{ animation: "spin 0.8s linear infinite" }}
                                    aria-hidden
                                />
                                Subscribing
                            </>
                        ) : status === "success" ? (
                            <>
                                <Check size={14} aria-hidden />
                                Subscribed
                            </>
                        ) : (
                            "Subscribe"
                        )}
                    </button>
                </form>

                <div
                    role={status === "error" ? "alert" : "status"}
                    style={{
                        minHeight: 18,
                        marginTop: 12,
                        fontSize: 12,
                        color:
                            status === "error"
                                ? "#F87171"
                                : status === "success"
                                  ? "#10B981"
                                  : palette.mute,
                    }}
                >
                    {message || (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <ShieldCheck size={12} aria-hidden />
                            Your email stays private. We never share it.
                        </span>
                    )}
                </div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

const EXPLORE_LINKS = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Calculators", href: "/calculators" },
    { label: "Assessment", href: "/assessment/profile" },
    { label: "Dashboard", href: "/dashboard" },
];

const LEGAL_LINKS = [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Refund", href: "/refund" },
    { label: "Disclaimer", href: "/disclaimer" },
];

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
    const palette = useAppTheme();
    return (
        <div>
            <h4
                style={{
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: palette.txt,
                    margin: "0 0 14px",
                }}
            >
                {title}
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
                {links.map((l) => (
                    <li key={l.label}>
                        <Link
                            href={l.href}
                            className="footer-link"
                            style={{
                                color: palette.mute,
                                textDecoration: "none",
                                fontSize: 13,
                                transition: "color 0.18s",
                            }}
                        >
                            {l.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
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
                padding: "56px 0 28px",
                color: palette.mute,
                fontFamily: "var(--font-display)",
                fontSize: 13,
                lineHeight: 1.6,
                background: `linear-gradient(180deg, ${palette.s1} 0%, ${palette.bg} 100%)`,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 -8px 32px rgba(0,0,0,0.3)",
            }}
        >
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem" }}>
                <NewsletterBand />

                <div className="footer-grid">
                    <div className="footer-brand">
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                            <img
                                src={
                                    mounted && resolvedTheme === "light"
                                        ? "/myfinancial-logo-light.svg"
                                        : "/myfinancial-logo.svg"
                                }
                                alt="MyFinancial"
                                style={{ height: 32, width: "auto" }}
                            />
                        </div>
                        <p style={{ fontSize: 13, color: palette.mute, margin: "0 0 14px", maxWidth: 320 }}>
                            India&apos;s financial diagnostic platform — clear, honest guidance on tax,
                            insurance, investing and budgeting for Indian households.
                        </p>
                        <p style={{ fontSize: 12, color: palette.mute, margin: 0 }}>
                            Made with care in Mumbai · © 2026 MyFinancial
                        </p>
                    </div>

                    <LinkColumn title="Explore" links={EXPLORE_LINKS} />
                    <LinkColumn title="Legal" links={LEGAL_LINKS} />
                </div>

                <div
                    style={{
                        marginTop: 36,
                        paddingTop: 20,
                        borderTop: `1px solid ${palette.brd}`,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 12,
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 12,
                        color: palette.mute,
                    }}
                >
                    <span>Educational diagnostic platform · Not investment advice</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <ShieldCheck size={12} aria-hidden />
                        SEBI-registered partners
                    </span>
                </div>
            </div>

            <style>{`
                .footer-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr;
                    gap: 48px;
                    align-items: start;
                }
                .footer-link:hover { color: ${palette.txt} !important; }
                @media (max-width: 720px) {
                    .footer-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 32px;
                    }
                    .footer-brand {
                        grid-column: 1 / -1;
                    }
                }
            `}</style>
        </footer>
    );
}
