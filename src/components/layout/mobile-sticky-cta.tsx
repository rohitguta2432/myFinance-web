"use client";

import { useState, useEffect } from "react";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

export function MobileStickyCTA() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 600);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!visible) return null;

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[rgba(8,14,18,0.95)] backdrop-blur-md border-t border-brd px-4 py-3 safe-area-bottom"
            role="complementary"
            aria-label="Get started"
        >
            <GoogleSignInButton className="btn-teal w-full justify-center text-sm py-3.5">
                Get My Financial Analysis →
            </GoogleSignInButton>
        </div>
    );
}
