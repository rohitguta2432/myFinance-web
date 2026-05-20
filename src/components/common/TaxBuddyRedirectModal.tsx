"use client";

/**
 * TaxBuddy redirect interstitial.
 *
 * Renders a modal before any outbound click to TaxBuddy. The component is
 * **plain-redirect only** — it does not collect or transmit any user data.
 * The disclosure satisfies:
 *  - ASCI material-connection guidance (referral fee disclosure)
 *  - Consumer Protection (E-Commerce) Rules 2020 (third-party identification)
 *  - IT Act §79 intermediary safe-harbour (no modification of third-party content)
 *
 * Wire into any TaxBuddy CTA by importing this component and managing its
 * `open` state from the parent. The modal handles the redirect itself —
 * the parent does not navigate.
 *
 * Related: docs/compliance/taxbuddy-redirect/01-disclosure-interstitial-and-consent.md
 */

import { useCallback, useEffect, useRef } from "react";
import { ExternalLink, X } from "lucide-react";
import Link from "next/link";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
    TAXBUDDY_REDIRECT_URL,
    TAXBUDDY_NOTICE_VERSION,
    logTaxBuddyEvent,
} from "@/lib/taxbuddy-redirect";

export interface TaxBuddyRedirectModalProps {
    open: boolean;
    onClose: () => void;
    /**
     * Identifier of the CTA that triggered the modal — used in the audit log
     * so we can tell which placement drives click-through. Examples:
     *  - "dashboard-itr-card"
     *  - "tax-page-cta"
     *  - "fy-end-banner"
     */
    sourceCTA: string;
    /** Override the destination URL (defaults to env-configured value). */
    redirectUrl?: string;
}

export function TaxBuddyRedirectModal({
    open,
    onClose,
    sourceCTA,
    redirectUrl,
}: TaxBuddyRedirectModalProps) {
    const palette = useAppTheme();
    const cancelButtonRef = useRef<HTMLButtonElement | null>(null);
    const continueButtonRef = useRef<HTMLAnchorElement | null>(null);

    const handleClose = useCallback(() => {
        void logTaxBuddyEvent({ eventType: "redirect_cancelled", sourceCTA });
        onClose();
    }, [onClose, sourceCTA]);

    const handleProceed = useCallback(() => {
        void logTaxBuddyEvent({ eventType: "redirect_proceeded", sourceCTA });
        // Allow the natural anchor navigation to proceed — don't prevent default.
        // We close the modal optimistically so it doesn't flash on return navigation.
        onClose();
    }, [onClose, sourceCTA]);

    // Log impression once per open.
    useEffect(() => {
        if (open) {
            void logTaxBuddyEvent({ eventType: "interstitial_shown", sourceCTA });
        }
    }, [open, sourceCTA]);

    // Focus management + Esc handler.
    useEffect(() => {
        if (!open) return;
        const previouslyFocused = document.activeElement as HTMLElement | null;
        continueButtonRef.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                handleClose();
            }
        };
        document.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
            previouslyFocused?.focus?.();
        };
    }, [open, handleClose]);

    if (!open) return null;

    const target = redirectUrl ?? TAXBUDDY_REDIRECT_URL;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="taxbuddy-redirect-title"
            aria-describedby="taxbuddy-redirect-body"
            onClick={(e) => {
                // Click on backdrop closes; click inside content does not.
                if (e.target === e.currentTarget) handleClose();
            }}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
                backgroundColor: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(4px)",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 480,
                    backgroundColor: palette.s1,
                    border: `1px solid ${palette.brd2}`,
                    borderRadius: 16,
                    padding: 28,
                    boxShadow: "0 12px 36px rgba(0,0,0,0.45)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 18,
                    }}
                >
                    <div>
                        <p
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: palette.accent,
                                letterSpacing: 0.5,
                                marginBottom: 6,
                                textTransform: "uppercase",
                            }}
                        >
                            Leaving MyFinancial
                        </p>
                        <h2
                            id="taxbuddy-redirect-title"
                            style={{
                                fontSize: 20,
                                fontWeight: 600,
                                color: palette.txt,
                                lineHeight: 1.3,
                                margin: 0,
                            }}
                        >
                            You&apos;re being redirected to TaxBuddy
                        </h2>
                    </div>
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={handleClose}
                        ref={cancelButtonRef}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: palette.mute,
                            cursor: "pointer",
                            padding: 4,
                            marginTop: -4,
                            marginRight: -4,
                            borderRadius: 6,
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div
                    id="taxbuddy-redirect-body"
                    style={{
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: palette.txt2,
                    }}
                >
                    <p style={{ marginBottom: 14 }}>
                        TaxBuddy is an <strong>independent third-party service</strong> operated by
                        Finbingo Wealth Tech Pvt Ltd. They handle the filing, their Chartered
                        Accountants sign your return, and their fees, refunds, and customer support
                        are governed entirely by TaxBuddy&apos;s own terms.
                    </p>
                    <p style={{ marginBottom: 14 }}>
                        <strong>MyFinancial does not share any of your data with TaxBuddy.</strong>
                        {" "}
                        You will enter your details directly on their site. Per our{" "}
                        <Link
                            href="/privacy"
                            style={{ color: palette.accent, textDecoration: "underline" }}
                        >
                            Privacy Policy
                        </Link>
                        , your financial information stays on your device.
                    </p>
                    <p
                        style={{
                            marginBottom: 18,
                            padding: 12,
                            backgroundColor: palette.s2,
                            border: `1px solid ${palette.brd}`,
                            borderRadius: 10,
                            fontSize: 13,
                            color: palette.mute,
                        }}
                    >
                        MyFinancial earns a referral fee when you file through this link. This does
                        not change what you pay TaxBuddy, and does not influence our editorial
                        content.
                    </p>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        marginBottom: 14,
                    }}
                >
                    <a
                        ref={continueButtonRef}
                        href={target}
                        target="_blank"
                        rel="noopener noreferrer external"
                        onClick={handleProceed}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            width: "100%",
                            padding: "12px 16px",
                            backgroundColor: palette.accent,
                            color: "#04110A",
                            fontWeight: 600,
                            fontSize: 15,
                            border: "none",
                            borderRadius: 10,
                            cursor: "pointer",
                            textDecoration: "none",
                        }}
                    >
                        Continue to TaxBuddy
                        <ExternalLink size={16} />
                    </a>
                    <button
                        type="button"
                        onClick={handleClose}
                        style={{
                            width: "100%",
                            padding: "10px 16px",
                            background: "transparent",
                            color: palette.mute,
                            border: `1px solid ${palette.brd2}`,
                            borderRadius: 10,
                            fontSize: 14,
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                </div>

                <p
                    style={{
                        fontSize: 11,
                        color: palette.mute,
                        lineHeight: 1.5,
                        margin: 0,
                    }}
                >
                    By continuing you acknowledge MyFinancial is not responsible for TaxBuddy&apos;s
                    services. See our{" "}
                    <Link
                        href="/disclaimer"
                        style={{ color: palette.mute, textDecoration: "underline" }}
                    >
                        Terms
                    </Link>
                    {" "}for details. Notice {TAXBUDDY_NOTICE_VERSION}.
                </p>
            </div>
        </div>
    );
}

export default TaxBuddyRedirectModal;
