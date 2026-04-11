"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
    { label: "Diagnosis", href: "/#prob" },
    { label: "How It Works", href: "/#how" },
    { label: "Pricing", href: "/#pricing" },
    { label: "About", href: "/#founder" },
    { label: "Blog", href: "/blog" },
];

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                padding: "0 clamp(1.5rem, 4vw, 3rem)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 64,
                background: "rgba(8,14,18,0.75)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 1px 12px rgba(0,0,0,0.4), 0 4px 24px rgba(0,0,0,0.2), inset 0 -1px 0 rgba(255,255,255,0.03)",
            }}
        >
            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                <img
                    src="/myfinancial-logo.svg"
                    alt="MyFinancial"
                    style={{ height: 40, width: "auto" }}
                />
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden md:flex" style={{ listStyle: "none", display: undefined, gap: "2rem" }}>
                {navLinks.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: 14,
                                color: "#CBD5E1",
                                fontWeight: 600,
                                letterSpacing: "0.01em",
                                textDecoration: "none",
                                transition: "color 0.2s",
                            }}
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Desktop CTA */}
            <div className="hidden md:flex" style={{ display: undefined, alignItems: "center", gap: 8 }}>
                <a
                    href="https://app.myfinancial.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        fontFamily: "var(--font-display)",
                        background: "#10B981",
                        color: "#080E12",
                        fontSize: 14,
                        fontWeight: 700,
                        padding: "8px 20px",
                        borderRadius: 8,
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        whiteSpace: "nowrap",
                        textDecoration: "none",
                    }}
                >
                    Get Started →
                </a>
            </div>

            {/* Mobile Toggle */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden"
                style={{ color: "#64748B", background: "none", border: "none", cursor: "pointer" }}
            >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div
                    className="md:hidden"
                    style={{
                        position: "absolute",
                        top: 64,
                        left: 0,
                        right: 0,
                        background: "#0C1319",
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                        padding: 16,
                    }}
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                display: "block",
                                fontFamily: "var(--font-display)",
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#64748B",
                                padding: "8px 0",
                                textDecoration: "none",
                            }}
                            onClick={() => setMobileOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <a
                        href="https://app.myfinancial.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "block",
                            width: "100%",
                            marginTop: 12,
                            background: "#10B981",
                            color: "#080E12",
                            fontFamily: "var(--font-display)",
                            fontSize: 14,
                            fontWeight: 600,
                            padding: "12px 20px",
                            borderRadius: 8,
                            border: "none",
                            cursor: "pointer",
                            textAlign: "center",
                            textDecoration: "none",
                        }}
                        onClick={() => setMobileOpen(false)}
                    >
                        Get Started →
                    </a>
                </div>
            )}
        </nav>
    );
}
