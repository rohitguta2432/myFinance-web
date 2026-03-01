import type { Metadata } from "next";
import {
    DollarSign,
    LineChart,
    Briefcase,
    CreditCard,
    Heart,
    Shield,
    Target,
    TrendingUp,
    FileText,
    Trash2,
    Upload,
} from "lucide-react";

export const metadata: Metadata = {
    title: "How It Works | MyFinancial",
    description: "From zero to financial clarity in 10 minutes. Learn how MyFinancial works.",
};

const step1SubItems = [
    { icon: <DollarSign size={18} />, title: "Income & Tax", desc: "Salary, bonus, tax regime selections" },
    { icon: <LineChart size={18} />, title: "Assets & Investments", desc: "Stocks, real estate, crypto, savings" },
    { icon: <CreditCard size={18} />, title: "Liabilities", desc: "Loans, mortgages, credit card dues" },
    { icon: <Heart size={18} />, title: "Insurance", desc: "Life, health, vehicle coverage details" },
];

const step2SubItems = [
    { icon: <TrendingUp size={18} />, title: "Tax Regime Optimization", desc: "Real-time comparison between new and old tax regimes based on your deductions." },
    { icon: <Briefcase size={18} />, title: "Net Worth Allocation", desc: "Visual breakdown of your liquid vs. locked assets across all categories." },
    { icon: <Shield size={18} />, title: "Insurance Adequacy", desc: "Gap analysis of your current coverage against recommended standards." },
    { icon: <Target size={18} />, title: "Goal Feasibility", desc: "Instant analysis of your financial goals against your current savings rate." },
];

const step3SubItems = [
    { icon: <FileText size={16} />, title: "Action Items", desc: "Prioritized next steps" },
    { icon: <Upload size={16} />, title: "Export Data", desc: "Download to PDF or JSON" },
    { icon: <Trash2 size={16} />, title: "Total Privacy", desc: "One click data wipe" },
];

const APP_URL = "https://app.myfinancial.in";

export default function HowItWorksPage() {
    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#0B1120" }}>
            {/* Hero */}
            <section className="section-padding" style={{ background: "linear-gradient(180deg, #111827 0%, #0B1120 100%)" }}>
                <div className="container-marketing text-center">
                    <p className="text-overline" style={{ color: "#10B981", marginBottom: 12 }}>HOW IT WORKS</p>
                    <h1 className="text-h1" style={{ color: "#F1F5F9", marginBottom: 16 }}>
                        From zero to clarity in
                        <br />
                        10 minutes
                    </h1>
                    <p className="text-body-lg" style={{ color: "#94A3B8", maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
                        Understand your financial health with our privacy-first local calculation engine. No servers, just your browser.
                    </p>
                </div>
            </section>

            {/* Step 1 */}
            <section className="section-padding" style={{ backgroundColor: "#0B1120" }}>
                <div className="container-marketing">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span style={{ fontSize: "2.25rem", fontWeight: 800, color: "#1E293B" }}>01</span>
                            </div>
                            <h2 className="text-h2" style={{ color: "#F1F5F9", marginBottom: 16 }}>Enter Your Numbers</h2>
                            <p className="text-body" style={{ color: "#94A3B8", marginBottom: 32, maxWidth: 500, lineHeight: 1.7 }}>
                                Input your financial data directly into the application. We cover everything from your paycheck to your insurance policies. Don&apos;t worry, nothing gets sent to the cloud.
                            </p>
                        </div>
                        {/* Sub-item cards */}
                        <div className="grid grid-cols-2 gap-3" style={{ maxWidth: 340 }}>
                            {step1SubItems.map((item, i) => (
                                <div
                                    key={i}
                                    style={{
                                        backgroundColor: "rgba(15, 23, 42, 0.6)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        borderRadius: 12,
                                        padding: 16,
                                        backdropFilter: "blur(12px)",
                                        transition: "all 0.3s ease",
                                    }}
                                >
                                    <div style={{ color: "#10B981", marginBottom: 8 }}>{item.icon}</div>
                                    <h4 style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9", marginBottom: 2 }}>{item.title}</h4>
                                    <p style={{ fontSize: 11, color: "#64748B", lineHeight: 1.4 }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Step 2 */}
            <section className="section-padding" style={{ backgroundColor: "#111827" }}>
                <div className="container-marketing">
                    <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-12 items-start">
                        {/* Analysis items on left */}
                        <div style={{ maxWidth: 400 }} className="space-y-4">
                            {step2SubItems.map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div
                                        className="flex items-center justify-center shrink-0"
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 8,
                                            backgroundColor: "rgba(16,185,129,0.1)",
                                            color: "#10B981",
                                            marginTop: 2,
                                        }}
                                    >
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9", marginBottom: 2 }}>{item.title}</h4>
                                        <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Text on right */}
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span style={{ fontSize: "2.25rem", fontWeight: 800, color: "#1E293B" }}>02</span>
                            </div>
                            <h2 className="text-h2" style={{ color: "#F1F5F9", marginBottom: 16 }}>Instant Browser Analysis</h2>
                            <p className="text-body" style={{ color: "#94A3B8", maxWidth: 500, lineHeight: 1.7 }}>
                                Our local engine crunches the numbers instantly within your browser. No loading spinners, no server delays. See the impact of every financial decision in milliseconds.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Step 3 */}
            <section className="section-padding" style={{ backgroundColor: "#0B1120" }}>
                <div className="container-marketing">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span style={{ fontSize: "2.25rem", fontWeight: 800, color: "#1E293B" }}>03</span>
                            </div>
                            <h2 className="text-h2" style={{ color: "#F1F5F9", marginBottom: 16 }}>Your Financial Report</h2>
                            <p className="text-body" style={{ color: "#94A3B8", marginBottom: 32, maxWidth: 500, lineHeight: 1.7 }}>
                                Get a comprehensive report that you own. Export it, save it, or delete it. We generate the insights, but the data remains completely under your control.
                            </p>
                        </div>
                        {/* Report mini-cards */}
                        <div className="grid grid-cols-3 gap-3" style={{ maxWidth: 380 }}>
                            {step3SubItems.map((item, i) => (
                                <div
                                    key={i}
                                    className="text-center"
                                    style={{
                                        backgroundColor: "rgba(15, 23, 42, 0.6)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        borderRadius: 12,
                                        padding: 16,
                                        backdropFilter: "blur(12px)",
                                    }}
                                >
                                    <div className="flex justify-center" style={{ color: "#10B981", marginBottom: 8 }}>{item.icon}</div>
                                    <h4 style={{ fontSize: 12, fontWeight: 700, color: "#F1F5F9", marginBottom: 2 }}>{item.title}</h4>
                                    <p style={{ fontSize: 10, color: "#64748B" }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Privacy Reminder */}
            <section className="section-padding" style={{ backgroundColor: "#111827" }}>
                <div className="container-marketing text-center">
                    <div
                        style={{
                            maxWidth: 600,
                            marginLeft: "auto",
                            marginRight: "auto",
                            background: "linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(16,185,129,0.12) 100%)",
                            borderRadius: 24,
                            padding: 48,
                            border: "1px solid rgba(16,185,129,0.15)",
                        }}
                    >
                        <div
                            className="flex items-center justify-center"
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: 16,
                                backgroundColor: "rgba(16,185,129,0.15)",
                                marginLeft: "auto",
                                marginRight: "auto",
                                marginBottom: 20,
                            }}
                        >
                            <Shield size={28} style={{ color: "#10B981" }} />
                        </div>
                        <h3 className="text-h3" style={{ color: "#F1F5F9", marginBottom: 12 }}>Your data never leaves your browser</h3>
                        <p className="text-body" style={{ color: "#94A3B8", marginBottom: 24 }}>
                            Every calculation runs locally. We don&apos;t have servers that store your financial data. Period.
                        </p>
                        <a
                            href={APP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-white text-sm font-semibold transition-all"
                            style={{
                                padding: "14px 32px",
                                backgroundColor: "#10B981",
                                borderRadius: 12,
                                boxShadow: "0 0 20px -4px rgba(16,185,129,0.3)",
                                textDecoration: "none",
                            }}
                        >
                            Start Free Assessment →
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
