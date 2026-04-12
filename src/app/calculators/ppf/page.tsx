import type { Metadata } from "next";
import { PpfCalculatorClient } from "./_client";

export const metadata: Metadata = {
    title: "PPF Calculator — Public Provident Fund Maturity Calculator | MyFinancial",
    description:
        "Calculate PPF maturity value after 15 years. PPF interest rate 7.1% p.a. compounded annually. Free PPF calculator for Indian investors.",
    openGraph: {
        title: "PPF Calculator — Public Provident Fund Maturity Calculator | MyFinancial",
        description:
            "Calculate PPF maturity value with 7.1% p.a. interest. Free PPF calculator for Indian investors.",
        type: "website",
    },
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What is PPF?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "PPF (Public Provident Fund) is a long-term savings scheme backed by the Government of India. It offers a guaranteed interest rate (currently 7.1% p.a.) and has a lock-in period of 15 years. It's one of the safest investment options available to Indian residents.",
            },
        },
        {
            "@type": "Question",
            name: "Can you withdraw PPF early?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "PPF has a mandatory 15-year lock-in period. However, partial withdrawals are allowed from the 7th year onwards (up to 50% of the balance at the end of the 4th year). Premature closure is only permitted after 5 years in specific cases like life-threatening illness.",
            },
        },
        {
            "@type": "Question",
            name: "Is PPF tax-free?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, PPF enjoys EEE (Exempt-Exempt-Exempt) tax status. Contributions up to ₹1.5 lakh per year are deductible under Section 80C. The interest earned is tax-free, and the maturity amount is completely exempt from tax — making PPF one of the most tax-efficient instruments in India.",
            },
        },
    ],
};

export default function Page() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <PpfCalculatorClient />
        </>
    );
}
