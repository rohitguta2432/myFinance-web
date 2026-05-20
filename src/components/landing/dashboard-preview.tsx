"use client";

import { useEffect, useRef } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";

const sideItems = ["Overview", "Protection", "Wealth", "Debt", "Retirement", "Tax"];

const insights = [
    { icon: "🔥", title: "Tax Leak", desc: "Wrong regime + NPS", val: "-₹1.3L" },
    { icon: "🛡️", title: "Cover Gap", desc: "Term inadequate", val: "-₹25L" },
    { icon: "🔄", title: "Overlap", desc: "4 duplicate funds", val: "-₹2.1L" },
];

export function DashboardPreview() {
    const palette = useAppTheme();
    const dashRef = useRef<HTMLDivElement>(null);

    const bars = [
        { label: "Protection", score: "8/20", pct: 40, color: palette.danger },
        { label: "Wealth", score: "11/20", pct: 55, color: palette.warn },
        { label: "Debt", score: "9/20", pct: 45, color: palette.warn },
        { label: "Retirement", score: "9/15", pct: 60, color: palette.accent },
        { label: "Survival", score: "21/25", pct: 84, color: "#F5C842" },
    ];

    useEffect(() => {
        const el = dashRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        el.querySelectorAll<HTMLDivElement>(".bar-fill").forEach((b) => {
                            const w = b.style.width;
                            b.style.width = "0";
                            requestAnimationFrame(() => requestAnimationFrame(() => { b.style.width = w; }));
                        });
                        obs.unobserve(e.target);
                    }
                });
            },
            { threshold: 0.3 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div style={{ padding: "0 2rem 100px", marginTop: -10, position: "relative", zIndex: 2 }}>
            <div
                ref={dashRef}
                style={{
                    maxWidth: 1120,
                    margin: "0 auto",
                    background: palette.s1,
                    border: `1px solid ${palette.brd}`,
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "0 40px 80px rgba(0,0,0,0.4)",
                }}
            >
                {/* Chrome bar */}
                <div style={{ display: "flex", gap: 6, padding: "12px 16px", borderBottom: `1px solid ${palette.brd}`, background: palette.s2, alignItems: "center" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E" }} />
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28CA42" }} />
                    <div style={{ flex: 1, textAlign: "center", fontFamily: "var(--font-display)", fontSize: 11, color: palette.mute }}>
                        myfinancial.in/dashboard
                    </div>
                </div>

                <div className="dash-body" style={{ display: "grid", gridTemplateColumns: "180px 1fr", minHeight: 320 }}>
                    <div className="dash-side" style={{ borderRight: `1px solid ${palette.brd}`, padding: 14, display: "flex", flexDirection: "column", gap: 2 }}>
                        {sideItems.map((item) => (
                            <div key={item} className={`dash-side-item ${item === "Overview" ? "active" : ""}`}>{item}</div>
                        ))}
                    </div>

                    <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 18 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, letterSpacing: "-0.5px" }}>Financial Health Overview</div>
                            <div style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(245,200,66,0.06))", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 10, padding: "8px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                                <div className="text-gradient" style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 800, lineHeight: 1 }}>58</div>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: 9, color: palette.mute, textTransform: "uppercase", letterSpacing: "0.06em" }}>Health<br />Score</div>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {bars.map((bar) => (
                                <div key={bar.label} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-display)", fontSize: 11 }}>
                                        <span style={{ color: palette.mute }}>{bar.label}</span>
                                        <span style={{ fontWeight: 600, color: bar.color }}>{bar.score}</span>
                                    </div>
                                    <div style={{ height: 5, background: palette.s3, borderRadius: 4, overflow: "hidden" }}>
                                        <div className="bar-fill" style={{ width: `${bar.pct}%`, background: bar.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                            {insights.map((ins) => (
                                <div key={ins.title} style={{ background: palette.s2, border: `1px solid ${palette.brd}`, borderRadius: 8, padding: 10 }}>
                                    <div style={{ fontSize: 14, marginBottom: 4 }}>{ins.icon}</div>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: 10, fontWeight: 600, marginBottom: 1 }}>{ins.title}</div>
                                    <div style={{ fontSize: 10, color: palette.mute, lineHeight: 1.3 }}>{ins.desc}</div>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 800, color: palette.danger, marginTop: 3 }}>{ins.val}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) { .dash-body { grid-template-columns: 1fr !important; } .dash-side { display: none !important; } }
            `}</style>
        </div>
    );
}
