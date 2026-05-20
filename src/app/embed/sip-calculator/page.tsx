import type { Metadata } from "next";
import { EmbedSipCalculator } from "./_client";

export const metadata: Metadata = {
    title: "SIP Calculator — Free Embed | MyFinancial",
    description:
        "Free embeddable SIP calculator for Indian mutual funds. Drop into any blog or fintech site.",
    robots: {
        // Embed pages should not show up directly in search — the canonical
        // calculator lives at /calculators/sip. We index that page instead.
        index: false,
        follow: false,
    },
};

export default function Page() {
    return <EmbedSipCalculator />;
}
