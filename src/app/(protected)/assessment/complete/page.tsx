"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Sparkles, Trophy } from "lucide-react";
import { useAssessmentStore } from "@/store/useAssessmentStore";

const CHECKLIST = [
    "Net Worth Calculated",
    "Insurance Gaps Identified",
    "Tax Savings Found",
    "Goals Mapped",
];

export default function AssessmentComplete() {
    const router = useRouter();
    const { completeAssessment } = useAssessmentStore();
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        completeAssessment();
        const timer = setTimeout(() => setShowContent(true), 300);
        return () => clearTimeout(timer);
    }, [completeAssessment]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                background: "#0B0F1A",
                padding: 24,
                position: "fixed",
                inset: 0,
                zIndex: 30,
                overflow: "hidden",
            }}
        >
            {/* Background glow orbs */}
            <div
                style={{
                    position: "absolute",
                    top: "-10%",
                    left: "-10%",
                    width: 384,
                    height: 384,
                    background: "rgba(16,185,129,0.2)",
                    borderRadius: "50%",
                    filter: "blur(100px)",
                    animation: "pulse 3s ease-in-out infinite",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "-10%",
                    right: "-10%",
                    width: 384,
                    height: 384,
                    background: "rgba(59,130,246,0.2)",
                    borderRadius: "50%",
                    filter: "blur(100px)",
                    animation: "pulse 3s ease-in-out infinite",
                    animationDelay: "1s",
                }}
            />

            {/* Card */}
            <div
                style={{
                    maxWidth: 440,
                    width: "100%",
                    background: "#0F172A",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 24,
                    padding: 32,
                    position: "relative",
                    zIndex: 10,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
                    opacity: showContent ? 1 : 0,
                    transform: showContent ? "translateY(0)" : "translateY(40px)",
                    transition: "opacity 1s ease, transform 1s ease",
                }}
            >
                {/* Trophy icon */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                    <div style={{ position: "relative" }}>
                        <div
                            style={{
                                position: "absolute",
                                inset: -16,
                                background: "rgba(16,185,129,0.2)",
                                borderRadius: "50%",
                                filter: "blur(12px)",
                                animation: "pulse 2s ease-in-out infinite",
                            }}
                        />
                        <div
                            style={{
                                width: 80,
                                height: 80,
                                background: "linear-gradient(135deg, #10B981, #059669)",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 8px 24px rgba(16,185,129,0.4)",
                                position: "relative",
                                zIndex: 1,
                                border: "4px solid #0F172A",
                            }}
                        >
                            <Trophy style={{ width: 40, height: 40, color: "#0B0F1A" }} />
                        </div>
                        <Sparkles
                            style={{
                                position: "absolute",
                                top: -8,
                                right: -8,
                                color: "#FBBF24",
                                width: 24,
                                height: 24,
                                animation: "bounce 1s ease infinite",
                            }}
                        />
                    </div>
                </div>

                {/* Badge + Heading */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div
                        style={{
                            display: "inline-block",
                            background: "rgba(16,185,129,0.1)",
                            color: "#10B981",
                            border: "1px solid rgba(16,185,129,0.2)",
                            padding: "4px 12px",
                            borderRadius: 9999,
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            marginBottom: 16,
                        }}
                    >
                        Assessment Complete!
                    </div>
                    <h1
                        style={{
                            fontSize: 22,
                            fontWeight: 700,
                            color: "#F1F5F9",
                            marginBottom: 12,
                            lineHeight: 1.3,
                        }}
                    >
                        Your Financial Position Summary is ready!
                    </h1>
                    <p style={{ fontSize: 14, color: "#94A3B8" }}>
                        We&apos;ve crunched the numbers and built your personalized roadmap.
                    </p>
                </div>

                {/* Checklist */}
                <div
                    style={{
                        background: "rgba(11,15,26,0.5)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: 16,
                        padding: 20,
                        marginBottom: 32,
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                    }}
                >
                    {CHECKLIST.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                opacity: showContent ? 1 : 0,
                                transform: showContent ? "translateX(0)" : "translateX(-16px)",
                                transition: `opacity 0.7s ease ${400 + index * 150}ms, transform 0.7s ease ${400 + index * 150}ms`,
                            }}
                        >
                            <div
                                style={{
                                    background: "rgba(16,185,129,0.2)",
                                    padding: 4,
                                    borderRadius: "50%",
                                    display: "flex",
                                    flexShrink: 0,
                                }}
                            >
                                <CheckCircle2 style={{ width: 16, height: 16, color: "#10B981" }} />
                            </div>
                            <span style={{ color: "#F1F5F9", fontWeight: 500, fontSize: 14 }}>
                                {item}
                            </span>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <button
                    onClick={() => router.push("/dashboard")}
                    style={{
                        width: "100%",
                        background: "#10B981",
                        border: "none",
                        borderRadius: 12,
                        padding: "16px 24px",
                        color: "#0B0F1A",
                        fontWeight: 700,
                        fontSize: 17,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        boxShadow: "0 0 20px rgba(16,185,129,0.3)",
                        opacity: showContent ? 1 : 0,
                        transform: showContent ? "scale(1)" : "scale(0.95)",
                        transition: "opacity 1s ease 1000ms, transform 1s ease 1000ms",
                    }}
                >
                    View Your Dashboard
                    <ArrowRight style={{ width: 20, height: 20 }} />
                </button>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.05); }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
            `}</style>
        </div>
    );
}
