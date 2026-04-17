"use client";

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { useAppTheme } from "@/hooks/useAppTheme";

export function FinalCTASection() {
    const palette = useAppTheme();
    return (
        <section style={{ textAlign: "center", padding: "clamp(100px, 14vw, 180px) 0", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", bottom: -100, left: "50%", transform: "translateX(-50%)", width: 500, height: 500, background: "radial-gradient(circle, rgba(16,185,129,0.06), transparent 60%)", pointerEvents: "none" }} />

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem", position: "relative" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4.5vw, 60px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-1.5px", maxWidth: 700, margin: "0 auto 20px", color: palette.txt }}>
                    The most expensive thing is <span className="text-gradient">waiting to find out.</span>
                </h2>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: palette.mute, lineHeight: 1.75, maxWidth: 440, margin: "0 auto 36px", fontStyle: "italic", textAlign: "center" }}>
                    ₹999. One form. Instant dashboard. The clearest picture you&apos;ve ever had.
                </p>

                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                    <GoogleSignInButton className="btn-teal" style={{ fontSize: 16, padding: "16px 38px" }}>Get My Financial Analysis →</GoogleSignInButton>
                    <GoogleSignInButton className="btn-outline">Try Free Essentials</GoogleSignInButton>
                </div>

                <div style={{ fontFamily: "var(--font-display)", fontSize: 13, color: palette.mute, marginTop: 20, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                    <span>Confidential</span><span>·</span><span>SEBI RIA In Progress</span><span>·</span><span>No product selling</span>
                </div>
            </div>
        </section>
    );
}
