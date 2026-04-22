import type { Metadata } from "next";
import { HowItWorksContent } from "./how-it-works-content";

export const metadata: Metadata = {
    title: "How It Works",
    description:
        "From zero to financial clarity in 10 minutes. Learn how MyFinancial's privacy-first assessment delivers a full financial picture without sharing personal data.",
    alternates: { canonical: "/how-it-works" },
    openGraph: {
        title: "How It Works | MyFinancial",
        description: "From zero to financial clarity in 10 minutes.",
        url: "https://myfinancial.in/how-it-works",
        type: "website",
    },
};

export default function HowItWorksPage() {
    return <HowItWorksContent />;
}
