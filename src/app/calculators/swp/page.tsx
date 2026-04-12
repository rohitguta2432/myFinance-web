import type { Metadata } from "next";
import { SwpCalculatorClient } from "./_client";

export const metadata: Metadata = {
    title: "SWP Calculator — Systematic Withdrawal Plan Sustainability | MyFinancial",
    description:
        "Calculate how long your mutual fund corpus will last with monthly withdrawals. Free SWP calculator to plan your retirement income.",
    openGraph: {
        title: "SWP Calculator — Systematic Withdrawal Plan Sustainability | MyFinancial",
        description:
            "Calculate how long your mutual fund corpus will last with monthly withdrawals. Free SWP calculator to plan your retirement income.",
        type: "website",
    },
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What is SWP (Systematic Withdrawal Plan)?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "SWP (Systematic Withdrawal Plan) is a facility in mutual funds that lets you withdraw a fixed amount at regular intervals (monthly, quarterly) from your corpus. Unlike FD interest, SWP withdrawals come from both capital gains and principal, letting your remaining corpus continue to grow at market-linked returns.",
            },
        },
        {
            "@type": "Question",
            name: "Is SWP better than FD for retirement income?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "SWP from equity or hybrid mutual funds can provide higher returns (8-12% p.a.) compared to FD rates (6-7% p.a.), potentially making your corpus last longer. However, SWP returns are market-linked and variable, while FD returns are fixed. For retirement, a combination of SWP (growth) and FD (stability) is often recommended.",
            },
        },
        {
            "@type": "Question",
            name: "How is tax calculated on SWP withdrawals?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "SWP withdrawals are taxed based on capital gains rules. For equity mutual funds held over 1 year: Long Term Capital Gains (LTCG) above ₹1.25 Lakh are taxed at 12.5%. Short-term gains (under 1 year) are taxed at 20%. Debt fund gains are added to income and taxed at your slab rate. Each SWP withdrawal is treated as a separate redemption for tax purposes.",
            },
        },
    ],
};

export default function SwpPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <SwpCalculatorClient />
        </>
    );
}
