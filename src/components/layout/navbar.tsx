"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useTheme } from "next-themes";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import { wipeAllAssessmentStorage, LAST_USER_KEY } from "@/lib/assessment-storage-cleanup";
import { useAppTheme } from "@/hooks/useAppTheme";

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
    { label: "Calculators", href: "/calculators" },
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
    const palette = useAppTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const isAppRoute = ["/assessment", "/dashboard", "/admin"].some((r) => pathname.startsWith(r));
    const pageTitle = PAGE_TITLES[pathname] || (pathname.startsWith("/assessment") ? "Assessment" : pathname.startsWith("/dashboard") ? "Dashboard" : "");
    const isComplete = useAssessmentStore((s) => s.isComplete);
    const resetAssessment = useAssessmentStore((s) => s.resetAssessment);

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
        // Wipe BEFORE the network call so failure modes still protect the next user.
        try {
            useAssessmentStore.persist.clearStorage();
        } catch {
            // ignore — defensive
        }
        wipeAllAssessmentStorage();
        if (typeof window !== "undefined") {
            window.localStorage.removeItem(LAST_USER_KEY);
        }
        resetAssessment();

        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch {
            // ignore — proceed to redirect
        }
        setUser(null);
        setDropdownOpen(false);
        router.push("/");
        router.refresh();
    };

    const isLight = mounted && resolvedTheme === "light";

    const ThemeToggleButton = (
        <button
            onClick={() => setTheme(isLight ? "dark" : "light")}
            aria-label="Toggle theme"
            suppressHydrationWarning
            style={{
                background: "none",
                border: `1px solid ${palette.brd}`,
                borderRadius: 8,
                padding: "6px 8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                color: palette.mute,
                transition: "all 0.15s",
                width: 32,
                height: 30,
            }}
        >
            {mounted ? (isLight ? <Moon size={16} /> : <Sun size={16} />) : null}
        </button>
    );

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
                background: mounted && resolvedTheme === "light" ? "rgba(248,250,252,0.80)" : "rgba(8,14,18,0.75)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: `1px solid ${palette.brd}`,
                boxShadow: "0 1px 12px rgba(0,0,0,0.4), 0 4px 24px rgba(0,0,0,0.2), inset 0 -1px 0 rgba(255,255,255,0.03)",
            }}
        >
            <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                <img
                    src={mounted && resolvedTheme === "light" ? "/myfinancial-logo-light.svg" : "/myfinancial-logo.svg"}
                    alt="MyFinancial"
                    style={{ height: 40, width: "auto" }}
                />
            </Link>

            {isAppRoute ? (
                <div className="hidden md:flex" style={{ display: undefined, alignItems: "center", gap: 8 }}>
                    <span style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 16,
                        fontWeight: 700,
                        color: palette.txt,
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
                                    color: palette.txt2,
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
                {ThemeToggleButton}
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
                                    background: palette.s1,
                                    border: `1px solid ${palette.brd2}`,
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
                                            color: palette.txt2,
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
                style={{ color: palette.mute, background: "none", border: "none", cursor: "pointer" }}
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
                        background: palette.bg,
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                        padding: 16,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: 13, color: palette.mute }}>Theme</span>
                        {ThemeToggleButton}
                    </div>
                    <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "4px 0" }} />
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                display: "block",
                                fontFamily: "var(--font-display)",
                                fontSize: 14,
                                fontWeight: 600,
                                color: palette.mute,
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
                                <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: palette.txt2 }}>
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
                                        color: palette.mute,
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
