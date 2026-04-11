"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface GoogleSignInButtonProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export function GoogleSignInButton({ children, className, style }: GoogleSignInButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const login = useGoogleLogin({
        flow: "auth-code",
        ux_mode: "popup",
        onSuccess: async (codeResponse) => {
            console.log("[GoogleSignIn] onSuccess, code:", codeResponse.code?.substring(0, 20) + "...");
            setLoading(true);
            try {
                const res = await fetch("/api/auth/google", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code: codeResponse.code }),
                });
                const data = await res.json();
                console.log("[GoogleSignIn] API response:", res.status, data);
                if (res.ok) {
                    router.push("/dashboard");
                }
            } finally {
                setLoading(false);
            }
        },
        onError: (error) => {
            console.error("[GoogleSignIn] onError:", error);
            setLoading(false);
        },
    });

    const handleClick = useCallback(async () => {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
            const data = await res.json();
            if (data.user) {
                router.push("/dashboard");
                return;
            }
        }
        login();
    }, [login, router]);

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={className}
            style={{ ...style, cursor: loading ? "wait" : "pointer" }}
        >
            {children}
        </button>
    );
}
