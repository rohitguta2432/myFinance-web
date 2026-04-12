import type { Metadata } from "next";
import { EmiCalculatorClient } from "./_client";

export const metadata: Metadata = {
    title: "EMI Calculator — Home Loan, Car Loan, Personal Loan | MyFinancial",
    description:
        "Calculate your monthly loan EMI instantly. Free EMI calculator for home loans, car loans, and personal loans with total interest and amortization breakdown.",
    openGraph: {
        title: "EMI Calculator — Home Loan, Car Loan, Personal Loan | MyFinancial",
        description:
            "Calculate your monthly loan EMI instantly. Free EMI calculator for home loans, car loans, and personal loans.",
        type: "website",
    },
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What is EMI?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "EMI (Equated Monthly Instalment) is the fixed monthly amount you pay to repay a loan. It includes both principal and interest components, calculated so that the loan is fully repaid by the end of the tenure.",
            },
        },
        {
            "@type": "Question",
            name: "How can I reduce my EMI?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "You can reduce your EMI by: 1) Negotiating a lower interest rate, 2) Extending the loan tenure, 3) Making a larger down payment to reduce the principal, or 4) Making prepayments to reduce the outstanding principal.",
            },
        },
        {
            "@type": "Question",
            name: "What is the difference between flat rate and reducing balance rate?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "A flat rate charges interest on the original loan amount throughout the tenure. A reducing balance rate (used by most Indian banks) charges interest only on the outstanding principal, which decreases with each EMI. Reducing balance results in lower effective interest paid.",
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
            <EmiCalculatorClient />
        </>
    );
}
