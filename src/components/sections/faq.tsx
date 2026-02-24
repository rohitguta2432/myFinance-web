"use client";

import { useState, useId } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const faqs = [
    {
        question: "Is MyFinancial really free?",
        answer:
            "Yes, the basic assessment is completely free. We monetize through optional premium features and expert consultations, never by selling your data. Our goal is to provide transparency first.",
    },
    {
        question: "How is my data kept private?",
        answer:
            "All calculations happen directly in your browser using JavaScript. Your financial data is stored in your browser's local storage and never transmitted to any server. We can't see your data even if we wanted to.",
    },
    {
        question: "Do I need to sign up?",
        answer:
            "No. You can use the free assessment without creating an account. No email, no phone number, no personal details required. Just open the tool and start entering your financial numbers.",
    },
    {
        question: "Can I export my report?",
        answer:
            "Yes. Free users can export as JSON. Premium users get beautifully formatted PDF reports with detailed breakdowns and actionable recommendations.",
    },
    {
        question: "How accurate are the projections?",
        answer:
            "Our calculations use the latest Indian tax slabs, standard deduction rules, and actuarial tables. While projections involve assumptions about future returns and inflation, we use conservative, well-researched defaults that you can customize.",
    },
    {
        question: "What assumptions are used?",
        answer:
            "We use 6% inflation, 8% equity returns, 7% debt returns as defaults. All assumptions are clearly displayed and can be customized. We believe in transparency over black-box calculations.",
    },
    {
        question: "Is this regulated advice?",
        answer:
            "No. MyFinancial provides educational financial analysis and projections. It is not registered investment advice. For personalized financial planning, we recommend consulting a SEBI-registered advisor.",
    },
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="section-padding bg-white" id="faq">
            <div className="container-marketing">
                {/* Header */}
                <div className="text-center mb-14">
                    <p className="text-overline text-accent mb-3">FAQ</p>
                    <h2 className="text-h2 text-foreground">
                        Common questions, honest answers
                    </h2>
                </div>

                {/* FAQ List */}
                <div className="max-w-[680px] mx-auto" role="list">
                    {faqs.map((faq, i) => (
                        <FAQItem
                            key={i}
                            faq={faq}
                            isOpen={openIndex === i}
                            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FAQItem({
    faq,
    isOpen,
    onToggle,
}: {
    faq: { question: string; answer: string };
    isOpen: boolean;
    onToggle: () => void;
}) {
    const id = useId();
    const triggerId = `faq-trigger-${id}`;
    const panelId = `faq-panel-${id}`;

    return (
        <div className="border-b border-gray-100 last:border-b-0" role="listitem">
            <h3>
                <button
                    id={triggerId}
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full flex items-center justify-between py-5 text-left group"
                >
                    <span className="text-sm font-semibold text-foreground pr-6 group-hover:text-accent transition-colors">
                        {faq.question}
                    </span>
                    {/* Stitch: open = green down-chevron, closed = green right-arrow */}
                    {isOpen ? (
                        <ChevronDown
                            size={16}
                            aria-hidden="true"
                            className="flex-shrink-0 text-accent"
                        />
                    ) : (
                        <ChevronRight
                            size={16}
                            aria-hidden="true"
                            className="flex-shrink-0 text-accent"
                        />
                    )}
                </button>
            </h3>
            <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[500px] pb-5" : "max-h-0"
                    }`}
                hidden={!isOpen}
            >
                <p className="text-sm text-gray-500 leading-relaxed pr-10">
                    {faq.answer}
                </p>
            </div>
        </div>
    );
}
