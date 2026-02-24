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
                borderBottom: "1px solid #e2e8f0",
                backgroundColor: "rgba(255,255,255,0.8)",
            }}
        >
            {/* Use same max-width as Stitch: max-w-7xl = 80rem, with px-4 sm:px-6 lg:px-8 */}
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
                                backgroundColor: "#059467",
                            }}
                        >
                            <span style={{ fontSize: 18, fontWeight: 700 }}>M</span>
                        </div>
                        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.025em", color: "#0f172a" }}>
                            My<span style={{ color: "#059467" }}>Financial</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center" style={{ gap: 32 }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="transition-colors"
                                style={{ fontSize: 14, fontWeight: 500, color: "#475569" }}
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
                                backgroundColor: "#059467",
                                borderRadius: "0.5rem",
                                border: "none",
                                cursor: "pointer",
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
                        style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden" style={{ borderTop: "1px solid #e2e8f0", backgroundColor: "#fff" }}>
                    <div style={{ padding: 16 }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block"
                                style={{ fontSize: 14, fontWeight: 500, color: "#475569", padding: "8px 0" }}
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
                                backgroundColor: "#059467",
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
