"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAssessmentStore } from "@/store/useAssessmentStore";

const PAGE_TITLES: Record<string, string> = {
    "/assessment/step-1": "Personal Profile",
    "/assessment/step-2": "Income & Expenses",
    "/assessment/step-3": "Assets & Liabilities",
    "/assessment/step-4": "Financial Goals",
    "/assessment/step-5": "Insurance Gap",
    "/assessment/step-6": "Tax Optimization",
    "/assessment/complete": "Assessment Complete",
    "/dashboard": "Financial Dashboard",
    "/dashboard/action-plan": "Action Plan",
    "/dashboard/insurance": "Insurance Analysis",
    "/dashboard/tax": "Tax Planning",
    "/admin": "Admin Panel",
};

const navLinks = [
    { label: "Diagnosis", href: "/#prob" },
    { label: "How It Works", href: "/#how" },
    { label: "Pricing", href: "/#pricing" },
    { label: "About", href: "/#founder" },
    { label: "Blog", href: "/blog" },
];

const dropdownLinks = [
    { label: "Assessment", href: "/assessment/step-1" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Blog", href: "/blog" },
    { label: "Home", href: "/" },
];

interface User {
    id: number;
    email: string;
    name: string;
    pictureUrl: string;
}

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    const isAppRoute = ["/assessment", "/dashboard", "/admin"].some((r) => pathname.startsWith(r));
    const pageTitle = PAGE_TITLES[pathname] || (pathname.startsWith("/assessment") ? "Assessment" : pathname.startsWith("/dashboard") ? "Dashboard" : "");
    const isComplete = useAssessmentStore((s) => s.isComplete);

    useEffect(() => {
        fetch("/api/auth/me")
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data?.user) setUser(data.user);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const login = useGoogleLogin({
        flow: "auth-code",
        ux_mode: "popup",
        onSuccess: async (codeResponse) => {
            setLoading(true);
            try {
                const res = await fetch("/api/auth/google", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code: codeResponse.code }),
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    // Route new users to assessment, returning users to dashboard (FLOW-01)
                    router.push(isComplete ? "/dashboard" : "/assessment/step-1");
                }
            } finally {
                setLoading(false);
            }
        },
        onError: () => setLoading(false),
    });

    const handleSignOut = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        setDropdownOpen(false);
        router.push("/");
        router.refresh();
    };

    const handleGetStarted = () => {
        if (user) {
            router.push(isComplete ? "/dashboard" : "/assessment/step-1");
        } else {
            login();
        }
    };

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
            <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                <img src="/myfinancial-logo.svg" alt="MyFinancial" style={{ height: 40, width: "auto" }} />
            </Link>

            {isAppRoute ? (
                <div className="hidden md:flex" style={{ display: undefined, alignItems: "center", gap: 8 }}>
                    <span style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#F1F5F9",
                        letterSpacing: "-0.01em",
                    }}>
                        {pageTitle}
                    </span>
                </div>
            ) : (
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
            )}

            <div className="hidden md:flex" style={{ display: undefined, alignItems: "center", gap: 8, position: "relative" }} ref={dropdownRef}>
                {user ? (
                    <>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            style={{
                                background: "none",
                                border: "2px solid transparent",
                                borderRadius: "50%",
                                cursor: "pointer",
                                padding: 0,
                                transition: "border-color 0.15s",
                                borderColor: dropdownOpen ? "#10B981" : "transparent",
                            }}
                        >
                            <img
                                src={user.pictureUrl}
                                alt={user.name}
                                referrerPolicy="no-referrer"
                                style={{ width: 32, height: 32, borderRadius: "50%" }}
                            />
                        </button>
                        {dropdownOpen && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "calc(100% + 8px)",
                                    right: 0,
                                    background: "#0F172A",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: 10,
                                    padding: "6px 0",
                                    minWidth: 180,
                                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                                    zIndex: 200,
                                }}
                            >
                                {dropdownLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setDropdownOpen(false)}
                                        style={{
                                            display: "block",
                                            fontFamily: "var(--font-display)",
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color: "#CBD5E1",
                                            padding: "10px 16px",
                                            textDecoration: "none",
                                            transition: "background 0.1s",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "4px 0" }} />
                                <button
                                    onClick={handleSignOut}
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        fontFamily: "var(--font-display)",
                                        fontSize: 14,
                                        fontWeight: 600,
                                        color: "#EF4444",
                                        padding: "10px 16px",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        textAlign: "left",
                                        transition: "background 0.1s",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <button
                        onClick={handleGetStarted}
                        disabled={loading}
                        style={{
                            fontFamily: "var(--font-display)",
                            background: "#10B981",
                            color: "#080E12",
                            fontSize: 14,
                            fontWeight: 700,
                            padding: "8px 20px",
                            borderRadius: 8,
                            border: "none",
                            cursor: loading ? "wait" : "pointer",
                            transition: "all 0.15s",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Get Started →
                    </button>
                )}
            </div>

            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden"
                style={{ color: "#64748B", background: "none", border: "none", cursor: "pointer" }}
            >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

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
                    {user ? (
                        <>
                            <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "8px 0" }} />
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
                                <img
                                    src={user.pictureUrl}
                                    alt={user.name}
                                    referrerPolicy="no-referrer"
                                    style={{ width: 28, height: 28, borderRadius: "50%" }}
                                />
                                <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "#CBD5E1" }}>
                                    {user.name}
                                </span>
                            </div>
                            {dropdownLinks.map((link) => (
                                <Link
                                    key={`mobile-${link.href}`}
                                    href={link.href}
                                    style={{
                                        display: "block",
                                        fontFamily: "var(--font-display)",
                                        fontSize: 14,
                                        fontWeight: 600,
                                        color: "#64748B",
                                        padding: "8px 0 8px 38px",
                                        textDecoration: "none",
                                    }}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <button
                                onClick={() => {
                                    handleSignOut();
                                    setMobileOpen(false);
                                }}
                                style={{
                                    display: "block",
                                    fontFamily: "var(--font-display)",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: "#EF4444",
                                    padding: "8px 0 8px 38px",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                handleGetStarted();
                                setMobileOpen(false);
                            }}
                            disabled={loading}
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
                                cursor: loading ? "wait" : "pointer",
                                textAlign: "center",
                            }}
                        >
                            Get Started →
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}
