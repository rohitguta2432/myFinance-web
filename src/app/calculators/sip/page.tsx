import type { Metadata } from "next";
import { SipCalculatorClient } from "./_client";

export const metadata: Metadata = {
    title: "SIP Calculator — Monthly Investment Returns | MyFinancial",
    description:
        "Calculate the future value of your monthly SIP investments. Free SIP calculator for Indian mutual funds with step-up and inflation-adjusted returns.",
    openGraph: {
        title: "SIP Calculator — Monthly Investment Returns | MyFinancial",
        description:
            "Calculate the future value of your monthly SIP investments. Free SIP calculator for Indian mutual funds.",
        type: "website",
    },
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What is SIP?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "SIP (Systematic Investment Plan) is a method of investing a fixed amount in mutual funds at regular intervals.",
            },
        },
        {
            "@type": "Question",
            name: "How is SIP return calculated?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "SIP future value = M × [((1+r)^n - 1) / r] × (1+r), where M is monthly investment, r is monthly return rate, n is number of months.",
            },
        },
        {
            "@type": "Question",
            name: "Is SIP better than lumpsum?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "SIP reduces timing risk through rupee cost averaging. Lumpsum is better when markets are low. Most retail investors benefit from SIP.",
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
            <SipCalculatorClient />
        </>
    );
}
