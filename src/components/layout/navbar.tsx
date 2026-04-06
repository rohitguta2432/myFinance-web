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
                background: "rgba(8,14,18,0.8)",
                backdropFilter: "blur(24px)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
        >
            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                <div
                    style={{
                        width: 26,
                        height: 26,
                        borderRadius: 7,
                        background: "linear-gradient(135deg, #2DD4BF, #F5C842)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 800,
                        color: "#080E12",
                    }}
                >
                    M
                </div>
                <span
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 20,
                        fontWeight: 700,
                        letterSpacing: "-0.5px",
                        color: "#F0F4F8",
                    }}
                >
                    MyFinancial
                </span>
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden md:flex" style={{ listStyle: "none", display: undefined, gap: "2rem" }}>
                {navLinks.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: 12,
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
                        background: "#2DD4BF",
                        color: "#080E12",
                        fontSize: 12,
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
                            background: "#2DD4BF",
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
