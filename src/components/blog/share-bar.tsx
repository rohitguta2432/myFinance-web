"use client";

import { useState } from "react";
import { Link2, Twitter, Linkedin, Heart } from "lucide-react";

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
        // TODO: persist like to Supabase
    };

    const btnStyle: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 16px",
        borderRadius: 9999,
        fontSize: 13,
        fontWeight: 500,
        border: "1px solid #1E293B",
        background: "rgba(15, 23, 42, 0.6)",
        color: "#94A3B8",
        cursor: "pointer",
        transition: "all 0.2s ease",
        backdropFilter: "blur(8px)",
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
                padding: "24px 0",
                borderTop: "1px solid #1E293B",
                borderBottom: "1px solid #1E293B",
                marginTop: 40,
                marginBottom: 40,
            }}
        >
            <button onClick={handleCopy} style={btnStyle}>
                <Link2 size={14} />
                {copied ? "Copied!" : "Copy Link"}
            </button>
            <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...btnStyle, textDecoration: "none" }}
            >
                <Twitter size={14} />
                Tweet
            </a>
            <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...btnStyle, textDecoration: "none" }}
            >
                <Linkedin size={14} />
                LinkedIn
            </a>
            <div style={{ flex: 1 }} />
            <button
                onClick={handleLike}
                style={{
                    ...btnStyle,
                    color: liked ? "#EF4444" : "#94A3B8",
                    borderColor: liked ? "rgba(239, 68, 68, 0.3)" : "#1E293B",
                    background: liked ? "rgba(239, 68, 68, 0.1)" : "rgba(15, 23, 42, 0.6)",
                }}
            >
                <Heart size={14} fill={liked ? "#EF4444" : "none"} />
                {likes}
            </button>
        </div>
    );
}
