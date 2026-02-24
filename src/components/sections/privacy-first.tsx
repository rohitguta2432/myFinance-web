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
        <section className="section-padding bg-gray-50" id="privacy">
            <div className="container-marketing">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Left - Text + Feature Cards */}
                    <div>
                        <p className="text-overline text-accent mb-3">PRIVACY FIRST</p>
                        <h2 className="text-h2 text-foreground mb-4 max-w-[480px]">
                            Your finances are yours. We never see them.
                        </h2>
                        <p className="text-body text-gray-500 mb-8 max-w-[440px] leading-relaxed">
                            Unlike other apps, we process everything locally. Your sensitive financial data never leaves your device.
                        </p>

                        {/* 2x2 Feature Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {features.map((f, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow"
                                >
                                    <div className="text-accent mb-3">{f.icon}</div>
                                    <h4 className="text-sm font-bold text-foreground mb-1">{f.title}</h4>
                                    <p className="text-xs text-gray-400">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right - Visual */}
                    <div className="flex items-center justify-center">
                        <div className="relative w-full max-w-[320px]">
                            {/* Main visual card */}
                            <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-3xl p-12 flex flex-col items-center gap-4 border border-accent/10">
                                <div className="w-20 h-20 rounded-2xl bg-accent/15 flex items-center justify-center">
                                    <Lock size={40} className="text-accent" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground text-center">100% Local</h3>
                                <p className="text-sm text-gray-500 text-center max-w-[220px]">
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
