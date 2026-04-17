import type { Metadata } from "next";
import { HowItWorksContent } from "./how-it-works-content";

export const metadata: Metadata = {
    title: "How It Works | MyFinancial",
    description: "From zero to financial clarity in 10 minutes. Learn how MyFinancial works.",
};

export default function HowItWorksPage() {
    return <HowItWorksContent />;
}
