import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
    title: "Disclaimer",
    description:
        "MyFinancial Disclaimer — this tool is for informational purposes only and does not constitute financial advice. Consult a SEBI-registered advisor.",
};

const sections = [
    {
        title: "Not Financial Advice",
        content:
            "MyFinancial is an informational and educational tool designed to help you understand your financial position. It does not constitute financial, investment, tax, or legal advice. The outputs are based solely on the numbers you provide and general calculation models.",
    },
    {
        title: "No Professional Relationship",
        content:
            "Use of MyFinancial does not create a financial advisor-client relationship. We are not SEBI-registered investment advisors, AMFI-certified mutual fund distributors, or licensed insurance intermediaries.",
    },
    {
        title: "Accuracy & Limitations",
        content:
            "While we strive for accuracy, the calculations are based on publicly available tax slabs, standard formulas, and assumptions. Actual tax liability, insurance requirements, and investment returns may differ based on your specific circumstances.",
    },
    {
        title: "Tax Information",
        content:
            "Tax calculations are based on FY 2026-27 slabs from the Union Budget. Tax laws change frequently. The tool's outputs should not be used as the sole basis for tax planning. Always consult a chartered accountant (CA) or tax professional.",
    },
    {
        title: "Insurance Assessment",
        content:
            "Insurance gap calculations use standard human life value and income replacement methods. Actual insurance needs depend on individual circumstances, health conditions, lifestyle, and other factors not captured by this tool.",
    },
    {
        title: "Investment Projections",
        content:
            "Any growth projections or goal feasibility calculations use assumed rates of return and inflation. Past performance does not guarantee future results. Market investments carry inherent risks including potential loss of principal.",
    },
    {
        title: "Limitation of Liability",
        content:
            "MyFinancial, its creators, and contributors shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use this tool or reliance on its outputs.",
    },
    {
        title: "Governing Law",
        content:
            "This disclaimer and your use of MyFinancial shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.",
    },
];

export default function DisclaimerPage() {
    return (
        <>
            {/* Hero */}
            <section className="section-padding bg-white">
                <div className="container-marketing text-center">
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle size={28} className="text-amber-600" />
                    </div>
                    <h1 className="text-h1 text-foreground mb-4">Disclaimer</h1>
                    <p className="text-body-lg text-muted-foreground max-w-[500px] mx-auto">
                        Please read this disclaimer carefully before using MyFinancial.
                    </p>
                </div>
            </section>

            {/* Sections */}
            <section className="section-padding bg-muted">
                <div className="container-marketing max-w-[700px]">
                    <div className="space-y-0">
                        {sections.map((s, i) => (
                            <div
                                key={i}
                                className={`py-8 ${i < sections.length - 1 ? "border-b border-border/60" : ""}`}
                            >
                                <h2 className="text-h4 text-foreground mb-3">
                                    {i + 1}. {s.title}
                                </h2>
                                <p className="text-body text-muted-foreground leading-relaxed">
                                    {s.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Updated */}
            <section className="py-12 bg-white">
                <div className="container-marketing text-center">
                    <p className="text-caption text-muted-foreground">
                        Last updated: February 2026
                    </p>
                </div>
            </section>
        </>
    );
}
