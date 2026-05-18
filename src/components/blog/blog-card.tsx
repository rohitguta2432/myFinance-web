"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Share2 } from "lucide-react";
import { useState } from "react";
import type { BlogPost } from "@/lib/types";
import { useAppTheme } from "@/hooks/useAppTheme";
import { getCategoryMeta } from "./category-meta";

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function CoverFallback({ category, title }: { category: string; title: string }) {
    const meta = getCategoryMeta(category);
    const Icon = meta.icon;
    return (
        <div
            aria-label={`Cover placeholder for ${title}`}
            style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, #0F172A 0%, #1E293B 100%)`,
                overflow: "hidden",
            }}
        >
            <div
                aria-hidden
                style={{
                    position: "absolute",
                    inset: 0,
                    background: `radial-gradient(circle at 30% 30%, ${meta.text}22 0%, transparent 60%)`,
                }}
            />
            <Icon size={56} style={{ color: meta.text, opacity: 0.9, position: "relative" }} />
            <span
                aria-hidden
                style={{
                    position: "absolute",
                    bottom: 12,
                    right: 14,
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    color: "rgba(255,255,255,0.35)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                }}
            >
                MyFinancial
            </span>
        </div>
    );
}

function ShareButton({ slug, title }: { slug: string; title: string }) {
    const [copied, setCopied] = useState(false);
    const url = `https://myfinancial.in/blog/${slug}`;

    async function handleShare(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        const shareData = { title, url };
        try {
            if (typeof navigator !== "undefined" && "share" in navigator) {
                await navigator.share(shareData);
                return;
            }
        } catch {
            /* user cancelled native share — fall through to clipboard */
        }
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            /* clipboard blocked — silently ignore */
        }
    }

    return (
        <button
            onClick={handleShare}
            aria-label={`Share ${title}`}
            type="button"
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 8px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "transparent",
                color: copied ? "#10B981" : "#94A3B8",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
            }}
        >
            <Share2 size={12} />
            {copied ? "Copied" : "Share"}
        </button>
    );
}

export function BlogCard({ post, featured = false, priority = false }: { post: BlogPost; featured?: boolean; priority?: boolean }) {
    const palette = useAppTheme();
    const meta = getCategoryMeta(post.category);
    const ChipIcon = meta.icon;
    const formattedDate = formatDate(post.published_at || post.created_at);

    if (featured) {
        return (
            <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <article
                    className="card-glass blog-featured"
                    style={{
                        display: "grid",
                        gap: 0,
                        padding: 0,
                        overflow: "hidden",
                        cursor: "pointer",
                    }}
                >
                    <div
                        className="blog-featured-cover"
                        style={{
                            position: "relative",
                            minHeight: 280,
                            overflow: "hidden",
                        }}
                    >
                        {post.cover_image ? (
                            <Image
                                src={post.cover_image}
                                alt={post.title}
                                fill
                                priority={priority}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                style={{ objectFit: "cover" }}
                            />
                        ) : (
                            <CoverFallback category={post.category} title={post.title} />
                        )}
                        <div
                            aria-hidden
                            className="blog-featured-fade"
                            style={{
                                position: "absolute",
                                inset: 0,
                                background: `linear-gradient(to right, transparent 80%, ${palette.s1}cc 100%)`,
                                pointerEvents: "none",
                            }}
                        />
                        <span
                            style={{
                                position: "absolute",
                                top: 16,
                                left: 16,
                                padding: "6px 14px",
                                borderRadius: 9999,
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                background: "rgba(16, 185, 129, 0.2)",
                                color: "#10B981",
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            ✦ Featured
                        </span>
                        <span
                            aria-label={`${post.reading_time} minute read`}
                            style={{
                                position: "absolute",
                                top: 16,
                                right: 16,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                padding: "6px 12px",
                                borderRadius: 9999,
                                fontSize: 11,
                                fontWeight: 600,
                                background: "rgba(8, 14, 18, 0.55)",
                                color: "#F0F4F8",
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            <Clock size={11} />
                            {post.reading_time} min
                        </span>
                    </div>

                    <div className="blog-featured-body" style={{ padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "4px 12px",
                                borderRadius: 9999,
                                fontSize: 12,
                                fontWeight: 600,
                                background: meta.bg,
                                color: meta.text,
                                width: "fit-content",
                            }}
                        >
                            <ChipIcon size={12} />
                            {post.category}
                        </span>
                        <h2 className="text-h3" style={{ marginBottom: 0, color: palette.txt }}>
                            {post.title}
                        </h2>
                        <p
                            className="text-body-sm"
                            style={{
                                color: palette.mute,
                                lineHeight: 1.6,
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {post.excerpt}
                        </p>
                        <div className="text-caption" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, color: palette.mute }}>
                            <span>{formattedDate}</span>
                            <ShareButton slug={post.slug} title={post.title} />
                        </div>
                    </div>
                </article>
            </Link>
        );
    }

    return (
        <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
            <article
                className="card-glass"
                style={{
                    padding: 0,
                    overflow: "hidden",
                    cursor: "pointer",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div
                    style={{
                        position: "relative",
                        height: 180,
                        overflow: "hidden",
                    }}
                >
                    {post.cover_image ? (
                        <Image
                            src={post.cover_image}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{ objectFit: "cover" }}
                        />
                    ) : (
                        <CoverFallback category={post.category} title={post.title} />
                    )}
                    <div
                        aria-hidden
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 60,
                            background: `linear-gradient(to top, ${palette.s1}e6, transparent)`,
                            pointerEvents: "none",
                        }}
                    />
                    <span
                        aria-label={`${post.reading_time} minute read`}
                        style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3,
                            padding: "3px 8px",
                            borderRadius: 9999,
                            fontSize: 10,
                            fontWeight: 600,
                            background: "rgba(8, 14, 18, 0.55)",
                            color: "#F0F4F8",
                            backdropFilter: "blur(6px)",
                        }}
                    >
                        <Clock size={10} />
                        {post.reading_time} min
                    </span>
                </div>

                <div style={{ padding: "20px 20px 24px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "3px 10px",
                            borderRadius: 9999,
                            fontSize: 11,
                            fontWeight: 600,
                            background: meta.bg,
                            color: meta.text,
                            width: "fit-content",
                        }}
                    >
                        <ChipIcon size={11} />
                        {post.category}
                    </span>
                    <h3 className="text-h4" style={{ marginBottom: 0, lineHeight: 1.35, color: palette.txt }}>
                        {post.title}
                    </h3>
                    <p
                        className="text-body-sm"
                        style={{
                            color: palette.mute,
                            lineHeight: 1.5,
                            flex: 1,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {post.excerpt}
                    </p>
                    <div className="text-caption" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: palette.mute }}>
                        <span>{formattedDate}</span>
                        <ShareButton slug={post.slug} title={post.title} />
                    </div>
                </div>
            </article>
        </Link>
    );
}
