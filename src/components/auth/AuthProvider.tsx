"use client";

import { useEffect, useRef } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import {
    readUserIdFromCookie,
    wipeAllAssessmentStorage,
    LAST_USER_KEY,
} from "@/lib/assessment-storage-cleanup";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const checkedRef = useRef(false);

    // Detect user-switch on a shared browser. If the cookie's userId differs
    // from the last-seen userId in localStorage, wipe all assessment-storage*
    // keys and force a full page reload so Zustand re-initializes the persist
    // store under the correct per-user key. This prevents the previous user's
    // wizard state from leaking into the new user's session.
    useEffect(() => {
        if (checkedRef.current) return;
        checkedRef.current = true;
        if (typeof window === "undefined") return;

        const cookieUserId = readUserIdFromCookie();
        if (!cookieUserId) return; // anonymous — nothing to compare

        const lastUserId = window.localStorage.getItem(LAST_USER_KEY);

        if (lastUserId === null) {
            // First login (or fresh login post-logout). Record the user; no wipe needed.
            window.localStorage.setItem(LAST_USER_KEY, cookieUserId);
            return;
        }

        if (lastUserId === cookieUserId) {
            // Same user — normal page load, no action.
            return;
        }

        // Mismatch: a different user is now logged in on this browser.
        // Wipe ALL assessment-storage* keys, record the new owner, and reload.
        wipeAllAssessmentStorage();
        window.localStorage.setItem(LAST_USER_KEY, cookieUserId);
        window.location.assign(window.location.pathname + window.location.search);
    }, []);

    if (!clientId) {
        console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set");
        return <>{children}</>;
    }

    return (
        <GoogleOAuthProvider clientId={clientId}>
            {children}
        </GoogleOAuthProvider>
    );
}
