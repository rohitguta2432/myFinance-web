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
            <section className="section-padding" style={{ backgroundColor: "#0B1120" }}>
                <div className="container-marketing text-center">
                    <p className="text-overline" style={{ color: "#10B981", marginBottom: 16 }}>PRIVACY POLICY</p>
                    <h1 className="text-h1" style={{ color: "#F1F5F9", maxWidth: 600, marginLeft: "auto", marginRight: "auto", marginBottom: 20 }}>
                        Your data stays with you. Always.
                    </h1>
                    <p className="text-body-lg" style={{ color: "#94A3B8", maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
                        MyFinancial is built on a simple principle: we never see your financial data. It never leaves your device.
                    </p>
                </div>
            </section>

            {/* Principles Grid */}
            <section className="section-padding" style={{ backgroundColor: "#111827" }}>
                <div className="container-marketing">
                    <h2 className="text-h3 text-center" style={{ color: "#F1F5F9", marginBottom: 48 }}>
                        Six principles that define our approach
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}>
                        {principles.map((p, i) => (
                            <div
                                key={i}
                                style={{
                                    backgroundColor: "rgba(15, 23, 42, 0.6)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: 16,
                                    padding: 28,
                                    backdropFilter: "blur(12px)",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                <div
                                    className="flex items-center justify-center"
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 12,
                                        backgroundColor: "rgba(16,185,129,0.08)",
                                        color: "#10B981",
                                        marginBottom: 20,
                                    }}
                                >
                                    {p.icon}
                                </div>
                                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#F1F5F9", marginBottom: 8 }}>
                                    {p.title}
                                </h3>
                                <p className="text-body-sm" style={{ color: "#94A3B8", lineHeight: 1.6 }}>
                                    {p.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technical Details */}
            <section className="section-padding" style={{ backgroundColor: "#0B1120" }}>
                <div className="container-marketing" style={{ maxWidth: 700 }}>
                    <h2 className="text-h3" style={{ color: "#F1F5F9", marginBottom: 32 }}>Technical implementation</h2>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-h4" style={{ color: "#F1F5F9", marginBottom: 12 }}>How localStorage works</h3>
                            <p className="text-body" style={{ color: "#94A3B8", lineHeight: 1.7 }}>
                                localStorage is a browser API that allows web applications to store key-value pairs
                                directly on your device. The data persists across browser sessions but is accessible
                                only to this website on this specific browser. It cannot be accessed by other
                                websites, apps, or even other browsers on the same device.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-h4" style={{ color: "#F1F5F9", marginBottom: 12 }}>What we store</h3>
                            <p className="text-body" style={{ color: "#94A3B8", lineHeight: 1.7 }}>
                                Only the financial numbers you enter: income details, asset values, liability
                                amounts, insurance coverage, and tax-related deductions. No names, no emails, no
                                phone numbers, no identification documents.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-h4" style={{ color: "#F1F5F9", marginBottom: 12 }}>Data lifecycle</h3>
                            <p className="text-body" style={{ color: "#94A3B8", lineHeight: 1.7 }}>
                                Data exists only while you choose to keep it. You can export it (JSON) for backup,
                                re-import it in another browser, or delete it entirely. Clearing your browser data
                                also removes everything.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section className="section-padding" style={{ backgroundColor: "#111827" }}>
                <div className="container-marketing text-center" style={{ maxWidth: 500 }}>
                    <h2 className="text-h3" style={{ color: "#F1F5F9", marginBottom: 16 }}>Questions about privacy?</h2>
                    <p className="text-body" style={{ color: "#94A3B8", marginBottom: 24 }}>
                        If you have questions about this policy or how MyFinancial handles data, reach out to us.
                    </p>
                    <p style={{ fontSize: 16, fontWeight: 600, color: "#10B981" }}>
                        privacy@myfinancial.in
                    </p>
                    <p className="text-caption" style={{ color: "#64748B", marginTop: 24 }}>
                        Last updated: February 2026
                    </p>
                </div>
            </section>
        </>
    );
}
