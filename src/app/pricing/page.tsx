import type { Metadata } from "next";
import { PricingContent } from "./pricing-content";

export const metadata: Metadata = {
    title: "Pricing",
    description:
        "Simple, transparent pricing for MyFinancial. Start free, upgrade when ready. Privacy-first personal finance for Indians.",
    alternates: { canonical: "/pricing" },
    openGraph: {
        title: "Pricing | MyFinancial",
        description: "Simple, transparent pricing. Start free, upgrade when ready.",
        url: "https://myfinancial.in/pricing",
        type: "website",
    },
};

export default function PricingPage() {
    return <PricingContent />;
}
