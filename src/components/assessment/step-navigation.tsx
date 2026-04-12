"use client";

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import { useAppTheme } from "@/hooks/useAppTheme";

interface StepNavigationProps {
    step: number;
    backPath?: string;
    onNext: () => void | Promise<void>;
    isValid?: boolean;
    isSaving?: boolean;
    validationMessage?: string;
}

export function StepNavigation({
    step,
    backPath,
    onNext,
    isValid = true,
    isSaving = false,
    validationMessage,
}: StepNavigationProps) {
    const router = useRouter();
    const palette = useAppTheme();

    const handleNext = () => {
        if (!isValid) {
            toast.error(
                validationMessage || "Please complete all required fields",
                { id: "step-validation" }
            );
            return;
        }
        onNext();
    };

    return (
        <div
            style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                background: `${palette.bg}d9`,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderTop: `1px solid ${palette.brd}`,
                padding: "16px 24px",
                zIndex: 50,
            }}
        >
            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: backPath ? "space-between" : "flex-end",
                    gap: 12,
                }}
            >
                {/* Back button */}
                {backPath && (
                    <button
                        onClick={() => router.push(backPath)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "12px 24px",
                            background: palette.s1,
                            border: `1px solid ${palette.brd2}`,
                            borderRadius: 12,
                            color: palette.txt,
                            fontWeight: 700,
                            fontSize: 14,
                            cursor: "pointer",
                            transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = palette.s3;
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = palette.s1;
                        }}
                    >
                        <ArrowLeft style={{ width: 16, height: 16 }} />
                        Back
                    </button>
                )}

                {/* Right side: next button */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Next button */}
                    <button
                        onClick={handleNext}
                        disabled={isSaving}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "12px 24px",
                            background: "#10B981",
                            border: "none",
                            borderRadius: 12,
                            color: palette.bg,
                            fontWeight: 700,
                            fontSize: 14,
                            cursor: isSaving ? "not-allowed" : "pointer",
                            opacity: isSaving ? 0.6 : 1,
                            boxShadow: "0 0 15px rgba(16,185,129,0.25)",
                            transition: "opacity 0.15s, transform 0.1s",
                        }}
                        onMouseEnter={(e) => {
                            if (!isSaving) {
                                (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isSaving) {
                                (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                            }
                        }}
                        onMouseDown={(e) => {
                            if (!isSaving) {
                                (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
                            }
                        }}
                        onMouseUp={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                        }}
                    >
                        {isSaving ? (
                            <>
                                <Loader2
                                    style={{
                                        width: 16,
                                        height: 16,
                                        animation: "spin 1s linear infinite",
                                    }}
                                />
                                Saving...
                            </>
                        ) : (
                            <>
                                Next
                                <ArrowRight style={{ width: 16, height: 16 }} />
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
