"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BLOG_CATEGORIES } from "@/lib/types";
import type { BlogCategory } from "@/lib/types";
import { ArrowLeft, Save, Send, Eye } from "lucide-react";

function EditorForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("id");

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [category, setCategory] = useState<BlogCategory>("General");
    const [author, setAuthor] = useState("MyFinancial");
    const [saving, setSaving] = useState(false);
    const [loadingPost, setLoadingPost] = useState(!!editId);
    const [existingStatus, setExistingStatus] = useState<string | null>(null);
    const [existingPublishedAt, setExistingPublishedAt] = useState<string | null>(null);

    // Auto-generate slug from title
    useEffect(() => {
        if (!editId) {
            setSlug(
                title
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/\s+/g, "-")
                    .replace(/-+/g, "-")
                    .trim()
            );
        }
    }, [title, editId]);

    // Load existing post for editing
    useEffect(() => {
        if (!editId) return;
        const loadPost = async () => {
            const res = await fetch("/api/admin/posts");
            if (res.ok) {
                const posts = await res.json();
                const post = posts.find((p: { id: string }) => p.id === editId);
                if (post) {
                    setTitle(post.title);
                    setSlug(post.slug);
                    setExcerpt(post.excerpt);
                    setContent(post.content);
                    setCoverImage(post.cover_image || "");
                    setCategory(post.category);
                    setAuthor(post.author);
                    setExistingStatus(post.status);
                    setExistingPublishedAt(post.published_at);
                }
            }
            setLoadingPost(false);
        };
        loadPost();
    }, [editId]);

    const handleSave = async (status: "draft" | "published") => {
        if (!title.trim() || !content.trim()) {
            alert("Title and content are required.");
            return;
        }
        setSaving(true);

        const postData = {
            id: editId || undefined,
            title: title.trim(),
            slug: slug.trim(),
            excerpt: excerpt.trim(),
            content,
            cover_image: coverImage.trim() || null,
            category,
            author: author.trim(),
            status,
            published_at: existingPublishedAt,
        };

        const res = await fetch("/api/admin/posts", {
            method: editId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData),
        });

        if (res.ok) {
            router.push("/blog/admin");
        } else {
            const err = await res.json();
            alert(`Error: ${err.error}`);
        }
        setSaving(false);
    };

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "12px 16px",
        borderRadius: 10,
        border: "1px solid #1E293B",
        background: "rgba(15, 23, 42, 0.6)",
        color: "#F1F5F9",
        fontSize: 14,
        outline: "none",
        fontFamily: "inherit",
    };

    const labelStyle: React.CSSProperties = {
        display: "block",
        fontSize: 13,
        fontWeight: 600,
        color: "#94A3B8",
        marginBottom: 6,
    };

    if (loadingPost) {
        return (
            <div className="section-padding" style={{ textAlign: "center", minHeight: "60vh" }}>
                <p style={{ color: "#64748B" }}>Loading post...</p>
            </div>
        );
    }

    return (
        <div className="section-padding">
            <div className="container-marketing" style={{ maxWidth: 800 }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Link
                            href="/blog/admin"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 36,
                                height: 36,
                                borderRadius: 8,
                                border: "1px solid #1E293B",
                                color: "#94A3B8",
                                textDecoration: "none",
                            }}
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <h1 className="text-h3">{editId ? "Edit Post" : "New Post"}</h1>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button
                            onClick={() => handleSave("draft")}
                            disabled={saving}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "10px 20px",
                                borderRadius: 10,
                                border: "1px solid #1E293B",
                                background: "transparent",
                                color: "#94A3B8",
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            <Save size={14} /> Save Draft
                        </button>
                        <button
                            onClick={() => handleSave("published")}
                            disabled={saving}
                            className="btn-primary"
                            style={{ padding: "10px 24px", fontSize: 14 }}
                        >
                            <Send size={14} /> Publish
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Title */}
                    <div>
                        <label style={labelStyle}>Title *</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="How to Save ₹1.5 Lakh Under Section 80C"
                            style={{ ...inputStyle, fontSize: 18, fontWeight: 600, padding: "16px 18px" }}
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label style={labelStyle}>URL Slug</label>
                        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                            <span
                                style={{
                                    padding: "12px 14px",
                                    borderRadius: "10px 0 0 10px",
                                    border: "1px solid #1E293B",
                                    borderRight: "none",
                                    background: "rgba(15, 23, 42, 0.8)",
                                    color: "#64748B",
                                    fontSize: 14,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                /blog/
                            </span>
                            <input
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                style={{
                                    ...inputStyle,
                                    borderRadius: "0 10px 10px 0",
                                }}
                            />
                        </div>
                    </div>

                    {/* Category + Author */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                            <label style={labelStyle}>Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as BlogCategory)}
                                style={{
                                    ...inputStyle,
                                    cursor: "pointer",
                                    appearance: "auto",
                                }}
                            >
                                {BLOG_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Author</label>
                            <input
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Cover Image URL */}
                    <div>
                        <label style={labelStyle}>Cover Image URL</label>
                        <input
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            style={inputStyle}
                        />
                        {coverImage && (
                            <div
                                style={{
                                    marginTop: 8,
                                    height: 160,
                                    borderRadius: 10,
                                    overflow: "hidden",
                                    background: `url(${coverImage}) center/cover no-repeat`,
                                    border: "1px solid #1E293B",
                                }}
                            />
                        )}
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label style={labelStyle}>Excerpt (shown on cards)</label>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="A brief 1-2 line summary of the article..."
                            rows={2}
                            style={{ ...inputStyle, resize: "vertical" }}
                        />
                    </div>

                    {/* Content (Markdown) */}
                    <div>
                        <label style={labelStyle}>Content (Markdown) *</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={`## Introduction\n\nWrite your article in Markdown...\n\n## Key Points\n\n- Point 1\n- Point 2\n\n## Conclusion`}
                            rows={20}
                            style={{
                                ...inputStyle,
                                resize: "vertical",
                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                fontSize: 13,
                                lineHeight: 1.7,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function EditorPage() {
    return (
        <Suspense
            fallback={
                <div className="section-padding" style={{ textAlign: "center", minHeight: "60vh" }}>
                    <p style={{ color: "#64748B" }}>Loading editor...</p>
                </div>
            }
        >
            <EditorForm />
        </Suspense>
    );
}
