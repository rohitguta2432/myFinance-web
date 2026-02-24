import { Lock, UserX, Monitor, Trash2, ArrowRight } from "lucide-react";

const trustItems = [
    {
        icon: <UserX size={20} />,
        title: "No Name / Phone / Email",
        sub: "We don't need to know who you are.",
    },
    {
        icon: <Monitor size={20} />,
        title: "Data stays on device",
        sub: "Your financial data never leaves.",
    },
    {
        icon: <Trash2 size={20} />,
        title: "Export / Delete anytime",
        sub: "You are in complete control.",
    },
];

export function HeroSection() {
    return (
        <section className="relative" style={{ paddingTop: 80, paddingBottom: 64 }}>
            {/* Background Gradients */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ zIndex: -1 }}
            >
                <div
                    className="absolute rounded-full"
                    style={{
                        top: "-20%",
                        left: "20%",
                        height: 500,
                        width: 500,
                        background: "rgba(5, 148, 103, 0.1)",
                        filter: "blur(100px)",
                    }}
                />
                <div
                    className="absolute rounded-full"
                    style={{
                        top: "10%",
                        right: "10%",
                        height: 300,
                        width: 300,
                        background: "rgba(110, 231, 183, 0.2)",
                        filter: "blur(80px)",
                    }}
                />
            </div>

            <div className="container-7xl" style={{ textAlign: "center" }}>
                {/* Trust Pill */}
                <div
                    className="inline-flex items-center gap-2"
                    style={{
                        marginBottom: 32,
                        borderRadius: 9999,
                        border: "1px solid #d1fae5",
                        backgroundColor: "#ecfdf5",
                        padding: "6px 16px",
                    }}
                >
                    <Lock size={18} style={{ color: "#059467" }} />
                    <span className="text-sm font-medium" style={{ color: "#059467" }}>
                        100% Private · No signup required
                    </span>
                </div>

                {/* Headlines */}
                <h1
                    style={{
                        maxWidth: 896, // max-w-4xl
                        margin: "0 auto",
                        fontSize: "clamp(3rem, 5.5vw, 4.5rem)",
                        fontWeight: 800,
                        letterSpacing: "-0.025em",
                        lineHeight: 1.1,
                        color: "#0f172a",
                    }}
                >
                    Know Your Money.{" "}
                    <br className="hidden sm:block" />
                    <span style={{ color: "#059467" }}>Own Your Future.</span>
                </h1>

                {/* Subtext */}
                <p
                    style={{
                        maxWidth: 672, // max-w-2xl
                        margin: "24px auto 0",
                        fontSize: "1.125rem",
                        lineHeight: 1.7,
                        color: "#475569",
                    }}
                >
                    Understand your true post-tax reality and goal feasibility without
                    sharing personal data. Get clarity in minutes.
                </p>

                {/* Main CTA */}
                <div
                    style={{
                        marginTop: 40,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 16,
                    }}
                >
                    <button
                        className="inline-flex items-center justify-center text-white font-bold"
                        style={{
                            height: 56,
                            minWidth: 240,
                            borderRadius: 12,
                            backgroundColor: "#059467",
                            padding: "0 32px",
                            fontSize: 16,
                            boxShadow: "0 8px 24px -4px rgba(5, 150, 105, 0.2)",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Start Free Assessment <ArrowRight size={18} style={{ marginLeft: 8 }} />
                    </button>
                </div>

                {/* Trust Bar */}
                <div
                    className="grid"
                    style={{
                        maxWidth: 768, // max-w-3xl
                        margin: "64px auto 0",
                        gap: 24,
                        gridTemplateColumns: "repeat(3, 1fr)",
                        textAlign: "center",
                    }}
                >
                    {trustItems.map((item, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center"
                            style={{ gap: 8 }}
                        >
                            <div
                                className="flex items-center justify-center rounded-full"
                                style={{
                                    width: 40,
                                    height: 40,
                                    backgroundColor: "#f1f5f9",
                                    color: "#0f172a",
                                }}
                            >
                                {item.icon}
                            </div>
                            <h3 className="font-bold" style={{ color: "#0f172a", fontSize: 14 }}>
                                {item.title}
                            </h3>
                            <p style={{ fontSize: 14, color: "#64748b" }}>{item.sub}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
