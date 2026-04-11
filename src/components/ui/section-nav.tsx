"use client";

import { useState, useEffect } from "react";

interface Section {
    id: string;
    label: string;
}

export function SectionNav({ sections, scrollContainer }: { sections: Section[]; scrollContainer?: string }) {
    const [activeId, setActiveId] = useState(sections[0]?.id);

    useEffect(() => {
        const root = scrollContainer ? document.querySelector(scrollContainer) : null;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length > 0) {
                    setActiveId(visible[0].target.id);
                }
            },
            { root: root, rootMargin: "-20% 0px -60% 0px", threshold: 0 }
        );

        sections.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [sections, scrollContainer]);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        const container = scrollContainer ? document.querySelector(scrollContainer) : window;
        if (!container) return;

        if (container === window) {
            const offset = 80;
            const top = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: "smooth" });
        } else {
            const c = container as HTMLElement;
            const offset = 16;
            const top = el.offsetTop - offset;
            c.scrollTo({ top, behavior: "smooth" });
        }
    };

    return (
        <nav
            style={{
                position: "fixed",
                right: 24,
                top: "45%",
                transform: "translateY(-50%)",
                zIndex: 40,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 0,
            }}
            className="hidden lg:flex"
        >
            {sections.map(({ id, label }, i) => {
                const isActive = activeId === id;
                const isPast = sections.findIndex((s) => s.id === activeId) > i;
                return (
                    <div key={id} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                        <button
                            onClick={() => scrollTo(id)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                cursor: "pointer",
                                padding: "4px 0",
                                background: "none",
                                border: "none",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 12,
                                    fontWeight: 500,
                                    letterSpacing: "0.03em",
                                    transition: "all 0.3s",
                                    color: isActive ? "#10B981" : "#64748B",
                                    opacity: 1,
                                }}
                                className="section-nav-label"
                            >
                                {label}
                            </span>
                            <span
                                style={{
                                    borderRadius: "50%",
                                    transition: "all 0.3s",
                                    flexShrink: 0,
                                    width: isActive ? 14 : 10,
                                    height: isActive ? 14 : 10,
                                    background: isActive
                                        ? "#10B981"
                                        : isPast
                                        ? "rgba(16,185,129,0.4)"
                                        : "#475569",
                                    boxShadow: isActive ? "0 0 10px rgba(16,185,129,0.5), 0 0 0 3px rgba(16,185,129,0.15)" : "none",
                                }}
                            />
                        </button>
                        {i < sections.length - 1 && (
                            <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", paddingRight: 5 }}>
                                <div
                                    style={{
                                        width: 1,
                                        height: 16,
                                        transition: "background 0.3s",
                                        background: isPast ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)",
                                    }}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
