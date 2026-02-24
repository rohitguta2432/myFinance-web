import { Database, ShieldOff, Upload, Trash2, Lock } from "lucide-react";

const features = [
    {
        icon: <Database size={22} />,
        title: "Browser-Only Storage",
        desc: "Data stays in local storage.",
    },
    {
        icon: <ShieldOff size={22} />,
        title: "Zero Data Collection",
        desc: "No tracking servers.",
    },
    {
        icon: <Upload size={22} />,
        title: "Export Anytime",
        desc: "JSON or CSV download.",
    },
    {
        icon: <Trash2 size={22} />,
        title: "Delete in One Click",
        desc: "Wipe instantly.",
    },
];

export function PrivacyFirstSection() {
    return (
        <section className="section-padding" style={{ backgroundColor: "#0B1120" }} id="privacy">
            <div className="container-marketing">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Left - Text + Feature Cards */}
                    <div>
                        <p className="text-overline text-accent mb-3">PRIVACY FIRST</p>
                        <h2 className="text-h2 mb-4 max-w-[480px]" style={{ color: "#F1F5F9" }}>
                            Your finances are yours. We never see them.
                        </h2>
                        <p className="text-body mb-8 max-w-[440px] leading-relaxed" style={{ color: "#94A3B8" }}>
                            Unlike other apps, we process everything locally. Your sensitive financial data never leaves your device.
                        </p>

                        {/* 2x2 Feature Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {features.map((f, i) => (
                                <div
                                    key={i}
                                    className="rounded-xl p-5"
                                    style={{
                                        backgroundColor: "rgba(15, 23, 42, 0.6)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        backdropFilter: "blur(12px)",
                                        transition: "all 0.3s ease",
                                    }}
                                >
                                    <div className="mb-3" style={{ color: "#10B981" }}>{f.icon}</div>
                                    <h4 className="text-sm font-bold mb-1" style={{ color: "#F1F5F9" }}>{f.title}</h4>
                                    <p className="text-xs" style={{ color: "#64748B" }}>{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right - Visual */}
                    <div className="flex items-center justify-center">
                        <div className="relative w-full max-w-[320px]">
                            <div
                                className="rounded-3xl p-12 flex flex-col items-center gap-4"
                                style={{
                                    background: "linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(16,185,129,0.12) 100%)",
                                    border: "1px solid rgba(16,185,129,0.15)",
                                }}
                            >
                                <div
                                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                                    style={{ backgroundColor: "rgba(16,185,129,0.15)" }}
                                >
                                    <Lock size={40} style={{ color: "#10B981" }} />
                                </div>
                                <h3 className="text-xl font-bold text-center" style={{ color: "#F1F5F9" }}>100% Local</h3>
                                <p className="text-sm text-center max-w-[220px]" style={{ color: "#94A3B8" }}>
                                    Your browser is the vault. No data is transmitted to our cloud.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
