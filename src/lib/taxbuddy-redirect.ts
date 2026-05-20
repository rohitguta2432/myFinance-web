/**
 * TaxBuddy redirect helpers.
 *
 * MyFinancial's published Privacy Policy says zero PII leaves the device.
 * The TaxBuddy redirect therefore operates in **plain-redirect mode only**:
 * we link out, we never pass any user data via URL params, headers, or
 * server-side handoff. The audit log captures only anonymous click events
 * (no IP, no user identity, no data fields) so we can prove the disclosure
 * was shown without violating the privacy stance.
 *
 * Related docs:
 *  - docs/compliance/taxbuddy-redirect/01-disclosure-interstitial-and-consent.md
 *  - docs/compliance/taxbuddy-redirect/05-audit-trail-schema.md
 */

export const TAXBUDDY_NOTICE_VERSION = "2026-05-20.v1";

export const TAXBUDDY_REDIRECT_URL =
    process.env.NEXT_PUBLIC_TAXBUDDY_REDIRECT_URL || "https://www.taxbuddy.com/?ref=myfinancial";

export type TaxBuddyEventType =
    | "interstitial_shown"
    | "redirect_proceeded"
    | "redirect_cancelled";

const ANON_TOKEN_KEY = "mf_anon_session_token";

/**
 * A random opaque token stored in localStorage. It is not linked to any
 * user identity — its sole purpose is to deduplicate the same browser
 * showing the interstitial twice within a session in the audit log.
 * It is cleared when the user clears site data.
 */
export function getOrCreateAnonSessionToken(): string {
    if (typeof window === "undefined") return "ssr";
    try {
        const existing = window.localStorage.getItem(ANON_TOKEN_KEY);
        if (existing) return existing;
        const token =
            typeof crypto !== "undefined" && "randomUUID" in crypto
                ? crypto.randomUUID()
                : Math.random().toString(36).slice(2) + Date.now().toString(36);
        window.localStorage.setItem(ANON_TOKEN_KEY, token);
        return token;
    } catch {
        // localStorage might be blocked (private mode, quota); fall back to ephemeral.
        return "ephemeral-" + Math.random().toString(36).slice(2);
    }
}

export interface TaxBuddyEventPayload {
    eventType: TaxBuddyEventType;
    sourceCTA: string;
    noticeVersion?: string;
    userLocale?: string;
    clientOccurredAt?: string;
}

/**
 * Fire-and-forget event log to /api/taxbuddy/redirect-event.
 * Never throws — a logging failure must not block the user.
 */
export async function logTaxBuddyEvent(payload: TaxBuddyEventPayload): Promise<void> {
    try {
        const body = {
            anonSessionToken: getOrCreateAnonSessionToken(),
            eventType: payload.eventType,
            sourceCTA: payload.sourceCTA,
            noticeVersion: payload.noticeVersion ?? TAXBUDDY_NOTICE_VERSION,
            userLocale:
                payload.userLocale ??
                (typeof navigator !== "undefined" ? navigator.language : "unknown"),
            clientOccurredAt: payload.clientOccurredAt ?? new Date().toISOString(),
        };
        await fetch("/api/taxbuddy/redirect-event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            keepalive: true,
        });
    } catch {
        // Intentional — never block redirect on log failure.
    }
}
