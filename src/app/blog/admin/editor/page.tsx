"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BLOG_CATEGORIES } from "@/lib/types";
import type { BlogCategory } from "@/lib/types";
import {
    ArrowLeft,
    Save,
    Send,
    Link2,
    Sparkles,
    X,
    Loader2,
    Wand2,
    RefreshCw,
    FileText,
    ChevronDown,
    ChevronUp,
    Check,
    AlertCircle,
} from "lucide-react";

/* ─────────── styles ─────────── */

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

const cardGlass: React.CSSProperties = {
    borderRadius: 14,
    border: "1px solid rgba(30, 41, 59, 0.8)",
    background: "rgba(15, 23, 42, 0.65)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    padding: 20,
};

/* ─────────── Import URL Panel ─────────── */

function ImportUrlPanel({
    onImport,
}: {
    onImport: (data: {
        title: string;
        content: string;
        excerpt: string;
        cover_image: string | null;
    }) => void;
}) {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleImport = async () => {
        if (!url.trim()) return;
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const res = await fetch("/api/admin/import-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: url.trim() }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to import");
            }

            const data = await res.json();
            onImport(data);
            setSuccess(true);
            setTimeout(() => {
                setOpen(false);
                setSuccess(false);
                setUrl("");
            }, 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Import failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginBottom: 20 }}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 18px",
                    borderRadius: 10,
                    border: "1px solid #1E293B",
                    background: open
                        ? "rgba(59, 130, 246, 0.1)"
                        : "transparent",
                    color: open ? "#60A5FA" : "#94A3B8",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                }}
            >
                <Link2 size={15} />
                Import from URL
                {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {open && (
                <div
                    style={{
                        ...cardGlass,
                        marginTop: 12,
                        borderColor: "rgba(59, 130, 246, 0.2)",
                        animation: "slideDown 0.25s ease-out",
                    }}
                >
                    <p
                        style={{
                            fontSize: 13,
                            color: "#64748B",
                            margin: "0 0 12px",
                        }}
                    >
                        Paste a blog or article URL to automatically import its
                        content into the editor.
                    </p>
                    <div
                        style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                        }}
                    >
                        <input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com/blog/article-title"
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleImport()
                            }
                            style={{
                                ...inputStyle,
                                flex: 1,
                                borderColor: error
                                    ? "#EF4444"
                                    : success
                                        ? "#10B981"
                                        : "#1E293B",
                            }}
                        />
                        <button
                            onClick={handleImport}
                            disabled={loading || !url.trim()}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "12px 22px",
                                borderRadius: 10,
                                border: "none",
                                background: success
                                    ? "#10B981"
                                    : "linear-gradient(135deg, #3B82F6, #2563EB)",
                                color: "#fff",
                                fontSize: 14,
                                fontWeight: 600,
                                cursor:
                                    loading || !url.trim()
                                        ? "not-allowed"
                                        : "pointer",
                                opacity: loading || !url.trim() ? 0.6 : 1,
                                whiteSpace: "nowrap",
                                transition: "all 0.2s",
                            }}
                        >
                            {loading ? (
                                <Loader2
                                    size={15}
                                    style={{ animation: "spin 1s linear infinite" }}
                                />
                            ) : success ? (
                                <Check size={15} />
                            ) : (
                                <Link2 size={15} />
                            )}
                            {loading
                                ? "Importing..."
                                : success
                                    ? "Imported!"
                                    : "Import"}
                        </button>
                    </div>
                    {error && (
                        <p
                            style={{
                                fontSize: 13,
                                color: "#EF4444",
                                margin: "10px 0 0",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                            }}
                        >
                            <AlertCircle size={13} />
                            {error}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

/* ─────────── AI Writer Modal ─────────── */

type AiAction = "generate" | "improve" | "summarize";

function AiWriterModal({
    open,
    onClose,
    existingContent,
    onApply,
}: {
    open: boolean;
    existingContent: string;
    onClose: () => void;
    onApply: (data: {
        content?: string;
        title?: string;
        excerpt?: string;
    }) => void;
}) {
    const [action, setAction] = useState<AiAction>("generate");
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState("");

    const actions: {
        id: AiAction;
        label: string;
        icon: typeof Wand2;
        desc: string;
    }[] = [
            {
                id: "generate",
                label: "Generate",
                icon: Sparkles,
                desc: "Create a full blog post from a topic",
            },
            {
                id: "improve",
                label: "Improve",
                icon: RefreshCw,
                desc: "Polish and enhance existing content",
            },
            {
                id: "summarize",
                label: "Summarize",
                icon: FileText,
                desc: "Generate an excerpt from content",
            },
        ];

    const handleGenerate = async () => {
        if (!prompt.trim() && action === "generate") return;
        if (!existingContent && action !== "generate") {
            setError("Write some content first before using this action.");
            return;
        }
        setLoading(true);
        setError("");
        setPreview("");

        try {
            const res = await fetch("/api/admin/ai-write", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: prompt.trim(),
                    existingContent,
                    action,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "AI generation failed");
            }

            const data = await res.json();
            setPreview(data.content);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "AI generation failed"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleApply = () => {
        if (!preview) return;
        if (action === "summarize") {
            onApply({ excerpt: preview });
        } else {
            // Extract title from first heading if present
            const titleMatch = preview.match(/^#\s+(.+)$/m);
            onApply({
                content: preview,
                title:
                    action === "generate" && titleMatch
                        ? titleMatch[1].trim()
                        : undefined,
            });
        }
        setPreview("");
        setPrompt("");
        onClose();
    };

    if (!open) return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(4px)",
                animation: "fadeIn 0.2s ease-out",
            }}
            onClick={(e) =>
                e.target === e.currentTarget && !loading && onClose()
            }
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 640,
                    maxHeight: "85vh",
                    overflowY: "auto",
                    borderRadius: 16,
                    border: "1px solid rgba(139, 92, 246, 0.25)",
                    background:
                        "linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 15, 60, 0.9))",
                    backdropFilter: "blur(24px)",
                    padding: 28,
                    animation: "scaleIn 0.25s ease-out",
                    boxShadow:
                        "0 0 60px -10px rgba(139, 92, 246, 0.2), 0 25px 50px -12px rgba(0,0,0,0.5)",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 24,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                background:
                                    "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow:
                                    "0 0 24px -4px rgba(139, 92, 246, 0.5)",
                            }}
                        >
                            <Sparkles size={20} color="#fff" />
                        </div>
                        <div>
                            <h3
                                style={{
                                    margin: 0,
                                    fontSize: 18,
                                    fontWeight: 700,
                                    color: "#F1F5F9",
                                }}
                            >
                                AI Writer
                            </h3>
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: 12,
                                    color: "#94A3B8",
                                }}
                            >
                                Powered by AWS Bedrock · Claude Sonnet
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        style={{
                            padding: 8,
                            borderRadius: 8,
                            border: "1px solid #1E293B",
                            background: "transparent",
                            color: "#64748B",
                            cursor: "pointer",
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Action Selector */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 10,
                        marginBottom: 20,
                    }}
                >
                    {actions.map((a) => {
                        const Icon = a.icon;
                        const selected = action === a.id;
                        return (
                            <button
                                key={a.id}
                                onClick={() => {
                                    setAction(a.id);
                                    setPreview("");
                                    setError("");
                                }}
                                style={{
                                    padding: "14px 12px",
                                    borderRadius: 12,
                                    border: selected
                                        ? "1px solid rgba(139, 92, 246, 0.5)"
                                        : "1px solid #1E293B",
                                    background: selected
                                        ? "rgba(139, 92, 246, 0.12)"
                                        : "rgba(15, 23, 42, 0.5)",
                                    cursor: "pointer",
                                    textAlign: "center",
                                    transition: "all 0.2s",
                                }}
                            >
                                <Icon
                                    size={18}
                                    style={{
                                        color: selected
                                            ? "#A78BFA"
                                            : "#64748B",
                                        marginBottom: 6,
                                    }}
                                />
                                <div
                                    style={{
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: selected
                                            ? "#E2E8F0"
                                            : "#94A3B8",
                                    }}
                                >
                                    {a.label}
                                </div>
                                <div
                                    style={{
                                        fontSize: 11,
                                        color: "#64748B",
                                        marginTop: 2,
                                    }}
                                >
                                    {a.desc}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Prompt Input */}
                <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>
                        {action === "generate"
                            ? "Topic / Prompt *"
                            : action === "improve"
                                ? "Instructions (optional)"
                                : "Focus (optional)"}
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={3}
                        placeholder={
                            action === "generate"
                                ? "e.g., 5 Tax Saving Tips for Salaried Employees Under New Regime 2026"
                                : action === "improve"
                                    ? "e.g., Make it more engaging, add examples"
                                    : "e.g., Focus on the tax saving aspect"
                        }
                        style={{
                            ...inputStyle,
                            resize: "vertical",
                            borderColor: "rgba(139, 92, 246, 0.2)",
                        }}
                    />
                </div>

                {/* Generate Button */}
                <button
                    onClick={handleGenerate}
                    disabled={
                        loading ||
                        (action === "generate" && !prompt.trim())
                    }
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        padding: "14px",
                        borderRadius: 12,
                        border: "none",
                        background: loading
                            ? "rgba(139, 92, 246, 0.3)"
                            : "linear-gradient(135deg, #8B5CF6, #7C3AED, #6D28D9)",
                        color: "#fff",
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: loading ? "wait" : "pointer",
                        opacity:
                            loading ||
                                (action === "generate" && !prompt.trim())
                                ? 0.6
                                : 1,
                        transition: "all 0.2s",
                        boxShadow: loading
                            ? "none"
                            : "0 0 30px -8px rgba(139, 92, 246, 0.4)",
                    }}
                >
                    {loading ? (
                        <>
                            <Loader2
                                size={16}
                                style={{
                                    animation: "spin 1s linear infinite",
                                }}
                            />
                            Generating with AI...
                        </>
                    ) : (
                        <>
                            <Wand2 size={16} />
                            {action === "generate"
                                ? "Generate Blog Post"
                                : action === "improve"
                                    ? "Improve Content"
                                    : "Generate Excerpt"}
                        </>
                    )}
                </button>

                {/* Error */}
                {error && (
                    <p
                        style={{
                            fontSize: 13,
                            color: "#EF4444",
                            marginTop: 12,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        <AlertCircle size={13} />
                        {error}
                    </p>
                )}

                {/* Preview */}
                {preview && (
                    <div style={{ marginTop: 20 }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 10,
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "#A78BFA",
                                }}
                            >
                                ✨ AI Generated Preview
                            </span>
                            <span
                                style={{ fontSize: 11, color: "#64748B" }}
                            >
                                {preview.split(/\s+/).length} words
                            </span>
                        </div>
                        <div
                            style={{
                                maxHeight: 240,
                                overflowY: "auto",
                                padding: 16,
                                borderRadius: 12,
                                background: "rgba(15, 23, 42, 0.7)",
                                border: "1px solid rgba(139, 92, 246, 0.15)",
                                fontSize: 13,
                                color: "#CBD5E1",
                                lineHeight: 1.7,
                                fontFamily:
                                    "'JetBrains Mono', 'Fira Code', monospace",
                                whiteSpace: "pre-wrap",
                            }}
                        >
                            {preview}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                gap: 10,
                                marginTop: 14,
                            }}
                        >
                            <button
                                onClick={handleApply}
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 6,
                                    padding: "12px",
                                    borderRadius: 10,
                                    border: "none",
                                    background:
                                        "linear-gradient(135deg, #10B981, #059669)",
                                    color: "#fff",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    boxShadow:
                                        "0 0 20px -6px rgba(16, 185, 129, 0.4)",
                                }}
                            >
                                <Check size={15} />
                                Apply to Editor
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 6,
                                    padding: "12px 20px",
                                    borderRadius: 10,
                                    border: "1px solid #1E293B",
                                    background: "transparent",
                                    color: "#94A3B8",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                <RefreshCw size={14} />
                                Retry
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─────────── Main Editor Form ─────────── */

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
    const [existingPublishedAt, setExistingPublishedAt] = useState<
        string | null
    >(null);
    const [aiModalOpen, setAiModalOpen] = useState(false);

    // Auto-generate slug from title
    useEffect(() => {
        if (!editId) {
            setSlug(
                title
                    .toLowerCase()
                    .replace(/[^\\w\\s-]/g, "")
                    .replace(/\\s+/g, "-")
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
                const post = posts.find(
                    (p: { id: string }) => p.id === editId
                );
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

    const handleUrlImport = (data: {
        title: string;
        content: string;
        excerpt: string;
        cover_image: string | null;
    }) => {
        if (data.title) setTitle(data.title);
        if (data.content) setContent(data.content);
        if (data.excerpt) setExcerpt(data.excerpt);
        if (data.cover_image) setCoverImage(data.cover_image);
    };

    const handleAiApply = (data: {
        content?: string;
        title?: string;
        excerpt?: string;
    }) => {
        if (data.content) setContent(data.content);
        if (data.title) setTitle(data.title);
        if (data.excerpt) setExcerpt(data.excerpt);
    };

    if (loadingPost) {
        return (
            <div
                className="section-padding"
                style={{ textAlign: "center", minHeight: "60vh" }}
            >
                <p style={{ color: "#64748B" }}>Loading post...</p>
            </div>
        );
    }

    return (
        <div className="section-padding">
            {/* CSS Animations */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>

            <div className="container-marketing" style={{ maxWidth: 800 }}>
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 24,
                        flexWrap: "wrap",
                        gap: 16,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
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
                        <h1 className="text-h3">
                            {editId ? "Edit Post" : "New Post"}
                        </h1>
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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
                            style={{
                                padding: "10px 24px",
                                fontSize: 14,
                            }}
                        >
                            <Send size={14} /> Publish
                        </button>
                    </div>
                </div>

                {/* New Feature Panels */}
                <div
                    style={{
                        display: "flex",
                        gap: 10,
                        marginBottom: 4,
                        flexWrap: "wrap",
                    }}
                >
                    <ImportUrlPanel onImport={handleUrlImport} />

                    <button
                        onClick={() => setAiModalOpen(true)}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "10px 18px",
                            borderRadius: 10,
                            border: "1px solid rgba(139, 92, 246, 0.3)",
                            background:
                                "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(109, 40, 217, 0.05))",
                            color: "#A78BFA",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            boxShadow:
                                "0 0 20px -8px rgba(139, 92, 246, 0.2)",
                            marginBottom: 20,
                        }}
                    >
                        <Sparkles size={15} />
                        AI Writer
                    </button>
                </div>

                {/* Form */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 20,
                    }}
                >
                    {/* Title */}
                    <div>
                        <label style={labelStyle}>Title *</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="How to Save ₹1.5 Lakh Under Section 80C"
                            style={{
                                ...inputStyle,
                                fontSize: 18,
                                fontWeight: 600,
                                padding: "16px 18px",
                            }}
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label style={labelStyle}>URL Slug</label>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0,
                            }}
                        >
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
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 16,
                        }}
                    >
                        <div>
                            <label style={labelStyle}>Category</label>
                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(
                                        e.target.value as BlogCategory
                                    )
                                }
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
                        <label style={labelStyle}>
                            Excerpt (shown on cards)
                        </label>
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
                                fontFamily:
                                    "'JetBrains Mono', 'Fira Code', monospace",
                                fontSize: 13,
                                lineHeight: 1.7,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* AI Writer Modal */}
            <AiWriterModal
                open={aiModalOpen}
                onClose={() => setAiModalOpen(false)}
                existingContent={content}
                onApply={handleAiApply}
            />
        </div>
    );
}

/* ─────────── Page Export ─────────── */

export default function EditorPage() {
    return (
        <Suspense
            fallback={
                <div
                    className="section-padding"
                    style={{ textAlign: "center", minHeight: "60vh" }}
                >
                    <p style={{ color: "#64748B" }}>Loading editor...</p>
                </div>
            }
        >
            <EditorForm />
        </Suspense>
    );
}
