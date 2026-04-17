"use client";

import { Shield, ArrowRight } from "lucide-react";
import { useAppTheme } from "@/hooks/useAppTheme";

export function FinalCTASection() {
    const palette = useAppTheme();
    return (
        <section
            style={{
                paddingTop: 96,
                paddingBottom: 96,
                background: `linear-gradient(180deg, ${palette.s1} 0%, ${palette.bg} 100%)`,
            }}
        >
            <div className="container-7xl" style={{ textAlign: "center" }}>
                <div style={{ maxWidth: 600, margin: "0 auto" }}>
                    {/* Shield Icon */}
                    <div
                        className="flex items-center justify-center"
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 16,
                            backgroundColor: "rgba(16, 185, 129, 0.12)",
                            margin: "0 auto 24px",
                        }}
                    >
                        <Shield size={28} style={{ color: "#10B981" }} />
                    </div>

                    {/* Overline */}
                    <p
                        style={{
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "#10B981",
                            marginBottom: 16,
                        }}
                    >
                        NO SIGNUP REQUIRED
                    </p>

                    {/* Headline */}
                    <h2
                        style={{
                            fontSize: "clamp(2rem, 3.5vw, 3rem)",
                            fontWeight: 700,
                            lineHeight: 1.15,
                            letterSpacing: "-0.025em",
                            color: palette.txt,
                            marginBottom: 16,
                        }}
                    >
                        Ready to see your real financial picture?
                    </h2>

                    {/* Subtext */}
                    <p style={{ fontSize: 16, color: palette.mute, marginBottom: 32 }}>
                        10 minutes. Zero data shared. Complete clarity.
                    </p>

                    {/* CTA */}
                    <a
                        href="#"
                        className="inline-flex items-center justify-center text-white font-semibold transition-all"
                        style={{
                            padding: "16px 32px",
                            backgroundColor: "#10B981",
                            borderRadius: 12,
                            fontSize: 16,
                            boxShadow: "0 8px 30px -4px rgba(16, 185, 129, 0.35)",
                            textDecoration: "none",
                            color: "#FFFFFF",
                        }}
                    >
                        Start Free Assessment <ArrowRight size={18} style={{ marginLeft: 8 }} />
                    </a>

                    {/* Trust micro-text */}
                    <div
                        className="flex items-center justify-center"
                        style={{ gap: 12, marginTop: 24, fontSize: 12, color: palette.mute }}
                    >
                        <span>• NO NAME</span>
                        <span>• NO PHONE</span>
                        <span>• NO EMAIL</span>
                        <span>• DATA STAYS ON YOUR DEVICE</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
