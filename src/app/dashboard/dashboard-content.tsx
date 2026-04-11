"use client";

import { useRouter } from "next/navigation";

interface User {
    id: number;
    email: string;
    name: string;
    pictureUrl: string;
}

export function DashboardContent({ user }: { user: User | null }) {
    const router = useRouter();

    const handleSignOut = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
    };

    const firstName = user?.name?.split(" ")[0] ?? "there";

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
                background: "#0B0F1A",
            }}
        >
            {user?.pictureUrl && (
                <img
                    src={user.pictureUrl}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        marginBottom: 24,
                        border: "3px solid #10B981",
                    }}
                />
            )}
            <h1
                style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(28px, 4vw, 48px)",
                    fontWeight: 800,
                    color: "#F1F5F9",
                    marginBottom: 12,
                }}
            >
                Welcome, {firstName}
            </h1>
            <p
                style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 18,
                    color: "#94A3B8",
                    marginBottom: 36,
                    textAlign: "center",
                }}
            >
                Your financial dashboard is coming soon.
            </p>
            <button
                onClick={handleSignOut}
                style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#94A3B8",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    padding: "10px 24px",
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "all 0.15s",
                }}
            >
                Sign Out
            </button>
        </div>
    );
}
