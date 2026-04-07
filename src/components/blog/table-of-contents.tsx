"use client";

import { useState, useEffect } from "react";

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

export function TableOfContents({ contentHtml }: { contentHtml: string }) {
    const [headings, setHeadings] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState("");

    useEffect(() => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(contentHtml, "text/html");
        const elements = doc.querySelectorAll("h2, h3");
        const items: TOCItem[] = [];

        elements.forEach((el, i) => {
            const id = el.id || `heading-${i}`;
            items.push({
                id,
                text: el.textContent || "",
                level: parseInt(el.tagName[1]),
            });
        });
        setHeadings(items);
    }, [contentHtml]);

    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "-80px 0px -70% 0px" }
        );

        headings.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length < 2) return null;

    return (
        <nav
            style={{
                position: "sticky",
                top: 96,
                padding: 20,
                maxHeight: "calc(100vh - 120px)",
                overflowY: "auto",
                background: "rgba(15, 23, 42, 0.6)",
                borderRadius: 16,
                border: "1px solid rgba(51, 65, 85, 0.6)",
                backdropFilter: "blur(12px)",
            }}
        >
            <p
                style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#94A3B8",
                    marginBottom: 16,
                    paddingBottom: 12,
                    borderBottom: "1px solid rgba(51, 65, 85, 0.4)",
                }}
            >
                On this page
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {headings.map((h) => {
                    const isActive = activeId === h.id;
                    return (
                        <li key={h.id} style={{ marginBottom: 2 }}>
                            <a
                                href={`#${h.id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                                }}
                                style={{
                                    display: "block",
                                    padding: "6px 10px",
                                    paddingLeft: h.level === 3 ? 20 : 10,
                                    fontSize: 12.5,
                                    fontWeight: isActive ? 600 : 400,
                                    color: isActive ? "#10B981" : "#CBD5E1",
                                    textDecoration: "none",
                                    borderRadius: 8,
                                    background: isActive ? "rgba(16, 185, 129, 0.08)" : "transparent",
                                    borderLeft: isActive ? "2px solid #10B981" : "2px solid transparent",
                                    transition: "all 0.2s ease",
                                    lineHeight: 1.4,
                                }}
                            >
                                {h.text}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
