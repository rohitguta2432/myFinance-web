import type { Metadata } from "next";
import { FdCalculatorClient } from "./_client";

export const metadata: Metadata = {
    title: "FD Calculator — Fixed Deposit Maturity Calculator | MyFinancial",
    description:
        "Calculate fixed deposit maturity amount with quarterly, half-yearly, and annual compounding. Compare FD returns across tenures.",
    openGraph: {
        title: "FD Calculator — Fixed Deposit Maturity Calculator | MyFinancial",
        description:
            "Calculate fixed deposit maturity amount with compounding options. Free FD calculator for Indian investors.",
        type: "website",
    },
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What is a Fixed Deposit (FD)?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "A Fixed Deposit (FD) is a financial instrument offered by banks where you deposit a sum of money for a fixed tenure at a predetermined interest rate. FDs offer guaranteed returns and are considered low-risk investments.",
            },
        },
        {
            "@type": "Question",
            name: "How is FD interest calculated?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "FD maturity value = P × (1 + r/n)^(n×t), where P is the principal, r is the annual interest rate, n is the compounding frequency per year (4 for quarterly, 2 for half-yearly, 1 for annually), and t is the tenure in years.",
            },
        },
        {
            "@type": "Question",
            name: "Is FD interest taxable in India?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, FD interest is taxable in India. Banks deduct TDS at 10% if interest exceeds ₹40,000 per year (₹50,000 for senior citizens). The total interest is added to your income and taxed at your applicable slab rate.",
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
            <FdCalculatorClient />
        </>
    );
}
