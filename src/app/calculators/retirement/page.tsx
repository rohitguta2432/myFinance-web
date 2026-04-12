import type { Metadata } from "next";
import { RetirementCalculatorClient } from "./_client";

export const metadata: Metadata = {
    title: "Retirement Calculator — How Much Do You Need to Retire? | MyFinancial",
    description:
        "Calculate the retirement corpus you need based on your monthly expenses, age, and inflation. Free retirement planning calculator for Indians.",
    openGraph: {
        title: "Retirement Calculator — How Much Do You Need to Retire? | MyFinancial",
        description:
            "Calculate the retirement corpus you need based on your monthly expenses, age, and inflation. Free retirement planning calculator for Indians.",
        type: "website",
    },
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What is the 4% rule for retirement?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "The 4% rule states that you can safely withdraw 4% of your retirement corpus each year without running out of money for 30+ years. So if your annual expenses are ₹6 Lakhs, you need a corpus of ₹1.5 Crore (₹6L ÷ 4%). This assumes a balanced portfolio generating ~6-7% annual returns.",
            },
        },
        {
            "@type": "Question",
            name: "How much corpus do I need to retire in India?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "A common Indian retirement rule of thumb is to build a corpus of 25x your annual expenses (equivalent to the 4% withdrawal rule). For example, if you spend ₹50,000/month today and have 20 years to retire (at 6% inflation), your future monthly expenses will be ~₹1.6 Lakhs. That means you need a corpus of roughly ₹5 Crore.",
            },
        },
        {
            "@type": "Question",
            name: "How does inflation affect retirement planning?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Inflation silently erodes purchasing power. At 6% inflation, ₹50,000/month today becomes ₹1.6 Lakhs/month in 20 years. This means your required retirement corpus nearly triples compared to what you would calculate at today's expenses. Always factor in an inflation rate of 5-7% when planning for retirement in India.",
            },
        },
    ],
};

export default function RetirementPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <RetirementCalculatorClient />
        </>
    );
}
