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
        // Parse headings from HTML
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
                padding: "20px 0",
                maxHeight: "calc(100vh - 120px)",
                overflowY: "auto",
            }}
        >
            <p
                style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#64748B",
                    marginBottom: 12,
                }}
            >
                On this page
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {headings.map((h) => (
                    <li key={h.id}>
                        <a
                            href={`#${h.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                            }}
                            style={{
                                display: "block",
                                padding: "4px 0",
                                paddingLeft: h.level === 3 ? 16 : 0,
                                fontSize: 13,
                                fontWeight: activeId === h.id ? 600 : 400,
                                color: activeId === h.id ? "#10B981" : "#64748B",
                                textDecoration: "none",
                                borderLeft: activeId === h.id ? "2px solid #10B981" : "2px solid transparent",
                                transition: "all 0.2s ease",
                            }}
                        >
                            {h.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
