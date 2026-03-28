"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { BlogPost } from "@/lib/types";
import { CommentSection } from "@/components/blog/comment-section";
import { ShareBar } from "@/components/blog/share-bar";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { BlogCard } from "@/components/blog/blog-card";
import { KeyTakeaways } from "@/components/blog/key-takeaways";
import { ArrowLeft, Calendar, Clock, User, Sparkles } from "lucide-react";
import { marked } from "marked";

const categoryColors: Record<string, { bg: string; text: string; glow: string }> = {
    "Tax Saving": { bg: "rgba(16, 185, 129, 0.15)", text: "#10B981", glow: "rgba(16, 185, 129, 0.08)" },
    Investing: { bg: "rgba(59, 130, 246, 0.15)", text: "#3B82F6", glow: "rgba(59, 130, 246, 0.08)" },
    Budgeting: { bg: "rgba(168, 85, 247, 0.15)", text: "#A855F7", glow: "rgba(168, 85, 247, 0.08)" },
    Insurance: { bg: "rgba(245, 158, 11, 0.15)", text: "#F59E0B", glow: "rgba(245, 158, 11, 0.08)" },
    "NPS & Retirement": { bg: "rgba(236, 72, 153, 0.15)", text: "#EC4899", glow: "rgba(236, 72, 153, 0.08)" },
    "Personal Finance Foundations": { bg: "rgba(14, 165, 233, 0.15)", text: "#0EA5E9", glow: "rgba(14, 165, 233, 0.08)" },
    "Income & Cash Flow Management": { bg: "rgba(168, 85, 247, 0.15)", text: "#A855F7", glow: "rgba(168, 85, 247, 0.08)" },
    "Investment Basics": { bg: "rgba(59, 130, 246, 0.15)", text: "#3B82F6", glow: "rgba(59, 130, 246, 0.08)" },
    "Mutual Funds Investing": { bg: "rgba(99, 102, 241, 0.15)", text: "#6366F1", glow: "rgba(99, 102, 241, 0.08)" },
    "Stock Market Investing": { bg: "rgba(244, 63, 94, 0.15)", text: "#F43F5E", glow: "rgba(244, 63, 94, 0.08)" },
    "Tax Planning": { bg: "rgba(16, 185, 129, 0.15)", text: "#10B981", glow: "rgba(16, 185, 129, 0.08)" },
    "Retirement Planning": { bg: "rgba(236, 72, 153, 0.15)", text: "#EC4899", glow: "rgba(236, 72, 153, 0.08)" },
    "Insurance Planning": { bg: "rgba(245, 158, 11, 0.15)", text: "#F59E0B", glow: "rgba(245, 158, 11, 0.08)" },
    "Debt Management & Credit Score": { bg: "rgba(239, 68, 68, 0.15)", text: "#EF4444", glow: "rgba(239, 68, 68, 0.08)" },
    "NRI Financial Planning": { bg: "rgba(139, 92, 246, 0.15)", text: "#8B5CF6", glow: "rgba(139, 92, 246, 0.08)" },
    "Behavioral Finance & Money Psychology": { bg: "rgba(20, 184, 166, 0.15)", text: "#14B8A6", glow: "rgba(20, 184, 166, 0.08)" },
    "MyFinancial Services & Financial Diagnostics": { bg: "rgba(217, 119, 6, 0.15)", text: "#D97706", glow: "rgba(217, 119, 6, 0.08)" },
    "Market Updates": { bg: "rgba(251, 146, 60, 0.15)", text: "#FB923C", glow: "rgba(251, 146, 60, 0.08)" },
    General: { bg: "rgba(148, 163, 184, 0.12)", text: "#94A3B8", glow: "rgba(148, 163, 184, 0.06)" },
};

export default function BlogPostPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [post, setPost] = useState<BlogPost | null>(null);
    const [related, setRelated] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const fetchPost = async () => {
            const { data } = await supabase
                .from("blog_posts")
                .select("*")
                .eq("slug", slug)
                .eq("status", "published")
                .single();

            if (data) {
                setPost(data as BlogPost);

                const { data: relatedData } = await supabase
                    .from("blog_posts")
                    .select("*")
                    .eq("status", "published")
                    .eq("category", data.category)
                    .neq("id", data.id)
                    .order("published_at", { ascending: false })
                    .limit(3);

                setRelated((relatedData as BlogPost[]) || []);
            }
            setLoading(false);
        };

        fetchPost();
    }, [slug]);

    // Reading progress bar
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            setScrollProgress(totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const contentHtml = useMemo(() => {
        if (!post) return "";
        const renderer = new marked.Renderer();

        renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
            const id = text
                .toLowerCase()
                .replace(/[^\w]+/g, "-")
                .replace(/(^-|-$)/g, "");
            return `<h${depth} id="${id}">${text}</h${depth}>`;
        };

        marked.setOptions({ renderer });
        return marked.parse(post.content) as string;
    }, [post]);

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                    <div className="blog-post-shimmer" style={{ width: 48, height: 48, borderRadius: 9999, margin: "0 auto 20px" }} />
                    <div className="blog-post-shimmer" style={{ width: 200, height: 14, borderRadius: 8, margin: "0 auto 12px" }} />
                    <div className="blog-post-shimmer" style={{ width: 140, height: 10, borderRadius: 8, margin: "0 auto" }} />
                </div>
                <style>{`
                    @keyframes shimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                    .blog-post-shimmer {
                        background: linear-gradient(90deg, #1E293B 25%, #334155 50%, #1E293B 75%);
                        background-size: 200% 100%;
                        animation: shimmer 1.8s ease-in-out infinite;
                    }
                `}</style>
            </div>
        );
    }

    if (!post) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center", maxWidth: 400 }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: 16,
                        background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 20px", fontSize: 28,
                    }}>
                        ?
                    </div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: "#F1F5F9", marginBottom: 8 }}>Article not found</h2>
                    <p style={{ color: "#64748B", marginBottom: 28, fontSize: 15, lineHeight: 1.6 }}>
                        The article you&apos;re looking for doesn&apos;t exist or has been removed.
                    </p>
                    <Link href="/blog" style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        padding: "12px 28px", borderRadius: 12,
                        background: "linear-gradient(135deg, #10B981, #059669)",
                        color: "#fff", fontWeight: 600, fontSize: 14,
                        textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s",
                        boxShadow: "0 4px 20px rgba(16, 185, 129, 0.3)",
                    }}>
                        <ArrowLeft size={16} /> Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    const colors = categoryColors[post.category] || categoryColors.General;
    const formattedDate = new Date(post.published_at || post.created_at).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <>
            {/* Reading progress bar */}
            <div style={{
                position: "fixed", top: 0, left: 0, zIndex: 100,
                width: `${scrollProgress}%`, height: 3,
                background: `linear-gradient(90deg, ${colors.text}, ${colors.text}dd)`,
                transition: "width 0.1s linear",
                boxShadow: `0 0 12px ${colors.text}66`,
            }} />

            <article>
                {/* Hero Section */}
                <div style={{ position: "relative", overflow: "hidden" }}>
                    {/* Ambient background glow */}
                    <div style={{
                        position: "absolute", inset: 0,
                        background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${colors.glow}, transparent 70%)`,
                        pointerEvents: "none",
                    }} />

                    <div style={{
                        maxWidth: 1200, margin: "0 auto",
                        padding: "48px 24px 0",
                    }}>
                        {/* Back link */}
                        <Link
                            href="/blog"
                            className="blog-post-back-link"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: 8,
                                fontSize: 13, fontWeight: 500,
                                color: "#64748B", textDecoration: "none",
                                marginBottom: 40,
                                padding: "8px 16px 8px 12px",
                                borderRadius: 10,
                                background: "rgba(30, 41, 59, 0.5)",
                                border: "1px solid rgba(51, 65, 85, 0.5)",
                                backdropFilter: "blur(8px)",
                                transition: "all 0.25s ease",
                            }}
                        >
                            <ArrowLeft size={14} /> All articles
                        </Link>

                        {/* Post Header — centered, editorial style */}
                        <header style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", marginBottom: 48 }}>
                            {/* Category pill */}
                            <span style={{
                                display: "inline-flex", alignItems: "center", gap: 6,
                                padding: "6px 16px", borderRadius: 9999,
                                fontSize: 12, fontWeight: 600, letterSpacing: "0.03em",
                                background: colors.bg, color: colors.text,
                                border: `1px solid ${colors.text}22`,
                                marginBottom: 24,
                            }}>
                                <Sparkles size={12} />
                                {post.category}
                            </span>

                            {/* Title */}
                            <h1 style={{
                                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                                fontWeight: 800, lineHeight: 1.2,
                                color: "#F8FAFC",
                                letterSpacing: "-0.025em",
                                marginBottom: 24,
                            }}>
                                {post.title}
                            </h1>

                            {/* Excerpt */}
                            {post.excerpt && (
                                <p style={{
                                    fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
                                    lineHeight: 1.7, color: "#94A3B8",
                                    maxWidth: 600, margin: "0 auto 28px",
                                }}>
                                    {post.excerpt}
                                </p>
                            )}

                            {/* Meta row */}
                            <div style={{
                                display: "flex", alignItems: "center", justifyContent: "center",
                                gap: 8, flexWrap: "wrap", fontSize: 13, color: "#64748B",
                            }}>
                                <span className="blog-post-meta-chip">
                                    <User size={13} /> {post.author}
                                </span>
                                <span style={{ color: "#334155" }}>·</span>
                                <span className="blog-post-meta-chip">
                                    <Calendar size={13} /> {formattedDate}
                                </span>
                                <span style={{ color: "#334155" }}>·</span>
                                <span className="blog-post-meta-chip">
                                    <Clock size={13} /> {post.reading_time} min read
                                </span>
                            </div>
                        </header>
                    </div>
                </div>

                {/* Hero Image — full-bleed with soft edges */}
                {post.cover_image && (
                    <div style={{
                        maxWidth: 960, margin: "0 auto 56px",
                        padding: "0 24px",
                    }}>
                        <div style={{
                            position: "relative", width: "100%",
                            borderRadius: 20, overflow: "hidden",
                            aspectRatio: "16 / 8",
                            background: `url(${post.cover_image}) center/cover no-repeat`,
                            boxShadow: `0 8px 40px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)`,
                        }}>
                            {/* Subtle vignette overlay */}
                            <div style={{
                                position: "absolute", inset: 0,
                                background: "radial-gradient(ellipse at center, transparent 50%, rgba(2, 6, 23, 0.4) 100%)",
                                pointerEvents: "none",
                            }} />
                        </div>
                    </div>
                )}

                {/* Key Takeaways */}
                {post.key_takeaways && post.key_takeaways.length > 0 && (
                    <div style={{ maxWidth: 760, margin: "0 auto 48px", padding: "0 24px" }}>
                        <KeyTakeaways takeaways={post.key_takeaways} />
                    </div>
                )}

                {/* Content + TOC Layout */}
                <div style={{
                    maxWidth: 1200, margin: "0 auto",
                    padding: "0 24px 80px",
                }}>
                    <div
                        className="blog-content-layout"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 240px",
                            gap: 64,
                            alignItems: "start",
                        }}
                    >
                        {/* Main Content */}
                        <div style={{ maxWidth: 720 }}>
                            <div
                                className="blog-prose"
                                dangerouslySetInnerHTML={{ __html: contentHtml }}
                            />

                            <ShareBar slug={post.slug} title={post.title} likes={post.likes} />
                            <CommentSection postId={post.id} />
                        </div>

                        {/* TOC Sidebar */}
                        <aside className="blog-toc-sidebar">
                            <TableOfContents contentHtml={contentHtml} />
                        </aside>
                    </div>

                    {/* Related Posts */}
                    {related.length > 0 && (
                        <section style={{ marginTop: 80 }}>
                            <div style={{
                                display: "flex", alignItems: "center", gap: 12,
                                marginBottom: 32,
                            }}>
                                <div style={{
                                    width: 4, height: 24, borderRadius: 4,
                                    background: `linear-gradient(to bottom, ${colors.text}, transparent)`,
                                }} />
                                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#F1F5F9", letterSpacing: "-0.01em" }}>
                                    Related articles
                                </h3>
                            </div>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                                gap: 24,
                            }}>
                                {related.map((r) => (
                                    <BlogCard key={r.id} post={r} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </article>

            {/* Premium prose styles */}
            <style>{`
                .blog-post-back-link:hover {
                    color: #CBD5E1 !important;
                    border-color: rgba(100, 116, 139, 0.5) !important;
                    background: rgba(30, 41, 59, 0.8) !important;
                    transform: translateX(-2px);
                }
                .blog-post-meta-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                }

                /* ─── Prose typography ─── */
                .blog-prose {
                    font-size: 1.0625rem;
                    line-height: 1.85;
                    color: #CBD5E1;
                }
                .blog-prose > *:first-child {
                    margin-top: 0;
                }

                /* Drop cap for first paragraph */
                .blog-prose > p:first-of-type::first-letter {
                    float: left;
                    font-size: 3.4em;
                    font-weight: 800;
                    line-height: 0.8;
                    margin: 6px 12px 0 0;
                    color: #F1F5F9;
                }

                .blog-prose h2 {
                    font-size: 1.55rem;
                    font-weight: 750;
                    color: #F8FAFC;
                    margin: 56px 0 20px;
                    letter-spacing: -0.02em;
                    line-height: 1.3;
                    padding-bottom: 12px;
                    border-bottom: 1px solid rgba(51, 65, 85, 0.4);
                }
                .blog-prose h3 {
                    font-size: 1.25rem;
                    font-weight: 650;
                    color: #F1F5F9;
                    margin: 40px 0 14px;
                    letter-spacing: -0.01em;
                    line-height: 1.35;
                }
                .blog-prose h4 {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #E2E8F0;
                    margin: 32px 0 12px;
                }
                .blog-prose p {
                    margin: 0 0 24px;
                }
                .blog-prose a {
                    color: #10B981;
                    text-decoration: none;
                    background: linear-gradient(to top, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.15) 30%, transparent 30%);
                    transition: background 0.25s ease;
                    padding-bottom: 1px;
                }
                .blog-prose a:hover {
                    background: linear-gradient(to top, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.3) 100%, transparent 100%);
                    color: #34D399;
                }
                .blog-prose strong {
                    color: #F1F5F9;
                    font-weight: 650;
                }
                .blog-prose ul, .blog-prose ol {
                    margin: 0 0 24px;
                    padding-left: 24px;
                }
                .blog-prose li {
                    margin-bottom: 10px;
                    padding-left: 4px;
                }
                .blog-prose li::marker {
                    color: #475569;
                }

                /* Blockquote — editorial callout */
                .blog-prose blockquote {
                    position: relative;
                    border-left: none;
                    padding: 24px 28px 24px 56px;
                    margin: 32px 0;
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(16, 185, 129, 0.02) 100%);
                    border-radius: 12px;
                    border: 1px solid rgba(16, 185, 129, 0.12);
                    color: #94A3B8;
                    font-style: italic;
                    font-size: 1.05rem;
                    line-height: 1.75;
                }
                .blog-prose blockquote::before {
                    content: '"';
                    position: absolute;
                    top: 16px;
                    left: 20px;
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: #10B981;
                    opacity: 0.4;
                    line-height: 1;
                    font-family: Georgia, serif;
                }
                .blog-prose blockquote p {
                    margin-bottom: 0;
                }

                /* Code */
                .blog-prose code {
                    background: rgba(30, 41, 59, 0.8);
                    padding: 3px 8px;
                    border-radius: 6px;
                    font-size: 0.875em;
                    color: #10B981;
                    border: 1px solid rgba(51, 65, 85, 0.5);
                    font-weight: 500;
                }
                .blog-prose pre {
                    background: linear-gradient(180deg, #0F172A 0%, #0C1322 100%);
                    padding: 24px;
                    border-radius: 14px;
                    border: 1px solid rgba(51, 65, 85, 0.5);
                    overflow-x: auto;
                    margin: 28px 0;
                    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
                }
                .blog-prose pre code {
                    background: none;
                    padding: 0;
                    color: #CBD5E1;
                    border: none;
                    font-size: 0.85em;
                }

                /* Images */
                .blog-prose img {
                    max-width: 100%;
                    border-radius: 14px;
                    margin: 28px 0;
                    box-shadow: 0 4px 24px -8px rgba(0, 0, 0, 0.4);
                    border: 1px solid rgba(51, 65, 85, 0.3);
                }

                /* Tables */
                .blog-prose table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                    margin: 28px 0;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid rgba(51, 65, 85, 0.5);
                }
                .blog-prose th, .blog-prose td {
                    padding: 12px 16px;
                    text-align: left;
                    border-bottom: 1px solid rgba(51, 65, 85, 0.4);
                }
                .blog-prose th {
                    background: rgba(15, 23, 42, 0.9);
                    font-weight: 650;
                    color: #F1F5F9;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                .blog-prose tr:last-child td {
                    border-bottom: none;
                }
                .blog-prose tr:nth-child(even) td {
                    background: rgba(15, 23, 42, 0.3);
                }

                /* HR / divider */
                .blog-prose hr {
                    border: none;
                    height: 1px;
                    margin: 48px auto;
                    max-width: 120px;
                    background: linear-gradient(90deg, transparent, #334155, transparent);
                }

                /* TOC sidebar */
                .blog-toc-sidebar {
                    display: block;
                }

                /* Responsive */
                @media (max-width: 900px) {
                    .blog-content-layout {
                        grid-template-columns: 1fr !important;
                        gap: 0 !important;
                    }
                    .blog-toc-sidebar {
                        display: none !important;
                    }
                }
            `}</style>
        </>
    );
}
