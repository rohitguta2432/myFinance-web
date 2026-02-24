import {
    Wallet,
    Calculator,
    Shield,
    Flag,
    ListChecks,
    ArrowRight,
    AlertTriangle,
    CheckCircle,
} from "lucide-react";

const cardStyle: React.CSSProperties = {
    position: "relative",
    overflow: "hidden",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    backgroundColor: "#fff",
    padding: 24,
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
};

const iconBoxStyle: React.CSSProperties = {
    width: 48,
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#ecfdf5",
    color: "#059467",
    marginBottom: 16,
};

const dividerStyle: React.CSSProperties = {
    borderTop: "1px solid #f1f5f9",
    paddingTop: 16,
    marginTop: "auto",
};

export function OutcomesSection() {
    return (
        <section
            id="outcomes"
            style={{ backgroundColor: "#fff", paddingTop: 80, paddingBottom: 80 }}
        >
            <div className="container-7xl">
                {/* Header */}
                <div style={{ maxWidth: 768, margin: "0 auto 64px", textAlign: "center" }}>
                    <span
                        style={{
                            display: "block",
                            fontSize: 14,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            color: "#059467",
                            marginBottom: 16,
                        }}
                    >
                        What You Get
                    </span>
                    <h2
                        style={{
                            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                            fontWeight: 700,
                            letterSpacing: "-0.025em",
                            color: "#0f172a",
                            lineHeight: 1.3,
                        }}
                    >
                        Five outcomes. Ten minutes. <br />
                        Zero data shared.
                    </h2>
                </div>

                {/* Grid Layout */}
                <div style={{ maxWidth: 1152, margin: "0 auto" }}>
                    {/* Top Row: 3 Cards */}
                    <div
                        className="grid"
                        style={{
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: 24,
                        }}
                    >
                        {/* Card 1: Post-Tax Reality */}
                        <div style={cardStyle}>
                            <div style={iconBoxStyle}>
                                <Wallet size={24} />
                            </div>
                            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
                                Post-Tax Reality
                            </h3>
                            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 16 }}>
                                Understand your actual disposable income after all deductions.
                            </p>
                            <div className="flex items-baseline gap-2" style={dividerStyle}>
                                <span style={{ fontSize: 24, fontWeight: 700, color: "#94a3b8", textDecoration: "line-through" }}>
                                    ₹45.7L
                                </span>
                                <ArrowRight size={14} style={{ color: "#94a3b8" }} />
                                <span style={{ fontSize: 24, fontWeight: 700, color: "#059467" }}>
                                    ₹38.2L
                                </span>
                            </div>
                        </div>

                        {/* Card 2: Tax Regime Optimizer */}
                        <div style={cardStyle}>
                            <div style={iconBoxStyle}>
                                <Calculator size={24} />
                            </div>
                            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
                                Tax Regime Optimizer
                            </h3>
                            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 16 }}>
                                Compare New vs Old regime for FY26-27 instantly.
                            </p>
                            <div style={dividerStyle}>
                                <div className="flex items-center justify-between" style={{ fontSize: 14 }}>
                                    <span style={{ fontWeight: 500, color: "#475569" }}>Old Regime</span>
                                    <span style={{ fontWeight: 700, color: "#ef4444" }}>Higher Tax</span>
                                </div>
                                <div className="flex items-center justify-between" style={{ fontSize: 14, marginTop: 8 }}>
                                    <span style={{ fontWeight: 500, color: "#475569" }}>New Regime</span>
                                    <span style={{ fontWeight: 700, color: "#059467" }}>Save ₹45k</span>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Insurance Gap Check */}
                        <div style={cardStyle}>
                            <div style={iconBoxStyle}>
                                <Shield size={24} />
                            </div>
                            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
                                Insurance Gap Check
                            </h3>
                            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 16 }}>
                                Are your dependents truly protected if something happens?
                            </p>
                            <div style={dividerStyle}>
                                <div
                                    className="flex items-center gap-2"
                                    style={{
                                        borderRadius: 8,
                                        backgroundColor: "#fef2f2",
                                        padding: 8,
                                        color: "#b91c1c",
                                    }}
                                >
                                    <AlertTriangle size={20} />
                                    <span style={{ fontWeight: 700 }}>₹1.6Cr Coverage Gap</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: 2 Cards Centered */}
                    <div
                        className="grid"
                        style={{
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: 24,
                            marginTop: 24,
                            maxWidth: 768,
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        {/* Card 4: Goal Feasibility */}
                        <div style={cardStyle}>
                            <div style={iconBoxStyle}>
                                <Flag size={24} />
                            </div>
                            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
                                Goal Feasibility
                            </h3>
                            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 16 }}>
                                Can you actually afford that house or early retirement?
                            </p>
                            <div style={dividerStyle}>
                                <div className="flex items-center justify-between">
                                    <span style={{ fontWeight: 500, color: "#334155" }}>Retire at 50?</span>
                                    <div className="flex items-center gap-1" style={{ color: "#059467" }}>
                                        <CheckCircle size={20} />
                                        <span style={{ fontWeight: 700 }}>On Track</span>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        marginTop: 8,
                                        height: 8,
                                        width: "100%",
                                        borderRadius: 9999,
                                        backgroundColor: "#f1f5f9",
                                        overflow: "hidden",
                                    }}
                                >
                                    <div
                                        style={{
                                            height: "100%",
                                            width: "85%",
                                            borderRadius: 9999,
                                            backgroundColor: "#059467",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Card 5: Action Plan */}
                        <div style={cardStyle}>
                            <div style={iconBoxStyle}>
                                <ListChecks size={24} />
                            </div>
                            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
                                Action Plan
                            </h3>
                            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 16 }}>
                                Clear next steps to optimize your financial health.
                            </p>
                            <div style={dividerStyle}>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                    {[
                                        "Increase term insurance cover",
                                        "Start ₹5k SIP for Tax Saving",
                                        "Review emergency fund",
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-2"
                                            style={{ fontSize: 14, color: "#475569", marginTop: i > 0 ? 8 : 0 }}
                                        >
                                            <span
                                                className="flex items-center justify-center shrink-0"
                                                style={{
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: 9999,
                                                    backgroundColor: "#059467",
                                                    color: "#fff",
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                    marginTop: 2,
                                                }}
                                            >
                                                {i + 1}
                                            </span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
