import type { Metadata } from "next";
import { Shield, Database, UserX, Download, Trash2, Lock } from "lucide-react";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description:
        "MyFinancial Privacy Policy — all data stored locally in your browser. No servers, no accounts, no tracking. Export or delete your data anytime.",
};

const principles = [
    {
        icon: <Database size={22} />,
        title: "Browser-Only Storage",
        description:
            "Your financial data is stored exclusively in your browser's localStorage. We have no servers, no databases, and no cloud storage.",
    },
    {
        icon: <UserX size={22} />,
        title: "Zero Personal Information",
        description:
            "We never ask for your name, email, phone number, PAN, Aadhaar, or any identity documents. You are completely anonymous.",
    },
    {
        icon: <Shield size={22} />,
        title: "No Third-Party Sharing",
        description:
            "We do not share, sell, or transmit any data to third parties. There is no data to share — we simply don't have it.",
    },
    {
        icon: <Lock size={22} />,
        title: "No Tracking or Analytics",
        description:
            "We do not use Google Analytics, Facebook Pixel, or any tracking tools. No cookies are set for advertising or analytics purposes.",
    },
    {
        icon: <Download size={22} />,
        title: "Full Data Export",
        description:
            "You can export all your data as a JSON file at any time. This file can be re-imported in another browser or used for personal records.",
    },
    {
        icon: <Trash2 size={22} />,
        title: "One-Click Deletion",
        description:
            "Clear all your data with a single click from the app settings. Alternatively, clearing your browser data removes everything.",
    },
];

export default function PrivacyPage() {
    return (
        <>
            {/* Hero */}
            <section className="section-padding bg-white">
                <div className="container-marketing text-center">
                    <p className="text-overline text-accent mb-4">PRIVACY POLICY</p>
                    <h1 className="text-h1 text-foreground max-w-[600px] mx-auto mb-5">
                        Your data stays with you. Always.
                    </h1>
                    <p className="text-body-lg text-muted-foreground max-w-[500px] mx-auto">
                        MyFinancial is built on a simple principle: we never see your financial data. It never leaves your device.
                    </p>
                </div>
            </section>

            {/* Principles Grid */}
            <section className="section-padding bg-muted">
                <div className="container-marketing">
                    <h2 className="text-h3 text-foreground text-center mb-12">
                        Six principles that define our approach
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
                        {principles.map((p, i) => (
                            <div key={i} className="card-flat !p-7">
                                <div className="w-12 h-12 rounded-xl bg-accent-lighter flex items-center justify-center text-accent mb-5">
                                    {p.icon}
                                </div>
                                <h3 className="text-body font-semibold text-foreground mb-2">
                                    {p.title}
                                </h3>
                                <p className="text-body-sm text-muted-foreground leading-relaxed">
                                    {p.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technical Details */}
            <section className="section-padding bg-white">
                <div className="container-marketing max-w-[700px]">
                    <h2 className="text-h3 text-foreground mb-8">Technical implementation</h2>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-h4 text-foreground mb-3">How localStorage works</h3>
                            <p className="text-body text-muted-foreground leading-relaxed">
                                localStorage is a browser API that allows web applications to store key-value pairs
                                directly on your device. The data persists across browser sessions but is accessible
                                only to this website on this specific browser. It cannot be accessed by other
                                websites, apps, or even other browsers on the same device.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-h4 text-foreground mb-3">What we store</h3>
                            <p className="text-body text-muted-foreground leading-relaxed">
                                Only the financial numbers you enter: income details, asset values, liability
                                amounts, insurance coverage, and tax-related deductions. No names, no emails, no
                                phone numbers, no identification documents.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-h4 text-foreground mb-3">Data lifecycle</h3>
                            <p className="text-body text-muted-foreground leading-relaxed">
                                Data exists only while you choose to keep it. You can export it (JSON) for backup,
                                re-import it in another browser, or delete it entirely. Clearing your browser data
                                also removes everything.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section className="section-padding bg-muted">
                <div className="container-marketing text-center max-w-[500px]">
                    <h2 className="text-h3 text-foreground mb-4">Questions about privacy?</h2>
                    <p className="text-body text-muted-foreground mb-6">
                        If you have questions about this policy or how MyFinancial handles data, reach out to us.
                    </p>
                    <p className="text-body font-semibold text-accent">
                        privacy@myfinancial.in
                    </p>
                    <p className="text-caption text-muted-foreground mt-6">
                        Last updated: February 2026
                    </p>
                </div>
            </section>
        </>
    );
}
