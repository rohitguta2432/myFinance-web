"use client";

import { useState } from "react";
import { Link2, Twitter, Linkedin, Heart, Check } from "lucide-react";

export function ShareBar({ slug, title, likes: initialLikes }: { slug: string; title: string; likes: number }) {
    const [copied, setCopied] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(initialLikes);

    const url = typeof window !== "undefined" ? `${window.location.origin}/blog/${slug}` : "";

    const handleCopy = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLike = () => {
        if (liked) return;
        setLiked(true);
        setLikes((l) => l + 1);
    };

    const btnBase: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "10px 18px",
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 500,
        border: "1px solid rgba(51, 65, 85, 0.5)",
        background: "rgba(15, 23, 42, 0.6)",
        color: "#94A3B8",
        cursor: "pointer",
        transition: "all 0.25s ease",
        backdropFilter: "blur(8px)",
        textDecoration: "none",
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexWrap: "wrap",
                    padding: "28px 0",
                    marginTop: 48,
                    marginBottom: 48,
                    borderTop: "1px solid rgba(51, 65, 85, 0.4)",
                    borderBottom: "1px solid rgba(51, 65, 85, 0.4)",
                    position: "relative",
                }}
            >
                <p style={{
                    position: "absolute", top: -10,
                    left: 0, fontSize: 11, fontWeight: 600,
                    textTransform: "uppercase", letterSpacing: "0.08em",
                    color: "#475569", background: "var(--bg-primary, #0B0F1A)",
                    padding: "0 12px 0 0",
                }}>
                    Share this article
                </p>

                <button onClick={handleCopy} className="share-bar-btn" style={btnBase}>
                    {copied ? <Check size={14} style={{ color: "#10B981" }} /> : <Link2 size={14} />}
                    {copied ? "Copied!" : "Copy Link"}
                </button>
                <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-bar-btn"
                    style={btnBase}
                >
                    <Twitter size={14} /> Tweet
                </a>
                <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-bar-btn"
                    style={btnBase}
                >
                    <Linkedin size={14} /> LinkedIn
                </a>
                <div style={{ flex: 1 }} />
                <button
                    onClick={handleLike}
                    className="share-bar-btn"
                    style={{
                        ...btnBase,
                        color: liked ? "#EF4444" : "#94A3B8",
                        borderColor: liked ? "rgba(239, 68, 68, 0.3)" : "rgba(51, 65, 85, 0.5)",
                        background: liked ? "rgba(239, 68, 68, 0.08)" : "rgba(15, 23, 42, 0.6)",
                    }}
                >
                    <Heart size={14} fill={liked ? "#EF4444" : "none"} />
                    {likes}
                </button>
            </div>
            <style>{`
                .share-bar-btn:hover {
                    border-color: rgba(100, 116, 139, 0.5) !important;
                    background: rgba(30, 41, 59, 0.8) !important;
                    color: #CBD5E1 !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }
            `}</style>
        </>
    );
}
