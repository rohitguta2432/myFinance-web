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

/* SVG Wealth Growth Chart — shows "Without Planning" vs "With Planning" */
function WealthChart() {
    return (
        <div style={{ maxWidth: 700, margin: "48px auto 0", position: "relative" }}>
            <svg viewBox="0 0 700 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                    <line
                        key={i}
                        x1="50" y1={40 + i * 50}
                        x2="680" y2={40 + i * 50}
                        stroke="rgba(255,255,255,0.04)"
                        strokeWidth="1"
                    />
                ))}

                {/* Y-axis labels */}
                <text x="10" y="45" fill="#64748B" fontSize="10" fontFamily="Inter, sans-serif">₹3Cr</text>
                <text x="10" y="95" fill="#64748B" fontSize="10" fontFamily="Inter, sans-serif">₹2Cr</text>
                <text x="10" y="145" fill="#64748B" fontSize="10" fontFamily="Inter, sans-serif">₹1Cr</text>
                <text x="10" y="195" fill="#64748B" fontSize="10" fontFamily="Inter, sans-serif">₹50L</text>
                <text x="10" y="245" fill="#64748B" fontSize="10" fontFamily="Inter, sans-serif">₹0</text>

                {/* X-axis labels */}
                <text x="60" y="255" fill="#64748B" fontSize="10" fontFamily="Inter, sans-serif">Year 1</text>
                <text x="210" y="255" fill="#64748B" fontSize="10" fontFamily="Inter, sans-serif">Year 5</text>
                <text x="370" y="255" fill="#64748B" fontSize="10" fontFamily="Inter, sans-serif">Year 10</text>
                <text x="530" y="255" fill="#64748B" fontSize="10" fontFamily="Inter, sans-serif">Year 15</text>
                <text x="630" y="255" fill="#64748B" fontSize="10" fontFamily="Inter, sans-serif">Year 20</text>

                {/* "Without Planning" line — flat/declining (red/amber) */}
                <defs>
                    <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF4444" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Red area fill */}
                <path
                    d="M60,180 C150,175 250,178 350,185 C450,192 550,200 670,210 L670,240 L60,240 Z"
                    fill="url(#redGrad)"
                />
                {/* Red line */}
                <path
                    d="M60,180 C150,175 250,178 350,185 C450,192 550,200 670,210"
                    stroke="#EF4444"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    strokeOpacity="0.7"
                />

                {/* Green area fill */}
                <path
                    d="M60,185 C150,170 250,140 350,110 C450,75 550,55 670,40 L670,240 L60,240 Z"
                    fill="url(#greenGrad)"
                />
                {/* Green line — exponential growth */}
                <path
                    d="M60,185 C150,170 250,140 350,110 C450,75 550,55 670,40"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                />

                {/* Endpoint dots */}
                <circle cx="670" cy="210" r="4" fill="#EF4444" />
                <circle cx="670" cy="40" r="5" fill="#10B981" />
                <circle cx="670" cy="40" r="8" fill="#10B981" fillOpacity="0.2" />

                {/* Legend labels at endpoints */}
                <rect x="520" y="205" width="130" height="20" rx="10" fill="rgba(239,68,68,0.12)" />
                <text x="535" y="219" fill="#EF4444" fontSize="10" fontWeight="600" fontFamily="Inter, sans-serif">Without Planning</text>

                <rect x="520" y="15" width="140" height="20" rx="10" fill="rgba(16,185,129,0.12)" />
                <text x="535" y="29" fill="#10B981" fontSize="10" fontWeight="600" fontFamily="Inter, sans-serif">With MyFinancial ✦</text>
            </svg>
        </div>
    );
}

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
                        height: 600,
                        width: 600,
                        background: "rgba(16, 185, 129, 0.07)",
                        filter: "blur(120px)",
                    }}
                />
                <div
                    className="absolute rounded-full"
                    style={{
                        top: "10%",
                        right: "10%",
                        height: 400,
                        width: 400,
                        background: "rgba(6, 182, 212, 0.05)",
                        filter: "blur(100px)",
                    }}
                />
                <div
                    className="absolute rounded-full"
                    style={{
                        bottom: "-10%",
                        left: "50%",
                        height: 300,
                        width: 300,
                        background: "rgba(16, 185, 129, 0.04)",
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
                        border: "1px solid rgba(16, 185, 129, 0.2)",
                        backgroundColor: "rgba(16, 185, 129, 0.08)",
                        padding: "6px 16px",
                    }}
                >
                    <Lock size={18} style={{ color: "#10B981" }} />
                    <span className="text-sm font-medium" style={{ color: "#10B981" }}>
                        100% Private · No signup required
                    </span>
                </div>

                {/* Headlines */}
                <h1
                    style={{
                        maxWidth: 896,
                        margin: "0 auto",
                        fontSize: "clamp(3rem, 5.5vw, 4.5rem)",
                        fontWeight: 800,
                        letterSpacing: "-0.025em",
                        lineHeight: 1.1,
                        color: "#F1F5F9",
                    }}
                >
                    Know Your Money.{" "}
                    <br className="hidden sm:block" />
                    <span style={{ color: "#10B981" }}>Own Your Future.</span>
                </h1>

                {/* Subtext */}
                <p
                    style={{
                        maxWidth: 672,
                        margin: "24px auto 0",
                        fontSize: "1.125rem",
                        lineHeight: 1.7,
                        color: "#94A3B8",
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
                            backgroundColor: "#10B981",
                            padding: "0 32px",
                            fontSize: 16,
                            boxShadow: "0 8px 30px -4px rgba(16, 185, 129, 0.35)",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Start Free Assessment <ArrowRight size={18} style={{ marginLeft: 8 }} />
                    </button>
                </div>

                {/* Wealth Growth Chart */}
                <WealthChart />

                {/* Trust Bar */}
                <div
                    className="grid"
                    style={{
                        maxWidth: 768,
                        margin: "48px auto 0",
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
                                    backgroundColor: "rgba(255,255,255,0.05)",
                                    color: "#94A3B8",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                }}
                            >
                                {item.icon}
                            </div>
                            <h3 className="font-bold" style={{ color: "#F1F5F9", fontSize: 14 }}>
                                {item.title}
                            </h3>
                            <p style={{ fontSize: 14, color: "#64748B" }}>{item.sub}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
