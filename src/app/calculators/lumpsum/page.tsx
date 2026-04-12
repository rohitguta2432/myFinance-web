import type { Metadata } from "next";
import { LumpsumCalculatorClient } from "./_client";

export const metadata: Metadata = {
    title: "Lumpsum Calculator — One-Time Investment Returns | MyFinancial",
    description:
        "Calculate the future value of your one-time lumpsum investment. Compare lumpsum vs SIP returns and find the best strategy for your financial goals.",
    openGraph: {
        title: "Lumpsum Calculator — One-Time Investment Returns | MyFinancial",
        description:
            "Calculate the future value of your one-time lumpsum investment. Free investment calculator for Indian investors.",
        type: "website",
    },
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What is a lumpsum investment?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "A lumpsum investment is a one-time investment of a fixed amount, as opposed to SIP where you invest regularly. Lumpsum investments benefit from compounding over the entire tenure.",
            },
        },
        {
            "@type": "Question",
            name: "How is lumpsum return calculated?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Lumpsum future value = P × (1 + r)^n, where P is the principal amount, r is the annual rate of return, and n is the number of years.",
            },
        },
        {
            "@type": "Question",
            name: "When is lumpsum better than SIP?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Lumpsum investing is typically better when markets are at a low point, as you deploy all capital at an attractive valuation. SIP is better for salaried individuals who receive regular income, as it averages out market volatility through rupee cost averaging.",
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
            <LumpsumCalculatorClient />
        </>
    );
}
