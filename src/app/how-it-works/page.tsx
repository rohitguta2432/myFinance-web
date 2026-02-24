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

export default function HowItWorksPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Hero */}
            <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
                <div className="container-marketing text-center">
                    <p className="text-overline text-accent mb-3">HOW IT WORKS</p>
                    <h1 className="text-h1 text-foreground mb-4">
                        From zero to clarity in
                        <br />
                        10 minutes
                    </h1>
                    <p className="text-body-lg text-gray-500 max-w-[500px] mx-auto">
                        Understand your financial health with our privacy-first local calculation engine. No servers, just your browser.
                    </p>
                </div>
            </section>

            {/* Step 1 */}
            <section className="section-padding bg-white">
                <div className="container-marketing">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-4xl font-extrabold text-gray-200">01</span>
                            </div>
                            <h2 className="text-h2 text-foreground mb-4">Enter Your Numbers</h2>
                            <p className="text-body text-gray-500 mb-8 max-w-[500px] leading-relaxed">
                                Input your financial data directly into the application. We cover everything from your paycheck to your insurance policies. Don't worry, nothing gets sent to the cloud.
                            </p>
                        </div>
                        {/* Sub-item cards */}
                        <div className="grid grid-cols-2 gap-3 max-w-[340px]">
                            {step1SubItems.map((item, i) => (
                                <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <div className="text-accent mb-2">{item.icon}</div>
                                    <h4 className="text-sm font-bold text-foreground mb-0.5">{item.title}</h4>
                                    <p className="text-[11px] text-gray-400 leading-snug">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Step 2 */}
            <section className="section-padding bg-gray-50">
                <div className="container-marketing">
                    <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-12 items-start">
                        {/* Analysis items on left */}
                        <div className="max-w-[400px] space-y-4">
                            {step2SubItems.map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-foreground mb-0.5">{item.title}</h4>
                                        <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Text on right */}
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-4xl font-extrabold text-gray-200">02</span>
                            </div>
                            <h2 className="text-h2 text-foreground mb-4">Instant Browser Analysis</h2>
                            <p className="text-body text-gray-500 max-w-[500px] leading-relaxed">
                                Our local engine crunches the numbers instantly within your browser. No loading spinners, no server delays. See the impact of every financial decision in milliseconds.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Step 3 */}
            <section className="section-padding bg-white">
                <div className="container-marketing">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-4xl font-extrabold text-gray-200">03</span>
                            </div>
                            <h2 className="text-h2 text-foreground mb-4">Your Financial Report</h2>
                            <p className="text-body text-gray-500 mb-8 max-w-[500px] leading-relaxed">
                                Get a comprehensive report that you own. Export it, save it, or delete it. We generate the insights, but the data remains completely under your control.
                            </p>
                        </div>
                        {/* Report mini-cards */}
                        <div className="grid grid-cols-3 gap-3 max-w-[380px]">
                            {step3SubItems.map((item, i) => (
                                <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                                    <div className="text-accent mx-auto mb-2 flex justify-center">{item.icon}</div>
                                    <h4 className="text-xs font-bold text-foreground mb-0.5">{item.title}</h4>
                                    <p className="text-[10px] text-gray-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Privacy Reminder */}
            <section className="section-padding bg-gray-50">
                <div className="container-marketing text-center">
                    <div className="max-w-[600px] mx-auto bg-gradient-to-br from-accent/5 to-accent/10 rounded-3xl p-12 border border-accent/10">
                        <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center mx-auto mb-5">
                            <Shield size={28} className="text-accent" />
                        </div>
                        <h3 className="text-h3 text-foreground mb-3">Your data never leaves your browser</h3>
                        <p className="text-body text-gray-500 mb-6">
                            Every calculation runs locally. We don't have servers that store your financial data. Period.
                        </p>
                        <a href="#" className="inline-flex items-center px-8 py-3.5 bg-accent text-white text-sm font-semibold rounded-xl hover:bg-accent-dark transition-colors">
                            Start Free Assessment →
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
