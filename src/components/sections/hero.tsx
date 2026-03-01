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

/* Mini dashboard inside the phone mockup */
function PhoneDashboard() {
    return (
        <div
            style={{
                position: "relative",
                width: 300,
                margin: "0 auto",
                perspective: 1000,
            }}
        >
            {/* Emerald glow beneath phone */}
            <div
                style={{
                    position: "absolute",
                    bottom: -30,
                    left: "10%",
                    width: "80%",
                    height: 60,
                    background: "rgba(16, 185, 129, 0.25)",
                    filter: "blur(40px)",
                    borderRadius: "50%",
                    zIndex: 0,
                }}
            />

            {/* Phone frame */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    background: "linear-gradient(145deg, #1E293B 0%, #0F172A 100%)",
                    border: "2px solid rgba(255,255,255,0.1)",
                    borderRadius: 32,
                    padding: "12px 10px",
                    boxShadow:
                        "0 25px 60px -12px rgba(0,0,0,0.6), 0 0 40px -10px rgba(16,185,129,0.15)",
                    transform: "rotateY(-5deg) rotateX(2deg)",
                }}
            >
                {/* Notch */}
                <div
                    style={{
                        width: 100,
                        height: 6,
                        backgroundColor: "rgba(255,255,255,0.15)",
                        borderRadius: 3,
                        margin: "0 auto 12px",
                    }}
                />

                {/* Screen area */}
                <div
                    style={{
                        background: "#0B1120",
                        borderRadius: 20,
                        padding: 16,
                        minHeight: 420,
                    }}
                >
                    {/* App header */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 16,
                        }}
                    >
                        <span
                            style={{
                                color: "#10B981",
                                fontWeight: 700,
                                fontSize: 13,
                                fontFamily: "Inter, sans-serif",
                            }}
                        >
                            MyFinancial
                        </span>
                        <span
                            style={{
                                color: "#64748B",
                                fontSize: 10,
                                fontFamily: "Inter, sans-serif",
                            }}
                        >
                            Dashboard
                        </span>
                    </div>

                    {/* Financial Health Score */}
                    <div
                        style={{
                            textAlign: "center",
                            marginBottom: 16,
                        }}
                    >
                        <svg
                            width="120"
                            height="80"
                            viewBox="0 0 120 80"
                            style={{ margin: "0 auto", display: "block" }}
                        >
                            {/* Background arc */}
                            <path
                                d="M15,70 A50,50 0 0,1 105,70"
                                fill="none"
                                stroke="rgba(255,255,255,0.06)"
                                strokeWidth="8"
                                strokeLinecap="round"
                            />
                            {/* Score arc — ~78% */}
                            <path
                                d="M15,70 A50,50 0 0,1 105,70"
                                fill="none"
                                stroke="url(#scoreGrad)"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray="142"
                                strokeDashoffset="31"
                            />
                            <defs>
                                <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#10B981" />
                                    <stop offset="100%" stopColor="#06B6D4" />
                                </linearGradient>
                            </defs>
                            <text
                                x="60"
                                y="58"
                                textAnchor="middle"
                                fill="#F1F5F9"
                                fontSize="22"
                                fontWeight="700"
                                fontFamily="Inter, sans-serif"
                            >
                                78
                            </text>
                            <text
                                x="60"
                                y="72"
                                textAnchor="middle"
                                fill="#64748B"
                                fontSize="8"
                                fontFamily="Inter, sans-serif"
                            >
                                Financial Health Score
                            </text>
                        </svg>
                    </div>

                    {/* Mini wealth chart */}
                    <div
                        style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 12,
                            padding: "10px 12px",
                            marginBottom: 12,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 6,
                            }}
                        >
                            <span style={{ color: "#94A3B8", fontSize: 9, fontFamily: "Inter, sans-serif" }}>
                                Wealth Projection
                            </span>
                            <span style={{ color: "#10B981", fontSize: 9, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                                +₹2.5Cr ↑
                            </span>
                        </div>
                        <svg
                            width="100%"
                            height="50"
                            viewBox="0 0 240 50"
                            preserveAspectRatio="none"
                        >
                            <defs>
                                <linearGradient id="miniChartFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M0,45 C30,42 60,38 90,30 C120,22 150,15 180,10 C210,6 230,4 240,3 L240,50 L0,50 Z"
                                fill="url(#miniChartFill)"
                            />
                            <path
                                d="M0,45 C30,42 60,38 90,30 C120,22 150,15 180,10 C210,6 230,4 240,3"
                                fill="none"
                                stroke="#10B981"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>

                    {/* Three metric cards */}
                    <div style={{ display: "flex", gap: 8 }}>
                        {[
                            { label: "Tax Saved", value: "₹7.5L", color: "#10B981", icon: "₹" },
                            { label: "Insurance Gap", value: "₹1.6Cr", color: "#F59E0B", icon: "⚠" },
                            { label: "Retirement", value: "₹2.4Cr", color: "#06B6D4", icon: "📊" },
                        ].map((m, i) => (
                            <div
                                key={i}
                                style={{
                                    flex: 1,
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: 10,
                                    padding: "10px 8px",
                                    textAlign: "center",
                                }}
                            >
                                <div style={{ fontSize: 14, marginBottom: 4 }}>{m.icon}</div>
                                <div
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 700,
                                        color: m.color,
                                        fontFamily: "Inter, sans-serif",
                                    }}
                                >
                                    {m.value}
                                </div>
                                <div
                                    style={{
                                        fontSize: 8,
                                        color: "#64748B",
                                        marginTop: 2,
                                        fontFamily: "Inter, sans-serif",
                                    }}
                                >
                                    {m.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mini action bar */}
                    <div
                        style={{
                            marginTop: 14,
                            background: "linear-gradient(135deg, #10B981, #059669)",
                            borderRadius: 10,
                            padding: "10px 0",
                            textAlign: "center",
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: 600,
                            fontFamily: "Inter, sans-serif",
                            letterSpacing: "0.02em",
                        }}
                    >
                        View Full Report →
                    </div>
                </div>

                {/* Home indicator */}
                <div
                    style={{
                        width: 80,
                        height: 4,
                        backgroundColor: "rgba(255,255,255,0.2)",
                        borderRadius: 2,
                        margin: "10px auto 0",
                    }}
                />
            </div>
        </div>
    );
}

export function HeroSection() {
    return (
        <section className="relative" style={{ paddingTop: 80, paddingBottom: 48 }}>
            {/* Background Gradients */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ zIndex: -1 }}
            >
                <div
                    className="absolute rounded-full"
                    style={{
                        top: "-20%",
                        left: "10%",
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
                        right: "5%",
                        height: 400,
                        width: 400,
                        background: "rgba(6, 182, 212, 0.05)",
                        filter: "blur(100px)",
                    }}
                />
            </div>

            <div className="container-7xl">
                {/* Split Hero Layout */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 48,
                        flexWrap: "wrap",
                    }}
                >
                    {/* Left Column — Copy */}
                    <div style={{ flex: "1 1 480px", minWidth: 0 }}>
                        {/* Trust Pill */}
                        <div
                            className="inline-flex items-center gap-2"
                            style={{
                                marginBottom: 28,
                                borderRadius: 9999,
                                border: "1px solid rgba(16, 185, 129, 0.2)",
                                backgroundColor: "rgba(16, 185, 129, 0.08)",
                                padding: "6px 16px",
                            }}
                        >
                            <Lock size={18} style={{ color: "#10B981" }} />
                            <span
                                className="text-sm font-medium"
                                style={{ color: "#10B981" }}
                            >
                                100% Private · No signup required
                            </span>
                        </div>

                        {/* Headline */}
                        <h1
                            style={{
                                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                                fontWeight: 800,
                                letterSpacing: "-0.025em",
                                lineHeight: 1.1,
                                color: "#F1F5F9",
                                marginBottom: 20,
                            }}
                        >
                            Know Your Money.
                            <br />
                            <span style={{ color: "#10B981" }}>Own Your Future.</span>
                        </h1>

                        {/* Subtitle */}
                        <p
                            style={{
                                maxWidth: 520,
                                fontSize: "1.1rem",
                                lineHeight: 1.7,
                                color: "#94A3B8",
                                marginBottom: 32,
                            }}
                        >
                            Understand your true post-tax reality and goal feasibility
                            without sharing personal data. Get clarity in minutes.
                        </p>

                        {/* CTA Button */}
                        <a
                            href="https://app.myfinancial.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center text-white font-bold"
                            style={{
                                height: 56,
                                minWidth: 240,
                                borderRadius: 12,
                                backgroundColor: "#10B981",
                                padding: "0 32px",
                                fontSize: 16,
                                textDecoration: "none",
                                boxShadow: "0 8px 30px -4px rgba(16, 185, 129, 0.35)",
                                border: "none",
                                cursor: "pointer",
                                transition: "transform 0.2s, box-shadow 0.2s",
                            }}
                        >
                            Start Free Assessment{" "}
                            <ArrowRight size={18} style={{ marginLeft: 8 }} />
                        </a>

                        {/* Micro trust line */}
                        <p
                            style={{
                                marginTop: 16,
                                fontSize: 13,
                                color: "#64748B",
                            }}
                        >
                            ✦ No credit card &nbsp;·&nbsp; 10 min setup &nbsp;·&nbsp; 100% browser-based
                        </p>
                    </div>

                    {/* Right Column — Phone Mockup */}
                    <div
                        style={{
                            flex: "0 1 340px",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <PhoneDashboard />
                    </div>
                </div>

                {/* Trust Bar */}
                <div
                    className="grid"
                    style={{
                        maxWidth: 768,
                        margin: "56px auto 0",
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
                            <h3
                                className="font-bold"
                                style={{ color: "#F1F5F9", fontSize: 14 }}
                            >
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
