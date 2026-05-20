"use client";

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useFeatureFlag } from "@/hooks/useFeatureFlags";

const getPlans = (palette: { s2: string; mute: string }) => [
    {
        badge: "Free", badgeBg: palette.s2, badgeColor: palette.mute,
        name: "Essentials", tagline: "Your financial blind spots, revealed", price: "₹0", cycle: "No credit card needed",
        features: [
            { text: "Basic financial health score", ok: true },
            { text: "Highlights key problems & issues in your financial life", ok: true },
            { text: "Protection, Wealth & Debt snapshot", ok: true },
            { text: "Identifies critical gaps to address", ok: true },
            { text: "Full 5-dimension analysis", ok: false },
            { text: "Action plan & step-by-step guides", ok: false },
            { text: "Tax & goal planning insights", ok: false },
        ],
        btnText: "Get Started Free", popular: false,
    },
    {
        badge: "Starter", badgeBg: "rgba(16,185,129,0.06)", badgeColor: "#10B981",
        name: "Comprehensive (Diagnostic)", tagline: "Full financial picture, instant clarity", price: "₹999", cycle: "One-time · Interactive dashboard",
        features: [
            { text: "Complete financial health score (out of 100)", ok: true },
            { text: "Income & expense analysis", ok: true },
            { text: "Insurance gap assessment", ok: true },
            { text: "Investment health review", ok: true },
            { text: "Tax optimisation insights", ok: true },
            { text: "Goal planning overview", ok: true },
            { text: "Step-by-step action guides", ok: true },
            { text: "Understand where you stand & what to do next", ok: true },
            { text: "1-on-1 diagnostic walkthrough", ok: false },
        ],
        btnText: "Get My Dashboard →", popular: false,
    },
    {
        badge: "Most Popular", badgeBg: "linear-gradient(135deg, #10B981, #F5C842)", badgeColor: "#080E12",
        name: "Guided Diagnostic", tagline: "Self-serve review", price: "₹2,999", cycle: "One-time engagement",
        features: [
            { text: "Everything in Comprehensive", ok: true },
            { text: "60-min 1-on-1 diagnostic walkthrough (educational only)", ok: true },
            { text: "Risk profiling assessment", ok: true },
            { text: "Portfolio diagnostic snapshot based on your risk profile", ok: true },
            { text: "Tax optimisation blueprint", ok: true },
            { text: "Quarterly diagnostic snapshots", ok: false },
        ],
        btnText: "Get Guided Diagnostic →", popular: true,
    },
    {
        badge: "Best Value", badgeBg: "rgba(245,200,66,0.06)", badgeColor: "#F5C842",
        name: "Annual Diagnostic", tagline: "Year-round diagnostic partnership", price: "₹9,999", cycle: "Annual · Only 15 clients/month",
        features: [
            { text: "Everything in Guided Diagnostic", ok: true },
            { text: "Portfolio diagnostic guidelines", ok: true },
            { text: "Personalised investment restructuring worksheet", ok: true },
            { text: "Quarterly portfolio diagnostic snapshots", ok: true },
            { text: "Quarterly self-serve reviews & course corrections", ok: true },
            { text: "Investment planning education (quarterly)", ok: true },
            { text: "Tax-filing checklist + DIY worksheet", ok: true },
            { text: "Annual tax strategy session (educational only)", ok: true },
            { text: "Goal tracking & rebalancing alerts", ok: true },
            { text: "Annual net worth tracking", ok: true },
        ],
        btnText: "Apply for Annual Diagnostic →", popular: false, gold: true,
    },
];

export function PricingSection() {
    const palette = useAppTheme();
    const showPricing = useFeatureFlag("show_pricing");
    const showSebi = useFeatureFlag("show_sebi_disclaimers");
    const plans = getPlans(palette);
    if (!showPricing) return null;
    return (
        <section id="pricing" style={{ background: palette.s1, borderTop: `1px solid ${palette.brd}`, padding: "clamp(80px, 10vw, 120px) 0" }}>
            <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 2rem" }}>
                <div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto 8px" }}>
                    <div className="section-tag" style={{ justifyContent: "center" }}>Pricing</div>
                    <h2 className="landing-h2" style={{ fontFamily: "var(--font-display)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-1.5px" }}>
                        What does <span className="text-gradient">clarity</span> cost?
                    </h2>
                </div>

                <div className="plans-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 48 }}>
                    {plans.map((p) => (
                        <div key={p.name} className={p.popular ? "plan-card popular" : "plan-card"}>
                            <span style={{ fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 6, marginBottom: 14, width: "fit-content", background: p.badgeBg, color: p.badgeColor }}>{p.badge}</span>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 2 }}>{p.name}</div>
                            <div style={{ fontSize: 13, color: palette.txt2, marginBottom: 16 }}>{p.tagline}</div>
                            <div className="text-gradient" style={{ fontFamily: "var(--font-display)", fontSize: 38, fontWeight: 800, lineHeight: 1, marginBottom: 4, letterSpacing: "-1.5px" }}>{p.price}</div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: 13, color: palette.txt2, marginBottom: 20 }}>{p.cycle}</div>

                            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7, marginTop: 0, marginRight: 0, marginBottom: "auto", marginLeft: 0, paddingTop: 0, paddingRight: 0, paddingBottom: 20, paddingLeft: 0 }}>
                                {p.features.map((f) => (
                                    <li key={f.text} style={{ fontSize: 13, display: "flex", gap: 6, lineHeight: 1.5, color: f.ok ? palette.txt2 : palette.mute }}>
                                        <span style={{ color: f.ok ? "#10B981" : palette.mute, fontWeight: 700, flexShrink: 0 }}>{f.ok ? "✓" : "✗"}</span>
                                        {f.text}
                                    </li>
                                ))}
                            </ul>

                            <GoogleSignInButton className={p.popular ? "btn-plan popular" : "btn-plan"} style={p.gold ? { borderColor: "#F5C842", color: "#F5C842", textAlign: "center" } : { textAlign: "center" }}>{p.btnText}</GoogleSignInButton>
                            {showSebi && (
                                <div style={{ marginTop: 12, fontSize: 11, lineHeight: 1.5, color: palette.mute, fontStyle: "italic" }}>
                                    Educational diagnostic only. Not investment advice. We are not SEBI-registered investment advisors.
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) { .plans-grid { grid-template-columns: 1fr 1fr !important; } }
                @media (max-width: 600px) { .plans-grid { grid-template-columns: 1fr !important; } }
            `}</style>
        </section>
    );
}
