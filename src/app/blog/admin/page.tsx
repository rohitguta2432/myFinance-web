"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { BlogPost, Comment } from "@/lib/types";
import {
    LogIn,
    Plus,
    Edit3,
    Trash2,
    Eye,
    FileText,
    MessageSquare,
    LayoutDashboard,
    LogOut,
} from "lucide-react";

type Tab = "posts" | "comments";

export default function AdminPage() {
    const [authenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);

    const [activeTab, setActiveTab] = useState<Tab>("posts");
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [comments, setComments] = useState<(Comment & { blog_posts?: { title: string; slug: string } })[]>([]);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError("");

        const res = await fetch("/api/admin/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            setAuthenticated(true);
            fetchPosts();
        } else {
            setLoginError("Invalid credentials");
        }
        setLoginLoading(false);
    };

    const fetchPosts = async () => {
        setLoading(true);
        const res = await fetch("/api/admin/posts");
        if (res.ok) {
            const data = await res.json();
            setPosts(data);
        }
        setLoading(false);
    };

    const fetchComments = async () => {
        setLoading(true);
        const res = await fetch("/api/admin/comments");
        if (res.ok) {
            const data = await res.json();
            setComments(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (authenticated && activeTab === "posts") fetchPosts();
        if (authenticated && activeTab === "comments") fetchComments();
    }, [authenticated, activeTab]);

    const handleDeletePost = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        await fetch(`/api/admin/posts?id=${id}`, { method: "DELETE" });
        fetchPosts();
    };

    const handleDeleteComment = async (id: string) => {
        if (!confirm("Delete this comment?")) return;
        await fetch(`/api/admin/comments?id=${id}`, { method: "DELETE" });
        fetchComments();
    };

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "14px 18px",
        borderRadius: 10,
        border: "1px solid #1E293B",
        background: "rgba(15, 23, 42, 0.6)",
        color: "#F1F5F9",
        fontSize: 15,
        outline: "none",
    };

    // --- LOGIN ---
    if (!authenticated) {
        return (
            <div
                className="section-padding"
                style={{
                    minHeight: "80vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    className="card-glass"
                    style={{
                        width: "100%",
                        maxWidth: 400,
                        padding: 32,
                    }}
                >
                    <div style={{ textAlign: "center", marginBottom: 28 }}>
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 12,
                                background: "linear-gradient(135deg, #10B981, #059669)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 16px",
                                boxShadow: "0 0 30px -5px rgba(16, 185, 129, 0.4)",
                            }}
                        >
                            <LayoutDashboard size={22} color="#fff" />
                        </div>
                        <h2 className="text-h3">Blog Admin</h2>
                        <p style={{ color: "#64748B", fontSize: 14, marginTop: 4 }}>
                            Sign in to manage posts & comments
                        </p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            required
                            style={{ ...inputStyle, marginBottom: 12 }}
                        />
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            type="password"
                            required
                            style={{ ...inputStyle, marginBottom: 16 }}
                        />
                        {loginError && (
                            <p style={{ color: "#EF4444", fontSize: 13, marginBottom: 12 }}>
                                {loginError}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={loginLoading}
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 10,
                                padding: "15px 24px",
                                fontSize: 15,
                                fontWeight: 600,
                                fontFamily: "inherit",
                                color: "#fff",
                                background: loginLoading
                                    ? "rgba(16, 185, 129, 0.6)"
                                    : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                                border: "none",
                                borderRadius: 12,
                                cursor: loginLoading ? "not-allowed" : "pointer",
                                opacity: loginLoading ? 0.8 : 1,
                                boxShadow: loginLoading
                                    ? "none"
                                    : "0 4px 14px -2px rgba(16, 185, 129, 0.4), 0 1px 3px rgba(0,0,0,0.2)",
                                transition: "all 0.25s ease",
                                letterSpacing: "0.02em",
                            }}
                        >
                            <LogIn size={18} />
                            {loginLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // --- DASHBOARD ---
    return (
        <div className="section-padding">
            <div className="container-marketing">
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 32,
                        flexWrap: "wrap",
                        gap: 16,
                    }}
                >
                    <div>
                        <h1 className="text-h2">Blog Admin</h1>
                        <p style={{ color: "#64748B", fontSize: 14, marginTop: 4 }}>
                            Manage your blog posts and comments
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <Link
                            href="/blog/admin/editor"
                            className="btn-primary"
                            style={{ textDecoration: "none", padding: "12px 24px", fontSize: 14 }}
                        >
                            <Plus size={16} /> New Post
                        </Link>
                        <button
                            onClick={() => {
                                document.cookie = "admin_token=; max-age=0; path=/";
                                document.cookie = "admin_session=; max-age=0; path=/";
                                setAuthenticated(false);
                            }}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "12px 20px",
                                borderRadius: 10,
                                border: "1px solid #1E293B",
                                background: "transparent",
                                color: "#64748B",
                                fontSize: 14,
                                cursor: "pointer",
                            }}
                        >
                            <LogOut size={14} /> Logout
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div
                    style={{
                        display: "flex",
                        gap: 4,
                        marginBottom: 24,
                        background: "rgba(15, 23, 42, 0.6)",
                        borderRadius: 12,
                        padding: 4,
                        width: "fit-content",
                    }}
                >
                    {(["posts", "comments"] as Tab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "10px 20px",
                                borderRadius: 8,
                                border: "none",
                                background: activeTab === tab ? "#10B981" : "transparent",
                                color: activeTab === tab ? "#fff" : "#64748B",
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s",
                            }}
                        >
                            {tab === "posts" ? <FileText size={14} /> : <MessageSquare size={14} />}
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {loading && (
                    <div style={{ textAlign: "center", padding: 60, color: "#64748B" }}>Loading...</div>
                )}

                {/* POSTS TAB */}
                {!loading && activeTab === "posts" && (
                    <div style={{ overflowX: "auto" }}>
                        {posts.length === 0 ? (
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: 60,
                                    color: "#64748B",
                                    background: "rgba(15, 23, 42, 0.4)",
                                    borderRadius: 12,
                                }}
                            >
                                <FileText size={36} style={{ opacity: 0.3, margin: "0 auto 12px" }} />
                                <p>No posts yet. Create your first article!</p>
                            </div>
                        ) : (
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    fontSize: 14,
                                }}
                            >
                                <thead>
                                    <tr style={{ borderBottom: "1px solid #1E293B" }}>
                                        <th style={{ padding: "12px 16px", textAlign: "left", color: "#64748B", fontWeight: 600 }}>Title</th>
                                        <th style={{ padding: "12px 16px", textAlign: "left", color: "#64748B", fontWeight: 600 }}>Category</th>
                                        <th style={{ padding: "12px 16px", textAlign: "left", color: "#64748B", fontWeight: 600 }}>Status</th>
                                        <th style={{ padding: "12px 16px", textAlign: "left", color: "#64748B", fontWeight: 600 }}>Date</th>
                                        <th style={{ padding: "12px 16px", textAlign: "right", color: "#64748B", fontWeight: 600 }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {posts.map((post) => (
                                        <tr
                                            key={post.id}
                                            style={{
                                                borderBottom: "1px solid rgba(30, 41, 59, 0.5)",
                                                transition: "background 0.15s",
                                            }}
                                        >
                                            <td style={{ padding: "14px 16px", fontWeight: 500, maxWidth: 300 }}>
                                                {post.title}
                                            </td>
                                            <td style={{ padding: "14px 16px", color: "#94A3B8" }}>{post.category}</td>
                                            <td style={{ padding: "14px 16px" }}>
                                                <span
                                                    style={{
                                                        padding: "3px 10px",
                                                        borderRadius: 9999,
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        background:
                                                            post.status === "published"
                                                                ? "rgba(16, 185, 129, 0.15)"
                                                                : "rgba(148, 163, 184, 0.1)",
                                                        color: post.status === "published" ? "#10B981" : "#94A3B8",
                                                    }}
                                                >
                                                    {post.status === "published" ? "✅ Live" : "📝 Draft"}
                                                </span>
                                            </td>
                                            <td style={{ padding: "14px 16px", color: "#64748B" }}>
                                                {new Date(post.created_at).toLocaleDateString("en-IN", {
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </td>
                                            <td style={{ padding: "14px 16px", textAlign: "right" }}>
                                                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                    {post.status === "published" && (
                                                        <Link
                                                            href={`/blog/${post.slug}`}
                                                            target="_blank"
                                                            style={{
                                                                padding: "6px 8px",
                                                                borderRadius: 6,
                                                                background: "rgba(59, 130, 246, 0.1)",
                                                                color: "#3B82F6",
                                                                border: "none",
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            <Eye size={14} />
                                                        </Link>
                                                    )}
                                                    <Link
                                                        href={`/blog/admin/editor?id=${post.id}`}
                                                        style={{
                                                            padding: "6px 8px",
                                                            borderRadius: 6,
                                                            background: "rgba(245, 158, 11, 0.1)",
                                                            color: "#F59E0B",
                                                            border: "none",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <Edit3 size={14} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeletePost(post.id)}
                                                        style={{
                                                            padding: "6px 8px",
                                                            borderRadius: 6,
                                                            background: "rgba(239, 68, 68, 0.1)",
                                                            color: "#EF4444",
                                                            border: "none",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* COMMENTS TAB */}
                {!loading && activeTab === "comments" && (
                    <div>
                        {comments.length === 0 ? (
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: 60,
                                    color: "#64748B",
                                    background: "rgba(15, 23, 42, 0.4)",
                                    borderRadius: 12,
                                }}
                            >
                                <MessageSquare size={36} style={{ opacity: 0.3, margin: "0 auto 12px" }} />
                                <p>No comments yet.</p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        style={{
                                            padding: 16,
                                            borderRadius: 12,
                                            background: "rgba(15, 23, 42, 0.6)",
                                            border: "1px solid #1E293B",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                            gap: 16,
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                                <span style={{ fontWeight: 600, fontSize: 14 }}>
                                                    {comment.author_name}
                                                </span>
                                                {comment.is_admin && (
                                                    <span
                                                        style={{
                                                            padding: "2px 8px",
                                                            borderRadius: 9999,
                                                            fontSize: 10,
                                                            background: "rgba(16, 185, 129, 0.15)",
                                                            color: "#10B981",
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        Admin
                                                    </span>
                                                )}
                                                <span style={{ fontSize: 12, color: "#64748B" }}>
                                                    on &quot;{comment.blog_posts?.title || "Unknown"}&quot;
                                                </span>
                                            </div>
                                            <p style={{ fontSize: 14, color: "#CBD5E1", margin: 0 }}>
                                                {comment.content}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            style={{
                                                padding: "6px 8px",
                                                borderRadius: 6,
                                                background: "rgba(239, 68, 68, 0.1)",
                                                color: "#EF4444",
                                                border: "none",
                                                cursor: "pointer",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
