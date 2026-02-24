"use client";

import { useState, useEffect } from "react";

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
            className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-border px-4 py-3 safe-area-bottom"
            role="complementary"
            aria-label="Start assessment"
        >
            <a
                href="#"
                className="flex items-center justify-center w-full py-3.5 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors text-body"
            >
                Start Free Assessment →
            </a>
        </div>
    );
}
