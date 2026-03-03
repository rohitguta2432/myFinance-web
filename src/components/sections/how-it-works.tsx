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
                <div style={{ textAlign: "center", marginBottom: 56 }}>
                    <p className="text-overline text-accent" style={{ marginBottom: 12 }}>PROCESS</p>
                    <h2 className="text-h2" style={{ color: "#F1F5F9", maxWidth: 700, margin: "0 auto 16px" }}>
                        Financial clarity in three steps
                    </h2>
                    <p style={{ color: "#94A3B8", maxWidth: 540, margin: "0 auto", textAlign: "center", fontSize: 16, lineHeight: 1.6 }}>
                        We&apos;ve simplified the complex world of personal finance into a streamlined process that respects your time.
                    </p>
                </div>

                {/* Steps */}
                <div style={{ maxWidth: 540, marginLeft: "auto", marginRight: "auto" }}>
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "48px 1fr",
                                gap: 20,
                                alignItems: "start",
                                paddingBottom: i < steps.length - 1 ? 40 : 0,
                                position: "relative",
                            }}
                        >
                            {/* Number circle + connecting line */}
                            <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                                {i < steps.length - 1 && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: 48,
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            width: 2,
                                            height: "calc(100% + 0px)",
                                            background: "linear-gradient(180deg, rgba(16,185,129,0.3) 0%, rgba(16,185,129,0.05) 100%)",
                                        }}
                                    />
                                )}
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 14,
                                        fontWeight: 700,
                                        backgroundColor: "#10B981",
                                        color: "#fff",
                                        boxShadow: "0 0 20px -4px rgba(16, 185, 129, 0.4)",
                                        flexShrink: 0,
                                        position: "relative",
                                        zIndex: 1,
                                    }}
                                >
                                    {step.num}
                                </div>
                            </div>

                            {/* Text */}
                            <div style={{ paddingTop: 12 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#F1F5F9", marginBottom: 6 }}>
                                    {step.title}
                                </h3>
                                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#94A3B8", margin: 0 }}>
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
