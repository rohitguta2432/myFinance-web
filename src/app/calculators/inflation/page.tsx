import type { Metadata } from "next";
import { InflationCalculatorClient } from "./_client";

export const metadata: Metadata = {
    title: "Inflation Calculator — Future Cost of Living Calculator India | MyFinancial",
    description:
        "Calculate the future cost of your expenses after inflation. See how ₹1 Lakh today becomes X Lakhs in 10, 20, 30 years at 6% inflation.",
    openGraph: {
        title: "Inflation Calculator — Future Cost of Living Calculator India | MyFinancial",
        description:
            "Calculate the future cost of your expenses after inflation. See how ₹1 Lakh today becomes X Lakhs in 10, 20, 30 years at 6% inflation.",
        type: "website",
    },
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What is inflation and how does it affect my money?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Inflation is the rate at which the general price level of goods and services rises over time. As inflation rises, each unit of currency buys fewer goods. For example, at 6% annual inflation, something that costs ₹1 Lakh today will cost ₹1.79 Lakhs in 10 years — the same product, but nearly double the price.",
            },
        },
        {
            "@type": "Question",
            name: "What is the average inflation rate in India?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "India's Consumer Price Index (CPI) inflation has averaged around 5-7% per year over the past decade. The RBI targets an inflation rate of 4% with a +/- 2% band. Food inflation tends to be higher (7-10%), while healthcare and education inflation can be 8-12% per year.",
            },
        },
        {
            "@type": "Question",
            name: "How can I beat inflation with investments?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "To beat inflation, your investments must grow faster than the inflation rate. Equity mutual funds have historically delivered 12-15% CAGR, well above India's 6% average inflation, giving a real return of 6-9%. Diversified equity portfolios, index funds, and real estate are common inflation-beating instruments. Fixed deposits and savings accounts often fail to beat inflation after taxes.",
            },
        },
    ],
};

export default function InflationPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <InflationCalculatorClient />
        </>
    );
}
