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
        <section className="section-padding bg-white" id="how-it-works">
            <div className="container-marketing">
                {/* Header */}
                <div className="text-center mb-14">
                    <p className="text-overline text-accent mb-3">PROCESS</p>
                    <h2 className="text-h2 text-foreground max-w-[700px] mx-auto mb-4">
                        Financial clarity in three steps
                    </h2>
                    <p className="text-body text-gray-500 max-w-[540px] mx-auto">
                        We've simplified the complex world of personal finance into a streamlined process that respects your time.
                    </p>
                </div>

                {/* Steps — text LEFT, circle RIGHT (Stitch layout) */}
                <div className="max-w-[640px] mx-auto space-y-8">
                    {steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-6">
                            {/* Text — left side */}
                            <div className="flex-1 text-right">
                                <h3 className="text-lg font-bold text-foreground mb-1">{step.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>

                            {/* Number circle — right side */}
                            <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold shrink-0">
                                {step.num}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
