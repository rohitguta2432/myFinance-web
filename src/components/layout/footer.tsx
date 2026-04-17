"use client";

import { useTheme } from "next-themes";
import { useAppTheme } from "@/hooks/useAppTheme";

export function Footer() {
    const palette = useAppTheme();
    const { resolvedTheme } = useTheme();

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
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 4 }}>
                    <img
                        src={resolvedTheme === "light" ? "/myfinancial-logo-light.svg" : "/myfinancial-logo.svg"}
                        alt="MyFinancial"
                        style={{ height: 32, width: "auto" }}
                    />
                    <span style={{ color: palette.brd2 }}>—</span>
                    <span>India&apos;s Financial Diagnostic Platform</span>
                </div>
                <p style={{ marginTop: 4, color: palette.mute }}>SEBI RIA In Progress · Mumbai · © 2026</p>
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
