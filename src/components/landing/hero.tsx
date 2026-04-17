"use client";

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { useAppTheme } from "@/hooks/useAppTheme";

export function HeroSection() {
    const palette = useAppTheme();
    return (
        <section
            style={{
                minHeight: "100lvh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "120px 2rem 80px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Glow orbs */}
            <div style={{ position: "absolute", inset: 0 }}>
                <div
                    style={{
                        position: "absolute",
                        width: "45vw",
                        height: "45vw",
                        background: "#10B981",
                        top: "-5%",
                        left: "15%",
                        opacity: 0.05,
                        borderRadius: "50%",
                        filter: "blur(120px)",
                        animation: "glow-float 20s ease-in-out infinite",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        width: "30vw",
                        height: "30vw",
                        background: "#F5C842",
                        bottom: "10%",
                        right: "15%",
                        opacity: 0.04,
                        borderRadius: "50%",
                        filter: "blur(120px)",
                        animation: "glow-float 16s ease-in-out infinite reverse",
                    }}
                />
            </div>
            <div className="hero-grid" />

            {/* Content */}
            <div style={{ position: "relative", zIndex: 2, maxWidth: 960 }}>
                {/* Announcement */}
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontFamily: "var(--font-display)",
                        fontSize: 13,
                        fontWeight: 500,
                        padding: "6px 6px 6px 16px",
                        borderRadius: 100,
                        marginBottom: 28,
                        background: "rgba(255,255,255,0.03)",
                        border: `1px solid ${palette.brd}`,
                        color: palette.mute,
                        animation: "fade-up 0.8s 0.2s both",
                    }}
                >
                    <span
                        style={{
                            background: "linear-gradient(135deg, #10B981, #F5C842)",
                            color: "#080E12",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            padding: "3px 10px",
                            borderRadius: 100,
                        }}
                    >
                        New
                    </span>
                    2026 Tax Rules — Are you missing ₹5.4L?
                </div>

                {/* Headline */}
                <h1
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(40px, 6vw, 80px)",
                        fontWeight: 800,
                        lineHeight: 1.02,
                        letterSpacing: -3,
                        marginBottom: 22,
                        animation: "fade-up 1s 0.4s both",
                    }}
                >
                    You think you&apos;re{" "}
                    <span
                        style={{
                            textDecoration: "line-through",
                            textDecorationColor: palette.danger,
                            textDecorationThickness: 3,
                            color: palette.mute,
                        }}
                    >
                        sorted.
                    </span>
                    <br />
                    The{" "}
                    <span className="text-gradient">numbers disagree.</span>
                </h1>

                {/* Subheadline */}
                <p
                    style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: 18,
                        color: palette.mute,
                        maxWidth: 520,
                        margin: "0 auto 36px",
                        lineHeight: 1.75,
                        fontStyle: "italic",
                        animation: "fade-up 1s 0.55s both",
                    }}
                >
                    Most professionals earning ₹15L+ silently lose{" "}
                    <b style={{ color: palette.txt2, fontStyle: "normal", fontWeight: 600 }}>
                        ₹3–8 lakh/year
                    </b>{" "}
                    through tax leakage, portfolio drift, and insurance traps.
                </p>

                {/* Buttons */}
                <div
                    style={{
                        display: "flex",
                        gap: 12,
                        justifyContent: "center",
                        flexWrap: "wrap",
                        animation: "fade-up 1s 0.7s both",
                    }}
                >
                    <GoogleSignInButton className="btn-teal">
                        Get Your Diagnosis
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </GoogleSignInButton>
                    <GoogleSignInButton className="btn-outline">Try Free Essentials</GoogleSignInButton>
                </div>

                {/* Fine print */}
                <div
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 14,
                        color: palette.mute,
                        marginTop: 14,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 16,
                        justifyContent: "center",
                        animation: "fade-up 1s 0.85s both",
                    }}
                >
                    {["₹999 one-time", "Instant dashboard", "100% confidential"].map((t) => (
                        <span key={t} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                                <path d="M13.5 4.5l-7 7L3 8" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            {t}
                        </span>
                    ))}
                </div>

                {/* Proof bar */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        marginTop: 64,
                        border: `1px solid ${palette.brd}`,
                        borderRadius: 14,
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.015)",
                        animation: "fade-up 1s 1s both",
                    }}
                >
                    {[
                        { v: "5", l: "Dimensions" },
                        { v: "140+", l: "Data Points" },
                        { v: "Instant", l: "Dashboard" },
                        { v: "100", l: "Point Score" },
                    ].map((item, i, arr) => (
                        <div
                            key={item.l}
                            style={{
                                flex: 1,
                                padding: "20px 0",
                                textAlign: "center",
                                borderRight: i < arr.length - 1 ? `1px solid ${palette.brd}` : "none",
                            }}
                        >
                            <div
                                className="text-gradient"
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: 28,
                                    fontWeight: 800,
                                    letterSpacing: -1,
                                }}
                            >
                                {item.v}
                            </div>
                            <div
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: 12,
                                    color: palette.mute,
                                    marginTop: 2,
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                }}
                            >
                                {item.l}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
