"use client";

import { Toaster } from "react-hot-toast";
import { useAppTheme } from "@/hooks/useAppTheme";

export function ThemedToaster() {
    const palette = useAppTheme();
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                style: {
                    background: palette.s2,
                    color: palette.txt,
                    border: `1px solid ${palette.brd2}`,
                    borderRadius: 10,
                    fontSize: 14,
                },
                success: {
                    iconTheme: { primary: "#10B981", secondary: "#FFFFFF" },
                },
                error: {
                    iconTheme: { primary: palette.danger, secondary: "#FFFFFF" },
                },
                duration: 3000,
            }}
        />
    );
}
