"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileStickyCTA } from "@/components/layout/mobile-sticky-cta";

const APP_ROUTES = ["/assessment", "/dashboard", "/admin"];

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAppRoute = APP_ROUTES.some((r) => pathname.startsWith(r));

    return (
        <>
            <Navbar />
            <main id="main-content">{children}</main>
            {!isAppRoute && <Footer />}
            {!isAppRoute && <MobileStickyCTA />}
        </>
    );
}
