import type { Metadata } from "next";
import { PricingContent } from "./pricing-content";

export const metadata: Metadata = {
    title: "Pricing | MyFinancial",
    description: "Simple, transparent pricing for MyFinancial. Start free, upgrade when ready.",
};

export default function PricingPage() {
    return <PricingContent />;
}
