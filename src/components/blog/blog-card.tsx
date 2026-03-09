import Link from "next/link";
import type { BlogPost } from "@/lib/types";

const categoryColors: Record<string, { bg: string; text: string }> = {
    // Old categories
    "Tax Saving": { bg: "rgba(16, 185, 129, 0.15)", text: "#10B981" },
    Investing: { bg: "rgba(59, 130, 246, 0.15)", text: "#3B82F6" },
    Budgeting: { bg: "rgba(168, 85, 247, 0.15)", text: "#A855F7" },
    Insurance: { bg: "rgba(245, 158, 11, 0.15)", text: "#F59E0B" },
    "NPS & Retirement": { bg: "rgba(236, 72, 153, 0.15)", text: "#EC4899" },
    // New Categories
    "Personal Finance Foundations": { bg: "rgba(14, 165, 233, 0.15)", text: "#0EA5E9" }, // Sky
    "Income & Cash Flow Management": { bg: "rgba(168, 85, 247, 0.15)", text: "#A855F7" }, // Purple
    "Investment Basics": { bg: "rgba(59, 130, 246, 0.15)", text: "#3B82F6" }, // Blue
    "Mutual Funds Investing": { bg: "rgba(99, 102, 241, 0.15)", text: "#6366F1" }, // Indigo
    "Stock Market Investing": { bg: "rgba(244, 63, 94, 0.15)", text: "#F43F5E" }, // Rose
    "Tax Planning": { bg: "rgba(16, 185, 129, 0.15)", text: "#10B981" }, // Emerald 
    "Retirement Planning": { bg: "rgba(236, 72, 153, 0.15)", text: "#EC4899" }, // Pink
    "Insurance Planning": { bg: "rgba(245, 158, 11, 0.15)", text: "#F59E0B" }, // Amber
    "Debt Management & Credit Score": { bg: "rgba(239, 68, 68, 0.15)", text: "#EF4444" }, // Red
    "NRI Financial Planning": { bg: "rgba(139, 92, 246, 0.15)", text: "#8B5CF6" }, // Violet
    "Behavioral Finance & Money Psychology": { bg: "rgba(20, 184, 166, 0.15)", text: "#14B8A6" }, // Teal
    "MyFinancial Services & Financial Diagnostics": { bg: "rgba(217, 119, 6, 0.15)", text: "#D97706" }, // Amber darker
    General: { bg: "rgba(148, 163, 184, 0.12)", text: "#94A3B8" }, // Slate
};

export function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
    const colors = categoryColors[post.category] || categoryColors.General;
    const formattedDate = new Date(post.published_at || post.created_at).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    if (featured) {
        return (
            <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <article
                    className="card-glass"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 0,
                        padding: 0,
                        overflow: "hidden",
                        cursor: "pointer",
                    }}
                >
                    {/* Cover Image */}
                    <div
                        style={{
                            position: "relative",
                            minHeight: 280,
                            background: post.cover_image
                                ? `url(${post.cover_image}) center/cover no-repeat`
                                : "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background: "linear-gradient(to right, transparent 60%, rgba(15, 23, 42, 0.8))",
                            }}
                        />
                        {/* Featured badge */}
                        <span
                            style={{
                                position: "absolute",
                                top: 16,
                                left: 16,
                                padding: "6px 14px",
                                borderRadius: 9999,
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                background: "rgba(16, 185, 129, 0.2)",
                                color: "#10B981",
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            ✦ Featured
                        </span>
                    </div>

                    {/* Content */}
                    <div style={{ padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <span
                            style={{
                                display: "inline-block",
                                padding: "4px 12px",
                                borderRadius: 9999,
                                fontSize: 12,
                                fontWeight: 600,
                                background: colors.bg,
                                color: colors.text,
                                marginBottom: 12,
                                width: "fit-content",
                            }}
                        >
                            {post.category}
                        </span>
                        <h3 className="text-h3" style={{ marginBottom: 12 }}>
                            {post.title}
                        </h3>
                        <p className="text-body-sm" style={{ color: "#94A3B8", marginBottom: 16, lineHeight: 1.6 }}>
                            {post.excerpt}
                        </p>
                        <div className="text-caption" style={{ color: "#64748B" }}>
                            {formattedDate} · {post.reading_time} min read
                        </div>
                    </div>
                </article>
            </Link>
        );
    }

    return (
        <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
            <article
                className="card-glass"
                style={{
                    padding: 0,
                    overflow: "hidden",
                    cursor: "pointer",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Cover */}
                <div
                    style={{
                        position: "relative",
                        height: 180,
                        background: post.cover_image
                            ? `url(${post.cover_image}) center/cover no-repeat`
                            : "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 60,
                            background: "linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent)",
                        }}
                    />
                </div>

                {/* Body */}
                <div style={{ padding: "20px 20px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <span
                        style={{
                            display: "inline-block",
                            padding: "3px 10px",
                            borderRadius: 9999,
                            fontSize: 11,
                            fontWeight: 600,
                            background: colors.bg,
                            color: colors.text,
                            marginBottom: 10,
                            width: "fit-content",
                        }}
                    >
                        {post.category}
                    </span>
                    <h4 className="text-h4" style={{ marginBottom: 8, lineHeight: 1.35 }}>
                        {post.title}
                    </h4>
                    <p
                        className="text-body-sm"
                        style={{
                            color: "#94A3B8",
                            marginBottom: 16,
                            lineHeight: 1.5,
                            flex: 1,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {post.excerpt}
                    </p>
                    <div className="text-caption" style={{ color: "#64748B" }}>
                        {formattedDate} · {post.reading_time} min read
                    </div>
                </div>
            </article>
        </Link>
    );
}
