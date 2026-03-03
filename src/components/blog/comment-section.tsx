"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Comment } from "@/lib/types";
import { MessageSquare, ThumbsUp, Reply, Shield } from "lucide-react";

export function CommentSection({ postId }: { postId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [content, setContent] = useState("");
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = useCallback(async () => {
        const { data } = await supabase
            .from("comments")
            .select("*")
            .eq("post_id", postId)
            .order("created_at", { ascending: true });

        if (data) {
            // Build threaded structure
            const topLevel = data.filter((c) => !c.parent_id);
            const replies = data.filter((c) => c.parent_id);
            const threaded = topLevel.map((c) => ({
                ...c,
                replies: replies.filter((r) => r.parent_id === c.id),
            }));
            setComments(threaded);
        }
        setLoading(false);
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !content.trim()) return;
        setSubmitting(true);

        await supabase.from("comments").insert({
            post_id: postId,
            author_name: name.trim(),
            author_email: email.trim() || null,
            content: content.trim(),
            is_admin: false,
        });

        setContent("");
        setSubmitting(false);
        fetchComments();
    };

    const handleReply = async (parentId: string) => {
        if (!name.trim() || !replyContent.trim()) return;
        setSubmitting(true);

        await supabase.from("comments").insert({
            post_id: postId,
            parent_id: parentId,
            author_name: name.trim(),
            author_email: email.trim() || null,
            content: replyContent.trim(),
            is_admin: false,
        });

        setReplyContent("");
        setReplyTo(null);
        setSubmitting(false);
        fetchComments();
    };

    const timeAgo = (date: string) => {
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return "just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
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
        transition: "border-color 0.2s",
    };

    const renderComment = (comment: Comment, isReply = false) => (
        <div
            key={comment.id}
            style={{
                paddingLeft: isReply ? 32 : 0,
                borderLeft: isReply ? "2px solid #1E293B" : "none",
                marginLeft: isReply ? 20 : 0,
                marginTop: isReply ? 12 : 0,
            }}
        >
            <div
                style={{
                    padding: 16,
                    borderRadius: 12,
                    background: isReply ? "rgba(15, 23, 42, 0.3)" : "rgba(15, 23, 42, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.04)",
                }}
            >
                {/* Author line */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div
                        style={{
                            width: 28,
                            height: 28,
                            borderRadius: 9999,
                            background: comment.is_admin
                                ? "linear-gradient(135deg, #10B981, #059669)"
                                : "linear-gradient(135deg, #3B82F6, #6366F1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#fff",
                        }}
                    >
                        {comment.author_name[0]?.toUpperCase()}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#F1F5F9" }}>
                        {comment.author_name}
                    </span>
                    {comment.is_admin && (
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                padding: "2px 8px",
                                borderRadius: 9999,
                                fontSize: 10,
                                fontWeight: 700,
                                background: "rgba(16, 185, 129, 0.15)",
                                color: "#10B981",
                            }}
                        >
                            <Shield size={10} /> Admin
                        </span>
                    )}
                    <span style={{ fontSize: 12, color: "#64748B" }}>· {timeAgo(comment.created_at)}</span>
                </div>

                {/* Content */}
                <p style={{ fontSize: 14, color: "#CBD5E1", lineHeight: 1.6, margin: 0 }}>
                    {comment.content}
                </p>

                {/* Actions */}
                {!isReply && (
                    <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                        <button
                            onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                fontSize: 12,
                                color: "#64748B",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                            }}
                        >
                            <Reply size={12} /> Reply
                        </button>
                    </div>
                )}
            </div>

            {/* Reply form */}
            {replyTo === comment.id && (
                <div style={{ marginTop: 8, paddingLeft: 52 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                        <input
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write a reply..."
                            style={{ ...inputStyle, flex: 1 }}
                        />
                        <button
                            onClick={() => handleReply(comment.id)}
                            disabled={submitting || !replyContent.trim()}
                            className="btn-primary"
                            style={{ padding: "10px 20px", fontSize: 13 }}
                        >
                            Reply
                        </button>
                    </div>
                </div>
            )}

            {/* Nested replies */}
            {comment.replies?.map((r) => renderComment(r, true))}
        </div>
    );

    return (
        <section style={{ marginTop: 48 }}>
            <h3
                className="text-h3"
                style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}
            >
                <MessageSquare size={22} style={{ color: "#10B981" }} />
                Discussion ({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})
            </h3>

            {/* Comment form */}
            <form
                onSubmit={handleSubmit}
                style={{
                    padding: 20,
                    borderRadius: 16,
                    background: "rgba(15, 23, 42, 0.6)",
                    border: "1px solid #1E293B",
                    marginBottom: 24,
                }}
            >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name *"
                        required
                        style={inputStyle}
                    />
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email (optional, never shown)"
                        type="email"
                        style={inputStyle}
                    />
                </div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your thoughts..."
                    required
                    rows={3}
                    style={{
                        ...inputStyle,
                        resize: "vertical",
                        marginBottom: 12,
                        fontFamily: "inherit",
                    }}
                />
                <button
                    type="submit"
                    disabled={submitting || !name.trim() || !content.trim()}
                    className="btn-primary"
                    style={{
                        padding: "12px 28px",
                        fontSize: 14,
                        opacity: submitting ? 0.6 : 1,
                    }}
                >
                    {submitting ? "Posting..." : "Post Comment"}
                </button>
            </form>

            {/* Comments list */}
            {loading ? (
                <div style={{ textAlign: "center", color: "#64748B", padding: 40, fontSize: 14 }}>
                    Loading comments...
                </div>
            ) : comments.length === 0 ? (
                <div
                    style={{
                        textAlign: "center",
                        color: "#64748B",
                        padding: 40,
                        fontSize: 14,
                        background: "rgba(15, 23, 42, 0.3)",
                        borderRadius: 12,
                    }}
                >
                    No comments yet. Be the first to share your thoughts!
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {comments.map((c) => renderComment(c))}
                </div>
            )}
        </section>
    );
}
