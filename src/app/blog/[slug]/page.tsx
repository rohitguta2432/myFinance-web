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
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { marked } from "marked";

const categoryColors: Record<string, { bg: string; text: string }> = {
    "Tax Saving": { bg: "rgba(16, 185, 129, 0.15)", text: "#10B981" },
    Investing: { bg: "rgba(59, 130, 246, 0.15)", text: "#3B82F6" },
    Budgeting: { bg: "rgba(168, 85, 247, 0.15)", text: "#A855F7" },
    Insurance: { bg: "rgba(245, 158, 11, 0.15)", text: "#F59E0B" },
    "NPS & Retirement": { bg: "rgba(236, 72, 153, 0.15)", text: "#EC4899" },
    General: { bg: "rgba(148, 163, 184, 0.12)", text: "#94A3B8" },
};

export default function BlogPostPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [post, setPost] = useState<BlogPost | null>(null);
    const [related, setRelated] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

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

                // Fetch related posts
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

    const contentHtml = useMemo(() => {
        if (!post) return "";
        // Configure marked for blog content
        const renderer = new marked.Renderer();

        // Add IDs to headings for TOC linking
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
            <div className="section-padding" style={{ textAlign: "center", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            border: "3px solid #1E293B",
                            borderTopColor: "#10B981",
                            borderRadius: 9999,
                            animation: "spin 0.8s linear infinite",
                            margin: "0 auto 16px",
                        }}
                    />
                    <p style={{ color: "#64748B", fontSize: 14 }}>Loading article...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="section-padding" style={{ textAlign: "center", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div>
                    <h2 className="text-h2" style={{ marginBottom: 12 }}>Article not found</h2>
                    <p style={{ color: "#94A3B8", marginBottom: 24 }}>The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                    <Link href="/blog" className="btn-primary" style={{ textDecoration: "none" }}>
                        ← Back to Blog
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
        <article className="section-padding">
            <div className="container-marketing">
                {/* Back link */}
                <Link
                    href="/blog"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 14,
                        color: "#64748B",
                        textDecoration: "none",
                        marginBottom: 32,
                        transition: "color 0.2s",
                    }}
                >
                    <ArrowLeft size={14} /> Back to Blog
                </Link>

                {/* Post Header */}
                <header style={{ maxWidth: 720, marginBottom: 32 }}>
                    <span
                        style={{
                            display: "inline-block",
                            padding: "5px 14px",
                            borderRadius: 9999,
                            fontSize: 12,
                            fontWeight: 600,
                            background: colors.bg,
                            color: colors.text,
                            marginBottom: 16,
                        }}
                    >
                        {post.category}
                    </span>
                    <h1 className="text-h1" style={{ marginBottom: 16 }}>
                        {post.title}
                    </h1>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 20,
                            flexWrap: "wrap",
                            fontSize: 14,
                            color: "#64748B",
                        }}
                    >
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <User size={14} /> {post.author}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Calendar size={14} /> {formattedDate}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Clock size={14} /> {post.reading_time} min read
                        </span>
                    </div>
                </header>

                {/* Hero Image */}
                {post.cover_image && (
                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            maxWidth: 900,
                            height: 400,
                            borderRadius: 16,
                            overflow: "hidden",
                            marginBottom: 48,
                            background: `url(${post.cover_image}) center/cover no-repeat`,
                            boxShadow: "0 0 40px -10px rgba(16, 185, 129, 0.15)",
                        }}
                    />
                )}

                {/* Content + TOC Layout */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 220px",
                        gap: 48,
                        alignItems: "start",
                    }}
                    className="blog-content-layout"
                >
                    {/* Main Content */}
                    <div style={{ maxWidth: 720 }}>
                        <div
                            className="blog-prose"
                            dangerouslySetInnerHTML={{ __html: contentHtml }}
                        />

                        {/* Share Bar */}
                        <ShareBar slug={post.slug} title={post.title} likes={post.likes} />

                        {/* Comments */}
                        <CommentSection postId={post.id} />
                    </div>

                    {/* TOC Sidebar (desktop) */}
                    <aside className="blog-toc-sidebar">
                        <TableOfContents contentHtml={contentHtml} />
                    </aside>
                </div>

                {/* Related Posts */}
                {related.length > 0 && (
                    <section style={{ marginTop: 64 }}>
                        <h3 className="text-h3" style={{ marginBottom: 24 }}>
                            You might also like
                        </h3>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                                gap: 24,
                            }}
                        >
                            {related.map((r) => (
                                <BlogCard key={r.id} post={r} />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Responsive + Prose styles */}
            <style>{`
                .blog-prose {
                    font-size: 1.0625rem;
                    line-height: 1.8;
                    color: #CBD5E1;
                }
                .blog-prose h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #F1F5F9;
                    margin: 40px 0 16px;
                    letter-spacing: -0.01em;
                }
                .blog-prose h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #F1F5F9;
                    margin: 32px 0 12px;
                }
                .blog-prose p {
                    margin: 0 0 20px;
                }
                .blog-prose a {
                    color: #10B981;
                    text-decoration: underline;
                    text-underline-offset: 3px;
                }
                .blog-prose a:hover {
                    color: #34D399;
                }
                .blog-prose ul, .blog-prose ol {
                    margin: 0 0 20px;
                    padding-left: 24px;
                }
                .blog-prose li {
                    margin-bottom: 8px;
                }
                .blog-prose blockquote {
                    border-left: 3px solid #10B981;
                    padding: 12px 20px;
                    margin: 24px 0;
                    background: rgba(16, 185, 129, 0.05);
                    border-radius: 0 8px 8px 0;
                    color: #94A3B8;
                    font-style: italic;
                }
                .blog-prose code {
                    background: rgba(15, 23, 42, 0.8);
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 0.9em;
                    color: #10B981;
                }
                .blog-prose pre {
                    background: #0F172A;
                    padding: 20px;
                    border-radius: 12px;
                    border: 1px solid #1E293B;
                    overflow-x: auto;
                    margin: 24px 0;
                }
                .blog-prose pre code {
                    background: none;
                    padding: 0;
                    color: #CBD5E1;
                }
                .blog-prose img {
                    max-width: 100%;
                    border-radius: 12px;
                    margin: 24px 0;
                }
                .blog-prose table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 24px 0;
                }
                .blog-prose th, .blog-prose td {
                    padding: 10px 14px;
                    border: 1px solid #1E293B;
                    text-align: left;
                }
                .blog-prose th {
                    background: rgba(15, 23, 42, 0.8);
                    font-weight: 600;
                    color: #F1F5F9;
                }
                .blog-prose hr {
                    border: none;
                    border-top: 1px solid #1E293B;
                    margin: 40px 0;
                }
                .blog-toc-sidebar {
                    display: block;
                }
                @media (max-width: 768px) {
                    .blog-content-layout {
                        grid-template-columns: 1fr !important;
                    }
                    .blog-toc-sidebar {
                        display: none !important;
                    }
                }
            `}</style>
        </article>
    );
}
