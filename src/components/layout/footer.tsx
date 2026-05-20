"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ArrowRight, Check, Linkedin, Loader2, Mail, ShieldCheck, Youtube } from "lucide-react";

const LEGAL_LINKS = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Regulatory Disclosures", href: "/disclaimer" },
];

function XIcon({ size = 16 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
        >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function NewsletterForm() {
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
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span
                    aria-hidden
                    style={{
                        width: 24,
                        height: 2,
                        background: palette.accent,
                        borderRadius: 2,
                    }}
                />
                <h3
                    style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        color: palette.txt,
                        margin: 0,
                    }}
                >
                    Subscribe to our newsletter
                </h3>
            </div>

            <form
                onSubmit={submit}
                style={{
                    display: "flex",
                    alignItems: "stretch",
                    gap: 8,
                    background: palette.s1,
                    border: `1px solid ${palette.brd2}`,
                    borderRadius: 12,
                    padding: 6,
                }}
            >
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        paddingLeft: 12,
                        color: palette.mute,
                        flexShrink: 0,
                    }}
                >
                    <Mail size={16} aria-hidden />
                </div>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={disabled}
                    aria-label="Email address"
                    style={{
                        flex: 1,
                        minWidth: 0,
                        padding: "10px 8px",
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
                        borderRadius: 8,
                        padding: "10px 18px",
                        background:
                            status === "success" ? "rgba(16,185,129,0.18)" : palette.txt,
                        color: status === "success" ? palette.accent : palette.bg,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: disabled ? "default" : "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        whiteSpace: "nowrap",
                        transition: "opacity 0.2s",
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
                        <>
                            Subscribe
                            <ArrowRight size={14} aria-hidden />
                        </>
                    )}
                </button>
            </form>

            <div
                role={status === "error" ? "alert" : "status"}
                style={{
                    minHeight: 16,
                    marginTop: 10,
                    fontSize: 12,
                    color:
                        status === "error"
                            ? palette.danger
                            : status === "success"
                              ? palette.accent
                              : palette.mute,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                }}
            >
                {status === "idle" && !message ? (
                    <>
                        <ShieldCheck size={13} aria-hidden />
                        We never share your email.
                    </>
                ) : (
                    message
                )}
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

export function Footer() {
    const palette = useAppTheme();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const socialIconStyle: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: 8,
        color: palette.mute,
        transition: "color 0.18s, background 0.18s",
    };

    return (
        <footer
            style={{
                borderTop: `1px solid ${palette.brd}`,
                padding: "40px 0 18px",
                color: palette.mute,
                fontFamily: "var(--font-display)",
                fontSize: 13,
                lineHeight: 1.6,
                background: palette.bg,
            }}
        >
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem" }}>
                <div className="footer-top">
                    <div className="footer-brand">
                        <img
                            src={
                                mounted && resolvedTheme === "light"
                                    ? "/myfinancial-logo-light.svg"
                                    : "/myfinancial-logo.svg"
                            }
                            alt="MyFinancial"
                            style={{ height: 28, width: "auto", display: "block", marginBottom: 22 }}
                        />

                        <p style={{ margin: "0 0 6px", color: palette.txt2, fontSize: 13.5, lineHeight: 1.6 }}>
                            © 2026 <span style={{ fontWeight: 600, color: palette.txt }}>Finnodiagnos Analytics Private Limited</span>.{" "}
                            CIN:{" "}
                            <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", color: palette.txt2 }}>
                                U62099KA2026PTC219284
                            </span>
                            .
                        </p>
                        <address
                            style={{
                                fontStyle: "normal",
                                color: palette.mute,
                                fontSize: 13,
                                lineHeight: 1.65,
                                margin: "0 0 22px",
                                maxWidth: 480,
                            }}
                        >
                            Registered office: No. 112, AKR Tech Park, B Block, Bommanahalli,
                            Bangalore South, Bangalore — 560068, Karnataka, India.
                        </address>

                        <ul
                            style={{
                                listStyle: "none",
                                padding: 0,
                                margin: 0,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                gap: "0 8px",
                                rowGap: 6,
                            }}
                        >
                            {LEGAL_LINKS.map((l, i) => (
                                <li key={l.label} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                                    <Link
                                        href={l.href}
                                        className="footer-link"
                                        style={{
                                            color: palette.txt2,
                                            textDecoration: "none",
                                            fontSize: 13,
                                            fontWeight: 500,
                                            transition: "color 0.18s",
                                        }}
                                    >
                                        {l.label}
                                    </Link>
                                    {i < LEGAL_LINKS.length - 1 && (
                                        <span
                                            aria-hidden
                                            style={{
                                                width: 3,
                                                height: 3,
                                                borderRadius: "50%",
                                                background: palette.mute,
                                                opacity: 0.5,
                                                marginRight: 4,
                                            }}
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-newsletter">
                        <NewsletterForm />
                    </div>
                </div>

                <div
                    className="footer-bottom"
                    style={{
                        marginTop: 32,
                        paddingTop: 16,
                        borderTop: `1px solid ${palette.brd}`,
                    }}
                >
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 12,
                            color: palette.mute,
                        }}
                    >
                        <span
                            aria-hidden
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: palette.accent,
                                boxShadow: `0 0 8px ${palette.accent}`,
                            }}
                        />
                        Educational diagnostic platform · Not investment advice
                    </div>

                    <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <a
                            href="https://x.com/myfinancial"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="X (Twitter)"
                            className="footer-social"
                            style={socialIconStyle}
                        >
                            <XIcon size={15} />
                        </a>
                        <a
                            href="https://linkedin.com/company/myfinancial"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="footer-social"
                            style={socialIconStyle}
                        >
                            <Linkedin size={16} />
                        </a>
                        <a
                            href="https://youtube.com/@myfinancial"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="YouTube"
                            className="footer-social"
                            style={socialIconStyle}
                        >
                            <Youtube size={17} />
                        </a>
                    </div>
                </div>
            </div>

            <style>{`
                .footer-top {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: 56px;
                    align-items: start;
                }
                .footer-bottom {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    flex-wrap: wrap;
                }
                .footer-link:hover { color: ${palette.txt} !important; }
                .footer-social:hover {
                    color: ${palette.txt} !important;
                    background: ${palette.s2};
                }
                @media (max-width: 860px) {
                    .footer-top {
                        grid-template-columns: 1fr;
                        gap: 36px;
                    }
                }
            `}</style>
        </footer>
    );
}
