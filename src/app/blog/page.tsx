"use client";

import { useState, useEffect } from "react";
import type { BlogPost, BlogCategory } from "@/lib/types";
import { BlogCard } from "@/components/blog/blog-card";
import { CategoryFilter } from "@/components/blog/category-filter";
import { BookOpen } from "lucide-react";
import { useAppTheme } from "@/hooks/useAppTheme";

const POSTS_PER_PAGE = 9;

export default function BlogPage() {
    const palette = useAppTheme();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState<BlogCategory | "All">("All");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            const params = new URLSearchParams();
            params.set("status", "published");
            params.set("page", String(page));
            params.set("limit", String(POSTS_PER_PAGE));
            if (category !== "All") params.set("category", category);

            const res = await fetch(`/api/blog/posts?${params}`);
            if (res.ok) {
                const { posts, total } = await res.json();
                setPosts(posts || []);
                setTotal(total || 0);
            }
            setLoading(false);
        };
        fetchPosts();
    }, [category, page]);

    const totalPages = Math.ceil(total / POSTS_PER_PAGE);
    const featured = page === 1 && category === "All" ? posts[0] : null;
    const gridPosts = featured ? posts.slice(1) : posts;

    return (
        <section className="section-padding" style={{ minHeight: "80vh" }}>
            <div className="container-marketing">
                {/* Section Header */}
                <div style={{ textAlign: "center", marginBottom: 48 }}>
                    <span className="badge badge-accent" style={{ marginBottom: 16, display: "inline-flex" }}>
                        <BookOpen size={14} />
                        Insights & Guides
                    </span>
                    <h1 className="text-h1" style={{ marginBottom: 12 }}>
                        Financial Wisdom,{" "}
                        <span style={{ color: "#10B981" }}>One Article at a Time</span>
                    </h1>
                    <p className="text-body-lg" style={{ color: palette.mute, maxWidth: 560, margin: "0 auto" }}>
                        Expert tips on budgeting, tax saving, insurance, investing and more — tailored for India.
                    </p>
                </div>

                {/* Category Filter */}
                <CategoryFilter
                    selected={category}
                    onChange={(cat) => {
                        setCategory(cat);
                        setPage(1);
                    }}
                />

                {loading ? (
                    <div style={{ textAlign: "center", padding: 80, color: palette.mute }}>
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                border: `3px solid ${palette.s3}`,
                                borderTopColor: "#10B981",
                                borderRadius: 9999,
                                animation: "spin 0.8s linear infinite",
                                margin: "0 auto 16px",
                            }}
                        />
                        Loading articles...
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : posts.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: 80,
                            color: palette.mute,
                            background: palette.s2,
                            borderRadius: 16,
                            border: `1px solid ${palette.brd2}`,
                        }}
                    >
                        <BookOpen size={40} style={{ margin: "0 auto 16px", opacity: 0.4 }} />
                        <p style={{ fontSize: 16 }}>No articles found in this category yet.</p>
                        <p style={{ fontSize: 13, marginTop: 8 }}>Check back soon — new content is coming!</p>
                    </div>
                ) : (
                    <>
                        {/* Featured Post */}
                        {featured && (
                            <div style={{ marginBottom: 32 }}>
                                <BlogCard post={featured} featured />
                            </div>
                        )}

                        {/* Post Grid */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                                gap: 24,
                            }}
                        >
                            {gridPosts.map((post) => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 8,
                                    marginTop: 48,
                                }}
                            >
                                <button
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    style={{
                                        padding: "10px 20px",
                                        borderRadius: 10,
                                        border: `1px solid ${palette.brd2}`,
                                        background: palette.s2,
                                        color: page === 1 ? palette.brd2 : palette.mute,
                                        cursor: page === 1 ? "not-allowed" : "pointer",
                                        fontSize: 13,
                                        fontWeight: 500,
                                    }}
                                >
                                    ← Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 8,
                                            border: p === page ? "1px solid #10B981" : `1px solid ${palette.brd2}`,
                                            background: p === page ? "rgba(16, 185, 129, 0.15)" : "transparent",
                                            color: p === page ? "#10B981" : palette.mute,
                                            cursor: "pointer",
                                            fontSize: 13,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                                    disabled={page === totalPages}
                                    style={{
                                        padding: "10px 20px",
                                        borderRadius: 10,
                                        border: `1px solid ${palette.brd2}`,
                                        background: palette.s2,
                                        color: page === totalPages ? palette.brd2 : palette.mute,
                                        cursor: page === totalPages ? "not-allowed" : "pointer",
                                        fontSize: 13,
                                        fontWeight: 500,
                                    }}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
