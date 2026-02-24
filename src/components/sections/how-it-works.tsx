import { PenLine, Settings, FileText } from "lucide-react";

const steps = [
    {
        num: "01",
        icon: <PenLine size={20} />,
        title: "Enter Your Numbers",
        desc: "Input your income, expenses, and investments securely in your browser. No server uploads, ever.",
    },
    {
        num: "02",
        icon: <Settings size={20} />,
        title: "Instant Analysis",
        desc: "Our algorithms analyze your cash flow, tax regime, and investment allocation instantly to find optimizations.",
    },
    {
        num: "03",
        icon: <FileText size={20} />,
        title: "Get Your Report",
        desc: "Receive a comprehensive PDF report with actionable insights and specific tax-saving tips tailored to you.",
    },
];

export function HowItWorksSection() {
    return (
        <section className="section-padding" style={{ backgroundColor: "#111827" }} id="how-it-works">
            <div className="container-marketing">
                {/* Header */}
                <div className="text-center mb-14">
                    <p className="text-overline text-accent mb-3">PROCESS</p>
                    <h2 className="text-h2 max-w-[700px] mx-auto mb-4" style={{ color: "#F1F5F9" }}>
                        Financial clarity in three steps
                    </h2>
                    <p className="text-body max-w-[540px] mx-auto" style={{ color: "#94A3B8" }}>
                        We&apos;ve simplified the complex world of personal finance into a streamlined process that respects your time.
                    </p>
                </div>

                {/* Steps */}
                <div className="max-w-[640px] mx-auto space-y-8">
                    {steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-6">
                            {/* Text — left side */}
                            <div className="flex-1 text-right">
                                <h3 className="text-lg font-bold mb-1" style={{ color: "#F1F5F9" }}>{step.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
                                    {step.desc}
                                </p>
                            </div>

                            {/* Number circle */}
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                                style={{
                                    backgroundColor: "#10B981",
                                    color: "#fff",
                                    boxShadow: "0 0 20px -4px rgba(16, 185, 129, 0.4)",
                                }}
                            >
                                {step.num}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
