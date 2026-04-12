import type { Metadata } from "next";
import { NpsCalculatorClient } from "./_client";

export const metadata: Metadata = {
    title: "NPS Calculator — National Pension Scheme Retirement Corpus | MyFinancial",
    description:
        "Calculate your NPS corpus and estimated monthly pension at retirement. National Pension System calculator for Tier I accounts.",
    openGraph: {
        title: "NPS Calculator — National Pension Scheme Retirement Corpus | MyFinancial",
        description:
            "Calculate your NPS corpus and estimated monthly pension at retirement. National Pension System calculator for Tier I accounts.",
        type: "website",
    },
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What is NPS (National Pension System)?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "NPS (National Pension System) is a government-sponsored voluntary retirement savings scheme. It allows you to build a corpus through regular contributions that grow at market-linked returns. At retirement (age 60), 60% can be withdrawn tax-free and 40% is used to purchase an annuity for monthly pension.",
            },
        },
        {
            "@type": "Question",
            name: "What are the differences between NPS and PPF?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "NPS offers higher potential returns (8-12% p.a.) with market-linked investments versus PPF's fixed 7.1% p.a. NPS requires 40% annuity purchase at retirement (PPF allows full withdrawal). NPS has a lock-in until age 60, while PPF is 15 years. Both offer Section 80C tax benefits, but NPS also offers an additional ₹50,000 deduction under 80CCD(1B).",
            },
        },
        {
            "@type": "Question",
            name: "What are the tax benefits of NPS under Section 80CCD?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "NPS contributions get tax benefits under two sections: Section 80CCD(1) — up to ₹1.5 Lakh per year as part of the overall 80C limit; Section 80CCD(1B) — an additional ₹50,000 per year deduction over and above 80C. This means total NPS-linked deductions can be up to ₹2 Lakh per year.",
            },
        },
    ],
};

export default function NpsPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <NpsCalculatorClient />
        </>
    );
}
