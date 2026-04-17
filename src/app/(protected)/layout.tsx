import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ThemedToaster } from "@/components/providers/ThemedToaster";
import ChatWidget from "@/components/ai/chat-widget";
import type { ReactNode } from "react";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
    const session = await getSession();

    if (!session) {
        redirect("/");
    }

    return (
        <QueryProvider>
            {children}
            <ThemedToaster />
            <ChatWidget />
        </QueryProvider>
    );
}
