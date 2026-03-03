"use client";

import { useState } from "react";
import type { BlogCategory } from "@/lib/types";
import { BLOG_CATEGORIES } from "@/lib/types";

export function CategoryFilter({
    selected,
    onChange,
}: {
    selected: BlogCategory | "All";
    onChange: (cat: BlogCategory | "All") => void;
}) {
    const all: (BlogCategory | "All")[] = ["All", ...BLOG_CATEGORIES];

    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                justifyContent: "center",
                marginBottom: 40,
            }}
        >
            {all.map((cat) => {
                const isActive = selected === cat;
                return (
                    <button
                        key={cat}
                        onClick={() => onChange(cat)}
                        style={{
                            padding: "8px 18px",
                            borderRadius: 9999,
                            fontSize: 13,
                            fontWeight: 600,
                            border: isActive ? "1px solid #10B981" : "1px solid #1E293B",
                            background: isActive ? "rgba(16, 185, 129, 0.15)" : "rgba(15, 23, 42, 0.6)",
                            color: isActive ? "#10B981" : "#94A3B8",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            backdropFilter: "blur(8px)",
                        }}
                    >
                        {cat}
                    </button>
                );
            })}
        </div>
    );
}
