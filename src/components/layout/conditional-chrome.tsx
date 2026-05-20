"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileStickyCTA } from "@/components/layout/mobile-sticky-cta";

const APP_ROUTES = ["/assessment", "/dashboard", "/admin"];
const EMBED_ROUTES = ["/embed"];

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAppRoute = APP_ROUTES.some((r) => pathname.startsWith(r));
    const isEmbedRoute = EMBED_ROUTES.some((r) => pathname.startsWith(r));

    // Embed routes render bare — no navbar, no footer, no sticky CTA.
    // Partner sites iframe these pages, so we strip all chrome.
    if (isEmbedRoute) {
        return <main id="main-content">{children}</main>;
    }

    return (
        <>
            <Navbar />
            <main id="main-content">{children}</main>
            {!isAppRoute && <Footer />}
            {!isAppRoute && <MobileStickyCTA />}
        </>
    );
}
