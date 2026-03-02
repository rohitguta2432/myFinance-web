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
        <section className="section-padding" style={{ backgroundColor: "#0B1120" }} id="faq">
            <div className="container-marketing">
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 56 }}>
                    <p className="text-overline" style={{ color: "#10B981", marginBottom: 12 }}>FAQ</p>
                    <h2 className="text-h2" style={{ color: "#F1F5F9" }}>
                        Common questions, honest answers
                    </h2>
                </div>

                {/* FAQ List */}
                <div style={{ maxWidth: 680, marginLeft: "auto", marginRight: "auto" }} role="list">
                    {faqs.map((faq, i) => (
                        <FAQItem
                            key={i}
                            faq={faq}
                            isOpen={openIndex === i}
                            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                            isLast={i === faqs.length - 1}
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
    isLast,
}: {
    faq: { question: string; answer: string };
    isOpen: boolean;
    onToggle: () => void;
    isLast: boolean;
}) {
    const id = useId();
    const triggerId = `faq-trigger-${id}`;
    const panelId = `faq-panel-${id}`;

    return (
        <div style={{ borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.06)" }} role="listitem">
            <h3>
                <button
                    id={triggerId}
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "20px 0",
                        textAlign: "left",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    <span style={{ fontSize: 14, fontWeight: 600, paddingRight: 24, color: "#F1F5F9" }}>
                        {faq.question}
                    </span>
                    {isOpen ? (
                        <ChevronDown size={16} aria-hidden="true" style={{ color: "#10B981", flexShrink: 0 }} />
                    ) : (
                        <ChevronRight size={16} aria-hidden="true" style={{ color: "#10B981", flexShrink: 0 }} />
                    )}
                </button>
            </h3>
            {isOpen && (
                <div id={panelId} role="region" aria-labelledby={triggerId} style={{ paddingBottom: 20 }}>
                    <p style={{ fontSize: 14, lineHeight: 1.7, paddingRight: 40, color: "#94A3B8" }}>
                        {faq.answer}
                    </p>
                </div>
            )}
        </div>
    );
}
