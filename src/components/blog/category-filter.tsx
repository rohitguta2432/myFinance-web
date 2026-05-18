"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Layers } from "lucide-react";
import type { BlogCategory } from "@/lib/types";
import { BLOG_CATEGORIES } from "@/lib/types";
import { getCategoryMeta } from "./category-meta";

const PRIMARY_CATEGORIES: BlogCategory[] = [
    "Mutual Funds Investing",
    "Tax Planning",
    "Investment Basics",
    "Insurance Planning",
    "Retirement Planning",
    "Personal Finance Foundations",
];

function isPrimary(cat: BlogCategory): boolean {
    return PRIMARY_CATEGORIES.includes(cat);
}

interface ChipProps {
    label: string;
    active: boolean;
    onClick: () => void;
    icon?: React.ComponentType<{ size?: number }>;
    color?: string;
}

function Chip({ label, active, onClick, icon: Icon, color }: ChipProps) {
    const accent = color || "#10B981";
    return (
        <button
            onClick={onClick}
            className="blog-cat-chip"
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: "nowrap",
                scrollSnapAlign: "start",
                border: active ? `1px solid ${accent}` : "1px solid rgba(255,255,255,0.10)",
                background: active ? `${accent}26` : "rgba(15, 23, 42, 0.6)",
                color: active ? accent : "#94A3B8",
                cursor: "pointer",
                transition: "all 0.18s ease",
                backdropFilter: "blur(8px)",
                flexShrink: 0,
            }}
        >
            {Icon && <Icon size={13} />}
            {label}
        </button>
    );
}

export function CategoryFilter({
    selected,
    onChange,
}: {
    selected: BlogCategory | "All";
    onChange: (cat: BlogCategory | "All") => void;
}) {
    const [moreOpen, setMoreOpen] = useState(false);
    const moreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!moreRef.current) return;
            if (!moreRef.current.contains(e.target as Node)) setMoreOpen(false);
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    const secondary = BLOG_CATEGORIES.filter((c) => !isPrimary(c));
    const selectedInSecondary = selected !== "All" && !isPrimary(selected);

    return (
        <>
            <div
                role="tablist"
                aria-label="Filter articles by category"
                className="blog-cat-row"
                style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "nowrap",
                    overflowX: "auto",
                    scrollSnapType: "x mandatory",
                    WebkitOverflowScrolling: "touch",
                    padding: "4px 4px 12px",
                    margin: "0 auto 28px",
                    maxWidth: "100%",
                    justifyContent: "flex-start",
                    scrollbarWidth: "none",
                }}
            >
                <Chip label="All" active={selected === "All"} onClick={() => onChange("All")} icon={Layers} />

                {PRIMARY_CATEGORIES.map((cat) => {
                    const m = getCategoryMeta(cat);
                    return (
                        <Chip
                            key={cat}
                            label={cat}
                            active={selected === cat}
                            onClick={() => onChange(cat)}
                            icon={m.icon}
                            color={m.text}
                        />
                    );
                })}

                <div ref={moreRef} style={{ position: "relative", scrollSnapAlign: "start", flexShrink: 0 }}>
                    <button
                        onClick={() => setMoreOpen((v) => !v)}
                        aria-expanded={moreOpen}
                        aria-haspopup="menu"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "8px 14px",
                            borderRadius: 9999,
                            fontSize: 13,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            border: selectedInSecondary ? `1px solid #10B981` : "1px solid rgba(255,255,255,0.10)",
                            background: selectedInSecondary ? "rgba(16,185,129,0.15)" : "rgba(15, 23, 42, 0.6)",
                            color: selectedInSecondary ? "#10B981" : "#94A3B8",
                            cursor: "pointer",
                            backdropFilter: "blur(8px)",
                        }}
                    >
                        {selectedInSecondary ? selected : "More"}
                        <ChevronDown size={13} style={{ transform: moreOpen ? "rotate(180deg)" : "none", transition: "transform 0.18s ease" }} />
                    </button>

                    {moreOpen && (
                        <div
                            role="menu"
                            style={{
                                position: "absolute",
                                top: "calc(100% + 8px)",
                                right: 0,
                                minWidth: 260,
                                background: "rgba(12, 19, 25, 0.96)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: 14,
                                padding: 8,
                                boxShadow: "0 16px 48px -16px rgba(0,0,0,0.6)",
                                backdropFilter: "blur(16px)",
                                zIndex: 50,
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            {secondary.map((cat) => {
                                const m = getCategoryMeta(cat);
                                const Icon = m.icon;
                                const active = selected === cat;
                                return (
                                    <button
                                        key={cat}
                                        role="menuitemradio"
                                        aria-checked={active}
                                        onClick={() => {
                                            onChange(cat);
                                            setMoreOpen(false);
                                        }}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            padding: "10px 12px",
                                            borderRadius: 10,
                                            border: "none",
                                            background: active ? `${m.text}1f` : "transparent",
                                            color: active ? m.text : "#CBD5E1",
                                            fontSize: 13,
                                            fontWeight: 600,
                                            textAlign: "left",
                                            cursor: "pointer",
                                            width: "100%",
                                        }}
                                    >
                                        <Icon size={14} style={{ color: m.text }} />
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .blog-cat-row::-webkit-scrollbar { display: none; }
            `}</style>
        </>
    );
}
