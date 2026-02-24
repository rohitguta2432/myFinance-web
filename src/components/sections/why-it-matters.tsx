import { IndianRupee, Shield, TrendingUp } from "lucide-react";

/* ─── Donut Chart: Tax Savings ─── */
function TaxDonutChart() {
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const saved = 0.72; // 72% of ring filled
    return (
        <svg viewBox="0 0 140 140" width="140" height="140">
            {/* Background ring */}
            <circle cx="70" cy="70" r={radius} fill="none" stroke="#1E293B" strokeWidth="12" />
            {/* Filled ring */}
            <circle
                cx="70" cy="70" r={radius} fill="none"
                stroke="#10B981" strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${saved * circumference} ${circumference}`}
                strokeDashoffset={circumference * 0.25}
                style={{ transition: "stroke-dasharray 1s ease" }}
            />
            {/* Center text */}
            <text x="70" y="64" textAnchor="middle" fill="#F1F5F9" fontSize="18" fontWeight="800" fontFamily="Inter, sans-serif">₹7.5L</text>
            <text x="70" y="82" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="Inter, sans-serif">saved/year</text>
        </svg>
    );
}

/* ─── Horizontal Bar: Insurance Gap ─── */
function InsuranceBarChart() {
    return (
        <svg viewBox="0 0 240 100" width="240" height="100">
            {/* Labels */}
            <text x="0" y="16" fill="#94A3B8" fontSize="10" fontFamily="Inter, sans-serif">Current Cover</text>
            <text x="0" y="60" fill="#94A3B8" fontSize="10" fontFamily="Inter, sans-serif">Needed Cover</text>

            {/* Current bar — short, amber */}
            <rect x="0" y="22" width="58" height="18" rx="4" fill="#F59E0B" fillOpacity="0.8" />
            <text x="65" y="35" fill="#F59E0B" fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif">₹50L</text>

            {/* Needed bar — full, green */}
            <rect x="0" y="66" width="200" height="18" rx="4" fill="#10B981" fillOpacity="0.8" />
            <text x="208" y="79" fill="#10B981" fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif">₹2.1Cr</text>

            {/* Gap indicator */}
            <line x1="58" y1="26" x2="58" y2="90" stroke="#EF4444" strokeWidth="1" strokeDasharray="3 2" />
            <rect x="62" y="42" width="45" height="14" rx="7" fill="rgba(239,68,68,0.15)" />
            <text x="84" y="52" textAnchor="middle" fill="#EF4444" fontSize="8" fontWeight="600" fontFamily="Inter, sans-serif">Gap ↗</text>
        </svg>
    );
}

/* ─── Line Chart: Retirement Corpus Growth ─── */
function RetirementLineChart() {
    return (
        <svg viewBox="0 0 240 120" width="240" height="120">
            <defs>
                <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="shortfallGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Grid */}
            {[0, 1, 2, 3].map((i) => (
                <line key={i} x1="0" y1={20 + i * 28} x2="240" y2={20 + i * 28} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            ))}

            {/* Target line (dashed) */}
            <line x1="0" y1="20" x2="240" y2="20" stroke="#10B981" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.5" />
            <text x="242" y="24" fill="#10B981" fontSize="8" fontFamily="Inter, sans-serif">₹2.4Cr</text>

            {/* Shortfall area */}
            <path d="M0,100 C30,95 60,88 90,78 C120,65 150,50 180,38 C200,30 220,25 240,22 L240,20 L180,20 C180,20 150,20 120,20 L0,20 Z" fill="url(#shortfallGrad)" />

            {/* Growth area fill */}
            <path d="M0,100 C30,95 60,88 90,78 C120,65 150,50 180,38 C200,30 220,25 240,22 L240,105 L0,105 Z" fill="url(#retGrad)" />

            {/* Growth line */}
            <path
                d="M0,100 C30,95 60,88 90,78 C120,65 150,50 180,38 C200,30 220,25 240,22"
                stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" fill="none"
            />

            {/* Endpoint dot */}
            <circle cx="240" cy="22" r="3" fill="#10B981" />
            <circle cx="240" cy="22" r="6" fill="#10B981" fillOpacity="0.2" />

            {/* X labels */}
            <text x="0" y="115" fill="#64748B" fontSize="8" fontFamily="Inter, sans-serif">Now</text>
            <text x="85" y="115" fill="#64748B" fontSize="8" fontFamily="Inter, sans-serif">10yr</text>
            <text x="175" y="115" fill="#64748B" fontSize="8" fontFamily="Inter, sans-serif">20yr</text>
            <text x="225" y="115" fill="#64748B" fontSize="8" fontFamily="Inter, sans-serif">30yr</text>
        </svg>
    );
}

const cards = [
    {
        icon: <IndianRupee size={20} />,
        title: "Tax Optimisation",
        metric: "₹7.5L",
        metricSub: "saved per year",
        description: "Smart tax planning under the new regime can save lakhs annually that most people don't even realise they're losing.",
        chart: <TaxDonutChart />,
        color: "#10B981",
    },
    {
        icon: <Shield size={20} />,
        title: "Insurance Protection",
        metric: "₹1.6Cr",
        metricSub: "coverage gap",
        description: "Most families are dangerously underinsured. Your current ₹50L cover only protects 3 years of expenses.",
        chart: <InsuranceBarChart />,
        color: "#F59E0B",
    },
    {
        icon: <TrendingUp size={20} />,
        title: "Retirement Readiness",
        metric: "₹2.4Cr",
        metricSub: "corpus needed",
        description: "To retire at 50 with ₹85K monthly expenses, adjusted for 6% inflation. Start planning to bridge the gap.",
        chart: <RetirementLineChart />,
        color: "#10B981",
    },
];

export function WhyItMattersSection() {
    return (
        <section style={{ padding: "96px 0", backgroundColor: "#0B1120" }} id="why-it-matters">
            <div className="container-marketing">
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 64 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#10B981", marginBottom: 12 }}>
                        WHY IT MATTERS
                    </p>
                    <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", fontWeight: 700, color: "#F1F5F9", letterSpacing: "-0.02em", marginBottom: 12 }}>
                        Your money is silently leaking.{" "}
                        <span style={{ color: "#10B981" }}>Let&apos;s fix that.</span>
                    </h2>
                    <p style={{ maxWidth: 520, margin: "0 auto", fontSize: "1rem", color: "#94A3B8", lineHeight: 1.6 }}>
                        Most Indians lose lakhs every year to poor tax planning, inadequate insurance, and no retirement strategy.
                    </p>
                </div>

                {/* 3 Visualization Cards */}
                <div
                    className="grid"
                    style={{
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 24,
                        maxWidth: 1080,
                        margin: "0 auto",
                    }}
                >
                    {cards.map((card, i) => (
                        <div
                            key={i}
                            style={{
                                background: "rgba(15, 23, 42, 0.6)",
                                backdropFilter: "blur(12px)",
                                WebkitBackdropFilter: "blur(12px)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                borderRadius: 16,
                                padding: 28,
                                display: "flex",
                                flexDirection: "column",
                                transition: "all 0.3s ease",
                            }}
                        >
                            {/* Icon + Title */}
                            <div className="flex items-center" style={{ gap: 10, marginBottom: 20 }}>
                                <div
                                    className="flex items-center justify-center"
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 10,
                                        backgroundColor: `${card.color}15`,
                                        color: card.color,
                                    }}
                                >
                                    {card.icon}
                                </div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9" }}>
                                    {card.title}
                                </h3>
                            </div>

                            {/* Chart */}
                            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                                {card.chart}
                            </div>

                            {/* Metric */}
                            <p style={{ fontSize: 28, fontWeight: 800, color: "#F1F5F9", marginBottom: 4 }}>
                                {card.metric}
                                <span style={{ fontSize: 14, fontWeight: 400, color: "#64748B", marginLeft: 8 }}>
                                    {card.metricSub}
                                </span>
                            </p>

                            {/* Description */}
                            <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.6, marginTop: 8 }}>
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Responsive: stack on mobile */}
                <style>{`
                    @media (max-width: 768px) {
                        #why-it-matters .grid {
                            grid-template-columns: 1fr !important;
                        }
                    }
                `}</style>
            </div>
        </section>
    );
}
