import type { Metadata } from "next";
import { EmbedLandingClient } from "./_landing-client";

export const metadata: Metadata = {
    title: "Free Embeddable Calculators for Indian Finance Blogs | MyFinancial",
    description:
        "Free, mobile-responsive financial calculators you can embed on any Indian finance blog. SIP, EMI, FD and more. Drop in 30 seconds.",
};

export default function Page() {
    return <EmbedLandingClient />;
}
