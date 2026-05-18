"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, Search as SearchIcon, X, Loader2 } from "lucide-react";
import type { BlogPost, BlogCategory } from "@/lib/types";
import { useAppTheme } from "@/hooks/useAppTheme";
import { BlogCard } from "./blog-card";
import { CategoryFilter } from "./category-filter";

const POSTS_PER_PAGE = 9;
const DEBOUNCE_MS = 280;

function buildPageList(current: number, total: number): (number | "…")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    if (current > 4) pages.push("…");
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 3) pages.push("…");
    pages.push(total);
    return pages;
}

function GridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="card-glass"
                    style={{ padding: 0, overflow: "hidden", height: 360 }}
                    aria-hidden
                >
                    <div className="blog-skel-shimmer" style={{ height: 180 }} />
                    <div style={{ padding: "20px 20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
                        <div className="blog-skel-shimmer" style={{ height: 18, width: "40%", borderRadius: 9999 }} />
                        <div className="blog-skel-shimmer" style={{ height: 20, width: "90%", borderRadius: 6 }} />
                        <div className="blog-skel-shimmer" style={{ height: 20, width: "75%", borderRadius: 6 }} />
                        <div className="blog-skel-shimmer" style={{ height: 14, width: "100%", borderRadius: 6, marginTop: 6 }} />
                        <div className="blog-skel-shimmer" style={{ height: 14, width: "55%", borderRadius: 6 }} />
                    </div>
                </div>
            ))}
            <style>{`
                .blog-skel-shimmer {
                    background: linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%);
                    background-size: 200% 100%;
                    animation: blogShimmer 1.4s ease-in-out infinite;
                }
                @keyframes blogShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
            `}</style>
        </div>
    );
}

export function BlogListClient({ initialPosts }: { initialPosts: BlogPost[] }) {
    const palette = useAppTheme();
    const [category, setCategory] = useState<BlogCategory | "All">("All");
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [debouncing, setDebouncing] = useState(false);

    useEffect(() => {
        if (searchInput === search) return;
        setDebouncing(true);
        const t = setTimeout(() => {
            setSearch(searchInput.trim());
            setPage(1);
            setDebouncing(false);
        }, DEBOUNCE_MS);
        return () => clearTimeout(t);
    }, [searchInput, search]);

    const filtered = useMemo(() => {
        const needle = search.toLowerCase();
        return initialPosts.filter((p) => {
            if (category !== "All" && p.category !== category) return false;
            if (!needle) return true;
            const hay = `${p.title} ${p.excerpt} ${(p.tags || []).join(" ")}`.toLowerCase();
            return hay.includes(needle);
        });
    }, [initialPosts, category, search]);

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    const pageSlice = filtered.slice(start, start + POSTS_PER_PAGE);
    const showFeatured = currentPage === 1 && category === "All" && !search;
    const featured = showFeatured ? pageSlice[0] : null;
    const gridPosts = featured ? pageSlice.slice(1) : pageSlice;

    function changeCategory(cat: BlogCategory | "All") {
        setCategory(cat);
        setPage(1);
    }

    return (
        <>
            <div style={{ maxWidth: 560, margin: "0 auto 24px", position: "relative" }}>
                <SearchIcon
                    size={16}
                    style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: palette.mute, pointerEvents: "none" }}
                />
                <input
                    type="search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search articles by title, excerpt, or tag..."
                    aria-label="Search articles"
                    style={{
                        width: "100%",
                        padding: "12px 44px 12px 44px",
                        borderRadius: 12,
                        border: `1px solid ${palette.brd2}`,
                        background: palette.s2,
                        color: palette.txt,
                        fontSize: 14,
                        outline: "none",
                    }}
                />
                {debouncing ? (
                    <Loader2
                        size={14}
                        style={{
                            position: "absolute",
                            right: 16,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: palette.mute,
                            animation: "blogSpin 0.8s linear infinite",
                        }}
                        aria-hidden
                    />
                ) : searchInput ? (
                    <button
                        onClick={() => {
                            setSearchInput("");
                            setSearch("");
                        }}
                        aria-label="Clear search"
                        type="button"
                        style={{
                            position: "absolute",
                            right: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 24,
                            height: 24,
                            borderRadius: 6,
                            border: "none",
                            background: "transparent",
                            color: palette.mute,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <X size={14} />
                    </button>
                ) : null}
                <style>{`@keyframes blogSpin { to { transform: translateY(-50%) rotate(360deg); } }`}</style>
            </div>

            <CategoryFilter selected={category} onChange={changeCategory} />

            {search && (
                <div style={{ textAlign: "center", margin: "-8px 0 24px", fontSize: 13, color: palette.mute }}>
                    {total === 0 ? `No results for "${search}"` : `${total} ${total === 1 ? "result" : "results"} for "${search}"`}
                </div>
            )}

            {total === 0 ? (
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
                    <p style={{ fontSize: 16 }}>No articles match this filter yet.</p>
                    <p style={{ fontSize: 13, marginTop: 8 }}>Try clearing search or a different category.</p>
                </div>
            ) : debouncing && search ? (
                <GridSkeleton count={6} />
            ) : (
                <>
                    {featured && (
                        <div style={{ marginBottom: 32 }}>
                            <BlogCard post={featured} featured priority />
                        </div>
                    )}

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

                    {totalPages > 1 && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 6,
                                marginTop: 48,
                                flexWrap: "wrap",
                            }}
                        >
                            <button
                                onClick={() => setPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                style={{
                                    padding: "10px 16px",
                                    borderRadius: 10,
                                    border: `1px solid ${palette.brd2}`,
                                    background: palette.s2,
                                    color: currentPage === 1 ? palette.brd2 : palette.mute,
                                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                    fontSize: 13,
                                    fontWeight: 500,
                                }}
                            >
                                ← Prev
                            </button>
                            {buildPageList(currentPage, totalPages).map((p, idx) =>
                                p === "…" ? (
                                    <span key={`gap-${idx}`} style={{ width: 28, textAlign: "center", color: palette.mute, fontSize: 13 }}>
                                        …
                                    </span>
                                ) : (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        aria-current={p === currentPage ? "page" : undefined}
                                        style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 8,
                                            border: p === currentPage ? "1px solid #10B981" : `1px solid ${palette.brd2}`,
                                            background: p === currentPage ? "rgba(16, 185, 129, 0.15)" : "transparent",
                                            color: p === currentPage ? "#10B981" : palette.mute,
                                            cursor: "pointer",
                                            fontSize: 13,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {p}
                                    </button>
                                ),
                            )}
                            <button
                                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                style={{
                                    padding: "10px 16px",
                                    borderRadius: 10,
                                    border: `1px solid ${palette.brd2}`,
                                    background: palette.s2,
                                    color: currentPage === totalPages ? palette.brd2 : palette.mute,
                                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
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
        </>
    );
}
