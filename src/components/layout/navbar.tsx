"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
    { label: "How it Works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "Privacy", href: "/privacy" },
];

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav
            className="sticky top-0 z-50 w-full backdrop-blur-md"
            style={{
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                backgroundColor: "rgba(11, 17, 32, 0.85)",
            }}
        >
            <div
                style={{
                    maxWidth: "80rem",
                    marginLeft: "auto",
                    marginRight: "auto",
                    paddingLeft: "2rem",
                    paddingRight: "2rem",
                }}
            >
                <div className="flex items-center justify-between" style={{ height: 64 }}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center" style={{ gap: 8 }}>
                        <div
                            className="flex items-center justify-center text-white"
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 6,
                                backgroundColor: "#10B981",
                                boxShadow: "0 0 20px -4px rgba(16, 185, 129, 0.4)",
                            }}
                        >
                            <span style={{ fontSize: 18, fontWeight: 700 }}>M</span>
                        </div>
                        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.025em", color: "#F1F5F9" }}>
                            My<span style={{ color: "#10B981" }}>Financial</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center" style={{ gap: 32 }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="transition-colors"
                                style={{ fontSize: 14, fontWeight: 500, color: "#94A3B8" }}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <button
                            className="inline-flex items-center justify-center text-white transition-all active:scale-95"
                            style={{
                                height: 40,
                                paddingLeft: 20,
                                paddingRight: 20,
                                fontSize: 14,
                                fontWeight: 600,
                                backgroundColor: "#10B981",
                                borderRadius: "0.5rem",
                                border: "none",
                                cursor: "pointer",
                                boxShadow: "0 0 20px -4px rgba(16, 185, 129, 0.3)",
                            }}
                        >
                            Start Free{" "}
                            <ArrowRight size={14} style={{ marginLeft: 4 }} />
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden"
                        style={{ color: "#94A3B8", background: "none", border: "none", cursor: "pointer" }}
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", backgroundColor: "#0F172A" }}>
                    <div style={{ padding: 16 }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block"
                                style={{ fontSize: 14, fontWeight: 500, color: "#94A3B8", padding: "8px 0" }}
                                onClick={() => setMobileOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <button
                            className="w-full text-white"
                            style={{
                                display: "block",
                                textAlign: "center",
                                fontSize: 14,
                                fontWeight: 600,
                                backgroundColor: "#10B981",
                                borderRadius: "0.5rem",
                                padding: "12px 20px",
                                marginTop: 12,
                                border: "none",
                                cursor: "pointer",
                            }}
                            onClick={() => setMobileOpen(false)}
                        >
                            Start Free →
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
