import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import type { ReactNode } from "react";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
    const session = await getSession();

    if (!session) {
        redirect("/");
    }

    return (
        <QueryProvider>
            {children}
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "#1E293B",
                        color: "#F1F5F9",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 10,
                        fontSize: 14,
                    },
                    success: {
                        iconTheme: { primary: "#10B981", secondary: "#0B0F1A" },
                    },
                    error: {
                        iconTheme: { primary: "#EF4444", secondary: "#0B0F1A" },
                    },
                    duration: 3000,
                }}
            />
        </QueryProvider>
    );
}
