import Link from "next/link";
import { Shield } from "lucide-react";

const productLinks = [
    { href: "/", label: "Assessment" },
    { href: "/", label: "Retirement Planner" },
    { href: "/", label: "Tax Optimizer" },
    { href: "/pricing", label: "Pricing" },
];

const resourceLinks = [
    { href: "/", label: "Blog" },
    { href: "/", label: "Calculators" },
];

const legalLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/", label: "Terms of Service" },
    { href: "/disclaimer", label: "Disclaimer" },
];

const columnHeaderStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#0f172a",
    marginBottom: 16,
};

const linkStyle: React.CSSProperties = {
    fontSize: 14,
    color: "#9ca3af",
    textDecoration: "none",
    display: "block",
    marginBottom: 10,
};

export function Footer() {
    return (
        <footer style={{ borderTop: "1px solid #f3f4f6", backgroundColor: "#fff" }}>
            <div className="container-7xl" style={{ paddingTop: 56, paddingBottom: 56 }}>
                {/* Grid */}
                <div
                    className="grid"
                    style={{
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: 40,
                    }}
                >
                    {/* Brand */}
                    <div>
                        <Link
                            href="/"
                            className="flex items-center"
                            style={{ gap: 8, marginBottom: 12, textDecoration: "none" }}
                        >
                            <div
                                className="flex items-center justify-center"
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 8,
                                    backgroundColor: "#059467",
                                }}
                            >
                                <span style={{ color: "#fff", fontWeight: 700, fontSize: 10 }}>M</span>
                            </div>
                            <span style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                                My<span style={{ color: "#059467" }}>Financial</span>
                            </span>
                        </Link>
                        <p
                            style={{
                                fontSize: 12,
                                color: "#9ca3af",
                                lineHeight: 1.6,
                                marginBottom: 16,
                                maxWidth: 200,
                            }}
                        >
                            Empowering Indians with clear, unbiased financial insights.
                        </p>
                        <div className="flex items-center" style={{ gap: 6, fontSize: 12, color: "#9ca3af" }}>
                            <Shield size={12} style={{ color: "#059467" }} />
                            Data stays on your device
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 style={columnHeaderStyle}>Product</h4>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {productLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} style={linkStyle}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 style={columnHeaderStyle}>Resources</h4>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {resourceLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} style={linkStyle}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 style={columnHeaderStyle}>Legal</h4>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {legalLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} style={linkStyle}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div
                    className="flex items-center justify-between"
                    style={{
                        borderTop: "1px solid #f3f4f6",
                        marginTop: 40,
                        paddingTop: 24,
                    }}
                >
                    <p style={{ fontSize: 12, color: "#9ca3af" }}>
                        © 2024 MyFinancial. Made for modern India.
                    </p>
                    <div className="flex items-center" style={{ gap: 6, fontSize: 12, color: "#9ca3af" }}>
                        <Shield size={12} style={{ color: "#059467" }} />
                        <span>Privacy-first design</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
