import type { Metadata } from "next";
import { HraCalculatorClient } from "./_client";

export const metadata: Metadata = {
    title: "HRA Calculator — House Rent Allowance Tax Exemption | MyFinancial",
    description:
        "Calculate your HRA tax exemption instantly. Free HRA calculator for salaried employees under old tax regime.",
    openGraph: {
        title: "HRA Calculator — House Rent Allowance Tax Exemption | MyFinancial",
        description:
            "Calculate your HRA tax exemption instantly. Free HRA calculator for salaried employees under old tax regime.",
        type: "website",
    },
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What is HRA exemption?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "HRA exemption is the minimum of: actual HRA received, rent paid minus 10% of basic salary, and 50% of basic salary for metro cities (40% for non-metro).",
            },
        },
        {
            "@type": "Question",
            name: "Is HRA exemption available under new tax regime?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "No. HRA exemption is only available under the old tax regime.",
            },
        },
        {
            "@type": "Question",
            name: "What are metro cities for HRA?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Mumbai, Delhi, Kolkata, and Chennai are classified as metro cities. All other cities are non-metro.",
            },
        },
    ],
};

export default function HraPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <HraCalculatorClient />
        </>
    );
}
