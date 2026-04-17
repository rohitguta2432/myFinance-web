import type { Metadata } from "next";
import { CalculatorsContent } from "./calculators-content";

export const metadata: Metadata = {
    title: "Free Financial Calculators — SIP, EMI, PPF, FD, HRA & More",
    description:
        "Use MyFinancial's free online calculators for SIP returns, loan EMI, PPF maturity, FD interest, HRA exemption, NPS corpus, retirement planning and more.",
    openGraph: {
        type: "website",
        title: "Free Financial Calculators — SIP, EMI, PPF, FD, HRA & More",
        description:
            "Use MyFinancial's free online calculators for SIP returns, loan EMI, PPF maturity, FD interest, HRA exemption, NPS corpus, retirement planning and more.",
    },
};

export default function CalculatorsPage() {
    return <CalculatorsContent />;
}
