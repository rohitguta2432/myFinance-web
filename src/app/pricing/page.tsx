import type { Metadata } from "next";
import { PricingContent } from "./pricing-content";

export const metadata: Metadata = {
    title: "Pricing",
    description:
        "Simple, transparent pricing for MyFinancial — an educational diagnostic platform. Start free, upgrade when ready. Not investment advice.",
    alternates: { canonical: "/pricing" },
    openGraph: {
        title: "Pricing | MyFinancial",
        description: "Educational diagnostic platform. Start free, upgrade when ready.",
        url: "https://myfinancial.in/pricing",
        type: "website",
    },
};

export default function PricingPage() {
    return <PricingContent />;
}
